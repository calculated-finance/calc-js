import type { StrategyHandle } from "@template/domain/calc";
import { useChainStrategy } from "./use-chain-strategy";
import { useDraftStrategies } from "./use-draft-strategies";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export const useStrategy = (handle: StrategyHandle | undefined) => {
  const { strategies } = useDraftStrategies(handle?.chainId);
  const chainQuery = useChainStrategy(handle);

  // Drafts live in the zustand store, which re-renders subscribers on every
  // update. Reading through a react-query cache here would serve stale data:
  // the query key never changes when a draft is edited, so the cached
  // (pre-edit) strategy would be returned until an unrelated refetch.
  if (handle?.status === "draft") {
    const draft = strategies[handle.id];
    return { data: draft, isPending: !draft };
  }

  return { data: chainQuery.data, isPending: chainQuery.isPending };
};
