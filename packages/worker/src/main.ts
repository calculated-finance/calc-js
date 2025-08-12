import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { stringToPath } from "@cosmjs/crypto"
import { toUtf8 } from "@cosmjs/encoding"
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing"
import { GasPrice } from "@cosmjs/stargate"
import type { Trigger } from "@template/domain/src/calc-2.js"
import { CHAINS_BY_ID, type CosmosChain } from "@template/domain/src/chains.js"
import type { CosmosTransactionMsgs } from "@template/domain/src/clients/index.js"
import { SigningClient } from "@template/domain/src/clients/index.js"
import type { CosmWasmConnectionError } from "@template/domain/src/cosmwasm.js"
import { CosmWasmQueryError, getCosmWasmClient } from "@template/domain/src/cosmwasm.js"
import type { ConditionFilter, SchedulerQueryMsg } from "@template/domain/types"
import { Config, Console, DateTime, Effect, Schema, Stream } from "effect"
import type { Scope } from "effect/Scope"

export class CosmWasmClientConnectionError
    extends Schema.TaggedError<CosmWasmClientConnectionError>()("CosmWasmClientConnectionError", {
        cause: Schema.Defect
    })
{}

;(BigInt.prototype as any).toJSON = function() {
    return this.toString()
}

const getClient = Effect.acquireRelease(
    Effect.gen(function*() {
        const rpcUrl = yield* Config.string("RPC_URL")

        return yield* Effect.tryPromise({
            try: () => CosmWasmClient.connect(rpcUrl),
            catch: (error) => new CosmWasmClientConnectionError({ cause: error })
        })
    }),
    (client) => Effect.sync(client.disconnect)
)

const getWallet = Effect.gen(function*() {
    const mnemonic = yield* Config.string("MNEMONIC")
    const prefix = yield* Config.string("PREFIX")

    return yield* Effect.tryPromise({
        try: () =>
            DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
                prefix,
                hdPaths: [stringToPath(`m/44'/931'/0'/0/0`)]
            }),
        catch: (error) => new CosmWasmClientConnectionError({ cause: error })
    })
})

const getSigningClient = Effect.acquireRelease(
    Effect.gen(function*() {
        const rpcUrl = yield* Config.string("RPC_URL")
        const wallet = yield* getWallet

        return yield* Effect.tryPromise({
            try: () =>
                SigningCosmWasmClient.connectWithSigner(
                    rpcUrl,
                    wallet,
                    {
                        gasPrice: GasPrice.fromString("0.00rune")
                    }
                ),
            catch: (error) => new CosmWasmClientConnectionError({ cause: error })
        })
    }),
    (client) => Effect.sync(client.disconnect)
)

export const executeStrategy = (contractAddress: string) =>
    Effect.gen(function*() {
        const client = yield* getSigningClient
        const wallet = yield* getWallet
        const managerAddress = yield* Config.string("MANAGER_ADDRESS")

        const res = yield* Effect.tryPromise(async () => {
            const [{ address }] = await wallet.getAccounts()
            return client.execute(
                address,
                managerAddress,
                {
                    execute_strategy: {
                        contract_address: contractAddress
                    }
                },
                "auto"
            )
        })

        console.log("Strategy executed:", res)

        yield* logStrategyConfig(contractAddress)
    })

export const getTimeTriggers = Effect.gen(function*() {
    const client = yield* getClient
    const schedulerAddress = yield* Config.string("SCHEDULER_ADDRESS")

    return yield* Effect.tryPromise(() =>
        client.queryContractSmart(schedulerAddress, {
            filtered: {
                limit: 10,
                filter: {
                    timestamp: {
                        start: undefined,
                        end: undefined
                    }
                }
            }
        }) as Promise<Array<Trigger>>
    )
})

export const getStrategyStatistics = (address: string) =>
    Effect.gen(function*() {
        const client = yield* getClient

        const statistics = yield* Effect.tryPromise(() =>
            client.queryContractSmart(address, {
                statistics: {}
            })
        )

        return statistics
    })

export const getStrategyBalances = (address: string) =>
    Effect.gen(function*() {
        const client = yield* getClient

        const balances = yield* Effect.tryPromise(() =>
            client.queryContractSmart(address, {
                balances: []
            })
        )

        return balances
    })

export const executeTriggers = (triggers: Array<Trigger>) =>
    Effect.gen(function*() {
        const client = yield* getSigningClient
        const wallet = yield* getWallet

        const schedulerAddress = yield* Config.string("SCHEDULER_ADDRESS")

        const res = yield* Effect.tryPromise(async () => {
            const [{ address }] = await wallet.getAccounts()

            return client.execute(
                address,
                schedulerAddress,
                {
                    execute: triggers.map((t) => t.id)
                },
                "auto"
            )
        })

        console.log("Triggers executed:", res)

        // console.log(JSON.stringify(yield* Effect.all(triggers.map((t) => getStrategyStatistics(t.owner))), null, 2))
        // console.log(JSON.stringify(yield* Effect.all(triggers.map((t) => getStrategyBalances(t.owner))), null, 2))
    })

export const logStrategyConfig = (address: string) =>
    Effect.gen(function*() {
        const client = yield* getClient

        const config = yield* Effect.tryPromise(() =>
            client.queryContractSmart(address, {
                config: {}
            })
        )

        console.log("Strategy config:", JSON.stringify(config, null, 2))
    })

export const updateStrategyConfig = (address: string, update: Record<string, unknown>) =>
    Effect.gen(function*() {
        const client = yield* getSigningClient
        const wallet = yield* getWallet
        const managerAddress = yield* Config.string("MANAGER_ADDRESS")

        const [{ address: executor }] = yield* Effect.tryPromise(() => wallet.getAccounts())

        const result = yield* Effect.tryPromise(() =>
            client.execute(
                executor,
                managerAddress,
                {
                    update_strategy: {
                        contract_address: address,
                        update
                    }
                },
                "auto"
            )
        )

        console.log("Strategy config updated:", result)
    })

export const getAndExecute = Effect.gen(function*() {
    const triggers = yield* getTimeTriggers
    if (triggers.length === 0) {
        console.log("No triggers to execute")
        return
    }

    console.log("Executing triggers:", triggers)

    yield* executeTriggers(triggers)
})

export const withdrawFromStrategy = (address: string, denoms: Array<string>) =>
    Effect.gen(function*() {
        const client = yield* getSigningClient
        const wallet = yield* getWallet

        const [{ address: executor }] = yield* Effect.tryPromise(() => wallet.getAccounts())

        const result = yield* Effect.tryPromise(() =>
            client.execute(
                executor,
                address,
                {
                    withdraw: denoms
                },
                "auto"
            )
        )

        console.log("Withdraw from strategy:", result)
    })

export const archiveStrategy = (address: string) =>
    Effect.gen(function*() {
        const client = yield* getSigningClient
        const wallet = yield* getWallet
        const managerAddress = yield* Config.string("MANAGER_ADDRESS")

        const [{ address: executor }] = yield* Effect.tryPromise(() => wallet.getAccounts())

        const result = yield* Effect.tryPromise(() =>
            client.execute(
                executor,
                managerAddress,
                {
                    update_strategy_status: {
                        contract_address: address,
                        status: "archived"
                    }
                },
                "auto"
            )
        )

        console.log("Cancelled strategy:", result)
    })

const getCosmosChainTriggers = (chain: CosmosChain, filter: ConditionFilter) =>
    Effect.gen(function*() {
        if (!chain.schedulerContract) {
            return yield* Effect.fail(new CosmWasmQueryError({ cause: "Scheduler contract not defined for chain" }))
        }

        const client = yield* getCosmWasmClient(chain)

        const triggers = yield* Effect.tryPromise<Array<Trigger>, CosmWasmQueryError>({
            try: () =>
                client.queryContractSmart(chain.schedulerContract!, {
                    filtered: {
                        limit: 5,
                        filter
                    }
                } as SchedulerQueryMsg),
            catch: (error: any) => new CosmWasmQueryError({ cause: error })
        })

        yield* Effect.log(
            `Fetched triggers with filter: ${JSON.stringify(filter)}`,
            triggers.map((t) => ({ id: t.id, condition: (t as any).condition }))
        )

        return triggers
    })

const chain = CHAINS_BY_ID["thorchain-stagenet-2"] as CosmosChain

const timeTriggerFetcher = () =>
    getCosmosChainTriggers(chain, {
        timestamp: {
            start: (DateTime.unsafeFromDate(new Date()).pipe(DateTime.subtractDuration("60 minutes")).epochMillis *
                (10 ** 6)).toFixed(0),
            end: (DateTime.unsafeFromDate(new Date()).epochMillis * (10 ** 6)).toFixed(0)
        }
    })

const blockTriggerFetcher = () =>
    Effect.gen(function*() {
        const client = yield* getCosmWasmClient(chain)

        const block = yield* Effect.tryPromise({
            try: async () => {
                const block = await client.getBlock()
                return block.header.height
            },
            catch: (error: any) => {
                Effect.log(`Failed to fetch block height from chain ${chain.id}: ${error.message}`)
                return new CosmWasmQueryError({ cause: error })
            }
        })

        return yield* getCosmosChainTriggers(chain, { block_height: { start: 0, end: block } })
    })

const mapToExecuteMessages = (
    triggers: Stream.Stream<Array<Trigger>, CosmWasmQueryError | CosmWasmConnectionError, Scope>
) => Stream.map(triggers, (triggers): CosmosTransactionMsgs =>
    triggers.length > 0 ?
        [{
            typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
            value: {
                sender: "sthor17pfp4qvy5vrmtjar7kntachm0cfm9m9azl3jka",
                contract: chain.schedulerContract,
                msg: toUtf8(
                    JSON.stringify({
                        execute: triggers.map((t) => t.id)
                    })
                ),
                funds: []
            }
        }] :
        [])

Effect.gen(function*() {
    const triggers = Stream.merge(
        Stream.repeatEffect(
            timeTriggerFetcher().pipe(
                Effect.delay("500 millis")
            )
        ),
        Stream.repeatEffect(
            blockTriggerFetcher().pipe(
                Effect.delay("500 millis")
            )
        )
    )

    const signingClient = yield* SigningClient
    const messages = mapToExecuteMessages(triggers)

    const process = Stream.runForEach((messages: CosmosTransactionMsgs) => {
        if (messages.length === 0) {
            return Effect.log("No triggers to execute")
        }

        return Effect.runFork(
            signingClient.signAndSubmitTransaction({
                type: "cosmos",
                chainId: "thorchain-stagenet-2",
                signer: "sthor17pfp4qvy5vrmtjar7kntachm0cfm9m9azl3jka",
                data: messages
            }).pipe(
                Effect.tap(({ result }) =>
                    Console.log(
                        "Transaction result:",
                        typeof result !== "string"
                            ? `${
                                JSON.stringify(
                                    {
                                        hash: result.transactionHash,
                                        gas: result.gasUsed
                                    },
                                    null,
                                    2
                                )
                            }`
                            : result
                    )
                ),
                Effect.catchAll((error) => Effect.logError("Transaction failed:", error))
            )
        )
    })(messages)

    yield* Effect.runFork(process.pipe(Effect.scoped))
}).pipe(
    Effect.provide(SigningClient.fromEnv),
    Effect.scoped,
    Effect.runPromise
)
