import { describe, expect, it } from "@effect/vitest"
import { calcOrderNodeId, decodePhoenixFrame, encodePhoenixFrame } from "../src/indexer.js"

describe("calcOrderNodeId", () => {
    it("encodes the Relay global id for a strategy address", () => {
        const id = calcOrderNodeId("thor1dp5eys9fs6jswdaxzdhcswfswyhfqlaz2alw5rjf5zqc0gvhh69sukdxvd")
        expect(atob(id)).toBe("CalcOrder:thor1dp5eys9fs6jswdaxzdhcswfswyhfqlaz2alw5rjf5zqc0gvhh69sukdxvd")
    })
})

describe("phoenix frame codec", () => {
    it("round-trips a control frame", () => {
        const frame = {
            joinRef: "1",
            ref: "2",
            topic: "__absinthe__:control",
            event: "phx_join",
            payload: {}
        }
        expect(decodePhoenixFrame(encodePhoenixFrame(frame))).toEqual(frame)
    })

    it("rejects malformed frames instead of throwing", () => {
        expect(decodePhoenixFrame("not json")).toBeUndefined()
        expect(decodePhoenixFrame("[1,2,3]")).toBeUndefined()
        expect(decodePhoenixFrame(JSON.stringify([null, null, 42, "event", {}]))).toBeUndefined()
    })
})
