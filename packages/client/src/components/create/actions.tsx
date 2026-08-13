import type { Asset } from "@template/domain/assets";
import type { DistributeAction, ManyAction, ScheduleAction, SwapAction } from "@template/domain/calc";
import { RUJIRA } from "@template/domain/chains";
import type { NodeTypes } from "@xyflow/react";
import { type ActionKey } from "../../lib/layout/layout";
import { DistributeNode } from "./distribute-node";
import { ManyNode } from "./many-node";
import { ScheduleNode } from "./schedule-node";
import { StrategyNode } from "./strategy-node";
import { SwapNode } from "./swap-node";

/** An action variant without its builder-assigned node id. */
export type ActionBody =
  | Omit<SwapAction, "id">
  | Omit<ManyAction, "id">
  | Omit<ScheduleAction, "id">
  | Omit<DistributeAction, "id">;

export interface MakeDefaultContext {
  assets: Asset[];
  denoms?: readonly string[];
}

export interface ActionTypeDefinition {
  key: ActionKey;
  /** Button label in the action picker. */
  label: string;
  /** Button colour in the action picker. */
  colorClassName: string;
  /** React Flow node type string; must match the layout function's output. */
  nodeType: string;
  Node: NodeTypes[string];
  /** The action inserted when the user picks this type. */
  makeDefault: (context: MakeDefaultContext) => ActionBody;
}

/**
 * Everything the builder needs to know about each action type, keyed by the
 * schema discriminant. Adding a variant to ActionKey forces an entry here and
 * in lib/layout's layoutFunctions — the compiler walks you through the rest.
 */
export const ACTION_TYPES: Record<ActionKey, ActionTypeDefinition> = {
  swap: {
    key: "swap",
    label: "Swap",
    colorClassName: "text-purple-300",
    nodeType: "swapNode",
    Node: SwapNode as NodeTypes[string],
    makeDefault: ({ assets }) => ({
      swap: {
        adjustment: "fixed",
        maximum_slippage_bps: 300,
        routes: [
          {
            thorchain: {},
          },
        ],
        minimum_receive_amount: {
          amount: 100,
          ...assets[0],
        },
        swap_amount: {
          amount: 0.001,
          ...assets[1],
        },
      },
    }),
  },
  distribute: {
    key: "distribute",
    label: "Distribute",
    colorClassName: "text-blue-300",
    nodeType: "distributeNode",
    Node: DistributeNode as NodeTypes[string],
    makeDefault: ({ denoms }) => ({
      distribute: {
        denoms: denoms ?? [],
        destinations: [],
      },
    }),
  },
  schedule: {
    key: "schedule",
    label: "Schedule",
    colorClassName: "text-yellow-300",
    nodeType: "scheduleNode",
    Node: ScheduleNode as NodeTypes[string],
    makeDefault: () => ({
      schedule: {
        cadence: { cron: { expr: "0 23 12 * * SUN#2" } },
        execution_rebate: [],
        scheduler: RUJIRA.schedulerContract,
        contract_address: RUJIRA.managerContract,
        executors: [],
      },
    }),
  },
  many: {
    key: "many",
    label: "Group",
    colorClassName: "text-red-300",
    nodeType: "manyNode",
    Node: ManyNode as NodeTypes[string],
    makeDefault: () => ({ many: [] }),
  },
};

/** React Flow node type registry for every action node plus the strategy root. */
export const actionNodeTypes: NodeTypes = {
  strategyNode: StrategyNode as NodeTypes[string],
  ...Object.fromEntries(Object.values(ACTION_TYPES).map((definition) => [definition.nodeType, definition.Node])),
};
