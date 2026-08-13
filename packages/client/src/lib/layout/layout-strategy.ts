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
import { CHILD_OFFSET_X, makeEdge, MULTI_CHILD_OFFSET_X, NODE_HEIGHT, NODE_WIDTH } from "./constants";
import type { LayoutContext, LayoutResult, NodeParams, StrategyNodeParams } from "./layout";
import { graphNodeType } from "./layout";

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
    const callbacks = {
      id: rfId(index),
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

  /** Places a node and its unplaced descendants; returns the subtree height. */
  const place = (index: number, x: number, y: number): number => {
    const node = byIndex.get(index);
    if (!node) return 0;

    placed.add(index);

    const links = outgoingEdges(node);
    const childX = x + (links.length > 1 ? MULTI_CHILD_OFFSET_X : CHILD_OFFSET_X);
    let childY = y;
    let laidChildren = 0;

    for (const link of links) {
      edges.push(makeEdge(rfId(index), rfId(link.target), link.kind));
      if (placed.has(link.target) || !byIndex.has(link.target)) continue;
      const height = place(link.target, childX, childY);
      childY += height + context.nodeSpacing;
      laidChildren += 1;
    }

    const childrenHeight = laidChildren > 0 ? childY - y - context.nodeSpacing : 0;
    const ownY = laidChildren > 0 ? y + childrenHeight / 2 - NODE_HEIGHT / 2 : y;

    nodes.push({
      id: rfId(index),
      type: graphNodeType(node),
      position: { x, y: ownY },
      data: paramsFor(node),
    });

    return Math.max(NODE_HEIGHT, childrenHeight);
  };

  const graphHeight = graph.length > 0 ? place(nodeIndex(graph[0]), context.startX + CHILD_OFFSET_X, context.startY - 100) : 0;

  const strategyNodeY =
    graph.length > 0 ? context.startY - 100 + graphHeight / 2 - NODE_HEIGHT / 2 : context.startY;

  nodes.push({
    id: `${strategy.id}`,
    type: "strategyNode",
    position: { x: context.startX, y: strategyNodeY },
    data: { strategy, update },
  });

  if (graph.length > 0) {
    edges.push(makeEdge(`${strategy.id}`, rfId(nodeIndex(graph[0])), "next"));
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
