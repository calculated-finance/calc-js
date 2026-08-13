import type { Asset } from "@template/domain/assets";
import type { DistributeAction, ManyAction, ScheduleAction, SwapAction } from "@template/domain/calc";
import { RUJIRA } from "@template/domain/chains";
import type { ActionKey } from "../../lib/layout/layout";

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

export interface ActionDefinition {
  key: ActionKey;
  /** Button label in the action picker. */
  label: string;
  /** Button colour in the action picker. */
  colorClassName: string;
  /** React Flow node type string; must match the layout function's output. */
  nodeType: string;
  /** The action inserted when the user picks this type. */
  makeDefault: (context: MakeDefaultContext) => ActionBody;
}

/**
 * Everything the builder knows about each action type except its node
 * component (kept apart in actions.tsx to avoid an import cycle with the node
 * components, which render the picker). Adding a variant to ActionKey forces
 * an entry here, in actions.tsx, and in lib/layout's layoutFunctions — the
 * compiler walks you through the rest.
 */
export const ACTION_DEFINITIONS: Record<ActionKey, ActionDefinition> = {
  swap: {
    key: "swap",
    label: "Swap",
    colorClassName: "text-purple-300",
    nodeType: "swapNode",
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
    makeDefault: () => ({ many: [] }),
  },
};
