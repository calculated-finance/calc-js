import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { ASSETS_BY_COINGECKO_ID } from "@template/domain/assets";
import { CHAINS_BY_ID, CosmosChain } from "@template/domain/chains";
import type { Strategy } from "@template/domain/types";
import { metricScope, Unit } from "aws-embedded-metrics";
import axios from "axios";

const chainId = process.env.CHAIN_ID!;
const chain = CHAINS_BY_ID[chainId] as CosmosChain;

const PAGE_LIMIT = Number(process.env.PAGE_LIMIT ?? 300);
const BATCH_CONCURRENCY = Number(process.env.BALANCE_CONCURRENCY ?? 10);

const fetchPrices = async () => {
  const { data } = await axios.get<{ id: string; current_price: number }[]>(
    "https://pro-api.coingecko.com/api/v3/coins/markets",
    {
      params: {
        vs_currency: "usd",
        ids: Object.keys(ASSETS_BY_COINGECKO_ID).join(","),
        per_page: 250,
        x_cg_pro_api_key: process.env.COINGECKO_API_KEY!,
      },
    }
  );

  return data.reduce((acc, { id, current_price }) => {
    const asset = ASSETS_BY_COINGECKO_ID[id];
    if (asset) {
      acc[asset.rawName] = current_price;
    }
    return acc;
  }, {} as Record<string, number>);
};

const fetchAllStrategies = async (client: CosmWasmClient, manager: string) => {
  const strategies: Strategy[] = [];
  let start_after: number | undefined = undefined;

  while (true) {
    const res = (await client.queryContractSmart(manager, {
      strategies: { limit: PAGE_LIMIT, start_after },
    })) as Strategy[];

    if (!res.length) break;

    strategies.push(...res);

    if (res.length < PAGE_LIMIT) break;

    start_after = res[res.length - 1].id;
  }

  return strategies;
};

export const handler = metricScope((metrics) => async () => {
  const client = await CosmWasmClient.connect(chain.rpcUrls[0]);

  const [prices, strategies] = await Promise.all([
    fetchPrices(),
    fetchAllStrategies(client, chain.managerContract!),
  ]);

  const totals = new Map<string, bigint>();

  for (let i = 0; i < strategies.length; i += BATCH_CONCURRENCY) {
    const batch = strategies.slice(i, i + BATCH_CONCURRENCY);

    await Promise.all(
      batch.map(async (s) => {
        const coins = await client.queryContractSmart(s.contract_address, {
          balances: {},
        });

        for (const c of coins) {
          const prev = totals.get(c.denom) ?? 0n;
          totals.set(c.denom, prev + BigInt(c.amount));
        }
      })
    );
  }

  metrics.setNamespace("Calc/Custom");

  for (const [denom, amount] of totals) {
    metrics.setDimensions({ ChainId: chainId, Denom: denom });
    metrics.putMetric(
      "TVL",
      Number(amount / 10n ** 8n) * (prices[denom] ?? 0),
      Unit.Count
    );
    await metrics.flush();
  }
});
