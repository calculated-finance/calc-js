import { describe, expect, it } from "@effect/vitest"
import { Either, Schema } from "effect"
import { LinearScalarSwapAdjustment } from "../src/calc.js"
import { BasisPoints } from "../src/numbers.js"

const decodeAdjustment = Schema.decodeUnknownEither(LinearScalarSwapAdjustment)
const encodeAdjustment = Schema.encodeUnknownEither(LinearScalarSwapAdjustment)
const decodeBps = Schema.decodeUnknownEither(BasisPoints)

const adjustmentWithScalar = (scalar: number) => ({
    linear_scalar: {
        base_receive_amount: { amount: "10000000000", denom: "rune" },
        minimum_swap_amount: null,
        scalar
    }
})

describe("LinearScalarSwapAdjustment.scalar", () => {
    it("accepts a scalar within (0, 10]", () => {
        const result = decodeAdjustment(adjustmentWithScalar(10))
        expect(Either.isRight(result)).toBe(true)
    })

    it("rejects a scalar above 10 on decode instead of clamping", () => {
        const result = decodeAdjustment(adjustmentWithScalar(11))
        expect(Either.isLeft(result)).toBe(true)
    })

    it("rejects a non-positive scalar on decode", () => {
        const result = decodeAdjustment(adjustmentWithScalar(0))
        expect(Either.isLeft(result)).toBe(true)
    })

    it("rejects a scalar above 10 on encode", () => {
        const decoded = decodeAdjustment(adjustmentWithScalar(5))
        expect(Either.isRight(decoded)).toBe(true)
        if (Either.isRight(decoded)) {
            const tampered = {
                linear_scalar: { ...decoded.right.linear_scalar, scalar: 11 }
            }
            expect(Either.isLeft(encodeAdjustment(tampered))).toBe(true)
        }
    })

    it("round-trips a valid adjustment", () => {
        const decoded = decodeAdjustment(adjustmentWithScalar(3))
        expect(Either.isRight(decoded)).toBe(true)
        if (Either.isRight(decoded)) {
            const encoded = encodeAdjustment(decoded.right)
            expect(Either.isRight(encoded)).toBe(true)
        }
    })
})

describe("BasisPoints", () => {
    it("accepts the bounds", () => {
        expect(Either.isRight(decodeBps(0))).toBe(true)
        expect(Either.isRight(decodeBps(10_000))).toBe(true)
    })

    it("rejects values above 10000 on decode instead of clamping", () => {
        expect(Either.isLeft(decodeBps(10_001))).toBe(true)
    })

    it("rejects negative values", () => {
        expect(Either.isLeft(decodeBps(-1))).toBe(true)
    })
})
