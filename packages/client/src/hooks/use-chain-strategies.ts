import { useQuery } from "@tanstack/react-query";
import { CalcService, StrategyHandle, StrategyId } from "@template/domain/src/calc";
import { ChainId } from "@template/domain/src/chains";
import { Effect, ManagedRuntime } from "effect";
import { useMemo } from "react";
import { useAddressBook } from "./use-address-book";
import { useMemoMap } from "./use-memo-map";

export const useChainStrategies = (chainId: ChainId, status: "draft" | "active" | "paused" | "archived") => {
  const { addressBook } = useAddressBook();
  const addresses = Object.values(addressBook[chainId] || {});

  const { memoMap } = useMemoMap();
  const runtime = useMemo(() => ManagedRuntime.make(CalcService.Default, memoMap), [memoMap]);

  return useQuery({
    queryKey: ["strategies", chainId, status, addresses.map((a) => a.address)],
    enabled: status !== "draft",
    queryFn: ({ signal }) =>
      runtime.runPromise(
        Effect.gen(function* () {
          if (status === "draft") {
            return {};
          }

          const CALC = yield* CalcService;

          const strategyHandles = yield* Effect.all(
            (addresses || []).map(({ address }) => CALC.getStrategyHandles(chainId, address, status)),
            { concurrency: "unbounded" },
          );

          return strategyHandles.flat().reduce(
            (acc, strategyHandle) => ({
              ...acc,
              [strategyHandle.id]: strategyHandle,
            }),
            {},
          ) as Record<StrategyId, StrategyHandle>;
        }),
        { signal },
      ),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
