import { Strategy } from "@template/domain/src/calc";
import { Effect, Schema } from "effect";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface StrategyStore {
  strategies: Record<string, Strategy>;
  add: (strategy: Strategy) => void;
  update: (strategy: Strategy) => void;
  deleteStrategy: (id: string) => void;
}

export const useStrategyStore = create<StrategyStore>()(
  persist(
    (set, get) => ({
      strategies: {},
      add: (strategy) => {
        if (!strategy.label) {
          throw new Error("Strategy must have a label");
        }

        if (strategy.label in get().strategies) {
          throw new Error(`Strategy with label ${strategy.label} already exists`);
        }

        set((state) => ({
          ...state,
          strategies: {
            ...(state.strategies || {}),
            [strategy.id]: strategy,
          },
        }));
      },
      update: (strategy) => {
        set((state) => ({
          ...state,
          strategies: {
            ...state.strategies,
            [strategy.id]: strategy,
          },
        }));
      },
      deleteStrategy: (id) => {
        set((state) => {
          const { [id]: _, ...strategies } = state.strategies;
          return { ...state, strategies };
        });
      },
    }),
    {
      name: "calc-strategies",
      storage: createJSONStorage<StrategyStore>(() => localStorage, {
        replacer: (key, value) => {
          if (key !== "strategies") return value;
          return Object.values(value as Record<string, Strategy>).reduce(
            (acc, strategy) => ({
              ...acc,
              [strategy.id]: Effect.runSync(Schema.encode(Strategy)(strategy)),
            }),
            {} as Record<string, typeof Strategy.Encoded>,
          );
        },
        reviver: (key, value) => {
          if (key !== "strategies") return value;
          return Object.values(value as Record<string, typeof Strategy.Encoded>).reduce(
            (acc, strategy) => ({
              ...acc,
              [strategy.id]: Effect.runSync(Schema.decode(Strategy)(strategy)),
            }),
            {} as Record<string, Strategy>,
          );
        },
      }),
    },
  ),
);

export const selectStrategiesByStatus =
  (status: "draft" | "active" | "paused" | "archived") => (state: StrategyStore) =>
    Object.values(state.strategies).reduce(
      (acc, strategy) => (strategy.status === status ? { ...acc, [strategy.label]: strategy } : acc),
      {} as Record<string, Strategy>,
    );
