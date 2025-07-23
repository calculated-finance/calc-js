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
    // Format the number with sufficient fraction digits, then remove trailing zeros after the decimal point
    const formatted = new Intl.NumberFormat("en-US", {
        maximumFractionDigits: value > 1_000 ? 0 : value > 1 ? 2 : 4,
        minimumFractionDigits: 0,
        ...options
    }).format(value)
    // Remove trailing zeros after decimal and possible lingering decimal point
    return formatted.replace(/(\.\d*?[1-9])0+$/g, "$1").replace(/\.0+$/, "").replace(/(\.\d*[1-9])0+$/, "$1")
}
