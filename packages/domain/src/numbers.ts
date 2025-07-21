import { Schema } from "effect"

export const BasisPoints = Schema.NonNegativeInt.pipe(
    Schema.clamp(0, 10_000)
)

export const PercentageFromBasisPoints = Schema.transform(
    BasisPoints,
    Schema.NonNegativeInt.pipe(
        Schema.clamp(0, 100)
    ),
    {
        strict: true,
        decode: (value) => Math.round(value / 10_000),
        encode: (value) => Math.round(value * 10_000)
    }
)

export const formatNumber = (value: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: value > 1 ? 2 : 4,
        minimumFractionDigits: 2,
        ...options
    }).format(value)
}
