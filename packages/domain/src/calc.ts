import { Schema } from "effect"
import { Amount } from "./assets.js"
import { Decimal } from "./cosmwasm.js"
import { BasisPoints } from "./numbers.js"

export const FixedSwapAdjustment = Schema.Literal("fixed")

export const LinearScalarSwapAdjustment = Schema.Struct({
    linear_scalar: Schema.Struct({
        base_receive_amount: Amount,
        minimum_swap_amount: Schema.NullOr(Amount),
        scalar: Decimal
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

export const SwapRoutes = Schema.Array(SwapRoute)

export const Swap = Schema.Struct({
    adjustment: SwapAmountAdjustment,
    maximum_slippage_bps: BasisPoints,
    minimum_receive_amount: Amount,
    routes: SwapRoutes,
    swap_amount: Amount
})

export const SwapAction = Schema.Struct({
    swap: Swap
})

export type SwapAction = Schema.Schema.Type<typeof SwapAction>

export const ActionsExcludingMany = Schema.Union(SwapAction)

export type ActionsExcludingMany = Schema.Schema.Type<
    typeof ActionsExcludingMany
>

export const Many = Schema.Array(ActionsExcludingMany)

export const ManyAction = Schema.Struct({
    many: Many
})

export type ManyAction = Schema.Schema.Type<typeof ManyAction>

export const Action = Schema.Union(SwapAction, ManyAction)

export type Action = Schema.Schema.Type<typeof Action>
