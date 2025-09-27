import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { CHAINS_BY_ID, CosmosChain } from "@template/domain/chains";
import type { Strategy } from "@template/domain/types";
import { metricScope, Unit } from "aws-embedded-metrics";

const chainId = process.env.CHAIN_ID!;
const chain = CHAINS_BY_ID[chainId] as CosmosChain;

const PAGE_LIMIT = Number(process.env.PAGE_LIMIT ?? 150);
const BATCH_CONCURRENCY = Number(process.env.BALANCE_CONCURRENCY ?? 10);

async function fetchAllStrategies(client: CosmWasmClient, manager: string) {
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
}

export const handler = metricScope((metrics) => async () => {
  const client = await CosmWasmClient.connect(chain.rpcUrls[0]);

  const strategies = await fetchAllStrategies(client, chain.managerContract!);

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
    metrics.putMetric("TVL", Number(amount / 10n ** 8n), Unit.Count);
    metrics.flush();
  }
});
