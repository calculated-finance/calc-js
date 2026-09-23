import type {
  Condition,
  Distribution,
  FinLimitOrder,
  Node as CalcNode,
  ScheduleCondition,
  Strategy,
  Swap,
} from "@template/domain/calc";
import type { Wallet } from "@template/domain/clients";
import type { Edge, Node } from "@xyflow/react";
import type { NodeBody } from "../graph";
import { isActionNode } from "../graph";

export interface LayoutContext {
  startX: number;
  startY: number;
  nodeSpacing: number;
}

export interface StrategyNodeParams {
  strategy: Strategy;
  update: (strategy: Strategy) => void;
}

/** Callbacks every graph-node component receives alongside its payload. */
export interface GraphNodeCallbacks {
  id: string;
  remove: () => void;
  /**
   * True when a next/on_success pointer leaves this node. Drives the
   * right-side handle: without it React Flow silently drops the edge.
   */
  hasOutgoing: boolean;
  /** True when an on_failure pointer leaves this node; drives the bottom handle. */
  hasFailure: boolean;
  /**
   * Present when the node's primary slot is empty: appends and links a new
   * step, returning the new node's React Flow id (for opening its modal).
   */
  addNext?: (body: NodeBody) => string;
}

export interface SwapNodeParams extends GraphNodeCallbacks {
  swap: Swap;
  update: (swap: Swap) => void;
}

export interface LimitOrderNodeParams extends GraphNodeCallbacks {
  limitOrder: FinLimitOrder;
  update: (limitOrder: FinLimitOrder) => void;
}

export interface DistributeNodeParams extends GraphNodeCallbacks {
  distribute: Distribution;
  update: (distribute: Distribution) => void;
}

export interface ScheduleNodeParams extends GraphNodeCallbacks {
  schedule: ScheduleCondition;
  update: (schedule: ScheduleCondition) => void;
}

export interface ConditionNodeParams extends GraphNodeCallbacks {
  condition: Condition;
  update: (condition: Condition) => void;
}

export interface WalletNodeParams {
  wallet: Wallet;
}

export type NodeParams =
  | StrategyNodeParams
  | SwapNodeParams
  | LimitOrderNodeParams
  | DistributeNodeParams
  | ScheduleNodeParams
  | ConditionNodeParams
  | WalletNodeParams;

export interface CustomNodeData<T> {
  data: T;
}

// Node's data slot wants Record<string, unknown>, but our param aliases can't
// carry an index signature without breaking exactness elsewhere — `any` is the
// only constraint TS accepts for both.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface LayoutResult<T extends Record<string, any>> {
  nodes: Node<T>[];
  edges: Edge[];
  bounds: {
    width: number;
    height: number;
  };
}

/** The React Flow node type rendered for a graph node. */
export const graphNodeType = (node: CalcNode): string => {
  if (isActionNode(node)) {
    const action = node.action.action;
    return "swap" in action ? "swapNode" : "limit_order" in action ? "limitOrderNode" : "distributeNode";
  }
  const condition = node.condition.condition;
  if ("schedule" in condition) return "scheduleNode";
  if ("balance_available" in condition) return "balanceNode";
  if ("can_swap" in condition) return "liquidityNode";
  return "conditionNode";
};
