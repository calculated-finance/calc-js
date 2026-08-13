import type { Asset } from "@template/domain/assets";
import type { Node, Swap } from "@template/domain/calc";
import { RUJIRA } from "@template/domain/chains";
import type { FinPair } from "@template/domain/rujira";

const USDC_DENOM = "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const RUJI_DENOM = "x/ruji";

export interface TemplateContext {
  assetsByDenom: Partial<Record<string, Asset>>;
  pairsByDenom: Partial<Record<string, Partial<Record<string, FinPair>>>>;
  /** The connected wallet's address, when available — used as the payout destination. */
  owner?: string;
}

export interface StrategyTemplate {
  key: string;
  /** Row label in the templates list. */
  label: string;
  /** The draft's initial label. */
  strategyLabel: string;
  /** Builds the template's node graph; undefined when required assets are missing. */
  makeNodes: (context: TemplateContext) => Node[] | undefined;
}

/**
 * The DCA shape rujira-ui submits (dev branch, Submit/Recurring.tsx),
 * defaulted to USDC -> RUJI:
 *
 *   0 balance_available(USDC)  ok-> 1  [auto: else-> 6]
 *   1 can_swap(USDC -> RUJI)   ok-> 3  else-> 2 (wait and retry)
 *   2 schedule (retry cadence)
 *   3 schedule (execution cadence) ok-> 4
 *   4 swap                     [auto: next-> 5]
 *   5 balance_available(USDC)  else-> 6 (drained: sweep out)   [auto only]
 *   6 distribute all funds to the owner                        [auto only]
 *
 * With auto-distribute off, the swapped funds stay in the strategy for a
 * manual withdraw; nodes 5/6 don't exist.
 */
const makeDcaNodes =
  (autoDistribute: boolean) =>
  ({ assetsByDenom, pairsByDenom, owner }: TemplateContext): Node[] | undefined => {
    const usdc = assetsByDenom[USDC_DENOM];
    const ruji = assetsByDenom[RUJI_DENOM];
    if (!usdc || !ruji) return undefined;

    const finPair = pairsByDenom[USDC_DENOM]?.[RUJI_DENOM];

    const swap: Swap = {
      adjustment: "fixed",
      maximum_slippage_bps: 200,
      swap_amount: { ...usdc, amount: 100 },
      minimum_receive_amount: { ...ruji, amount: 0 },
      // x/ruji is app-layer only, so FIN is the only route for this pair.
      routes: finPair ? [{ fin: { pair_address: finPair.address } }] : [],
    };

    const schedule = {
      cadence: { time: { duration: { secs: 3600, nanos: 0 } } },
      execution_rebate: [],
      executors: [],
      manager_address: RUJIRA.managerContract,
      scheduler_address: RUJIRA.schedulerContract,
    };

    const minimumBalance = { ...usdc, amount: 0.00001 };

    const distributeAllFunds = {
      distribute: {
        denoms: [USDC_DENOM, RUJI_DENOM],
        destinations: owner ? [{ recipient: { bank: { address: owner } }, shares: 10000n }] : [],
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

export const STRATEGY_TEMPLATES: StrategyTemplate[] = [
  {
    key: "dca-auto",
    label: "DCA + auto distribute",
    strategyLabel: "USDC → RUJI DCA",
    makeNodes: makeDcaNodes(true),
  },
  {
    key: "dca",
    label: "DCA",
    strategyLabel: "USDC → RUJI DCA",
    makeNodes: makeDcaNodes(false),
  },
];
