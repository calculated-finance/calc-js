import type { Action } from "@template/domain/calc";
import type { Edge } from "@xyflow/react";
import { CHILD_OFFSET_X, makeEdge, MULTI_CHILD_OFFSET_X, NODE_HEIGHT, NODE_WIDTH } from "./constants";
import type { ActionNodeParams, LayoutContext, LayoutFunction, LayoutResult } from "./layout";

export const layoutManyAction: LayoutFunction<ActionNodeParams> = (
  params: ActionNodeParams,
  context: LayoutContext,
  layoutAction: LayoutFunction<ActionNodeParams>,
): LayoutResult<ActionNodeParams> => {
  if (!("many" in params.action)) {
    throw new Error("Data must contain 'many' property for layoutManyAction");
  }

  const actions = params.action.many;

  if (actions.length === 0) {
    return {
      nodes: [
        {
          id: params.action.id,
          type: "manyNode",
          position: { x: context.startX, y: context.startY },
          data: params,
        },
      ],
      edges: [],
      bounds: { width: NODE_WIDTH, height: NODE_HEIGHT },
    };
  }

  const childrenStartX = context.startX + (actions.length > 1 ? MULTI_CHILD_OFFSET_X : CHILD_OFFSET_X);

  let allChildNodes: LayoutResult<ActionNodeParams>["nodes"] = [];
  let allChildEdges: Edge[] = [];
  const parentEdges: Edge[] = [];
  let currentChildY = context.startY;

  actions.forEach((childAction, index) => {
    const childLayout = layoutAction(
      {
        action: childAction,
        update: (action: Action) => {
          if ("many" in action) {
            throw new Error("Many action should not contain nested 'many' actions");
          }
          const newActions = [...actions];
          newActions[index] = action;
          params.update({ id: params.action.id, many: newActions });
        },
        remove: () => {
          const newActions = actions.filter((action) => action.id !== childAction.id);
          params.update({ id: params.action.id, many: newActions });
        },
      },
      { ...context, startX: childrenStartX, startY: currentChildY },
      layoutAction,
    );

    if (childLayout.nodes.length > 0) {
      parentEdges.push(makeEdge(params.action.id, childLayout.nodes[0].id));
    }

    allChildNodes = [...allChildNodes, ...childLayout.nodes];
    allChildEdges = [...allChildEdges, ...childLayout.edges];
    currentChildY += childLayout.bounds.height + context.nodeSpacing;
  });

  const totalChildrenHeight = currentChildY - context.startY - context.nodeSpacing;
  const manyNodeY = context.startY + totalChildrenHeight / 2 - NODE_HEIGHT / 2;

  const containerNode: LayoutResult<ActionNodeParams>["nodes"][number] = {
    id: params.action.id,
    type: "manyNode",
    position: { x: context.startX, y: manyNodeY },
    data: params,
  };

  let minX = context.startX;
  let maxX = context.startX + CHILD_OFFSET_X;
  let minY = Math.min(manyNodeY, context.startY);
  let maxY = Math.max(manyNodeY + NODE_HEIGHT, currentChildY - context.nodeSpacing);

  allChildNodes.forEach((node) => {
    minX = Math.min(minX, node.position.x);
    maxX = Math.max(maxX, node.position.x + (node.width ?? CHILD_OFFSET_X));
    minY = Math.min(minY, node.position.y);
    maxY = Math.max(maxY, node.position.y + (node.height ?? NODE_HEIGHT));
  });

  return {
    nodes: [containerNode, ...allChildNodes],
    edges: [...allChildEdges, ...parentEdges],
    bounds: {
      width: maxX - minX,
      height: maxY - minY,
    },
  };
};
