import { type Action } from "@template/domain/src/calc";
import type { BuiltInEdge } from "@xyflow/react";
import {
  layoutAction,
  type LayoutContext,
  type LayoutResult,
  type NodeParams,
  type StrategyNodeParams,
} from "./layout";

export const layoutStrategy = (
  { strategy, update }: StrategyNodeParams,
  context: LayoutContext,
): LayoutResult<NodeParams> => {
  if (!strategy.action) {
    return {
      nodes: [
        {
          id: `${strategy.id}`,
          type: "strategyNode",
          position: { x: context.startX, y: context.startY },
          data: {
            strategy,
            update,
          },
        },
      ],
      edges: [],
      bounds: { width: 200, height: 150 },
    };
  }

  const layoutContext = {
    startX: 300,
    startY: -100,
    nodeSpacing: 50,
  };

  const layout = layoutAction(
    {
      action: strategy.action,
      update: (action: Action) =>
        update({
          ...strategy,
          action,
        }),
      remove: () =>
        update({
          ...strategy,
          action: undefined,
        }),
    },
    layoutContext,
  );

  const strategyNodeY = layoutContext.startY + layout.bounds.height / 2 - 75;

  return {
    ...layout,
    nodes: [
      ...layout.nodes,
      {
        id: `${strategy.id}`,
        type: "strategyNode",
        position: { x: 0, y: strategyNodeY },
        data: {
          strategy,
          update,
        },
      },
    ],
    edges: [
      ...layout.edges,
      {
        id: `${strategy.id}-to-${layout.nodes[0].id}`,
        source: `${strategy.id}`,
        target: layout.nodes[0].id,
        style: { stroke: "#9CCCF0", strokeWidth: 2 },
        type: "smoothstep",
        pathOptions: {
          borderRadius: 16,
        },
      } as BuiltInEdge,
    ],
  };
};
