import type { Amount } from "@template/domain/assets";
import type { Action, Condition, Node } from "@template/domain/calc";
import { describe, expect, it } from "vitest";
import { getDefaultDeposits, getDefaultWithdrawalDenoms } from "../src/lib/strategy";

const amount = (denom: string, value: number): Amount => ({ denom, amount: value }) as Amount;

const swapNode = (swapAmount: Amount, index: number, next: number | null = null): Node => ({
  action: { action: { swap: { swap_amount: swapAmount } } as unknown as Action, index, next },
});
const scheduleNode = (index: number, onSuccess: number | null = null): Node => ({
  condition: { condition: { schedule: {} } as unknown as Condition, index, on_success: onSuccess, on_failure: null },
});

describe("getDefaultDeposits", () => {
  it("takes the swap amount for a bare swap", () => {
    const deposits = getDefaultDeposits([swapNode(amount("rune", 5), 0)]);
    expect(deposits).toEqual({ rune: amount("rune", 5) });
  });

  it("returns nothing for a schedule with no downstream swap", () => {
    expect(getDefaultDeposits([scheduleNode(0)])).toEqual({});
  });

  it("sums deposits of the same denom across the graph", () => {
    const deposits = getDefaultDeposits([
      scheduleNode(0, 1),
      swapNode(amount("rune", 5), 1, 2),
      swapNode(amount("rune", 2), 2, 3),
      swapNode(amount("btc-btc", 1), 3),
    ]);

    expect(deposits.rune.amount).toBe(7);
    expect(deposits["btc-btc"].amount).toBe(1);
  });
});

describe("getDefaultWithdrawalDenoms", () => {
  it("collects swap denoms not already escrowed", () => {
    const nodes = [swapNode(amount("rune", 5), 0, 1), swapNode(amount("btc-btc", 1), 1)];

    expect(getDefaultWithdrawalDenoms(nodes, ["rune"])).toEqual(["btc-btc"]);
    expect(getDefaultWithdrawalDenoms(nodes, [])).toEqual(["rune", "btc-btc"]);
  });
});
