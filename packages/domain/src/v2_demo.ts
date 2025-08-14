/*
 Demo for the v2 domain layer.

 Run (from repo root) after building, e.g. with ts-node / tsx:
   pnpm tsx packages/domain/src/v2_demo.ts
*/

import { Effect } from "effect"
import { v2_createStrategyBuilder, v2_encodeToChainNodes, v2_parseGraph } from "./v2_index.js"

// Small helper to pretty log inside an Effect pipeline
const log = <A>(label: string) => (value: A): A => {
    console.log(`\n=== ${label} ===`)

    console.dir(value, { depth: 6 })
    return value
}

// Build a simple branching strategy:
// start(Action) -> cond(Condition) -> onSuccess: success(Action), onFailure: fallback(Action)
const buildStrategy = Effect.gen(function*() {
    const builder = v2_createStrategyBuilder({ id: "demo-strategy" })

    const start = yield* builder.addAction({ label: "Start", data: { swap: { from: "ATOM", to: "USDC" } } })
    const cond = yield* builder.addCondition({
        label: "Price Check",
        data: { oracle_price: { asset: "ATOM", direction: "above", price: "10" } }
    })
    // Connect start -> cond
    yield* builder.connect(start.id, "next", cond.id)
    // Use convenience helpers to add + connect in one step
    yield* builder.addActionAndConnect(cond.id, "onSuccess", {
        label: "Execute Trade",
        data: { swap: { from: "USDC", to: "BTC" } }
    })
    yield* builder.addActionAndConnect(cond.id, "onFailure", { label: "Fallback", data: { do_nothing: {} } })

    // Validate structural invariants
    const validated = yield* builder.validate()
    log("Validated Graph")(validated)

    // Encode to chain (topologically ordered Node[] compatible with on-chain types)
    const chainNodes = yield* v2_encodeToChainNodes(validated)
    log("Encoded Chain Nodes")(chainNodes)

    // Serialize (convert Map -> entries array) for storage / network transport
    const serializable = {
        ...validated,
        nodes: Array.from(validated.nodes.entries())
    }
    log("Serializable Form")(serializable)

    // Round-trip decode via schema
    const decoded = yield* v2_parseGraph(serializable)
    log("Decoded Graph")(decoded)

    return decoded
})

// Demonstrate a failing cycle attempt captured via the error channel (no try/catch)
const cycleExample = Effect.gen(function*() {
    const b = v2_createStrategyBuilder({ id: "cycle-demo" })
    const a1 = yield* b.addAction({ label: "A1" })
    const a2 = yield* b.addAction({ label: "A2" })
    yield* b.connect(a1.id, "next", a2.id)
    // Illegal back edge a2 -> a1 triggers conflict
    yield* b.connect(a2.id, "next", a1.id)
}).pipe(
    Effect.catchTag("V2ConflictError", (e) =>
        Effect.sync(() => {
            log("Cycle Prevention Triggered")(e)
            return undefined
        }))
)
// Compose: run cycle example (for side‑effect logging) then build main strategy
const program = Effect.flatMap(cycleExample, () => buildStrategy)

// Final handling: log categorized errors or final graph
const runnable = program.pipe(
    Effect.tap((graph) => Effect.sync(() => log("Final Graph")(graph))),
    Effect.catchTag("V2ValidationError", (e) => Effect.sync(() => log("Validation Error")(e))),
    Effect.catchTag("V2EncodingError", (e) => Effect.sync(() => log("Encoding Error")(e))),
    Effect.catchTag("V2ConflictError", (e) => Effect.sync(() => log("Conflict Error")(e))),
    Effect.catchAll((err) => Effect.sync(() => log("Unknown Error")(err as any)))
)

// Execute when run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    Effect.runPromise(runnable).catch((e) => {
        console.error("Program failed", e)
        process.exit(1)
    })
}
