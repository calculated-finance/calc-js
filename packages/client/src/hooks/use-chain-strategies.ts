import { useQuery } from "@tanstack/react-query";
import { CalcService, StrategyHandle, StrategyId, StrategyStatus } from "@template/domain/calc";
import { ChainId } from "@template/domain/chains";
import { Effect } from "effect";
import { useAddressBook } from "./use-address-book";
import { useRuntime } from "./use-runtime";

/** Fetches the manager's strategy handles for every book address, across statuses. */
export const useChainStrategies = (chainId: ChainId, statuses: StrategyStatus[]) => {
  const { addressBook } = useAddressBook();
  const addresses = Object.values(addressBook[chainId] ?? {});

  const runtime = useRuntime();

  return useQuery({
    queryKey: ["strategies", chainId, statuses, addresses.map((a) => a.address)],
    enabled: statuses.length > 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    queryFn: ({ signal }) =>
      runtime.runPromise(
        Effect.gen(function* () {
          const CALC = yield* CalcService;

          const strategyHandles = yield* Effect.all(
            addresses.flatMap(({ address }) =>
              statuses.map((status) => CALC.getStrategyHandles(chainId, address, status)),
            ),
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
