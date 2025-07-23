import type { Action } from "@template/domain/src/calc";
import type { BuiltInEdge, Edge, Node } from "@xyflow/react";
import type { ActionNodeParams, LayoutContext, LayoutFunction, LayoutResult } from "./layout";

export const layoutManyAction: LayoutFunction<ActionNodeParams> = (
  params: ActionNodeParams,
  context: LayoutContext,
  layoutAction: LayoutFunction<ActionNodeParams>,
): LayoutResult<ActionNodeParams> => {
  const nodeId = context.generateId();

  if (!("many" in params.action)) {
    throw new Error("Data must contain 'many' property for layoutManyAction");
  }

  const actions = params.action.many;

  if (actions.length === 0) {
    const containerNode = {
      id: params.action.id,
      type: "manyNode",
      position: { x: context.startX, y: context.startY },
      data: params,
    };

    return {
      nodes: [containerNode],
      edges: [],
      bounds: { width: 200, height: 150 },
    };
  }

  const tempChildLayoutResults = [];
  let tempCurrentChildY = context.startY;
  const tempChildrenStartX = context.startX + 650;

  actions?.forEach((childAction) => {
    const tempChildContext = {
      ...context,
      startX: tempChildrenStartX,
      startY: tempCurrentChildY,
    };

    const tempChildLayout = layoutAction(
      {
        action: childAction,
        update: () => {},
        remove: () => {},
      },
      tempChildContext,
      layoutAction,
    );

    tempChildLayoutResults.push(tempChildLayout);
    tempCurrentChildY += tempChildLayout.bounds.height + context.nodeSpacing;
  });

  const totalChildrenHeight = tempCurrentChildY - context.startY - context.nodeSpacing;

  const childrenStartX = context.startX + (actions.length > 1 ? 500 : 350);

  let allChildNodes: Node[] = [];
  let allChildEdges: Edge[] = [];
  const childLayoutResults: LayoutResult<ActionNodeParams>[] = [];
  let currentChildY = context.startY;

  actions?.forEach((childAction, index) => {
    const childContext = {
      ...context,
      startX: childrenStartX,
      startY: currentChildY,
    };

    const childLayout = layoutAction(
      {
        action: childAction,
        update: (action: Action) => {
          if ("many" in action) {
            throw new Error("Many action should not contain nested 'many' actions");
          }
          const newActions = [...actions];
          newActions[index] = action;
          params.update({ id: params.action.id, many: newActions } as any);
        },
        remove: () => {
          const newActions = actions.filter((action) => action.id !== childAction.id);
          params.update({ id: params.action.id, many: newActions } as any);
        },
      },
      childContext,
      layoutAction,
    );

    childLayoutResults.push(childLayout);
    allChildNodes = [...allChildNodes, ...childLayout.nodes];
    allChildEdges = [...allChildEdges, ...childLayout.edges];

    currentChildY += childLayout.bounds.height + context.nodeSpacing;
  });

  const manyNodeY = context.startY + totalChildrenHeight / 2 - 75;

  const containerNode: Node = {
    id: nodeId,
    type: "manyNode",
    position: { x: context.startX, y: manyNodeY },
    data: params,
  };

  const parentEdges: BuiltInEdge[] = [];

  childLayoutResults.forEach((childLayout) => {
    if (childLayout.nodes.length > 0) {
      const childRootId = childLayout.nodes[0].id;
      parentEdges.push({
        id: `${nodeId}-to-${childRootId}`,
        source: nodeId,
        target: childRootId,
        style: { stroke: "#9CCCF0", strokeWidth: 2 },
        type: "smoothstep",
        pathOptions: {
          borderRadius: 16,
        },
      });
    }
  });

  const allNodes = [containerNode, ...allChildNodes];

  let minX = context.startX;
  let maxX = context.startX + 300;
  let minY = Math.min(manyNodeY, context.startY);
  let maxY = Math.max(manyNodeY + 120, currentChildY - context.nodeSpacing);

  allChildNodes.forEach((node) => {
    minX = Math.min(minX, node.position.x);
    maxX = Math.max(maxX, node.position.x + (node.width || 300));
    minY = Math.min(minY, node.position.y);
    maxY = Math.max(maxY, node.position.y + (node.height || 120));
  });

  return {
    nodes: allNodes as any[],
    edges: [...allChildEdges, ...parentEdges],
    bounds: {
      width: maxX - minX,
      height: maxY - minY,
    },
  };
};
