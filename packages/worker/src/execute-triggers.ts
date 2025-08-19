import { toUtf8 } from "@cosmjs/encoding"
import type { Trigger } from "@template/domain/calc2"
import { CHAINS_BY_ID, type CosmosChain } from "@template/domain/chains"
import type { CosmosTransactionMsgs } from "@template/domain/clients"
import { SigningClient } from "@template/domain/clients"
import { CosmWasmQueryError, getCosmWasmClient } from "@template/domain/cosmwasm"
import type { ConditionFilter, SchedulerQueryMsg } from "@template/domain/types"
import { config } from "dotenv"
import { DateTime, Effect, Fiber, Queue, Stream } from "effect"

config()
;(BigInt.prototype as any).toJSON = function() {
    return this.toString()
}

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
            catch: (error: any) => {
                console.log(
                    `Failed to fetch triggers from chain ${chain.id} with filter ${
                        JSON.stringify(filter)
                    }: ${error.message}`
                )
                return new CosmWasmQueryError({ cause: error })
            }
        })

        yield* Effect.log(
            `Fetched triggers with filter: ${JSON.stringify(filter)}`,
            triggers.map((t) => (t as any).condition)
        )

        return triggers
    })

const chain = CHAINS_BY_ID["thorchain-stagenet-2"] as CosmosChain

const executeTransaction = (triggers: ReadonlyArray<Trigger>) =>
    Effect.gen(function*() {
        if (triggers.length === 0) {
            return yield* Effect.log("No triggers to execute")
        }

        const signingClient = yield* SigningClient
        const triggerIds = triggers.map((t) => t.id)

        const messages: CosmosTransactionMsgs = [{
            typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
            value: {
                sender: signingClient.address,
                contract: chain.schedulerContract,
                msg: toUtf8(JSON.stringify({
                    execute: triggerIds
                })),
                funds: []
            }
        }]

        yield* signingClient.signAndSubmitTransaction({
            type: "cosmos",
            chainId: signingClient.chainId as any,
            signer: signingClient.address,
            data: messages
        }).pipe(
            Effect.tap(() => {
                console.log("Executed triggers:", triggerIds)
            }),
            Effect.catchAll((error) => Effect.logError("Transaction failed:", error))
        )
    })

const fetchTimeTriggers = () =>
    Effect.gen(function*() {
        const client = yield* getCosmWasmClient(chain)

        const block = yield* Effect.tryPromise({
            try: async () => client.getBlock(),
            catch: (error: any) => {
                Effect.log(`Failed to fetch block height from chain ${chain.id}: ${error.message}`)
                return new CosmWasmQueryError({ cause: error })
            }
        })

        const blockTime = DateTime.unsafeFromDate(new Date(Date.parse(block.header.time)))

        console.log(`Fetched block time: ${
            (blockTime.epochMillis * (10 ** 6)).toFixed(
                0
            )
        }`)

        const start = (blockTime
            .pipe(DateTime.subtractDuration("24 hours"))
            .epochMillis * (10 ** 6)).toFixed(0)

        const end = (blockTime.epochMillis * (10 ** 6)).toFixed(
            0
        )

        return yield* getCosmosChainTriggers(chain, {
            timestamp: { start, end }
        })
    })

const fetchBlockTriggers = () =>
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

        console.log(`Fetched block height: ${block}`)

        return yield* getCosmosChainTriggers(chain, {
            block_height: { start: block - 14_400, end: block }
        })
    })

const program = Effect.gen(function*() {
    const triggerQueue = yield* Queue.sliding<Array<Trigger>>(200)

    const timeFetcher = Effect.gen(function*() {
        yield* Stream.repeatEffect(
            fetchTimeTriggers().pipe(
                Effect.delay("3 seconds"),
                Effect.catchAll((error) =>
                    Effect.gen(function*() {
                        yield* Effect.logError("Failed to fetch time triggers", error)
                        return []
                    })
                )
            )
        ).pipe(
            Stream.runForEach((triggers) => Queue.offer(triggerQueue, triggers))
        )
    })

    const blockFetcher = Effect.gen(function*() {
        yield* Stream.repeatEffect(
            fetchBlockTriggers().pipe(
                Effect.delay("3 seconds"),
                Effect.catchAll((error) =>
                    Effect.gen(function*() {
                        yield* Effect.logError("Failed to fetch block triggers", error)
                        return []
                    })
                )
            )
        ).pipe(
            Stream.runForEach((triggers) => Queue.offer(triggerQueue, triggers))
        )
    })

    const processor = Effect.gen(function*() {
        yield* Stream.fromQueue(triggerQueue).pipe(
            Stream.filter((triggers) => triggers.length > 0),
            Stream.runForEach((triggers) => executeTransaction(triggers))
        )
    })

    const timeFiberFiber = yield* Effect.forkScoped(timeFetcher)
    const blockFiberFiber = yield* Effect.forkScoped(blockFetcher)
    const processorFiber = yield* Effect.forkScoped(processor)

    yield* Effect.log("Started trigger execution worker")

    yield* Fiber.joinAll([
        timeFiberFiber,
        blockFiberFiber,
        processorFiber
    ]).pipe(
        Effect.onInterrupt(() => Effect.log("Trigger worker interrupted, cleaning up...")),
        Effect.onExit(() => Effect.log("Trigger worker exited"))
    )
})

program.pipe(
    Effect.provide(SigningClient.fromEnv),
    Effect.scoped,
    Effect.runPromise
)
