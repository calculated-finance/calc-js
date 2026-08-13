import { Effect, Schema } from "effect"
import { Amount } from "./assets.js"
import { ChainId, CHAINS_BY_ID } from "./chains.js"
import { Coin, CosmWasm, Decimal, Timestamp, Uint128, Uint64 } from "./cosmwasm.js"
import { BasisPoints } from "./numbers.js"

/**
 * Schemas for the CALC v2 contracts. The wire shapes mirror
 * repos/calc-rs/calc.d.ts (vendored at the deployed v2.0.0 tag) exactly; a
 * strategy is a flat graph of nodes linked by index, not a nested action
 * tree. Coin-valued fields the builder edits decode through Amount (display
 * units + asset metadata); everything else stays wire-shaped.
 */

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

export const StrategyStatus = Schema.Literal("active", "paused", "archived")

export type StrategyStatus = Schema.Schema.Type<typeof StrategyStatus>

export const NodeIndex = Schema.NonNegativeInt

export const Side = Schema.Literal("base", "quote")

export const Direction = Schema.Literal("above", "below")

/** Rust std Duration: both fields always present on the wire. */
export const WireDuration = Schema.Struct({
    secs: Schema.NonNegative,
    nanos: Schema.optionalWith(Schema.NonNegative, { default: () => 0 })
})

// ---------------------------------------------------------------------------
// Swap action (wire shape unchanged from v1)
// ---------------------------------------------------------------------------

export const FixedSwapAdjustment = Schema.Literal("fixed")

export const LinearScalarSwapAdjustment = Schema.Struct({
    linear_scalar: Schema.Struct({
        base_receive_amount: Amount,
        minimum_swap_amount: Schema.optional(Schema.NullOr(Amount)),
        // The contract's Decimal serializes as a string, but the swap form
        // binds this field as a number in decoded space, so the codec accepts
        // both and always encodes to the wire string. Strict filters, not a
        // clamp: out-of-range input must fail validation, not silently
        // coerce.
        scalar: Schema.Union(Schema.NumberFromString, Schema.Number).pipe(
            Schema.positive(),
            Schema.lessThanOrEqualTo(10),
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

// Both block fields are legitimately 0 on the wire (a non-streaming swap
// reports streaming_swap_blocks: 0), so no Positive filters here.
export const StreamingSwap = Schema.Struct({
    expected_receive_amount: Amount,
    memo: Schema.NonEmptyTrimmedString,
    starting_block: Schema.NonNegative,
    streaming_swap_blocks: Schema.NonNegative,
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

export type Swap = Schema.Schema.Type<typeof Swap>

// ---------------------------------------------------------------------------
// Limit order action
// ---------------------------------------------------------------------------

export const Offset = Schema.Union(
    Schema.Struct({ exact: Decimal }),
    Schema.Struct({ percent: Schema.Number })
)

export const PriceStrategy = Schema.Union(
    Schema.Struct({ fixed: Decimal }),
    Schema.Struct({
        offset: Schema.Struct({
            direction: Direction,
            offset: Offset,
            side: Side,
            tolerance: Schema.optional(Schema.NullOr(Offset))
        })
    })
)

export const BidAmount = Schema.Union(
    Schema.Struct({ fixed: Uint128 }),
    Schema.Struct({ fraction: Decimal })
)

export const FinLimitOrder = Schema.Struct({
    bid_amount: BidAmount,
    bid_denom: Schema.NonEmptyTrimmedString,
    current_order: Schema.optional(Schema.NullOr(Schema.Struct({ price: Decimal }))),
    min_fill_ratio: Schema.optional(Schema.NullOr(Decimal)),
    pair_address: Schema.NonEmptyTrimmedString,
    side: Side,
    strategy: PriceStrategy
})

export type FinLimitOrder = Schema.Schema.Type<typeof FinLimitOrder>

// ---------------------------------------------------------------------------
// Distribute action
// ---------------------------------------------------------------------------

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
    distributions: Schema.optional(Schema.NullOr(Schema.Array(Coin))),
    label: Schema.optional(Schema.NullOr(Schema.NonEmptyTrimmedString)),
    shares: Uint128,
    recipient: Recipient
})

export const Distribution = Schema.Struct({
    denoms: Schema.Array(Schema.NonEmptyTrimmedString),
    destinations: Schema.Array(Destination)
})

export type Distribution = Schema.Schema.Type<typeof Distribution>

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export const Action = Schema.Union(
    Schema.Struct({ swap: Swap }),
    Schema.Struct({ limit_order: FinLimitOrder }),
    Schema.Struct({ distribute: Distribution })
)

export type Action = Schema.Schema.Type<typeof Action>

// ---------------------------------------------------------------------------
// Cadence
// ---------------------------------------------------------------------------

export const BlockCadence = Schema.Struct({
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

export const TimeCadence = Schema.Struct({
    time: Schema.Struct({
        duration: WireDuration,
        previous: Schema.optional(Schema.NullOr(Timestamp))
    })
})

export const CronCadence = Schema.Struct({
    cron: Schema.Struct({
        expr: Schema.NonEmptyTrimmedString.pipe(
            Schema.annotations({
                message: () => ({
                    message: "Please provide a valid cron expression",
                    override: true
                })
            })
        ),
        previous: Schema.optional(Schema.NullOr(Timestamp))
    })
})

export const Cadence = Schema.Union(
    BlockCadence,
    TimeCadence,
    CronCadence
)

export type Cadence = Schema.Schema.Type<typeof Cadence>

// ---------------------------------------------------------------------------
// Conditions (schedule is a condition in v2, not an action)
// ---------------------------------------------------------------------------

export const ScheduleCondition = Schema.Struct({
    cadence: Cadence,
    execution_rebate: Schema.mutable(Schema.Array(Coin)),
    executions: Schema.optional(Schema.NullOr(Schema.NonNegative)),
    executors: Schema.Array(Schema.NonEmptyTrimmedString),
    jitter: Schema.optional(Schema.NullOr(WireDuration)),
    manager_address: Schema.NonEmptyTrimmedString,
    max_executions: Schema.optional(Schema.NullOr(Schema.NonNegative)),
    next: Schema.optional(Schema.NullOr(Cadence)),
    scheduler_address: Schema.NonEmptyTrimmedString
})

export type ScheduleCondition = Schema.Schema.Type<typeof ScheduleCondition>

export const PriceSource = Schema.Union(
    Schema.Literal("thorchain"),
    Schema.Struct({ fin: Schema.Struct({ address: Schema.NonEmptyTrimmedString }) })
)

export const Condition = Schema.Union(
    Schema.Struct({ timestamp_elapsed: Timestamp }),
    Schema.Struct({ blocks_completed: Schema.NonNegative }),
    Schema.Struct({ schedule: ScheduleCondition }),
    Schema.Struct({ can_swap: Swap }),
    Schema.Struct({
        fin_limit_order_filled: Schema.Struct({
            owner: Schema.optional(Schema.NullOr(Schema.NonEmptyTrimmedString)),
            pair_address: Schema.NonEmptyTrimmedString,
            price: Decimal,
            side: Side
        })
    }),
    Schema.Struct({
        balance_available: Schema.Struct({
            address: Schema.optional(Schema.NullOr(Schema.NonEmptyTrimmedString)),
            amount: Amount
        })
    }),
    Schema.Struct({
        strategy_status: Schema.Struct({
            contract_address: Schema.NonEmptyTrimmedString,
            manager_contract: Schema.NonEmptyTrimmedString,
            status: StrategyStatus
        })
    }),
    Schema.Struct({
        oracle_price: Schema.Struct({
            asset: Schema.NonEmptyTrimmedString,
            direction: Direction,
            price: Decimal
        })
    }),
    Schema.Struct({
        asset_value_ratio: Schema.Struct({
            denominator: Schema.NonEmptyTrimmedString,
            numerator: Schema.NonEmptyTrimmedString,
            oracle: PriceSource,
            ratio: Decimal,
            tolerance: Decimal
        })
    })
)

export type Condition = Schema.Schema.Type<typeof Condition>

// ---------------------------------------------------------------------------
// Nodes: the strategy graph
// ---------------------------------------------------------------------------

export const ActionNode = Schema.Struct({
    action: Schema.Struct({
        action: Action,
        index: NodeIndex,
        next: Schema.optional(Schema.NullOr(NodeIndex))
    })
})

export type ActionNode = Schema.Schema.Type<typeof ActionNode>

export const ConditionNode = Schema.Struct({
    condition: Schema.Struct({
        condition: Condition,
        index: NodeIndex,
        on_success: Schema.optional(Schema.NullOr(NodeIndex)),
        on_failure: Schema.optional(Schema.NullOr(NodeIndex))
    })
})

export type ConditionNode = Schema.Schema.Type<typeof ConditionNode>

export const Node = Schema.Union(ActionNode, ConditionNode)

export type Node = Schema.Schema.Type<typeof Node>

export const Nodes = Schema.Array(Node)

export type Nodes = Schema.Schema.Type<typeof Nodes>

// ---------------------------------------------------------------------------
// Strategy handles and the builder's strategy model
// ---------------------------------------------------------------------------

export const StrategyId = Schema.Union(Schema.NonEmptyTrimmedString, Schema.Positive)

export type StrategyId = Schema.Schema.Type<typeof StrategyId>

/**
 * The builder's working model: a chain strategy or a local draft. Drafts use
 * a uuid id and carry no chain metadata; everything else mirrors the
 * contract, with nodes as the single source of structure.
 */
export const Strategy = Schema.Struct({
    id: StrategyId,
    chainId: ChainId,
    nodes: Schema.mutable(Schema.Array(Node)),
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
        created_at: Schema.optional(Schema.NonNegative),
        updated_at: Schema.optional(Schema.NonNegative),
        source: Schema.optional(Schema.NullOr(Schema.NonEmptyTrimmedString)),
        status: StrategyStatus
    })
)

export type StrategyHandle = Schema.Schema.Type<typeof StrategyHandle>

/**
 * The manager contract's strategy listing, as returned on the wire: the
 * chain-side StrategyHandle minus the chainId we attach locally.
 */
export const ChainStrategyHandle = Schema.Struct({
    id: Schema.NonNegative,
    owner: Schema.NonEmptyTrimmedString,
    contract_address: Schema.NonEmptyTrimmedString,
    created_at: Schema.NonNegative,
    updated_at: Schema.NonNegative,
    label: Schema.NonEmptyTrimmedString,
    source: Schema.optional(Schema.NullOr(Schema.NonEmptyTrimmedString)),
    status: StrategyStatus
})

export type ChainStrategyHandle = Schema.Schema.Type<typeof ChainStrategyHandle>

const ChainStrategyHandles = Schema.Array(ChainStrategyHandle)

/** A strategy contract's `{ config: {} }` response. */
export const StrategyConfig = Schema.Struct({
    manager: Schema.NonEmptyTrimmedString,
    nodes: Schema.Array(Node),
    owner: Schema.NonEmptyTrimmedString,
    withdrawals: Schema.Array(Coin)
})

export type StrategyConfig = Schema.Schema.Type<typeof StrategyConfig>

// ---------------------------------------------------------------------------
// Manager execute messages
// ---------------------------------------------------------------------------

export const Affiliate = Schema.Struct({
    address: Schema.NonEmptyTrimmedString,
    bps: BasisPoints,
    label: Schema.NonEmptyTrimmedString
})

export const InstantiateStrategyMsg = Schema.Struct({
    instantiate: Schema.Struct({
        affiliates: Schema.Array(Affiliate),
        label: Schema.NonEmptyTrimmedString,
        nodes: Schema.Array(Node),
        owner: Schema.optional(Schema.NullOr(Schema.NonEmptyTrimmedString)),
        source: Schema.optional(Schema.NullOr(Schema.NonEmptyTrimmedString))
    })
})

export type InstantiateStrategyMsg = Schema.Schema.Type<typeof InstantiateStrategyMsg>

export const UpdateStrategyMsg = Schema.Struct({
    update: Schema.Struct({
        contract_address: Schema.NonEmptyTrimmedString,
        nodes: Schema.Array(Node)
    })
})

export const UpdateStrategyStatusMsg = Schema.Struct({
    update_status: Schema.Struct({
        contract_address: Schema.NonEmptyTrimmedString,
        status: StrategyStatus
    })
})

export const UpdateStrategyLabelMsg = Schema.Struct({
    update_label: Schema.Struct({
        contract_address: Schema.NonEmptyTrimmedString,
        label: Schema.NonEmptyTrimmedString
    })
})

// ---------------------------------------------------------------------------
// Scheduler wire types (type-level only; the worker casts, never decodes)
// ---------------------------------------------------------------------------

export const Trigger = Schema.Struct({
    id: Uint64,
    owner: Schema.NonEmptyTrimmedString,
    contract_address: Schema.NonEmptyTrimmedString,
    executors: Schema.Array(Schema.NonEmptyTrimmedString),
    execution_rebate: Schema.Array(Coin),
    jitter: Schema.optional(Schema.NullOr(WireDuration)),
    msg: Schema.String,
    condition: Schema.Unknown
})

export type Trigger = Schema.Schema.Type<typeof Trigger>

export interface ConditionFilter {
    readonly timestamp?: { readonly start?: string | null; readonly end?: string | null }
    readonly block_height?: { readonly start?: number | null; readonly end?: number | null }
}

export type SchedulerQueryMsg =
    | { readonly config: Record<string, never> }
    | { readonly filtered: { readonly filter: ConditionFilter; readonly limit?: number | null } }
    | { readonly can_execute: string }

// ---------------------------------------------------------------------------
// CalcService
// ---------------------------------------------------------------------------

export class CalcError extends Schema.TaggedError<CalcError>()("CalcError", {
    cause: Schema.Defect
}) {}

const asCalcError = (cause: unknown) => new CalcError({ cause })

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
                status: StrategyStatus | undefined
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

                if (chain.type !== "cosmos") {
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
