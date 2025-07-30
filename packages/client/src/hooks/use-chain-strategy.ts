import { useQuery } from "@tanstack/react-query";
import { CalcService, Strategy, type StrategyHandle } from "@template/domain/src/calc";
import { Effect, ManagedRuntime, Schema } from "effect";
import { useMemo } from "react";
import { v4 } from "uuid";
import { useMemoMap } from "./use-memo-map";

export const useChainStrategy = (handle: StrategyHandle | undefined) => {
  const { memoMap } = useMemoMap();
  const runtime = useMemo(() => ManagedRuntime.make(CalcService.Default, memoMap), [memoMap]);

  return useQuery({
    queryKey: ["strategy", handle?.chainId, handle?.id, handle?.status],
    enabled: handle && handle.status !== "draft",
    queryFn: ({ signal }) =>
      runtime.runPromise(
        Effect.gen(function* () {
          if (!handle || handle.status === "draft") {
            throw new Error(`Cannot fetch strategy with handle: ${handle}`);
          }

          const CALC = yield* CalcService;
          const config = yield* CALC.getStrategy(handle.chainId, handle.contract_address);

          function addUuidToActions(action: any): any {
            if ("many" in action) {
              return {
                id: v4(),
                many: action.many.map(addUuidToActions),
              };
            }
            if ("schedule" in action) {
              return {
                id: v4(),
                schedule: {
                  ...action.schedule,
                  action: addUuidToActions(action.schedule.action),
                },
              };
            }
            if ("conditional" in action) {
              return {
                id: v4(),
                conditional: {
                  ...action.conditional,
                  action: addUuidToActions(action.conditional.action),
                },
              };
            }
            return { id: v4(), ...action };
          }

          return yield* Schema.decode(Strategy)({
            ...handle,
            action: addUuidToActions(config.strategy.action),
          });
        }),
        { signal },
      ),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
