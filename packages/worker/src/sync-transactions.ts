import { QueryClient } from "@template/domain/src/clients/index.js"
import { Effect } from "effect"

export class CosmWasmClientConnectionError {}

;(BigInt.prototype as any).toJSON = function() {
    return this.toString()
}

Effect.gen(function*() {
    const queryClient = yield* QueryClient

    const transactions = yield* queryClient.fetchTransactions(
        "sthor18e35rm2dwpx3h09p7q7xx8qfvwdsxz2ls92fdfd4j7vh6g55h8ash7gkau",
        5567915
    )

    console.log("Transactions:", transactions)
}).pipe(
    Effect.provide(QueryClient.fromEnv),
    Effect.scoped,
    Effect.runPromise
)
