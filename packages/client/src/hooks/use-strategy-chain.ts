import { ChainId, CHAINS_BY_ID, RUJIRA } from "@template/domain/chains";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StrategyChainState {
  chainId: ChainId;
  setChain: (id: ChainId) => void;
}

const useStrategyChainStore = create<StrategyChainState>()(
  persist(
    (set) => ({
      chainId: RUJIRA.id,
      setChain: (id) => set({ chainId: id }),
    }),
    {
      name: "strategy-chain-storage",
    },
  ),
);

export function useStrategyChain() {
  const { chainId, setChain } = useStrategyChainStore();
  return { chain: CHAINS_BY_ID[chainId], setChain };
}
