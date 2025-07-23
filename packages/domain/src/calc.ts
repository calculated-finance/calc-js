import { Schema } from "effect"
import { Amount } from "./assets.js"
import { Coin, Uint64 } from "./cosmwasm.js"
import { BasisPoints } from "./numbers.js"

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
        latest_swap: Schema.optional(StreamingSwap),
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

export const InnerMany = Schema.Array(Schema.Union(SwapAction))

export const InnerManyAction = Schema.Struct({
    id: Schema.NonEmptyTrimmedString,
    many: InnerMany
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
        interval: Schema.Positive.pipe(
            Schema.annotations({
                message: () => ({
                    message: "Please provide a valid time interval",
                    override: true
                })
            })
        ),
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
        previous: Schema.optional(Schema.NullOr(Uint64))
    })
})

export const Cadence = Schema.Union(
    BlockSchedule,
    TimeSchedule,
    CronSchedule
)

export const Schedule = Schema.Struct({
    cadence: Cadence,
    action: Schema.optional(Schema.Union(SwapAction, InnerManyAction)),
    execution_rebate: Schema.mutable(Schema.Array(Coin)),
    scheduler: Schema.NonEmptyTrimmedString
})

export type Schedule = Schema.Schema.Type<typeof Schedule>

export const ScheduleAction = Schema.Struct({
    id: Schema.NonEmptyTrimmedString,
    schedule: Schedule
})

export type ScheduleAction = Schema.Schema.Type<typeof ScheduleAction>

export const ActionsExcludingMany = Schema.Union(SwapAction, ScheduleAction)

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

export const Action = Schema.Union(SwapAction, ManyAction, ScheduleAction)

export type Action = Schema.Schema.Type<typeof Action>

export const Strategy = Schema.Struct({
    id: Schema.NonEmptyTrimmedString,
    action: Schema.optional(Action),
    address: Schema.optional(Schema.NonEmptyTrimmedString),
    owner: Schema.optional(Schema.NonEmptyString.pipe(
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
