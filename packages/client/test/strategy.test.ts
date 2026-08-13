import type { Amount } from "@template/domain/assets";
import type { Action } from "@template/domain/calc";
import { describe, expect, it } from "vitest";
import { getDefaultDeposits, getDefaultWithdrawalDenoms } from "../src/lib/strategy";

const amount = (denom: string, value: number): Amount => ({ denom, amount: value }) as Amount;

const swap = (id: string, swapAmount: Amount) => ({ id, swap: { swap_amount: swapAmount } }) as unknown as Action;
const schedule = (id: string, child?: Action) => ({ id, schedule: { action: child } }) as unknown as Action;
const many = (id: string, children: Action[]) => ({ id, many: children }) as unknown as Action;

describe("getDefaultDeposits", () => {
  it("takes the swap amount for a bare swap", () => {
    const deposits = getDefaultDeposits(swap("a", amount("rune", 5)));
    expect(deposits).toEqual({ rune: amount("rune", 5) });
  });

  it("looks through a schedule to its inner action", () => {
    const deposits = getDefaultDeposits(schedule("s", swap("a", amount("rune", 5))));
    expect(deposits).toEqual({ rune: amount("rune", 5) });
  });

  it("returns nothing for a schedule with no action", () => {
    expect(getDefaultDeposits(schedule("s"))).toEqual({});
  });

  it("sums deposits of the same denom across a group", () => {
    const deposits = getDefaultDeposits(
      many("g", [swap("a", amount("rune", 5)), swap("b", amount("rune", 2)), swap("c", amount("btc-btc", 1))]),
    );

    expect(deposits.rune.amount).toBe(7);
    expect(deposits["btc-btc"].amount).toBe(1);
  });
});

describe("getDefaultWithdrawalDenoms", () => {
  it("collects swap denoms not already escrowed", () => {
    const action = many("g", [swap("a", amount("rune", 5)), swap("b", amount("btc-btc", 1))]);

    expect(getDefaultWithdrawalDenoms(action, ["rune"])).toEqual(["btc-btc"]);
    expect(getDefaultWithdrawalDenoms(action, [])).toEqual(["rune", "btc-btc"]);
  });
});
