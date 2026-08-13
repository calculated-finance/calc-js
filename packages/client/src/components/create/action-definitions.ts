import type { Asset } from "@template/domain/assets";
import { RUJIRA } from "@template/domain/chains";
import type { NodeBody } from "../../lib/graph";

/** The step variants the picker can insert into the strategy graph. */
export type ActionKey = "swap" | "distribute" | "schedule";

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
  /** React Flow node type string; must match graphNodeType's output. */
  nodeType: string;
  /** The node payload inserted when the user picks this type. */
  makeDefault: (context: MakeDefaultContext) => NodeBody;
}

/**
 * Everything the builder knows about each insertable step except its node
 * component (kept apart in actions.tsx to avoid an import cycle with the node
 * components, which render the picker). In the v2 contract model swap and
 * distribute are action nodes while schedule is a condition node gating
 * whatever follows it.
 */
export const ACTION_DEFINITIONS: Record<ActionKey, ActionDefinition> = {
  swap: {
    key: "swap",
    label: "Swap",
    colorClassName: "text-purple-300",
    nodeType: "swapNode",
    makeDefault: ({ assets }) => ({
      action: {
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
      },
    }),
  },
  distribute: {
    key: "distribute",
    label: "Distribute",
    colorClassName: "text-blue-300",
    nodeType: "distributeNode",
    makeDefault: ({ denoms }) => ({
      action: {
        distribute: {
          denoms: denoms ?? [],
          destinations: [],
        },
      },
    }),
  },
  schedule: {
    key: "schedule",
    label: "Schedule",
    colorClassName: "text-yellow-300",
    nodeType: "scheduleNode",
    makeDefault: () => ({
      condition: {
        schedule: {
          cadence: { cron: { expr: "0 23 12 * * SUN#2" } },
          execution_rebate: [],
          executors: [],
          manager_address: RUJIRA.managerContract,
          scheduler_address: RUJIRA.schedulerContract,
        },
      },
    }),
  },
};
