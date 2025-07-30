import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { stringToPath } from "@cosmjs/crypto"
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing"
import { GasPrice } from "@cosmjs/stargate"
import type { Trigger } from "@template/domain/calc"
import { Config, Effect, Schema } from "effect"

export class CosmWasmClientConnectionError
    extends Schema.TaggedError<CosmWasmClientConnectionError>()("CosmWasmClientConnectionError", {
        cause: Schema.Defect
    })
{}

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

export const getOwnedTriggers = Effect.gen(function*() {
    const client = yield* getClient
    const schedulerAddress = yield* Config.string("SCHEDULER_ADDRESS")

    const triggers = yield* Effect.tryPromise(() =>
        client.queryContractSmart(schedulerAddress, {
            owned: {
                owner: "sthor17rrm9t5e6tr3hycxfhg6x92pfpvccqs2wcgkpu90mppwshs83xrqs3ncx4"
            }
        }) as Promise<Array<Trigger>>
    )

    return triggers.map((trigger) => trigger.id)
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

        yield* Effect.tryPromise(async () => {
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

        console.log(JSON.stringify(yield* Effect.all(triggers.map((t) => getStrategyStatistics(t.owner))), null, 2))
        console.log(JSON.stringify(yield* Effect.all(triggers.map((t) => getStrategyBalances(t.owner))), null, 2))
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

Effect.runPromise(
    getAndExecute.pipe(
        Effect.scoped
    )
)

// Effect.runPromise(
//     archiveStrategy("sthor1atntklk6xhgakx8ecm6rjnavg0cw0khd04mxd7mqjmevgvcszzrqvfgd5h").pipe(Effect.scoped)
// )

// Effect.runPromise(
//     logStrategyConfig("sthor14k7mw8r23tn572ya8sgpx5q2edcj3trru7xljxhnhzh2yeegthnqth66mr").pipe(Effect.scoped)
// )

// Effect.runPromise(
//     executeStrategy("sthor14k7mw8r23tn572ya8sgpx5q2edcj3trru7xljxhnhzh2yeegthnqth66mr").pipe(Effect.scoped)
// )

// Effect.runPromise(
//     withdrawFromStrategy("sthor14k7mw8r23tn572ya8sgpx5q2edcj3trru7xljxhnhzh2yeegthnqth66mr", [
//         "rune",
//         "x/ruji"
//     ]).pipe(Effect.scoped)
// )

// Effect.runPromise(
//     updateStrategyConfig("sthor14k7mw8r23tn572ya8sgpx5q2edcj3trru7xljxhnhzh2yeegthnqth66mr", {
//         "owner": "sthor17pfp4qvy5vrmtjar7kntachm0cfm9m9azl3jka",
//         "action": {
//             "schedule": {
//                 "scheduler": "sthor1s4wcpc6mzfe9rvu3x48t6mvmmupg04n7cfecgx3pxvcl5q3h4y3shqqv8a",
//                 "cadence": {
//                     "cron": {
//                         "expr": "*/30 * * * * *",
//                         "previous": "1753869720000000000"
//                     }
//                 },
//                 "execution_rebate": [],
//                 "action": {
//                     "many": [
//                         {
//                             "swap": {
//                                 "swap_amount": {
//                                     "denom": "x/ruji",
//                                     "amount": "1000"
//                                 },
//                                 "minimum_receive_amount": {
//                                     "denom": "rune",
//                                     "amount": "0"
//                                 },
//                                 "maximum_slippage_bps": 9900,
//                                 "adjustment": "fixed",
//                                 "routes": [
//                                     {
//                                         "fin": {
//                                             "pair_address":
//                                                 "sthor1knzcsjqu3wpgm0ausx6w0th48kvl2wvtqzmvud4hgst4ggutehlseele4r"
//                                         }
//                                     }
//                                 ]
//                             }
//                         },
//                         {
//                             "swap": {
//                                 "swap_amount": {
//                                     "denom": "rune",
//                                     "amount": "1000"
//                                 },
//                                 "minimum_receive_amount": {
//                                     "denom": "x/ruji",
//                                     "amount": "0"
//                                 },
//                                 "maximum_slippage_bps": 9900,
//                                 "adjustment": "fixed",
//                                 "routes": [
//                                     {
//                                         "fin": {
//                                             "pair_address":
//                                                 "sthor1knzcsjqu3wpgm0ausx6w0th48kvl2wvtqzmvud4hgst4ggutehlseele4r"
//                                         }
//                                     }
//                                 ]
//                             }
//                         }
//                     ]
//                 }
//             }
//         },
//         "state": null
//     }).pipe(Effect.scoped)
// )
