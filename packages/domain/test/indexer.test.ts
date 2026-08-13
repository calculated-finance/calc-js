import { describe, expect, it } from "@effect/vitest"
import { buildSchema, parse, validate } from "graphql"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import {
    ACCOUNT_BALANCES_QUERY,
    accountNodeId,
    CALC_ORDERS_BALANCES_QUERY,
    CALC_ORDERS_UPDATED_SUBSCRIPTION,
    calcOrderNodeId,
    decodePhoenixFrame,
    encodePhoenixFrame,
    FIN_PAIRS_QUERY
} from "../src/indexer.js"

const schemaPath = join(
    dirname(fileURLToPath(import.meta.url)),
    "../../../repos/rujira-ui/packages/developer/data/schema.graphql"
)

describe("indexer GraphQL documents", () => {
    // The documents are handwritten; validating them against the vendored
    // introspection schema catches typos and upstream drift without codegen.
    // assumeValidSDL: the vendored SDL itself has a duplicate enum value
    // (Chain.TRON) that graphql-js would otherwise reject.
    const schema = buildSchema(readFileSync(schemaPath, "utf8"), { assumeValidSDL: true })

    it.each([
        ["FIN_PAIRS_QUERY", FIN_PAIRS_QUERY],
        ["CALC_ORDERS_BALANCES_QUERY", CALC_ORDERS_BALANCES_QUERY],
        ["ACCOUNT_BALANCES_QUERY", ACCOUNT_BALANCES_QUERY],
        ["CALC_ORDERS_UPDATED_SUBSCRIPTION", CALC_ORDERS_UPDATED_SUBSCRIPTION]
    ])("%s validates against the vendored schema", (_name, document) => {
        const errors = validate(schema, parse(document))
        expect(errors.map((error) => error.message)).toEqual([])
    })
})

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
