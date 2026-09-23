import { useQuery } from "@tanstack/react-query";
import { CalcService, type Strategy, type StrategyHandle } from "@template/domain/calc";
import { Effect } from "effect";
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

          // The config's node graph is keyed by index, so it maps straight
          // onto the builder model — no synthetic ids required.
          return {
            id: handle.id,
            chainId: handle.chainId,
            address: handle.contract_address,
            owner: config.owner,
            label: handle.label,
            status: handle.status,
            nodes: [...config.nodes],
          } satisfies Strategy;
        }),
        { signal },
      ),
  });
};
