import type { Action, Strategy } from "@template/domain/calc";
import type { Wallet } from "@template/domain/clients";
import type { Edge, Node } from "@xyflow/react";
import { NODE_HEIGHT, NODE_WIDTH } from "./constants";
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

/** The discriminant key identifying each action variant. */
export type ActionKey = "swap" | "many" | "schedule" | "distribute";

export const actionKeyOf = (action: Action): ActionKey =>
  "swap" in action ? "swap" : "many" in action ? "many" : "schedule" in action ? "schedule" : "distribute";

const layoutFunctions: Record<ActionKey, LayoutFunction<ActionNodeParams>> = {
  swap: layoutSwapAction,
  many: layoutManyAction,
  schedule: layoutScheduleAction,
  distribute: layoutDistributeAction,
};

/**
 * Lays out a single node with no children — the shape shared by every leaf
 * action type.
 */
export const layoutLeafNode = (
  nodeType: string,
  params: ActionNodeParams,
  context: LayoutContext,
): LayoutResult<ActionNodeParams> => ({
  nodes: [
    {
      id: params.action.id,
      type: nodeType,
      position: { x: context.startX, y: context.startY },
      data: params,
    },
  ],
  edges: [],
  bounds: { width: NODE_WIDTH, height: NODE_HEIGHT },
});

export const layoutAction = (
  params: ActionNodeParams,
  context: LayoutContext,
): LayoutResult<ActionNodeParams> => layoutFunctions[actionKeyOf(params.action)](params, context, layoutAction);
