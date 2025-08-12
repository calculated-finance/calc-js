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

export const formatNumber = (value: number, options?: Intl.NumberFormatOptions) =>
    (new Intl.NumberFormat("en-US", {
        maximumFractionDigits: value > 1000
            ? 0
            : value > 1
            ? 2
            : value > 0.001
            ? 4
            : value > 0.0001
            ? 5
            : value > 0.00001
            ? 6
            : value > 0.000001
            ? 7
            : 8,
        minimumFractionDigits: 0,
        ...options
    }).format(value)).replace(/(\.\d*?[1-9])0+$/g, "$1").replace(/\.0+$/, "").replace(/(\.\d*[1-9])0+$/, "$1")
