import type { Asset } from "@template/domain/assets";
import type { Node, ScheduleCondition, Swap } from "@template/domain/calc";
import { RUJIRA } from "@template/domain/chains";
import type { FinPair } from "@template/domain/rujira";

export const USDC_DENOM = "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
export const RUJI_DENOM = "x/ruji";

export interface TemplateContext {
  assetsByDenom: Partial<Record<string, Asset>>;
  pairsByDenom: Partial<Record<string, Partial<Record<string, FinPair>>>>;
  /** The connected wallet's address, when available — used as the default payout destination. */
  owner?: string;
}

/** The answers collected by the template setup modal. */
export interface TemplateParams {
  swapAsset: Asset;
  receiveAsset: Asset;
  swapAmount: number;
  maximumSlippageBps: number;
  cadence: ScheduleCondition["cadence"];
  destinations: { address: string; shares: bigint }[];
}

export interface StrategyTemplate {
  key: string;
  /** Row label in the create-strategy picker. */
  label: string;
  /** One-line summary of what the template creates, shown in the picker. */
  description: string;
  /** Templates that end in a distribute step ask for destinations during setup. */
  hasDestinations: boolean;
  /** The draft's default label, derived from the chosen assets. */
  strategyLabel: (swapAsset: Asset, receiveAsset: Asset) => string;
  /** Builds the template's node graph from the setup answers. */
  makeNodes: (context: TemplateContext, params: TemplateParams) => Node[];
}

const isAppLayer = (denom: string) => denom.startsWith("x/");

/**
 * The DCA shape rujira-ui submits (dev branch, Submit/Recurring.tsx):
 *
 *   0 balance_available(swap denom)  ok-> 1  [auto: else-> 6]
 *   1 can_swap(swap -> receive)      ok-> 3  else-> 2 (wait and retry)
 *   2 schedule (retry cadence)
 *   3 schedule (execution cadence) ok-> 4
 *   4 swap                     [auto: next-> 5]
 *   5 balance_available(swap denom)  else-> 6 (drained: sweep out)   [auto only]
 *   6 distribute all funds to the destinations                       [auto only]
 *
 * With auto-distribute off, the swapped funds stay in the strategy for a
 * manual withdraw; nodes 5/6 don't exist.
 */
const makeDcaNodes =
  (autoDistribute: boolean) =>
  ({ pairsByDenom }: TemplateContext, params: TemplateParams): Node[] => {
    const { swapAsset, receiveAsset } = params;
    const finPair = pairsByDenom[swapAsset.denom]?.[receiveAsset.denom];

    const swap: Swap = {
      adjustment: "fixed",
      maximum_slippage_bps: params.maximumSlippageBps,
      swap_amount: { ...swapAsset, amount: params.swapAmount },
      minimum_receive_amount: { ...receiveAsset, amount: 0 },
      // App-layer denoms (x/...) only trade on FIN; everything else can
      // also route through the THORChain pools.
      routes: [
        ...(finPair ? [{ fin: { pair_address: finPair.address } }] : []),
        ...(isAppLayer(swapAsset.denom) || isAppLayer(receiveAsset.denom) ? [] : [{ thorchain: {} }]),
      ],
    };

    const schedule = {
      cadence: params.cadence,
      execution_rebate: [],
      executors: [],
      manager_address: RUJIRA.managerContract,
      scheduler_address: RUJIRA.schedulerContract,
    };

    const minimumBalance = { ...swapAsset, amount: 0.00001 };

    const distributeAllFunds = {
      distribute: {
        denoms: [swapAsset.denom, receiveAsset.denom],
        destinations: params.destinations.map(({ address, shares }) => ({
          recipient: { bank: { address } },
          shares,
        })),
      },
    };

    return [
      {
        condition: {
          condition: { balance_available: { address: null, amount: minimumBalance } },
          index: 0,
          on_success: 1,
          on_failure: autoDistribute ? 6 : null,
        },
      },
      { condition: { condition: { can_swap: swap }, index: 1, on_success: 3, on_failure: 2 } },
      { condition: { condition: { schedule }, index: 2, on_success: null, on_failure: null } },
      { condition: { condition: { schedule }, index: 3, on_success: 4, on_failure: null } },
      { action: { action: { swap }, index: 4, next: autoDistribute ? 5 : null } },
      ...(autoDistribute
        ? ([
            {
              condition: {
                condition: { balance_available: { address: null, amount: minimumBalance } },
                index: 5,
                on_success: null,
                on_failure: 6,
              },
            },
            { action: { action: distributeAllFunds, index: 6, next: null } },
          ] satisfies Node[])
        : []),
    ];
  };

const dcaLabel = (swapAsset: Asset, receiveAsset: Asset) =>
  `${swapAsset.displayName.toUpperCase()} → ${receiveAsset.displayName.toUpperCase()} DCA`;

export const STRATEGY_TEMPLATES: StrategyTemplate[] = [
  {
    key: "dca-auto",
    label: "DCA + auto distribute",
    description:
      "recurring swaps from one denom into another, sending everything to your destinations once the deposit is spent",
    hasDestinations: true,
    strategyLabel: (swapAsset, receiveAsset) => `${dcaLabel(swapAsset, receiveAsset)} (Auto)`,
    makeNodes: makeDcaNodes(true),
  },
  {
    key: "dca",
    label: "DCA",
    description: "recurring swaps from one denom into another; the proceeds stay in the strategy until you withdraw",
    hasDestinations: false,
    strategyLabel: dcaLabel,
    makeNodes: makeDcaNodes(false),
  },
];
