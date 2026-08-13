import { Strategy } from "@template/domain/calc";
import { Schema } from "effect";
import { describe, expect, it } from "vitest";
import { useStrategyDraftsStore } from "../src/hooks/use-draft-strategies";

const encodedStrategy: typeof Strategy.Encoded = {
  id: "draft-1",
  chainId: "thorchain",
  label: "Round Trip",
  owner: "thor1owner",
  status: "draft",
  nodes: [
    {
      condition: {
        condition: {
          schedule: {
            cadence: { cron: { expr: "0 0 * * * *" } },
            execution_rebate: [],
            executors: [],
            manager_address: "thor1manager",
            scheduler_address: "thor1scheduler",
          },
        },
        index: 0,
        on_success: 1,
        on_failure: null,
      },
    },
    {
      action: {
        action: {
          swap: {
            adjustment: "fixed",
            maximum_slippage_bps: 300,
            routes: [{ thorchain: {} }],
            minimum_receive_amount: { amount: "10000000000", denom: "rune" },
            swap_amount: { amount: "100000", denom: "btc-btc" },
          },
        },
        index: 1,
        next: null,
      },
    },
  ],
};

describe("draft strategy store persistence", () => {
  it("persists drafts in encoded form and round-trips them losslessly", () => {
    const strategy = Schema.decodeSync(Strategy)(encodedStrategy);

    useStrategyDraftsStore.getState().add("thorchain", strategy);

    const persisted = localStorage.getItem("calc_strategies");
    expect(persisted).not.toBeNull();

    const stored = (
      JSON.parse(persisted ?? "{}") as {
        state: { strategies: Record<string, Record<string, typeof Strategy.Encoded>> };
      }
    ).state.strategies.thorchain["draft-1"];

    // encoded on disk: raw integer amounts, not display units
    expect(stored.nodes[1]).toMatchObject({
      action: { action: { swap: { swap_amount: { amount: "100000", denom: "btc-btc" } } } },
    });

    // and decoding what was stored returns the original strategy
    expect(Schema.decodeSync(Strategy)(stored)).toEqual(strategy);

    const fetched = useStrategyDraftsStore.getState().fetch("thorchain", "draft-1");
    expect(fetched).toEqual(strategy);

    useStrategyDraftsStore.getState().deleteStrategy("thorchain", "draft-1");
    expect(useStrategyDraftsStore.getState().fetch("thorchain", "draft-1")).toBeUndefined();
  });

  it("drops corrupt persisted drafts on rehydration and keeps valid ones", async () => {
    const valid = { ...encodedStrategy, id: "survivor" };
    // A draft persisted under the pre-v2 schema: nested action tree, no nodes.
    const corrupt = {
      id: "stale",
      chainId: "thorchain",
      label: "Old Schema",
      status: "draft",
      action: {
        id: "action-x",
        swap: {
          adjustment: "fixed",
          maximum_slippage_bps: 300,
          routes: [{ thorchain: {} }],
          minimum_receive_amount: { amount: "1", denom: "rune" },
          swap_amount: { amount: "1", denom: "rune" },
        },
      },
    };

    localStorage.setItem(
      "calc_strategies",
      JSON.stringify({ state: { strategies: { thorchain: { survivor: valid, stale: corrupt } } }, version: 0 }),
    );

    await useStrategyDraftsStore.persist.rehydrate();

    const strategies = useStrategyDraftsStore.getState().strategies.thorchain ?? {};
    expect(Object.keys(strategies)).toEqual(["survivor"]);
  });

});
