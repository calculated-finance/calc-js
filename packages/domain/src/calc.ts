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
        // A strict filter, not a clamp: the client form validates via decode
        // and commits the raw value, so a clamp would let out-of-range input
        // pass validation and then fail on the encode round-trip.
        scalar: Schema.Positive.pipe(Schema.between(0, 10)).pipe(
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

const asCalcError = (cause: unknown) => new CalcError({ cause })

/**
 * The manager contract's strategy handles, as returned on the wire: the
 * StrategyHandle union minus the chainId we attach locally.
 */
const ChainStrategyHandleCommon = StrategyHandleCommon.omit("chainId")

const ChainStrategyHandles = Schema.Array(Schema.Union(
    Schema.Struct({
        ...ChainStrategyHandleCommon.fields,
        status: Schema.Literal("draft")
    }),
    Schema.Struct({
        ...ChainStrategyHandleCommon.fields,
        contract_address: Schema.NonEmptyTrimmedString,
        status: Schema.Literal("active", "paused", "archived")
    })
))

/**
 * A strategy contract's config response. The action carries no node ids on
 * the wire, so it stays a raw object here; consumers attach ids and decode
 * the full Strategy schema themselves.
 */
export const StrategyConfig = Schema.Struct({
    strategy: Schema.Struct({
        action: Schema.Record({ key: Schema.String, value: Schema.Unknown })
    })
})

export type StrategyConfig = Schema.Schema.Type<typeof StrategyConfig>

export class CalcService extends Effect.Service<CalcService>()("CalcService", {
    effect: Effect.gen(function*() {
        const cosmWasm = yield* CosmWasm

        const queryContract = <A, I>(
            chainId: ChainId,
            contractAddress: string,
            query: Record<string, unknown>,
            schema: Schema.Schema<A, I, never>
        ) =>
            Effect.gen(function*() {
                const raw = yield* cosmWasm
                    .queryContractSmart(chainId, contractAddress, query)
                    .pipe(Effect.mapError(asCalcError))

                return yield* Schema.decodeUnknown(schema)(raw).pipe(Effect.mapError(asCalcError))
            })

        return {
            queryManager: <A, I>(
                chainId: ChainId,
                query: Record<string, unknown>,
                schema: Schema.Schema<A, I, never>
            ) =>
                Effect.gen(function*() {
                    const chain = CHAINS_BY_ID[chainId]

                    if (!chain || chain.type !== "cosmos" || !chain.managerContract) {
                        return yield* Effect.fail(
                            new CalcError({ cause: `Chain id ${chainId} does not have a manager contract` })
                        )
                    }

                    return yield* queryContract(chainId, chain.managerContract, query, schema)
                }),

            queryScheduler: <A, I>(
                chainId: ChainId,
                query: Record<string, unknown>,
                schema: Schema.Schema<A, I, never>
            ) =>
                Effect.gen(function*() {
                    const chain = CHAINS_BY_ID[chainId]

                    if (!chain || chain.type !== "cosmos" || !chain.schedulerContract) {
                        return yield* Effect.fail(
                            new CalcError({ cause: `Chain id ${chainId} does not have a scheduler contract` })
                        )
                    }

                    return yield* queryContract(chainId, chain.schedulerContract, query, schema)
                }),

            queryStrategy: <A, I>(
                chainId: ChainId,
                contractAddress: string,
                query: Record<string, unknown>,
                schema: Schema.Schema<A, I, never>
            ) =>
                Effect.gen(function*() {
                    const chain = CHAINS_BY_ID[chainId]

                    if (!chain || chain.type !== "cosmos") {
                        return yield* Effect.fail(
                            new CalcError({ cause: `Chain id ${chainId} is not a cosmos chain` })
                        )
                    }

                    return yield* queryContract(chainId, contractAddress, query, schema)
                }),

            getStrategyHandles: (
                chainId: ChainId,
                owner: string | undefined,
                status: "active" | "paused" | "archived" | undefined
            ) => Effect.gen(function*() {
                const client = cosmWasm.clients.get(chainId)

                if (!client) {
                    return yield* Effect.fail(
                        new CalcError({ cause: `CosmWasm client for chain ${chainId} is not available` })
                    )
                }

                const chain = CHAINS_BY_ID[chainId]
                const managerContract = "managerContract" in chain ? chain.managerContract : undefined

                if (chain.type !== "cosmos" || !managerContract) {
                    return yield* Effect.fail(
                        new CalcError({ cause: `Chain type ${chain.displayName} is not supported for strategies` })
                    )
                }

                const raw = yield* Effect.tryPromise({
                    try: () =>
                        client.queryContractSmart(managerContract, {
                            strategies: {
                                owner,
                                status
                            }
                        }),
                    catch: asCalcError
                })

                const handles = yield* Schema.decodeUnknown(ChainStrategyHandles)(raw).pipe(
                    Effect.mapError(asCalcError)
                )

                return handles.map((handle): StrategyHandle => ({ ...handle, chainId }))
            }),

            getStrategy: (
                chainId: ChainId,
                contractAddress: string
            ) => Effect.gen(function*() {
                const client = cosmWasm.clients.get(chainId)

                if (!client) {
                    return yield* Effect.fail(
                        new CalcError({ cause: `CosmWasm client for chain ${chainId} is not available` })
                    )
                }

                const chain = CHAINS_BY_ID[chainId]
                const managerContract = "managerContract" in chain ? chain.managerContract : undefined

                if (chain.type !== "cosmos" || !managerContract) {
                    return yield* Effect.fail(
                        new CalcError({ cause: `Chain type ${chain.displayName} is not supported for strategies` })
                    )
                }

                const raw = yield* Effect.tryPromise({
                    try: () =>
                        client.queryContractSmart(contractAddress, {
                            config: {}
                        }),
                    catch: asCalcError
                })

                yield* Effect.logDebug("Fetched strategy config", { chainId, contractAddress })

                return yield* Schema.decodeUnknown(StrategyConfig)(raw).pipe(Effect.mapError(asCalcError))
            })
        }
    }),
    dependencies: [CosmWasm.Default]
}) {}
