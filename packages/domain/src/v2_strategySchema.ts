import { Effect, Schema as S } from "effect"
import { V2ValidationError } from "./v2_errors.js"
import type { V2ActionNode, V2ConditionNode, V2StrategyGraph, V2StrategyNode } from "./v2_strategyModel.js"

// Basic schemas – payloads remain unknown (validation can be layered later per concrete action/condition variant)

// NOTE: Using the capitalized constructor API as per current Effect Schema guidelines.
export const V2ActionNodeSchema = S.Struct({
    id: S.String,
    kind: S.Literal("action"),
    label: S.optional(S.String),
    data: S.Unknown,
    next: S.optional(S.String),
    meta: S.optional(S.Record({ key: S.String, value: S.Unknown }))
}) satisfies S.Schema<V2ActionNode>

export const V2ConditionNodeSchema = S.Struct({
    id: S.String,
    kind: S.Literal("condition"),
    label: S.optional(S.String),
    data: S.Unknown,
    onSuccess: S.optional(S.String),
    onFailure: S.optional(S.String),
    meta: S.optional(S.Record({ key: S.String, value: S.Unknown }))
}) satisfies S.Schema<V2ConditionNode>

export const V2StrategyNodeSchema = S.Union(V2ActionNodeSchema, V2ConditionNodeSchema) satisfies S.Schema<
    V2StrategyNode
>

// Represent nodes as entries then transform to Map to satisfy runtime decoding while preserving Map type
const NodesEntriesSchema = S.Array(S.Tuple(S.String, V2StrategyNodeSchema))

// Internal decode shape (nodes as entries array) to avoid complex Map schema typing friction
export const V2StrategyGraphSchema = S.Struct({
    id: S.String,
    root: S.String,
    status: S.Union(S.Literal("draft"), S.Literal("active"), S.Literal("paused")),
    createdAt: S.Number,
    updatedAt: S.Number,
    nodes: NodesEntriesSchema
})

export function v2_parseGraph(input: unknown) {
    const decoded = S.decodeUnknown(V2StrategyGraphSchema)(input)
    const toGraph = Effect.map(decoded, (g) =>
        ({
            ...g,
            nodes: new Map(g.nodes as any)
        }) as V2StrategyGraph)
    return Effect.mapError(
        toGraph,
        (issue: unknown) => new V2ValidationError({ issues: [String((issue as any)?.message ?? issue)] })
    )
}
