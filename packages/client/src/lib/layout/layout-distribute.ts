import type { ActionNodeParams, LayoutContext, LayoutFunction, LayoutResult } from "./layout";
import { layoutLeafNode } from "./layout";

export const layoutDistributeAction: LayoutFunction<ActionNodeParams> = (
  params: ActionNodeParams,
  context: LayoutContext,
): LayoutResult<ActionNodeParams> => {
  if (!("distribute" in params.action)) {
    throw new Error("Data must contain 'distribute' property for layoutDistributeAction");
  }

  return layoutLeafNode("distributeNode", params, context);
};
