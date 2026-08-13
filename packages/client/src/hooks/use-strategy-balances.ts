import { useQuery } from "@tanstack/react-query";
import { Amount } from "@template/domain/assets";
import { CalcService, Strategy } from "@template/domain/calc";
import { Effect, ManagedRuntime, Schema } from "effect";
import { useMemo } from "react";
import { useMemoMap } from "./use-memo-map";

export const useStrategyBalances = (strategy: Strategy | undefined) => {

    const { memoMap } = useMemoMap();
    const runtime = useMemo(() => ManagedRuntime.make(CalcService.Default, memoMap), [memoMap]);

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
