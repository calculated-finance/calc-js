import { useQuery } from "@tanstack/react-query";
import { Strategy } from "@template/domain/calc";
import { RujiraIndexer } from "@template/domain/indexer";
import { Effect } from "effect";
import { useIndexerRuntime } from "./use-runtime";

/**
 * Strategy balances from the Rujira indexer — one GraphQL lookup instead of
 * a per-strategy contract RPC round trip.
 */
export const useStrategyBalances = (strategy: Strategy | undefined) => {
  const runtime = useIndexerRuntime();

  return useQuery({
    queryKey: ["strategyBalances", strategy?.address],
    enabled: !!strategy?.address,
    refetchInterval: false,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    queryFn: ({ signal }) =>
      runtime.runPromise(
        Effect.gen(function* () {
          if (!strategy?.address) {
            throw new Error("Cannot fetch strategy balances without a strategy address");
          }

          const indexer = yield* RujiraIndexer;
          return yield* indexer.strategyBalances(strategy.address);
        }),
        { signal },
      ),
  });
};
