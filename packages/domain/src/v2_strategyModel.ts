// Domain-centric, blockchain-agnostic strategy model (version 2)
// NOTE: This file deliberately avoids importing contract wire types to keep the
// core model portable; conversions live in v2_strategyEncoding.ts

export type V2NodeId = string

export type V2StrategyStatus = "draft" | "active" | "paused"

// Action / Condition payloads reuse the on-chain JSON shapes so consumers can
// pass through known structures, but they remain opaque to the core graph logic.
// If in future additional domain-only fields are needed, extend here.
export type V2ActionPayload = unknown
export type V2ConditionPayload = unknown

export interface V2BaseNode<K extends string, P> {
    readonly id: V2NodeId
    readonly kind: K
    readonly label?: string | undefined
    readonly data: P
    readonly meta?: Record<string, unknown> | undefined
}

export interface V2ActionNode extends V2BaseNode<"action", V2ActionPayload> {
    readonly next?: V2NodeId | undefined
}

export interface V2ConditionNode extends V2BaseNode<"condition", V2ConditionPayload> {
    readonly onSuccess?: V2NodeId | undefined
    readonly onFailure?: V2NodeId | undefined
}

export type V2StrategyNode = V2ActionNode | V2ConditionNode

export interface V2StrategyGraph {
    readonly id: string
    readonly root: V2NodeId
    readonly nodes: Map<V2NodeId, V2StrategyNode>
    readonly status: V2StrategyStatus
    readonly createdAt: number
    readonly updatedAt: number
}

export interface V2MutableStrategyGraph extends Omit<V2StrategyGraph, "nodes"> {
    nodes: Map<V2NodeId, V2StrategyNode>
}

// Slots for uniform edge iteration
export type V2EdgeSlot = "next" | "onSuccess" | "onFailure"

export interface V2EdgeDefinition {
    readonly from: V2NodeId
    readonly to: V2NodeId
    readonly slot: V2EdgeSlot
}

export function v2_listEdges(graph: V2StrategyGraph): Array<V2EdgeDefinition> {
    const out: Array<V2EdgeDefinition> = []
    for (const node of graph.nodes.values()) {
        if (node.kind === "action" && node.next) {
            out.push({ from: node.id, to: node.next, slot: "next" })
        } else if (node.kind === "condition") {
            if (node.onSuccess) out.push({ from: node.id, to: node.onSuccess, slot: "onSuccess" })
            if (node.onFailure) out.push({ from: node.id, to: node.onFailure, slot: "onFailure" })
        }
    }
    return out
}

export function v2_clone(graph: V2StrategyGraph): V2MutableStrategyGraph {
    return {
        ...graph,
        nodes: new Map(graph.nodes.entries())
    }
}
