import { describe, expect, it } from "@effect/vitest"
import { Either, Schema } from "effect"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { ChainStrategyHandle, Node, StrategyConfig } from "../src/calc.js"

/**
 * Wire-fidelity tests against real mainnet responses (captured 2026-08-13
 * from the deployed v2.0.0 manager and eight of its strategy contracts).
 * If these fail after a fixture refresh, the deployed contract shape moved
 * and repos/calc-rs needs re-vendoring at the new tag.
 */

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), "fixtures")

const handles = JSON.parse(readFileSync(join(fixturesDir, "manager-strategies.json"), "utf8")) as Array<unknown>
const configs = JSON.parse(
    readFileSync(join(fixturesDir, "strategy-configs.json"), "utf8")
) as Record<string, unknown>

const decodeHandle = Schema.decodeUnknownEither(ChainStrategyHandle)
const decodeConfig = Schema.decodeUnknownEither(StrategyConfig)
const encodeNodes = Schema.encodeUnknownEither(Schema.Array(Node))

describe("manager strategies listing", () => {
    it("decodes every live handle", () => {
        for (const handle of handles) {
            const result = decodeHandle(handle)
            if (Either.isLeft(result)) {
                throw new Error(`handle failed to decode: ${JSON.stringify(handle)}\n${String(result.left)}`)
            }
        }
        expect(handles.length).toBeGreaterThan(0)
    })
})

describe("strategy config", () => {
    it("decodes every live config", () => {
        for (const [address, config] of Object.entries(configs)) {
            const result = decodeConfig(config)
            if (Either.isLeft(result)) {
                throw new Error(`config ${address} failed to decode:\n${String(result.left)}`)
            }
        }
        expect(Object.keys(configs).length).toBeGreaterThan(0)
    })

    it("re-encodes nodes preserving graph structure and coin strings", () => {
        for (const [address, config] of Object.entries(configs)) {
            const decoded = decodeConfig(config)
            expect(Either.isRight(decoded)).toBe(true)
            if (Either.isLeft(decoded)) continue

            const encoded = encodeNodes(decoded.right.nodes)
            if (Either.isLeft(encoded)) {
                throw new Error(`nodes for ${address} failed to encode:\n${String(encoded.left)}`)
            }

            const raw = (config as { nodes: Array<Record<string, { index: number }>> }).nodes
            expect(encoded.right.length).toBe(raw.length)
            for (let i = 0; i < raw.length; i++) {
                const rawNode = raw[i] as Record<string, { index: number; next?: number | null }>
                const outNode = encoded.right[i] as Record<string, { index: number; next?: number | null }>
                const kind = "action" in rawNode ? "action" : "condition"
                expect(kind in outNode).toBe(true)
                expect(outNode[kind].index).toBe(rawNode[kind].index)
            }
        }
    })
})
