import { Effect } from "effect"
import { describe, expect, it } from "vitest"
import {
    v2_createStrategyBuilder,
    v2_encodeToChainNodes,
    v2_validateGraph,
    v2_wouldCreateCycle,
    V2ValidationError
} from "../src/v2_index.js"

// Helper to run an Effect inside tests
const run = <A>(eff: Effect.Effect<A, unknown>): Promise<A> => Effect.runPromise(eff)

describe("v2 strategy builder basics", () => {
    it("creates action + condition and connects them", async () => {
        const builder = v2_createStrategyBuilder({ id: "test-strat" })
        const action = await run(builder.addAction({ label: "Start", data: { swap: { foo: "bar" } } }))
        const cond = await run(
            builder.addCondition({
                label: "Check",
                data: { oracle_price: { asset: "ATOM", direction: "above", price: "1" } }
            })
        )
        await run(builder.connect(action.id, "next", cond.id))
        const graph = builder.get()
        expect(graph.root).toBe(action.id)
        expect(graph.nodes.size).toBe(2)
        const encoded = await run(builder.encodeChain())
        expect(encoded.length).toBe(2)
    })

    it("prevents cycles", async () => {
        const b = v2_createStrategyBuilder()
        const a1 = await run(b.addAction({ label: "A1" }))
        const a2 = await run(b.addAction({ label: "A2" }))
        await run(b.connect(a1.id, "next", a2.id))
        const cycle = v2_wouldCreateCycle(b.get(), a2.id, a1.id)
        expect(cycle).toBe(true)
    })

    it("validation fails on unreachable node", async () => {
        const b = v2_createStrategyBuilder()
        const a1 = await run(b.addAction({ label: "Root" }))
        await run(b.addAction({ label: "Dangling" }))
        const eff = v2_validateGraph(b.get())
        try {
            await run(eff)
            throw new Error("should have failed")
        } catch (e) {
            expect(e).toBeInstanceOf(V2ValidationError)
        }
        // After connecting, validation should pass
        const all = Array.from(b.get().nodes.keys())
        const dangling = all.find((id) => id !== a1.id)!
        await run(b.connect(a1.id, "next", dangling))
        await run(v2_validateGraph(b.get()))
    })

    it("encodes condition branching", async () => {
        const b = v2_createStrategyBuilder()
        const start = await run(b.addAction({ label: "Start" }))
        const cond = await run(b.addCondition({ label: "Cond" }))
        const success = await run(b.addAction({ label: "Success" }))
        const failure = await run(b.addAction({ label: "Failure" }))
        await run(b.connect(start.id, "next", cond.id))
        await run(b.connect(cond.id, "onSuccess", success.id))
        await run(b.connect(cond.id, "onFailure", failure.id))
        await run(v2_validateGraph(b.get()))
        const chainNodes = await run(v2_encodeToChainNodes(b.get()))
        expect(chainNodes.length).toBe(4)
    })
})
