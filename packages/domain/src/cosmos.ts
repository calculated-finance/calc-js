import { decodeTxRaw, type OfflineSigner } from "@cosmjs/proto-signing"
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx.js"
import { Data, Effect, Schedule } from "effect"

import type { CosmosChain } from "./chains.js"
import type { Transaction } from "./clients.js"
import {
    BalancesFetchFailed,
    SignerNotAvailableError,
    SigningClient,
    TransactionFetchFailed,
    TransactionSimulationFailed,
    TransactionSubmissionFailed
} from "./clients.js"
import { getSigningCosmWamClient, getStargateClient } from "./cosmwasm.js"

export class AccountSequenceMismatchError extends Data.TaggedError("AccountSequenceMismatchError") {}

export const createCosmosSigningClient = (
    chain: CosmosChain,
    signer: OfflineSigner
) => Effect.gen(function*() {
    const client = yield* getSigningCosmWamClient(signer, chain)

    const address = yield* Effect.tryPromise({
        try: () => signer.getAccounts().then((accounts) => accounts[0].address),
        catch: (error: any) =>
            new SignerNotAvailableError({
                cause: `Failed to get address from signer for chain ${chain.id}: ${error.message}`
            })
    })

    return SigningClient.of({
        type: "cosmos",
        chainId: chain.id,
        address,
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
                })

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

                        if (`${error}`.includes("account sequence mismatch")) {
                            return new AccountSequenceMismatchError()
                        }

                        return new TransactionSubmissionFailed({
                            cause: `Failed to sign and broadcast transaction on chain ${chain.id}: ${error.message}`
                        })
                    }
                }).pipe(
                    Effect.retry({
                        schedule: Schedule.exponential("100 millis")
                    }),
                    Effect.catchTag("AccountSequenceMismatchError", (error) =>
                        new TransactionSubmissionFailed({ cause: `${error}` }))
                )

                return {
                    type: "cosmos" as const,
                    result
                }
            })
    })
})

export const createCosmosQueryClient = (chain: CosmosChain) =>
    Effect.gen(function*() {
        const client = yield* getStargateClient(chain)

        return {
            fetchBalances: (address: string) =>
                Effect.tryPromise({
                    try: async () => {
                        const balances = await client.getAllBalances(address)

                        return balances.map((coin) => ({
                            denom: coin.denom,
                            amount: coin.amount
                        }))
                    },
                    catch: (error: any) => new BalancesFetchFailed({ cause: error.message })
                }),

            fetchTransactions: (address: string, afterBlock: number) =>
                Effect.gen(function*() {
                    const transactions = yield* Effect.tryPromise({
                        try: () =>
                            client.searchTx(
                                [
                                    { key: "tx.height>", value: afterBlock },
                                    { key: "execute._contract_address", value: address }
                                ]
                            ),
                        catch: (error: any) => new TransactionFetchFailed({ cause: error.message })
                    })

                    return transactions.map((tx) => {
                        try {
                            const decodedTx = decodeTxRaw(tx.tx)

                            const executeMsg = decodedTx.body.messages.find((msg) =>
                                msg.typeUrl === "/cosmwasm.wasm.v1.MsgExecuteContract"
                            )

                            const signer = executeMsg
                                ? MsgExecuteContract.decode(executeMsg.value).sender
                                : "unknown"

                            return ({
                                type: "cosmos" as const,
                                height: tx.height,
                                chainId: chain.id,
                                signer,
                                memo: decodedTx.body.memo,
                                data: decodedTx.body.messages,
                                events: tx.events
                            } as Transaction)
                        } catch {
                            return []
                        }
                    }).flat()
                })
        }
    }).pipe(
        Effect.catchAll((error) => Effect.fail(new Error(`Failed to create Cosmos query client: ${error.message}`)))
    )
