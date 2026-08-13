import type { Action, Strategy } from "@template/domain/calc";
import type { Wallet } from "@template/domain/clients";
import type { Edge, Node } from "@xyflow/react";
import { layoutDistributeAction } from "./layout-distribute";
import { layoutManyAction } from "./layout-many";
import { layoutScheduleAction } from "./layout-schedule";
import { layoutSwapAction } from "./layout-swap";

export interface LayoutContext {
  startX: number;
  startY: number;
  nodeSpacing: number;
}

export interface StrategyNodeParams {
  strategy: Strategy;
  update: (strategy: Strategy) => void;
}

export interface ActionNodeParams<T extends Action = Action> {
  action: T;
  update: (action: T) => void;
  remove: () => void;
}

export interface WalletNodeParams {
  wallet: Wallet;
}

export type NodeParams = StrategyNodeParams | ActionNodeParams | WalletNodeParams;

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LayoutFunction<T extends Record<string, any>> = (
  nodeData: T,
  context: LayoutContext,
  layout: LayoutFunction<T>,
) => LayoutResult<T>;

const layoutFunctions: Partial<Record<string, LayoutFunction<ActionNodeParams>>> = {
  swap: layoutSwapAction,
  many: layoutManyAction,
  schedule: layoutScheduleAction,
  distribute: layoutDistributeAction,
};

export const layoutAction = (
  { action, ...params }: ActionNodeParams,
  context: LayoutContext,
): LayoutResult<ActionNodeParams> => {
  const actionType = Object.keys(action)[1];
  const layoutFunction = layoutFunctions[actionType];

  if (!layoutFunction) {
    throw new Error(`No layout function found for action type: ${actionType}`);
  }

  return layoutFunction({ action, ...params }, context, layoutAction);
};
