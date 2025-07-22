import { Schema } from "effect"

export const BasisPoints = Schema.NonNegativeInt.pipe(
    Schema.clamp(0, 10_000)
).pipe(
    Schema.annotations({
        message: () => ({
            message: "Please provide a valid % value",
            override: true
        })
    })
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
).pipe(Schema.annotations({
    message: () => ({
        message: "Please provide a % value",
        override: true
    })
}))

export const formatNumber = (value: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: value > 1_000 ? 0 : value > 1 ? 2 : 4,
        minimumFractionDigits: value > 1_000 ? 0 : value > 1 ? 2 : 4,
        ...options
    }).format(value)
}
