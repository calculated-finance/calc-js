import { type Action } from "@template/domain/src/calc";
import type { BuiltInEdge } from "@xyflow/react";
import { type ActionNodeParams, type LayoutContext, type LayoutFunction, type LayoutResult } from "./layout";

export const layoutScheduleAction: LayoutFunction<ActionNodeParams> = (
  params: ActionNodeParams,
  context: LayoutContext,
  layoutAction: LayoutFunction<ActionNodeParams>,
): LayoutResult<ActionNodeParams> => {
  if (!("schedule" in params.action)) {
    throw new Error("Data must contain 'schedule' property for layoutScheduleAction");
  }

  const schedule = params.action.schedule;

  if (!schedule.action) {
    return {
      nodes: [
        {
          id: params.action.id,
          type: "scheduleNode",
          position: { x: context.startX, y: context.startY },
          data: params,
        },
      ],
      edges: [],
      bounds: { width: 200, height: 150 },
    };
  }

  const childContext = {
    startX: context.startX + 300,
    startY: context.startY,
    nodeSpacing: 50,
    generateId: context.generateId,
  };

  const layout = layoutAction(
    {
      action: schedule.action,
      update: (action: Action) => {
        if ("schedule" in action) {
          throw new Error("Schedule action should not contain a nested 'schedule' or 'many' action");
        }
        params.update({
          id: params.action.id,
          schedule: {
            ...schedule,
            action: action as any,
          },
        });
      },
      remove: () =>
        params.update({
          id: params.action.id,
          schedule: {
            ...schedule,
            action: undefined,
          },
        }),
    },
    childContext,
    layoutAction,
  );

  const scheduleNodeY = context.startY + layout.bounds.height / 2 - 75;

  return {
    ...layout,
    nodes: [
      {
        id: params.action.id,
        type: "scheduleNode",
        position: { x: context.startX, y: scheduleNodeY },
        data: params,
      },
      ...layout.nodes,
    ],
    edges: [
      {
        id: `${params.action.id}-to-${layout.nodes[0].id}`,
        source: params.action.id,
        target: layout.nodes[0].id,
        style: { stroke: "#9CCCF0", strokeWidth: 2 },
        type: "smoothstep",
        pathOptions: {
          borderRadius: 16,
        },
      } as BuiltInEdge,
      ...layout.edges,
    ],
  };
};
