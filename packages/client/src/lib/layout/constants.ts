import type { BuiltInEdge } from "@xyflow/react";

/** Node box dimensions assumed by every layout function and by BaseNode. */
export const NODE_WIDTH = 200;
export const NODE_HEIGHT = 150;

/** Vertical gap between sibling nodes. */
export const NODE_SPACING = 50;

/** Horizontal offset from a parent node to its child column. */
export const CHILD_OFFSET_X = 300;

/** Wider offset used when a parent fans out to multiple children. */
export const MULTI_CHILD_OFFSET_X = 400;

export const makeEdge = (source: string, target: string): BuiltInEdge => ({
  id: `${source}-to-${target}`,
  source,
  target,
  style: { stroke: "#9CCCF0", strokeWidth: 2 },
  type: "smoothstep",
  pathOptions: {
    borderRadius: 16,
  },
});
