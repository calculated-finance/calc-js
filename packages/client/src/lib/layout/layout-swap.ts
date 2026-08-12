import type { ActionNodeParams, LayoutContext, LayoutFunction, LayoutResult } from "./layout";

export const layoutSwapAction: LayoutFunction<ActionNodeParams> = (
  { action, ...params }: ActionNodeParams,
  context: LayoutContext,
): LayoutResult<ActionNodeParams> => {
  if (!("swap" in action)) {
    throw new Error("Data must contain 'swap' property for layoutSwapAction");
  }

  return {
    nodes: [
      {
        id: action.id,
        type: "swapNode",
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
