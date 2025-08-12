import { Effect, Schema } from "effect"
import { Amount } from "./assets.js"
import { ChainId, CHAINS_BY_ID } from "./chains.js"
import { Coin, CosmWasm, Uint128, Uint64 } from "./cosmwasm.js"
import { BasisPoints } from "./numbers.js"

export const Trigger = Schema.Struct({
    id: Uint64,
    owner: Schema.NonEmptyTrimmedString
})

export type Trigger = Schema.Schema.Type<typeof Trigger>

export const FixedSwapAdjustment = Schema.Literal("fixed")

export const LinearScalarSwapAdjustment = Schema.Struct({
    linear_scalar: Schema.Struct({
        base_receive_amount: Amount,
        minimum_swap_amount: Schema.NullOr(Amount),
        scalar: Schema.Positive.pipe(Schema.clamp(0, 10)).pipe(
            Schema.annotations({
                message: () => ({
                    message: "Please provide a multiplier between 0 and 10",
                    override: true
                })
            })
        )
    })
})

export const SwapAmountAdjustment = Schema.Union(
    FixedSwapAdjustment,
    LinearScalarSwapAdjustment
)

export const FinRoute = Schema.Struct({
    fin: Schema.Struct({ pair_address: Schema.NonEmptyTrimmedString })
})

export const StreamingSwap = Schema.Struct({
    expected_receive_amount: Amount,
    memo: Schema.NonEmptyTrimmedString,
    starting_block: Schema.Positive,
    streaming_swap_blocks: Schema.Positive,
    swap_amount: Amount
})

export const ThorchainRoute = Schema.Struct({
    thorchain: Schema.Struct({
        affiliate_bps: Schema.optional(Schema.NullOr(Schema.Number)),
        affiliate_code: Schema.optional(Schema.NullOr(Schema.Trimmed)),
        latest_swap: Schema.optional(Schema.NullOr(StreamingSwap)),
        max_streaming_quantity: Schema.optional(Schema.NullOr(Schema.Number)),
        streaming_interval: Schema.optional(Schema.NullOr(Schema.Number))
    })
})

export const SwapRoute = Schema.Union(
    FinRoute,
    ThorchainRoute
)

export type SwapRoute = Schema.Schema.Type<typeof SwapRoute>

export const Swap = Schema.Struct({
    adjustment: SwapAmountAdjustment,
    maximum_slippage_bps: BasisPoints.pipe(
        Schema.annotations({
            message: () => ({
                message: "Please provide slippage % between 0 and 100",
                override: true
            })
        })
    ),
    minimum_receive_amount: Amount,
    routes: Schema.Array(SwapRoute),
    swap_amount: Amount
})

export const SwapAction = Schema.Struct({
    id: Schema.NonEmptyTrimmedString,
    swap: Swap
})

export type SwapAction = Schema.Schema.Type<typeof SwapAction>

export const Recipient = Schema.Union(
    Schema.Struct({
        bank: Schema.Struct({
            address: Schema.Trimmed
        })
    }),
    Schema.Struct({
        contract: Schema.Struct({
            address: Schema.Trimmed,
            msg: Schema.Trimmed
        })
    }),
    Schema.Struct({
        deposit: Schema.Struct({
            memo: Schema.Trimmed
        })
    })
)

export const Destination = Schema.Struct({
    label: Schema.optional(Schema.NullOr(Schema.NonEmptyTrimmedString)),
    shares: Uint128,
    recipient: Recipient
})

export const Distribute = Schema.Struct({
    denoms: Schema.Array(Schema.NonEmptyTrimmedString),
    destinations: Schema.Array(Destination)
})

export type Distribute = Schema.Schema.Type<typeof Distribute>

export const DistributeAction = Schema.Struct({
    id: Schema.NonEmptyTrimmedString,
    distribute: Distribute
})

export type DistributeAction = Schema.Schema.Type<typeof DistributeAction>

export const InnerManyAction = Schema.Struct({
    id: Schema.NonEmptyTrimmedString,
    many: Schema.Array(Schema.Union(SwapAction, DistributeAction))
})

export const BlockSchedule = Schema.Struct({
    blocks: Schema.Struct({
        interval: Schema.Positive.pipe(
            Schema.annotations({
                message: () => ({
                    message: "Please provide a valid block interval",
                    override: true
                })
            })
        ),
        previous: Schema.optional(Schema.NullOr(Schema.Positive))
    })
})

export const TimeSchedule = Schema.Struct({
    time: Schema.Struct({
        duration: Schema.Struct({
            nanos: Schema.optional(Schema.Number),
            secs: Schema.Positive
        }),
        previous: Schema.optional(Schema.NullOr(Uint64))
    })
})

export const CronSchedule = Schema.Struct({
    cron: Schema.Struct({
        expr: Schema.NonEmptyTrimmedString.pipe(
            Schema.annotations({
                message: () => ({
                    message: "Please provide a valid cron expression",
                    override: true
                })
            })
        ),
        previous: Schema.optional(Uint64)
    })
})

export const LimitOrderSchedule = Schema.Struct({})

export const Cadence = Schema.Union(
    BlockSchedule,
    TimeSchedule,
    CronSchedule
)

export const InnerSchedule = Schema.Struct({
    action: Schema.optional(Schema.Union(SwapAction, InnerManyAction, DistributeAction)),
    cadence: Cadence,
    contract_address: Schema.NonEmptyTrimmedString,
    msg: Schema.optional(Schema.NullOr(Schema.String)),
    execution_rebate: Schema.mutable(Schema.Array(Coin)),
    scheduler: Schema.NonEmptyTrimmedString,
    executors: Schema.Array(Schema.NonEmptyTrimmedString),
    jitter: Schema.optional(Schema.NullOr(Schema.Struct({
        nanos: Schema.optional(Schema.Number),
        secs: Schema.Positive
    })))
})

export type InnerSchedule = Schema.Schema.Type<typeof InnerSchedule>

export const InnerScheduleAction = Schema.Struct({
    id: Schema.NonEmptyTrimmedString,
    schedule: InnerSchedule
})

export const SchedulableAction = Schema.Union(SwapAction, InnerManyAction, InnerScheduleAction, DistributeAction)

export const Schedule = Schema.Struct({
    action: Schema.optional(Schema.Union(SwapAction, InnerManyAction)),
    cadence: Cadence,
    contract_address: Schema.NonEmptyTrimmedString,
    msg: Schema.optional(Schema.NullOr(Schema.String)),
    execution_rebate: Schema.mutable(Schema.Array(Coin)),
    scheduler: Schema.NonEmptyTrimmedString,
    executors: Schema.Array(Schema.NonEmptyTrimmedString),
    jitter: Schema.optional(Schema.NullOr(Schema.Struct({
        nanos: Schema.optional(Schema.Number),
        secs: Schema.Positive
    })))
})

export type Schedule = Schema.Schema.Type<typeof Schedule>

export const ScheduleAction = Schema.Struct({
    id: Schema.NonEmptyTrimmedString,
    schedule: Schedule
})

export type ScheduleAction = Schema.Schema.Type<typeof ScheduleAction>

export const ActionsExcludingMany = Schema.Union(SwapAction, ScheduleAction, InnerManyAction, DistributeAction)

export type ActionsExcludingMany = Schema.Schema.Type<
    typeof ActionsExcludingMany
>

export const Many = Schema.Array(ActionsExcludingMany)

export const ManyAction = Schema.Struct({
    id: Schema.NonEmptyTrimmedString,
    many: Many
})

export type ManyAction = Schema.Schema.Type<typeof ManyAction>

export const ActionsExcludingSchedule = Schema.Union(
    SwapAction,
    ManyAction
)

export const Action = Schema.Union(SwapAction, ManyAction, ScheduleAction, DistributeAction)

export type Action = Schema.Schema.Type<typeof Action>

export const StrategyId = Schema.Union(Schema.NonEmptyTrimmedString, Schema.Positive)

export type StrategyId = Schema.Schema.Type<typeof StrategyId>

export const Strategy = Schema.Struct({
    id: StrategyId,
    chainId: ChainId,
    action: Schema.optional(Action),
    address: Schema.optional(Schema.Trimmed),
    owner: Schema.optional(Schema.Trimmed.pipe(
        Schema.annotations({
            message: () => ({
                message: "Please provide a valid owner address",
                override: true
            })
        })
    )),
    label: Schema.NonEmptyString.pipe(
        Schema.annotations({
            message: () => ({
                message: "Please provide a label for the strategy",
                override: true
            })
        })
    ),
    status: Schema.Literal("draft", "active", "paused", "archived")
})

export type Strategy = Schema.Schema.Type<typeof Strategy>

const StrategyHandleCommon = Schema.Struct({
    id: StrategyId,
    chainId: ChainId,
    owner: Schema.NonEmptyTrimmedString,
    label: Schema.NonEmptyTrimmedString
})

export const StrategyHandle = Schema.Union(
    Schema.Struct({
        ...StrategyHandleCommon.fields,
        status: Schema.Literal("draft")
    }),
    Schema.Struct({
        ...StrategyHandleCommon.fields,
        contract_address: Schema.NonEmptyTrimmedString,
        status: Schema.Literal("active", "paused", "archived")
    })
)

export type StrategyHandle = Schema.Schema.Type<typeof StrategyHandle>

export class CalcError extends Schema.TaggedError<CalcError>()("CalcError", {
    cause: Schema.Defect
}) {}

export class CalcService extends Effect.Service<CalcService>()("CalcService", {
    effect: Effect.gen(function*() {
        const cosmWasm = yield* CosmWasm

        return {
            queryManager: <A>(
                chainId: ChainId,
                query: Record<string, any>
            ): Effect.Effect<A, Error, any> =>
                Effect.gen(function*() {
                    const chain = CHAINS_BY_ID[chainId]

                    if (!chain || chain.type !== "cosmos" || !chain.managerContract) {
                        return yield* Effect.fail(
                            new CalcError({ cause: `Chain id ${chainId} does not have a manager contract` })
                        )
                    }

                    return yield* cosmWasm.queryContractSmart(chainId, chain.managerContract!, query)
                }),

            queryScheduler: <A>(
                chainId: ChainId,
                query: Record<string, any>
            ): Effect.Effect<A, Error, any> =>
                Effect.gen(function*() {
                    const chain = CHAINS_BY_ID[chainId]

                    if (!chain || chain.type !== "cosmos" || !chain.schedulerContract) {
                        return yield* Effect.fail(
                            new CalcError({ cause: `Chain id ${chainId} does not have a scheduler contract` })
                        )
                    }

                    return yield* cosmWasm.queryContractSmart(chainId, chain.schedulerContract!, query)
                }),

            queryStrategy: <A>(
                chainId: ChainId,
                contractAddress: string,
                query: Record<string, any>
            ): Effect.Effect<A, Error, any> =>
                Effect.gen(function*() {
                    const chain = CHAINS_BY_ID[chainId]

                    if (!chain || chain.type !== "cosmos") {
                        return yield* Effect.fail(
                            new CalcError({ cause: `Chain id ${chainId} is not a cosmos chain` })
                        )
                    }

                    return yield* cosmWasm.queryContractSmart(chainId, contractAddress, query)
                }),

            getStrategyHandles: (
                chainId: ChainId,
                owner: string | undefined,
                status: "active" | "paused" | "archived" | undefined
            ) => Effect.gen(function*() {
                const client = cosmWasm.clients.get(chainId)

                if (!client) {
                    return yield* Effect.fail(
                        new Error(`CosmWasm client for chain ${chainId} is not available`)
                    )
                }

                const chain = CHAINS_BY_ID[chainId]
                const managerContract = "managerContract" in chain ? chain.managerContract : undefined

                if (chain.type !== "cosmos" || !managerContract) {
                    return yield* Effect.fail(
                        new Error(`Chain type ${chain.displayName} is not supported for strategies`)
                    )
                }

                const strategyHandles = yield* Effect.tryPromise({
                    try: () =>
                        client.queryContractSmart(managerContract, {
                            strategies: {
                                owner,
                                status
                            }
                        }),
                    catch: (cause) => {
                        console.error("Error fetching strategy handles", cause)
                        return new Error(`Failed to fetch strategy handles for chain ${chainId}`)
                    }
                })

                return (strategyHandles as Array<Omit<StrategyHandle, "chainId">>).map((handle) => ({
                    ...handle,
                    chainId
                }))
            }),

            getStrategy: (
                chainId: ChainId,
                contractAddress: string
            ) => Effect.gen(function*() {
                const client = cosmWasm.clients.get(chainId)

                if (!client) {
                    return yield* Effect.fail(
                        new Error(`CosmWasm client for chain ${chainId} is not available`)
                    )
                }

                const chain = CHAINS_BY_ID[chainId]
                const managerContract = "managerContract" in chain ? chain.managerContract : undefined

                if (chain.type !== "cosmos" || !managerContract) {
                    return yield* Effect.fail(
                        new Error(`Chain type ${chain.displayName} is not supported for strategies`)
                    )
                }

                const strategy = yield* Effect.tryPromise({
                    try: () =>
                        client.queryContractSmart(contractAddress, {
                            config: {}
                        }),
                    catch: (error) => {
                        console.error("Error fetching strategy", error)
                        throw new Error(`Failed to fetch strategy from contract ${contractAddress}`)
                    }
                })

                console.log("Fetched strategy:", strategy)

                return strategy
            })
        }
    }),
    dependencies: [CosmWasm.Default]
}) {}
