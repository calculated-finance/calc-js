import { Effect } from "effect"
import type { Node as ChainNode } from "./types.js"
import type { V2ValidationError } from "./v2_errors.js"
import { V2EncodingError } from "./v2_errors.js"
import type { V2StrategyGraph, V2StrategyNode } from "./v2_strategyModel.js"
import { v2_listEdges } from "./v2_strategyModel.js"
import { v2_validateGraph } from "./v2_strategyValidation.js"

interface IndexedNodeRef {
    id: string
    index: number
    node: V2StrategyNode
}

// Topological order (Kahn). Assumes acyclic (validated beforehand)
function topoOrder(graph: V2StrategyGraph): Array<IndexedNodeRef> {
    const inDeg = new Map<string, number>()
    for (const id of graph.nodes.keys()) inDeg.set(id, 0)
    for (const e of v2_listEdges(graph)) inDeg.set(e.to, (inDeg.get(e.to) || 0) + 1)
    const q: Array<string> = []
    for (const [id, deg] of inDeg.entries()) if (deg === 0) q.push(id)
    const ordered: Array<IndexedNodeRef> = []
    while (q.length) {
        const id = q.shift()!
        const node = graph.nodes.get(id)!
        ordered.push({ id, node, index: ordered.length })
        if (node.kind === "action" && node.next) {
            inDeg.set(node.next, (inDeg.get(node.next) || 0) - 1)
            if (inDeg.get(node.next) === 0) q.push(node.next)
        } else if (node.kind === "condition") {
            for (const to of [node.onSuccess, node.onFailure]) {
                if (!to) continue
                inDeg.set(to, (inDeg.get(to) || 0) - 1)
                if (inDeg.get(to) === 0) q.push(to)
            }
        }
    }
    if (ordered.length !== graph.nodes.size) throw new Error("Topological order failed - graph may be cyclic")
    return ordered
}

export function v2_encodeToChainNodes(
    graph: V2StrategyGraph
): Effect.Effect<Array<ChainNode>, V2EncodingError | V2ValidationError> {
    return v2_validateGraph(graph).pipe(
        Effect.flatMap(() =>
            Effect.try({
                try: () => {
                    const ordered = topoOrder(graph)
                    const indexMap = new Map<string, number>()
                    ordered.forEach((r, i) => indexMap.set(r.id, i))
                    const chainNodes: Array<ChainNode> = ordered.map((r) => {
                        if (r.node.kind === "action") {
                            return {
                                action: {
                                    index: indexMap.get(r.id)!,
                                    action: r.node.data as any, // consumer ensures shape
                                    next: r.node.next ? indexMap.get(r.node.next)! : null
                                }
                            }
                        }
                        return {
                            condition: {
                                index: indexMap.get(r.id)!,
                                condition: r.node.data as any,
                                on_success: r.node.onSuccess ? indexMap.get(r.node.onSuccess)! : null,
                                on_failure: r.node.onFailure ? indexMap.get(r.node.onFailure)! : null
                            }
                        }
                    })
                    return chainNodes
                },
                catch: (
                    e
                ) => (e instanceof V2EncodingError ? e : new V2EncodingError({ message: (e as Error).message }))
            })
        )
    )
}
