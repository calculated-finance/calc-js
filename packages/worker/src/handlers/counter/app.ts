import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { CHAINS_BY_ID, CosmosChain } from "@template/domain/chains";
import { metricScope, Unit } from "aws-embedded-metrics";

const chainId = process.env.CHAIN_ID!;
const chain = CHAINS_BY_ID[chainId] as CosmosChain;

export const handler = metricScope((metrics) => async () => {
  const client = await CosmWasmClient.connect(chain.rpcUrls[0]);

  const count = await client.queryContractSmart(chain.managerContract!, {
    count: {},
  });

  metrics.setNamespace("Calc/Custom");
  metrics.setDimensions({ ChainId: chainId });
  metrics.putMetric("StrategyCount", count, Unit.Count);
});
