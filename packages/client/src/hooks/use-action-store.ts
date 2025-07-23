import { Action } from "@template/domain/src/calc";
import { Schema } from "effect";
import { create } from "zustand";

export type CreateActionStore = {
  action: Action | undefined;
  updateAction: (action: Action) => void;
  removeAction: () => void;
  generateJson: () => typeof Action.Encoded | undefined;
};

const action = Schema.decodeSync(Action)({
  id: "action-0",
  many: [
    {
      id: "action-1",
      swap: {
        swap_amount: { amount: "508761230", denom: "rune" },
        minimum_receive_amount: {
          amount: "12323212321",
          denom: "x/ruji",
        },
        adjustment: "fixed" as const,
        maximum_slippage_bps: 300,
        routes: [],
      },
    },
    {
      id: "action-2",
      swap: {
        swap_amount: { amount: "12312321321", denom: "rune" },
        minimum_receive_amount: {
          amount: "1231232121",
          denom: "x/ruji",
        },
        adjustment: "fixed" as const,
        maximum_slippage_bps: 300,
        routes: [],
      },
    },
  ],
});

export const useCreateActionStore = create<CreateActionStore>((set, get) => ({
  action,
  updateAction: (action: Action) => {
    set({ action });
  },
  removeAction: () => {
    set({ action: undefined });
  },
  generateJson: () => Schema.encodeSync(Action)(get().action ?? action),
}));
