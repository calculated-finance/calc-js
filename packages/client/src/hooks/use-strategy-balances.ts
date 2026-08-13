import { useQuery } from "@tanstack/react-query";
import { Amount } from "@template/domain/assets";
import { CalcService, Strategy } from "@template/domain/calc";
import { Effect, Schema } from "effect";
import { useRuntime } from "./use-runtime";

export const useStrategyBalances = (strategy: Strategy | undefined) => {

    const runtime = useRuntime();

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
            
                    const CALC = yield* CalcService;

                    return yield* CALC.queryStrategy(strategy.chainId, strategy.address, { balances: [] }, Schema.Array(Amount));
                }),
                { signal },
            ),
    });
}
