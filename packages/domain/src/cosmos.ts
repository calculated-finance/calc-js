import type { OfflineSigner } from "@cosmjs/proto-signing"
import { Effect } from "effect"
import type { CosmosChain } from "./chains.js"
import type { Transaction } from "./clients/index.js"
import { SigningClient, TransactionSimulationFailed, TransactionSubmissionFailed } from "./clients/index.js"
import { getSigningCosmWamClient } from "./cosmwasm.js"

export const createCosmosSigningClient = (
    chain: CosmosChain,
    signer: OfflineSigner
) => Effect.gen(function*() {
    const client = yield* getSigningCosmWamClient(signer, chain)

    return SigningClient.of({
        simulateTransaction: (transaction: Transaction) =>
            Effect.gen(function*() {
                if (transaction.type !== "cosmos") {
                    return yield* Effect.fail(
                        new TransactionSimulationFailed({
                            cause: `Cosmos signing client cannot simulate ${transaction.type} transactions`
                        })
                    )
                }

                const result = yield* Effect.tryPromise({
                    try: () => client.simulate(transaction.signer, transaction.data, transaction.memo),
                    catch: (error: any) => {
                        console.log(`Failed to simulate transaction on chain ${chain.id}: ${error.message}`)
                        return new TransactionSimulationFailed({
                            cause: `Transaction simulation failed: ${error.message}`
                        })
                    }
                }).pipe(
                    Effect.catchAll((error) => Effect.fail(new TransactionSimulationFailed(error)))
                )

                return {
                    type: "cosmos" as const,
                    result
                }
            }),

        signAndSubmitTransaction: (transaction: Transaction) =>
            Effect.gen(function*() {
                if (transaction.type !== "cosmos") {
                    return yield* Effect.fail(
                        new TransactionSubmissionFailed({
                            cause: `Cosmos signing client cannot sign ${transaction.type} transactions`
                        })
                    )
                }

                const result = yield* Effect.tryPromise({
                    try: () => client.signAndBroadcast(transaction.signer, transaction.data, "auto", transaction.memo),
                    catch: (error: any) => {
                        console.log(`Failed to sign and broadcast transaction on chain ${chain.id}: ${error.message}`)
                        return new TransactionSubmissionFailed({
                            cause: `Failed to sign and broadcast transaction on chain ${chain.id}: ${error.message}`
                        })
                    }
                }).pipe(
                    Effect.catchAll((error) => Effect.fail(new TransactionSubmissionFailed(error)))
                )

                return {
                    type: "cosmos" as const,
                    result
                }
            })
    })
})
