import type { ActionNodeParams, LayoutContext, LayoutFunction, LayoutResult } from "./layout";
import { layoutLeafNode } from "./layout";

export const layoutSwapAction: LayoutFunction<ActionNodeParams> = (
  params: ActionNodeParams,
  context: LayoutContext,
): LayoutResult<ActionNodeParams> => {
  if (!("swap" in params.action)) {
    throw new Error("Data must contain 'swap' property for layoutSwapAction");
  }

  return layoutLeafNode("swapNode", params, context);
};
