import { Schema } from "effect"

export const ChainType = Schema.Literal("evm", "cosmos", "utxo")

export type ChainType = Schema.Schema.Type<typeof ChainType>

export const ChainId = Schema.Union(
    Schema.NonEmptyTrimmedString,
    Schema.Positive
)

export const Chain = Schema.Struct({
    type: ChainType,
    id: ChainId,
    displayName: Schema.NonEmptyTrimmedString,
    color: Schema.NonEmptyTrimmedString,
    rpcUrls: Schema.Array(Schema.NonEmptyTrimmedString),
    nativeCurrency: Schema.Struct({
        name: Schema.NonEmptyTrimmedString,
        symbol: Schema.NonEmptyTrimmedString,
        decimals: Schema.Positive.pipe(Schema.clamp(6, 18))
    })
})

export type Chain = Schema.Schema.Type<typeof Chain>

export type ChainId = Schema.Schema.Type<typeof ChainId>
