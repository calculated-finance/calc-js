import type { Action, Strategy } from "@template/domain/src/calc";
import type { Wallet } from "@template/domain/src/wallets";
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

export type StrategyNodeParams = {
  strategy: Strategy;
  update: (strategy: Strategy) => void;
};

export type ActionNodeParams<T extends Action = Action> = {
  action: T;
  update: (action: T) => void;
  remove: () => void;
};

export type WalletNodeParams = {
  wallet: Wallet;
};

export type NodeParams = StrategyNodeParams | ActionNodeParams | WalletNodeParams;

export type CustomNodeData<T> = {
  data: T;
};

export interface LayoutResult<T extends Record<string, any>> {
  nodes: Node<T>[];
  edges: Edge[];
  bounds: {
    width: number;
    height: number;
  };
}

export type LayoutFunction<T extends Record<string, any>> = (
  nodeData: T,
  context: LayoutContext,
  layout: LayoutFunction<T>,
) => LayoutResult<T>;

const layoutFunctions: Record<string, LayoutFunction<ActionNodeParams>> = {
  swap: layoutSwapAction,
  many: layoutManyAction,
  schedule: layoutScheduleAction,
  distribute: layoutDistributeAction,
};

export const layoutAction = (
  { action, ...params }: ActionNodeParams,
  context: LayoutContext,
): LayoutResult<ActionNodeParams> => {
  if (!action || typeof action !== "object") {
    throw new Error("Invalid data provided for layoutAction");
  }

  const actionType = Object.keys(action)[1];
  const layoutFunction = layoutFunctions[actionType];

  if (!layoutFunction) {
    throw new Error(`No layout function found for action type: ${actionType}`);
  }

  return layoutFunction({ action, ...params }, context, layoutAction);
};
