import { useQuery } from "@tanstack/react-query";
import { CalcService, StrategyHandle, StrategyId } from "@template/domain/calc";
import { ChainId } from "@template/domain/chains";
import { Effect } from "effect";
import { useAddressBook } from "./use-address-book";
import { useRuntime } from "./use-runtime";

export const useChainStrategies = (chainId: ChainId, status: "draft" | "active" | "paused" | "archived") => {
  const { addressBook } = useAddressBook();
  const addresses = Object.values(addressBook[chainId] ?? {});

    const runtime = useRuntime();

  return useQuery({
    queryKey: ["strategies", chainId, status, addresses.map((a) => a.address)],
    enabled: status !== "draft",
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    queryFn: ({ signal }) =>
      runtime.runPromise(
        Effect.gen(function* () {
          const empty: Record<StrategyId, StrategyHandle> = {};

          if (status === "draft") {
            return empty;
          }

          const CALC = yield* CalcService;

          const strategyHandles = yield* Effect.all(
            addresses.map(({ address }) => CALC.getStrategyHandles(chainId, address, status)),
            { concurrency: "unbounded" },
          );

          return strategyHandles.flat().reduce(
            (acc, strategyHandle) => ({
              ...acc,
              [strategyHandle.id]: strategyHandle,
            }),
            empty,
          );
        }),
        { signal },
      ),
  });
};
