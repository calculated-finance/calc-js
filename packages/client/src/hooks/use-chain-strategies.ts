import { useQuery } from "@tanstack/react-query";
import { CalcService, StrategyHandle, StrategyId, StrategyStatus } from "@template/domain/calc";
import { ChainId } from "@template/domain/chains";
import { Effect } from "effect";
import { useConnectedAddress } from "./use-connected-address";
import { useRuntime } from "./use-runtime";

/**
 * Fetches the manager's strategy handles for the connected wallet, across
 * statuses. Deliberately scoped to the wallet's own strategies: shared
 * strategies opened via URL are viewable through the sticky selection
 * without joining the list.
 */
export const useChainStrategies = (chainId: ChainId, statuses: StrategyStatus[]) => {
  const address = useConnectedAddress(chainId);

  const runtime = useRuntime();

  return useQuery({
    queryKey: ["strategies", chainId, statuses, address],
    enabled: statuses.length > 0 && address !== undefined,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    queryFn: ({ signal }) =>
      runtime.runPromise(
        Effect.gen(function* () {
          if (address === undefined) return {};
          const CALC = yield* CalcService;

          const strategyHandles = yield* Effect.all(
            statuses.map((status) => CALC.getStrategyHandles(chainId, address, status)),
            { concurrency: "unbounded" },
          );

          return strategyHandles.flat().reduce<Record<StrategyId, StrategyHandle>>(
            (acc, strategyHandle) => ({
              ...acc,
              [strategyHandle.id]: strategyHandle,
            }),
            {},
          );
        }),
        { signal },
      ),
  });
};
