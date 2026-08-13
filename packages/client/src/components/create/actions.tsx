import type { NodeTypes } from "@xyflow/react";
import type { ActionKey } from "../../lib/layout/layout";
import { ACTION_DEFINITIONS } from "./action-definitions";
import { DistributeNode } from "./distribute-node";
import { ManyNode } from "./many-node";
import { ScheduleNode } from "./schedule-node";
import { StrategyNode } from "./strategy-node";
import { SwapNode } from "./swap-node";

/**
 * Node components per action type, kept separate from ACTION_DEFINITIONS so
 * the node components (which render the action picker) never import their own
 * module graph back.
 */
const ACTION_NODES: Record<ActionKey, NodeTypes[string]> = {
  swap: SwapNode as NodeTypes[string],
  many: ManyNode as NodeTypes[string],
  schedule: ScheduleNode as NodeTypes[string],
  distribute: DistributeNode as NodeTypes[string],
};

/** React Flow node type registry for every action node plus the strategy root. */
export const actionNodeTypes: NodeTypes = {
  strategyNode: StrategyNode as NodeTypes[string],
  ...Object.fromEntries(
    Object.values(ACTION_DEFINITIONS).map((definition) => [definition.nodeType, ACTION_NODES[definition.key]]),
  ),
};
