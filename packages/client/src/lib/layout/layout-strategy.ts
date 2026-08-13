import { type Action } from "@template/domain/calc";
import { CHILD_OFFSET_X, makeEdge, NODE_HEIGHT, NODE_WIDTH } from "./constants";
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
      bounds: { width: NODE_WIDTH, height: NODE_HEIGHT },
    };
  }

  const layoutContext = {
    startX: context.startX + CHILD_OFFSET_X,
    startY: context.startY - 100,
    nodeSpacing: context.nodeSpacing,
  };

  const layout = layoutAction(
    {
      action: strategy.action,
      update: (action: Action) => {
        update({
          ...strategy,
          action,
        });
      },
      remove: () => {
        update({
          ...strategy,
          action: undefined,
        });
      },
    },
    layoutContext,
  );

  const strategyNodeY = layoutContext.startY + layout.bounds.height / 2 - NODE_HEIGHT / 2;

  return {
    ...layout,
    nodes: [
      ...layout.nodes,
      {
        id: `${strategy.id}`,
        type: "strategyNode",
        position: { x: context.startX, y: strategyNodeY },
        data: {
          strategy,
          update,
        },
      },
    ],
    edges: [...layout.edges, makeEdge(`${strategy.id}`, layout.nodes[0].id)],
  };
};
