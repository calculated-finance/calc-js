import type {
  Condition,
  Distribution,
  FinLimitOrder,
  Node as CalcNode,
  ScheduleCondition,
  Swap,
} from "@template/domain/calc";
import type { Edge } from "@xyflow/react";
import type { NodeBody } from "../graph";
import {
  appendAfter,
  isActionNode,
  nodeIndex,
  outgoingEdges,
  primaryNext,
  removeNode,
  replaceNodeBody,
} from "../graph";
import { CHILD_OFFSET_X, makeEdge, NODE_HEIGHT, NODE_WIDTH } from "./constants";
import type { LayoutContext, LayoutResult, NodeParams, StrategyNodeParams } from "./layout";
import { graphNodeType } from "./layout";

/**
 * The reading label for an edge: failures read "else", anything leading
 * into a condition reads "if", and the ordinary path reads "then".
 */
const edgeLabel = (kind: "next" | "success" | "failure", target: CalcNode | undefined): string => {
  if (kind === "failure") return "ELSE";
  if (target && !isActionNode(target)) return "IF";
  return "THEN";
};

/**
 * Lays out the strategy's node graph left to right from the entry node
 * (index 0). Conditions stack their success branch above their failure
 * branch in the next column; links to already-placed nodes (loops) become
 * edges without re-laying the target.
 */
export const layoutStrategy = (
  { strategy, update }: StrategyNodeParams,
  context: LayoutContext,
): LayoutResult<NodeParams> => {
  const graph = strategy.nodes;
  const byIndex = new Map(graph.map((node) => [nodeIndex(node), node]));
  const rfId = (index: number) => `${strategy.id}:${index}`;

  const nodes: LayoutResult<NodeParams>["nodes"] = [];
  const edges: Edge[] = [];
  const placed = new Set<number>();

  const paramsFor = (node: CalcNode): NodeParams => {
    const index = nodeIndex(node);
    const commitNodes = (updated: CalcNode[]) => {
      update({ ...strategy, nodes: updated });
    };
    const links = outgoingEdges(node);
    const callbacks = {
      id: rfId(index),
      hasOutgoing: links.some((link) => link.kind !== "failure"),
      hasFailure: links.some((link) => link.kind === "failure"),
      remove: () => {
        commitNodes(removeNode(graph, index));
      },
      ...(primaryNext(node) === undefined
        ? {
            addNext: (body: NodeBody) => {
              commitNodes(appendAfter(graph, index, body));
              return rfId(graph.length);
            },
          }
        : {}),
    };

    if (isActionNode(node)) {
      const action = node.action.action;
      if ("swap" in action) {
        return {
          ...callbacks,
          swap: action.swap,
          update: (swap: Swap) => {
            commitNodes(replaceNodeBody(graph, index, { action: { swap } }));
          },
        };
      }
      if ("limit_order" in action) {
        return {
          ...callbacks,
          limitOrder: action.limit_order,
          update: (limitOrder: FinLimitOrder) => {
            commitNodes(replaceNodeBody(graph, index, { action: { limit_order: limitOrder } }));
          },
        };
      }
      return {
        ...callbacks,
        distribute: action.distribute,
        update: (distribute: Distribution) => {
          commitNodes(replaceNodeBody(graph, index, { action: { distribute } }));
        },
      };
    }

    const condition = node.condition.condition;
    if ("schedule" in condition) {
      return {
        ...callbacks,
        schedule: condition.schedule,
        update: (schedule: ScheduleCondition) => {
          commitNodes(replaceNodeBody(graph, index, { condition: { schedule } }));
        },
      };
    }
    return {
      ...callbacks,
      condition,
      update: (updated: Condition) => {
        commitNodes(replaceNodeBody(graph, index, { condition: updated }));
      },
    };
  };

  /**
   * Places a node and its unplaced descendants. Returns the subtree height
   * and the node's own row (anchorY) so parents can stay level with their
   * success path instead of drifting toward failure lanes.
   */
  const place = (index: number, x: number, y: number): { height: number; anchorY: number } => {
    const node = byIndex.get(index);
    if (!node) return { height: 0, anchorY: y };

    placed.add(index);

    const links = outgoingEdges(node);
    const childX = x + CHILD_OFFSET_X;
    let childY = y;
    let laidChildren = 0;
    let successAnchor: number | undefined;

    for (const link of links) {
      edges.push(makeEdge(rfId(index), rfId(link.target), link.kind, edgeLabel(link.kind, byIndex.get(link.target))));
      if (placed.has(link.target) || !byIndex.has(link.target)) continue;
      // Failure branches always drop a lane, even as an only child, so the
      // main success/next row stays visually distinct from failure handling.
      if (link.kind === "failure") {
        childY = Math.max(childY, y + NODE_HEIGHT + context.nodeSpacing);
      }
      const result = place(link.target, childX, childY);
      childY += result.height + context.nodeSpacing;
      laidChildren += 1;
      // Stay level with the success/next child's own row; failure children
      // hang below without dragging the main row down.
      if (link.kind !== "failure") {
        successAnchor = result.anchorY;
      }
    }

    const childrenHeight = laidChildren > 0 ? childY - y - context.nodeSpacing : 0;
    const ownY = successAnchor ?? y;

    nodes.push({
      id: rfId(index),
      type: graphNodeType(node),
      position: { x, y: ownY },
      data: paramsFor(node),
    });

    return { height: Math.max(NODE_HEIGHT, childrenHeight), anchorY: ownY };
  };

  const entry =
    graph.length > 0 ? place(nodeIndex(graph[0]), context.startX + CHILD_OFFSET_X, context.startY - 100) : undefined;

  const strategyNodeY = entry ? entry.anchorY : context.startY;

  nodes.push({
    id: `${strategy.id}`,
    type: "strategyNode",
    position: { x: context.startX, y: strategyNodeY },
    data: { strategy, update },
  });

  if (graph.length > 0) {
    edges.push(makeEdge(`${strategy.id}`, rfId(nodeIndex(graph[0])), "next", edgeLabel("next", graph[0])));
  }

  const minX = Math.min(...nodes.map((node) => node.position.x));
  const maxX = Math.max(...nodes.map((node) => node.position.x + NODE_WIDTH));
  const minY = Math.min(...nodes.map((node) => node.position.y));
  const maxY = Math.max(...nodes.map((node) => node.position.y + NODE_HEIGHT));

  return {
    nodes,
    edges,
    bounds: { width: maxX - minX, height: maxY - minY },
  };
};
