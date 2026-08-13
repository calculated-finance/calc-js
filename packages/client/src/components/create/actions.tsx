import type { NodeTypes } from "@xyflow/react";
import { ConditionNode } from "./condition-node";
import { DistributeNode } from "./distribute-node";
import { LimitOrderNode } from "./limit-order-node";
import { ScheduleNode } from "./schedule-node";
import { StrategyNode } from "./strategy-node";
import { SwapNode } from "./swap-node";

/**
 * React Flow node type registry: one component per graph node kind (the
 * strings graphNodeType produces) plus the strategy root. Kept separate from
 * ACTION_DEFINITIONS so the node components (which render the action picker)
 * never import their own module graph back.
 */
export const actionNodeTypes: NodeTypes = {
  strategyNode: StrategyNode as NodeTypes[string],
  swapNode: SwapNode as NodeTypes[string],
  limitOrderNode: LimitOrderNode as NodeTypes[string],
  distributeNode: DistributeNode as NodeTypes[string],
  scheduleNode: ScheduleNode as NodeTypes[string],
  conditionNode: ConditionNode as NodeTypes[string],
};
