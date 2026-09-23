import { keepPreviousData, useQuery } from "@tanstack/react-query";
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
    retry: 2,
    // The list's addresses change as handles load in; keep showing the last
    // balances rather than blanking every chip while the new batch fetches.
    placeholderData: keepPreviousData,
    queryFn: () =>
      runtime
        .runPromise(Effect.flatMap(RujiraIndexer, (indexer) => indexer.strategiesBalances(addresses)))
        .catch((error: unknown) => {
          // A failed batch means no chips anywhere — never fail silently.
          console.error("strategiesBalances failed", error);
          throw error;
        }),
  });
};
