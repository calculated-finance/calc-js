import { Schema } from "effect"

// A strict filter, not a clamp: the client form validates via decode and
// commits the raw value, so a clamp would let out-of-range input pass
// validation and then fail on the encode round-trip.
export const BasisPoints = Schema.NonNegativeInt.pipe(
    Schema.between(0, 10_000)
).pipe(
    Schema.annotations({
        message: () => ({
            message: "Please provide a valid % value",
            override: true
        })
    })
)

/**
 * The magnitude-dependent precision formatNumber uses, exposed so animated
 * number displays (NumberFlow) can format identically. The return type stays
 * structural so it satisfies both Intl.NumberFormatOptions and NumberFlow's
 * stricter Format.
 */
export const numberFormatOptions = (value: number) => ({
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
    minimumFractionDigits: 0
})

export const formatNumber = (value: number, options?: Intl.NumberFormatOptions) =>
    (new Intl.NumberFormat("en-US", {
        ...numberFormatOptions(value),
        ...options
    }).format(value)).replace(/(\.\d*?[1-9])0+$/g, "$1").replace(/\.0+$/, "").replace(/(\.\d*[1-9])0+$/, "$1")
