import { ChainId } from "@template/domain/chains";
import { useChainStrategies } from "./use-chain-strategies";
import { useDraftStrategies } from "./use-draft-strategies";

/** Local drafts merged over every chain strategy; the list filters by status. */
export const useStrategies = (chainId: ChainId) => {
  const { strategyHandles: draftStrategies } = useDraftStrategies(chainId);
  // The deployed manager's strategies query only accepts active|paused as a
  // status filter (archived is a strategy status but not a queryable one).
  const { data: liveStrategies, isLoading, ...helpers } = useChainStrategies(chainId, ["active", "paused"]);

  // The list stays empty until the chain set has loaded, so it doesn't
  // flash a drafts-only view on page open.
  return {
    data: isLoading ? {} : { ...draftStrategies, ...liveStrategies },
    isLoading,
    ...helpers,
  };
};
