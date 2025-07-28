import { ChainId } from "@template/domain/src/chains";
import { useChainStrategies } from "./use-chain-strategies";
import { useDraftStrategies } from "./use-draft-strategies";

export const useStrategies = (chainId: ChainId, status: "draft" | "active" | "paused" | "archived") => {
  const { strategyHandles: draftStrategies } = useDraftStrategies(chainId);
  const { data: liveStrategies, ...helpers } = useChainStrategies(chainId, status);

  return { data: status === "draft" ? draftStrategies : liveStrategies, ...helpers };
};
