import { Effect } from "effect"
import { V2ValidationError } from "./v2_errors.js"
import type { V2StrategyGraph } from "./v2_strategyModel.js"
import { v2_listEdges } from "./v2_strategyModel.js"

export interface V2ValidationOptions {
    requireRootReachability?: boolean
    forbidCycles?: boolean
    enforceOutDegree?: boolean
}

const defaultOpts: Required<V2ValidationOptions> = {
    requireRootReachability: true,
    forbidCycles: true,
    enforceOutDegree: true
}

export function v2_validateGraph(
    graph: V2StrategyGraph,
    options?: V2ValidationOptions
): Effect.Effect<V2StrategyGraph, V2ValidationError> {
    const opts = { ...defaultOpts, ...options }
    return Effect.try({
        try: () => {
            const issues: Array<string> = []
            if (!graph.nodes.has(graph.root)) issues.push(`Root node '${graph.root}' missing`)

            // Reachability / BFS
            if (opts.requireRootReachability && graph.nodes.size > 0) {
                const visited = new Set<string>()
                const q: Array<string> = [graph.root]
                while (q.length) {
                    const id = q.shift()!
                    const node = graph.nodes.get(id)
                    if (!node) continue
                    if (visited.has(node.id)) continue
                    visited.add(node.id)
                    if (node.kind === "action" && node.next) q.push(node.next)
                    if (node.kind === "condition") {
                        if (node.onSuccess) q.push(node.onSuccess)
                        if (node.onFailure) q.push(node.onFailure)
                    }
                }
                for (const id of graph.nodes.keys()) {
                    if (!visited.has(id)) issues.push(`Node '${id}' unreachable from root`)
                }
            }

            // Out-degree constraints
            if (opts.enforceOutDegree) {
                for (const node of graph.nodes.values()) {
                    if (node.kind === "action") {
                        if (node.next === node.id) issues.push(`Action node '${node.id}' cannot point to itself`)
                    } else {
                        if (node.onSuccess === node.id) issues.push(`Condition '${node.id}' success loop disallowed`)
                        if (node.onFailure === node.id) issues.push(`Condition '${node.id}' failure loop disallowed`)
                    }
                }
            }

            // Cycle detection (DFS)
            if (opts.forbidCycles) {
                const edges = v2_listEdges(graph)
                const adj = new Map<string, Array<string>>()
                for (const e of edges) {
                    const list = adj.get(e.from) || []
                    list.push(e.to)
                    adj.set(e.from, list)
                }
                const visiting = new Set<string>()
                const visited = new Set<string>()
                const dfs = (id: string): boolean => {
                    if (visiting.has(id)) return true
                    if (visited.has(id)) return false
                    visiting.add(id)
                    for (const n of adj.get(id) || []) if (dfs(n)) return true
                    visiting.delete(id)
                    visited.add(id)
                    return false
                }
                for (const id of graph.nodes.keys()) {
                    if (dfs(id)) issues.push(`Cycle detected involving '${id}'`)
                }
            }

            if (issues.length) throw new V2ValidationError({ issues })
            return graph
        },
        catch: (e) => (e instanceof V2ValidationError ? e : new V2ValidationError({ issues: [(e as any).message] }))
    })
}

// Helper – ensure a prospective connection does not create a cycle
export function v2_wouldCreateCycle(graph: V2StrategyGraph, from: string, to: string): boolean {
    if (from === to) return true
    // search path from target back to source
    const stack = [to]
    const visited = new Set<string>()
    while (stack.length) {
        const id = stack.pop()!
        if (id === from) return true
        if (visited.has(id)) continue
        visited.add(id)
        const node = graph.nodes.get(id)
        if (!node) continue
        if (node.kind === "action" && node.next) stack.push(node.next)
        if (node.kind === "condition") {
            if (node.onSuccess) stack.push(node.onSuccess)
            if (node.onFailure) stack.push(node.onFailure)
        }
    }
    return false
}
