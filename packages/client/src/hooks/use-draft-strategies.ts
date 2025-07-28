import { Strategy, StrategyHandle, StrategyId } from "@template/domain/src/calc";
import type { ChainId } from "@template/domain/src/chains";
import { Effect, Schema } from "effect";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface StrategyStore {
  strategies: Record<ChainId, Record<string, Strategy>>;
  fetch: (chainId: ChainId, id: StrategyId) => Strategy;
  add: (chainId: ChainId, strategy: Strategy) => void;
  update: (chainId: ChainId, strategy: Strategy) => void;
  deleteStrategy: (chainId: ChainId, id: StrategyId) => void;
}

export const useStrategyDraftsStore = create<StrategyStore>()(
  persist(
    (set, get) => ({
      strategies: {},
      fetch: (chainId, id) => get().strategies[chainId]?.[id],
      add: (chainId, strategy) => {
        set((state) => ({
          ...state,
          strategies: {
            ...state.strategies,
            [chainId]: {
              ...(state.strategies[chainId] || {}),
              [strategy.id]: strategy,
            },
          },
        }));
      },
      update: (chainId, strategy) => {
        set((state) => ({
          ...state,
          strategies: {
            ...state.strategies,
            [chainId]: {
              ...(state.strategies[chainId] || {}),
              [strategy.id]: strategy,
            },
          },
        }));
      },
      deleteStrategy: (chainId, id) => {
        set((state) => {
          const { [id]: _, ...rest } = state.strategies[chainId] || {};
          return {
            ...state,
            strategies: {
              ...state.strategies,
              [chainId]: rest,
            },
          };
        });
      },
    }),
    {
      name: "calc_strategies",
      storage: createJSONStorage<StrategyStore>(() => localStorage, {
        replacer: (key, value) => {
          if (key !== "strategies") return value;
          return Object.entries(value as Record<ChainId, Record<string, Strategy>>).reduce(
            (acc, [chainId, strategies]) => ({
              ...acc,
              [chainId]: Object.values(strategies).reduce(
                (chainAcc, strategy) => ({
                  ...chainAcc,
                  [strategy.id]: Effect.runSync(Schema.encode(Strategy)(strategy)),
                }),
                {} as Record<string, typeof Strategy.Encoded>,
              ),
            }),
            {} as Record<ChainId, Record<string, typeof Strategy.Encoded>>,
          );
        },
        reviver: (key, value) => {
          if (key !== "strategies") return value;
          return Object.entries(value as Record<ChainId, Record<string, typeof Strategy.Encoded>>).reduce(
            (acc, [chainId, strategies]) => ({
              ...acc,
              [chainId]: Object.values(strategies).reduce(
                (chainAcc, strategy) => ({
                  ...chainAcc,
                  [strategy.id]: Effect.runSync(Schema.decode(Strategy)(strategy)),
                }),
                {} as Record<string, Strategy>,
              ),
            }),
            {} as Record<ChainId, Record<string, Strategy>>,
          );
        },
      }),
    },
  ),
);

export const selectStrategiesByStatus =
  (status: "draft" | "active" | "paused" | "archived") => (chainId: ChainId, state: StrategyStore) =>
    Object.values(state.strategies[chainId] || {}).reduce(
      (acc, strategy) => (strategy.status === status ? { ...acc, [strategy.label]: strategy } : acc),
      {} as Record<string, Strategy>,
    );

export const useDraftStrategies = (chainId: ChainId | undefined) => {
  const { strategies, fetch, add, update, deleteStrategy } = useStrategyDraftsStore();

  if (!chainId) {
    return {
      strategies: {} as Record<string | number, Strategy>,
      strategyHandles: {} as Record<string | number, StrategyHandle>,
      fetch: () => undefined,
      add: () => {},
      update: () => {},
      deleteStrategy: () => {},
    };
  }

  return {
    strategies: strategies[chainId] || {},
    strategyHandles: Object.values(strategies[chainId] || {}).reduce(
      (acc, strategy) => ({
        ...acc,
        [strategy.id]: {
          id: strategy.id,
          chainId,
          owner: strategy.owner || "",
          label: strategy.label,
          status: "draft" as const,
        },
      }),
      {} as Record<string, StrategyHandle>,
    ),
    fetch: (id: StrategyId) => fetch(chainId, id),
    add: (strategy: Strategy) => add(chainId, strategy),
    update: (strategy: Strategy) => update(chainId, strategy),
    deleteStrategy: (id: StrategyId) => deleteStrategy(chainId, id),
  };
};
