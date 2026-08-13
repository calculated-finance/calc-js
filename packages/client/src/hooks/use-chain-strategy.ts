import { useQuery } from "@tanstack/react-query";
import { CalcService, Strategy, type StrategyHandle } from "@template/domain/calc";
import { Effect, Schema } from "effect";
import { v4 } from "uuid";
import { useRuntime } from "./use-runtime";

export const useChainStrategy = (handle: StrategyHandle | undefined) => {
    const runtime = useRuntime();

  return useQuery({
    queryKey: ["strategy", handle?.chainId, handle?.id, handle?.status],
    enabled: handle && handle.status !== "draft",
    refetchInterval: false,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    queryFn: ({ signal }) =>
      runtime.runPromise(
        Effect.gen(function* () {
          if (!handle || handle.status === "draft") {
            throw new Error(`Cannot fetch strategy with handle: ${JSON.stringify(handle)}`);
          }

          const CALC = yield* CalcService;
          const config = yield* CALC.getStrategy(handle.chainId, handle.contract_address);

          // Raw contract actions carry no ids; the builder needs one per node.
          function addUuidToActions(action: Record<string, unknown>): Record<string, unknown> {
            if (Array.isArray(action.many)) {
              return {
                id: v4(),
                many: action.many.map((child) => addUuidToActions(child as Record<string, unknown>)),
              };
            }
            if (typeof action.schedule === "object" && action.schedule !== null) {
              const schedule = action.schedule as Record<string, unknown>;
              return {
                id: v4(),
                schedule: {
                  ...schedule,
                  action: addUuidToActions(schedule.action as Record<string, unknown>),
                },
              };
            }
            if (typeof action.conditional === "object" && action.conditional !== null) {
              const conditional = action.conditional as Record<string, unknown>;
              return {
                id: v4(),
                conditional: {
                  ...conditional,
                  action: addUuidToActions(conditional.action as Record<string, unknown>),
                },
              };
            }
            return { id: v4(), ...action };
          }

          return yield* Schema.decodeUnknown(Strategy)({
            ...handle,
            address: handle.contract_address,
            action: addUuidToActions(config.strategy.action),
          });
        }),
        { signal },
      ),
  });
};
