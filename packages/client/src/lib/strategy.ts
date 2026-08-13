import type { Amount } from "@template/domain/assets";
import type { Node } from "@template/domain/calc";
import { isActionNode } from "./graph";

/**
 * Suggested deposits for a strategy: the sum of every swap action's
 * swap_amount per denom. Limit orders bid in base units the form never
 * edits, so they are left for the user to top up manually.
 */
export const getDefaultDeposits = (nodes: readonly Node[]): Record<string, Amount> =>
  nodes.reduce<Record<string, Amount>>((acc, node) => {
    if (!isActionNode(node) || !("swap" in node.action.action)) return acc;

    const deposit = node.action.action.swap.swap_amount;
    const existing = acc[deposit.denom] as Amount | undefined;
    return {
      ...acc,
      [deposit.denom]: existing ? { ...deposit, amount: existing.amount + deposit.amount } : deposit,
    };
  }, {});

export const getDefaultWithdrawalDenoms = (nodes: readonly Node[], escrowed: string[]): string[] =>
  nodes.flatMap((node) => {
    if (!isActionNode(node) || !("swap" in node.action.action)) return [];
    const denom = node.action.action.swap.swap_amount.denom;
    return escrowed.includes(denom) ? [] : [denom];
  });
