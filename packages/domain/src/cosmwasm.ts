import { BigDecimal, Schema } from "effect"

export const Uint128 = Schema.BigInt.pipe(Schema.clampBigInt(
    BigInt(0),
    BigInt("3402823668417103009491288319719694682111")
))

export const Uint64 = Schema.BigInt.pipe(Schema.clampBigInt(
    BigInt(0),
    BigInt("18446744073709551615")
))

export const Decimal = Schema.BigDecimal.pipe(Schema.clampBigDecimal(
    BigDecimal.fromBigInt(0n),
    BigDecimal.fromBigInt(340282366841710300949128831971969468211n)
))

export const Coin = Schema.Struct({
    amount: Uint128,
    denom: Schema.NonEmptyTrimmedString
})

export const AddrSchema = Schema.NonEmptyTrimmedString.pipe(
    Schema.brand("Addr"),
    Schema.maxLength(255),
    Schema.minLength(1)
)

export type Addr = typeof AddrSchema.Type

export const RujiraStagenetAddrSchema = AddrSchema.pipe(
    Schema.startsWith("sthor")
)

export type RujiraStagenetAddr = typeof RujiraStagenetAddrSchema.Type

export const RujiraMainnetAddrSchema = AddrSchema.pipe(
    Schema.startsWith("thor")
)

export type RujiraMainnetAddr = typeof RujiraMainnetAddrSchema.Type
