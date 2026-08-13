import { type Action, type Schedule } from "@template/domain/calc";
import { CHILD_OFFSET_X, makeEdge, NODE_HEIGHT, NODE_WIDTH } from "./constants";
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
      bounds: { width: NODE_WIDTH, height: NODE_HEIGHT },
    };
  }

  const childContext = {
    ...context,
    startX: context.startX + CHILD_OFFSET_X,
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
            action: action as Schedule["action"],
          },
        });
      },
      remove: () => {
        params.update({
          id: params.action.id,
          schedule: {
            ...schedule,
            action: undefined,
          },
        });
      },
    },
    childContext,
    layoutAction,
  );

  const scheduleNodeY = context.startY + layout.bounds.height / 2 - NODE_HEIGHT / 2;

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
    edges: [makeEdge(params.action.id, layout.nodes[0].id), ...layout.edges],
  };
};
