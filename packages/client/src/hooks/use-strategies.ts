import { useQuery } from "@tanstack/react-query";
import { CalcService, StrategyHandle } from "@template/domain/src/calc";
import { RUJIRA_STAGENET } from "@template/domain/src/chains";
import { Effect, ManagedRuntime } from "effect";
import { useMemo } from "react";
import { useAddressBook } from "./use-address-book";
import { useMemoMap } from "./use-memo-map";
import { useStrategyStore } from "./use-strategy-store";

export const useStrategies = (status: "draft" | "active" | "paused" | "archived") => {
  const { addressBook } = useAddressBook();

  const addresses = Object.values(addressBook[RUJIRA_STAGENET.id] || {});

  const { memoMap } = useMemoMap();

  const runtime = useMemo(() => ManagedRuntime.make(CalcService.Default, memoMap), [memoMap]);

  const { strategies: draftStrategies } = useStrategyStore();

  return useQuery({
    queryKey: ["strategies", RUJIRA_STAGENET.id, status, addresses.map((a) => a.address)],
    queryFn: async ({ signal }) =>
      runtime.runPromise(
        Effect.gen(function* () {
          if (status === "draft") {
            return Object.values(draftStrategies).reduce(
              (acc, strategy) => ({
                ...acc,
                [strategy.id]: {
                  label: strategy.label,
                  id: strategy.id,
                  owner: strategy.owner,
                  status: "draft",
                },
              }),
              {},
            );
          }

          const calc = yield* CalcService;

          const strategyHandles = yield* Effect.all(
            (addresses || []).map(({ address }) => calc.strategyHandles(RUJIRA_STAGENET.id, address, status)),
            { concurrency: "unbounded" },
          );

          return strategyHandles.flat().reduce(
            (acc: Record<string, StrategyHandle>, strategyHandle: StrategyHandle) => ({
              ...acc,
              [strategyHandle.id]: strategyHandle,
            }),
            {},
          ) as Record<string, StrategyHandle>;
        }),
        { signal },
      ),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
