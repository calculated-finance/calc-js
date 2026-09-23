import { type BuiltInEdge, MarkerType } from "@xyflow/react";

/** Node box dimensions assumed by every layout function and by BaseNode. */
export const NODE_WIDTH = 200;
export const NODE_HEIGHT = 150;

/** Vertical gap between sibling nodes. */
export const NODE_SPACING = 50;

/** Horizontal offset from a parent node to its child column. */
export const CHILD_OFFSET_X = 300;

export type EdgeKind = "next" | "success" | "failure";

const EDGE_COLORS: Record<EdgeKind, string> = {
  next: "#9CCCF0",
  success: "#6EE7A0",
  failure: "#F87171",
};

export const makeEdge = (source: string, target: string, kind: EdgeKind = "next", label?: string): BuiltInEdge => ({
  id: `${source}-to-${target}`,
  source,
  target,
  // Failure edges leave through the node's bottom handle so they drop into
  // the failure lane immediately instead of overlaying the success edges.
  ...(kind === "failure" ? { sourceHandle: "failure" } : {}),
  style: { stroke: EDGE_COLORS[kind], strokeWidth: 2 },
  markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: EDGE_COLORS[kind] },
  ...(label
    ? {
        label,
        labelStyle: { fill: "#a1a1aa", fontFamily: "monospace", fontSize: 12 },
        labelBgStyle: { fill: "#0b0b0d" },
        labelBgPadding: [4, 2] as [number, number],
        labelBgBorderRadius: 4,
      }
    : {}),
  type: "smoothstep",
  pathOptions: {
    borderRadius: 16,
  },
});
