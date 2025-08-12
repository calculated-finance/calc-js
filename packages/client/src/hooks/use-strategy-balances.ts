import { useQuery } from "@tanstack/react-query";
import { Amount } from "@template/domain/src/assets";
import { CalcService, Strategy } from "@template/domain/src/calc";
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
                    if (!strategy || !strategy.address) {
                        throw new Error("Cannot fetch strategy balances without a strategy address");
                    }
            
                    const CALC = yield* CalcService;

                    const balances = yield* CALC.queryStrategy<Array<typeof Amount.Encoded>>(strategy.chainId, strategy.address, {
                        balances: [],
                    });

                    return balances.map((b: any) => Schema.decodeSync(Amount)(b));
                }),
                { signal },
            ),
    });
}
