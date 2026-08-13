import { Strategy, StrategyHandle, StrategyId } from "@template/domain/calc";
import type { ChainId } from "@template/domain/chains";
import { Effect, Schema } from "effect";
import { useMemo } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface StrategyStore {
  strategies: Partial<Record<ChainId, Record<string, Strategy>>>;
  fetch: (chainId: ChainId, id: StrategyId) => Strategy | undefined;
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
              ...state.strategies[chainId],
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
              ...state.strategies[chainId],
              [strategy.id]: strategy,
            },
          },
        }));
      },
      deleteStrategy: (chainId, id) => {
        set((state) => {
          const rest = { ...state.strategies[chainId] };
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- keyed removal from a plain map
          delete rest[id];
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
          return Object.entries(value as Record<ChainId, Record<string, Strategy>>).reduce<Record<ChainId, Record<string, typeof Strategy.Encoded>>>(
            (acc, [chainId, strategies]) => ({
              ...acc,
              [chainId]: Object.values(strategies).reduce<Record<string, typeof Strategy.Encoded>>(
                (chainAcc, strategy) => ({
                  ...chainAcc,
                  [strategy.id]: Effect.runSync(Schema.encode(Strategy)(strategy)),
                }),
                {},
              ),
            }),
            {},
          );
        },
        reviver: (key, value) => {
          if (key !== "strategies") return value;
          return Object.entries(value as Record<ChainId, Record<string, typeof Strategy.Encoded>>).reduce<Record<ChainId, Record<string, Strategy>>>(
            (acc, [chainId, strategies]) => ({
              ...acc,
              [chainId]: Object.values(strategies).reduce<Record<string, Strategy>>(
                (chainAcc, strategy) => ({
                  ...chainAcc,
                  [strategy.id]: Effect.runSync(Schema.decode(Strategy)(strategy)),
                }),
                {},
              ),
            }),
            {},
          );
        },
      }),
    },
  ),
);

export const selectStrategiesByStatus =
  (status: "draft" | "active" | "paused" | "archived") => (chainId: ChainId, state: StrategyStore) =>
    Object.values(state.strategies[chainId] ?? {}).reduce<Record<string, Strategy>>(
      (acc, strategy) => (strategy.status === status ? { ...acc, [strategy.label]: strategy } : acc),
      {},
    );

export const useDraftStrategies = (chainId: ChainId | undefined) => {
  const { strategies, fetch, add, update, deleteStrategy } = useStrategyDraftsStore();

  // Memoized so consumers can safely put the returned callbacks in effect
  // dependency arrays without re-firing on every render.
  return useMemo(() => {
    if (!chainId) {
      return {
        strategies: {},
        strategyHandles: {},
        fetch: () => undefined,
        add: () => {},
        update: () => {},
        deleteStrategy: () => {},
      };
    }

    return {
      strategies: strategies[chainId] ?? {},
      strategyHandles: Object.values(strategies[chainId] ?? {}).reduce<Record<string, StrategyHandle>>(
        (acc, strategy) => ({
          ...acc,
          [strategy.id]: {
            id: strategy.id,
            chainId,
            owner: strategy.owner ?? "",
            label: strategy.label,
            status: "draft" as const,
          },
        }),
        {},
      ),
      fetch: (id: StrategyId) => fetch(chainId, id),
      add: (strategy: Strategy) => {
        add(chainId, strategy);
      },
      update: (strategy: Strategy) => {
        update(chainId, strategy);
      },
      deleteStrategy: (id: StrategyId) => {
        deleteStrategy(chainId, id);
      },
    };
  }, [chainId, strategies, fetch, add, update, deleteStrategy]);
};
