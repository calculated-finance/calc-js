import type { ActionNodeParams, LayoutContext, LayoutFunction, LayoutResult } from "./layout";

export const layoutDistributeAction: LayoutFunction<ActionNodeParams> = (
  { action, ...params }: ActionNodeParams,
  context: LayoutContext,
): LayoutResult<ActionNodeParams> => {
  if (!("distribute" in action)) {
    throw new Error("Data must contain 'distribute' property for layoutDistributeAction");
  }

  return {
    nodes: [
      {
        id: action.id,
        type: "distributeNode",
        position: { x: context.startX, y: context.startY },
        data: {
          action,
          ...params,
        },
      },
    ],
    edges: [],
    bounds: {
      width: 200,
      height: 150,
    },
  };
};
