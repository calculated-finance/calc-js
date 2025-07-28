import { ChainId, CHAINS_BY_ID, RUJIRA_STAGENET } from "@template/domain/src/chains";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StrategyChainState {
  chainId: ChainId;
  setChain: (id: ChainId) => void;
}

const useStrategyChainStore = create<StrategyChainState>()(
  persist(
    (set) => ({
      chainId: RUJIRA_STAGENET.id,
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
