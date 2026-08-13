import { useQuery } from "@tanstack/react-query";
import type { StrategyHandle } from "@template/domain/calc";
import { RujiraIndexer } from "@template/domain/indexer";
import { Effect } from "effect";
import { useIndexerRuntime } from "./use-runtime";

/**
 * Balances for every chain strategy in the list, in one batched indexer
 * lookup keyed by contract address.
 */
export const useStrategiesBalances = (handles: StrategyHandle[]) => {
  const runtime = useIndexerRuntime();

  const addresses = handles
    .flatMap((handle) => (handle.status !== "draft" ? [handle.contract_address] : []))
    .sort();

  return useQuery({
    queryKey: ["strategiesBalances", addresses],
    enabled: addresses.length > 0,
    staleTime: 30 * 1000,
    queryFn: () =>
      runtime.runPromise(
        Effect.flatMap(RujiraIndexer, (indexer) => indexer.strategiesBalances(addresses)),
      ),
  });
};
