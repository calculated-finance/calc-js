import { QueryClient } from "@template/domain/clients"
import { Effect, Schedule, Stream } from "effect"

export class CosmWasmClientConnectionError {}

;(BigInt.prototype as any).toJSON = function() {
    return this.toString()
}

const syncTransactions = () =>
    Effect.gen(function*() {
        const queryClient = yield* QueryClient

        const transactions = yield* queryClient.fetchTransactions(
            "sthor18e35rm2dwpx3h09p7q7xx8qfvwdsxz2ls92fdfd4j7vh6g55h8ash7gkau",
            5567915
        )

        yield* Effect.log(`Synced ${transactions.length} transactions`)
        console.log("Transactions:", transactions)
    })

const program = Effect.gen(function*() {
    yield* Effect.log("Starting transaction sync worker")

    // Run sync every 5 minutes with exponential backoff on failure
    yield* Stream.repeatEffect(
        syncTransactions().pipe(
            Effect.retry(
                Schedule.exponential("10 seconds").pipe(
                    Schedule.union(Schedule.recurs(3))
                )
            ),
            Effect.delay("5 minutes"),
            Effect.catchAll((error) =>
                Effect.gen(function*() {
                    yield* Effect.logError("Failed to sync transactions after retries", error)
                    // Continue the loop even if sync fails
                    return undefined
                })
            )
        )
    ).pipe(
        Stream.runDrain
    ).pipe(
        Effect.onInterrupt(() => Effect.log("Transaction sync worker interrupted, cleaning up...")),
        Effect.onExit(() => Effect.log("Transaction sync worker exited"))
    )
})

program.pipe(
    Effect.provide(QueryClient.fromEnv),
    Effect.scoped,
    Effect.runPromise
)
