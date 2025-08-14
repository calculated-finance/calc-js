import { Effect } from "effect"
import { v4 as uuid } from "uuid"
import type { V2EncodingError, V2ValidationError } from "./v2_errors.js"
import { V2ConflictError, V2NotFoundError } from "./v2_errors.js"
import { v2_encodeToChainNodes } from "./v2_strategyEncoding.js"
import type { V2ActionNode, V2ConditionNode, V2MutableStrategyGraph, V2StrategyGraph } from "./v2_strategyModel.js"
import { v2_validateGraph, v2_wouldCreateCycle } from "./v2_strategyValidation.js"

export interface V2StrategyBuilderOptions {
    readonly id?: string
    readonly timestamp?: () => number
}

export interface V2StrategyBuilderApi {
    readonly get: () => V2StrategyGraph
    readonly addAction: (input: { label?: string; data?: unknown }) => Effect.Effect<V2ActionNode>
    readonly addCondition: (input: { label?: string; data?: unknown }) => Effect.Effect<V2ConditionNode>
    // Convenience: add a new action and connect it from an existing node in one step
    readonly addActionAndConnect: (
        from: string,
        slot: "next" | "onSuccess" | "onFailure",
        input: { label?: string; data?: unknown }
    ) => Effect.Effect<V2StrategyGraph, V2ConflictError | V2NotFoundError>
    // Convenience: add a new condition and connect it from an existing node in one step
    readonly addConditionAndConnect: (
        from: string,
        slot: "next" | "onSuccess" | "onFailure",
        input: { label?: string; data?: unknown }
    ) => Effect.Effect<V2StrategyGraph, V2ConflictError | V2NotFoundError>
    readonly connect: (
        from: string,
        slot: "next" | "onSuccess" | "onFailure",
        to: string
    ) => Effect.Effect<V2StrategyGraph, V2ConflictError | V2NotFoundError>
    readonly disconnect: (
        from: string,
        slot: "next" | "onSuccess" | "onFailure"
    ) => Effect.Effect<V2StrategyGraph, V2NotFoundError>
    readonly remove: (id: string) => Effect.Effect<V2StrategyGraph, V2NotFoundError>
    readonly validate: () => Effect.Effect<V2StrategyGraph, V2ValidationError>
    readonly encodeChain: () => Effect.Effect<ReadonlyArray<unknown>, V2EncodingError | V2ValidationError>
}

export function v2_createStrategyBuilder(opts?: V2StrategyBuilderOptions): V2StrategyBuilderApi {
    const now = () => opts?.timestamp?.() ?? Date.now()
    const graph: V2MutableStrategyGraph = {
        id: opts?.id ?? uuid(),
        createdAt: now(),
        updatedAt: now(),
        root: "",
        status: "draft",
        nodes: new Map()
    }

    const api: V2StrategyBuilderApi = {
        get: () => ({ ...graph, nodes: new Map(graph.nodes.entries()) }),
        addAction: ({ data, label }) =>
            Effect.sync(() => {
                const node: V2ActionNode = { id: uuid(), kind: "action", label, data: data ?? {}, next: undefined }
                graph.nodes.set(node.id, node)
                if (!graph.root) (graph as any).root = node.id
                ;(graph as any).updatedAt = now()
                return node
            }),
        addCondition: ({ data, label }) =>
            Effect.sync(() => {
                const node: V2ConditionNode = {
                    id: uuid(),
                    kind: "condition",
                    label,
                    data: data ?? {},
                    onFailure: undefined,
                    onSuccess: undefined
                }
                graph.nodes.set(node.id, node)
                if (!graph.root) (graph as any).root = node.id
                ;(graph as any).updatedAt = now()
                return node
            }),
        addActionAndConnect: (from, slot, input) =>
            Effect.flatMap(api.addAction(input), (node) => api.connect(from, slot, node.id)),
        addConditionAndConnect: (from, slot, input) =>
            Effect.flatMap(api.addCondition(input), (node) => api.connect(from, slot, node.id)),
        connect: (from, slot, to) =>
            Effect.sync(() => {
                const a = graph.nodes.get(from)
                const b = graph.nodes.get(to)
                if (!a) throw new V2NotFoundError({ entity: "node", id: from })
                if (!b) throw new V2NotFoundError({ entity: "node", id: to })
                if (v2_wouldCreateCycle(graph, from, to)) {
                    throw new V2ConflictError({ message: "Connection would create cycle" })
                }
                if (a.kind === "action" && slot !== "next") {
                    throw new V2ConflictError({ message: "Action node only supports 'next'" })
                }
                if (a.kind === "condition" && slot === "next") {
                    throw new V2ConflictError({ message: "Condition node does not support 'next'" })
                }
                if (a.kind === "action") {
                    graph.nodes.set(from, { ...a, next: to })
                } else {
                    if (slot === "onSuccess") graph.nodes.set(from, { ...a, onSuccess: to })
                    if (slot === "onFailure") graph.nodes.set(from, { ...a, onFailure: to })
                }
                ;(graph as any).updatedAt = now()
                return api.get()
            }),
        disconnect: (from, slot) =>
            Effect.sync(() => {
                const n = graph.nodes.get(from)
                if (!n) throw new V2NotFoundError({ entity: "node", id: from })
                if (n.kind === "action" && slot === "next") graph.nodes.set(from, { ...n, next: undefined })
                else if (n.kind === "condition") {
                    if (slot === "onSuccess") graph.nodes.set(from, { ...n, onSuccess: undefined })
                    if (slot === "onFailure") graph.nodes.set(from, { ...n, onFailure: undefined })
                }
                ;(graph as any).updatedAt = now()
                return api.get()
            }),
        remove: (id) =>
            Effect.sync(() => {
                if (!graph.nodes.has(id)) throw new V2NotFoundError({ entity: "node", id })
                for (const [nid, node] of graph.nodes.entries()) {
                    if (node.kind === "action" && node.next === id) graph.nodes.set(nid, { ...node, next: undefined })
                    if (node.kind === "condition") {
                        if (node.onSuccess === id) graph.nodes.set(nid, { ...node, onSuccess: undefined })
                        if (node.onFailure === id) graph.nodes.set(nid, { ...node, onFailure: undefined })
                    }
                }
                graph.nodes.delete(id)
                if (graph.root === id) (graph as any).root = graph.nodes.keys().next().value ?? ""
                ;(graph as any).updatedAt = now()
                return api.get()
            }),
        validate: () => v2_validateGraph(api.get()),
        encodeChain: () => v2_encodeToChainNodes(api.get())
    }

    return api
}
