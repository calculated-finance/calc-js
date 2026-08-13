import { StrategyStatus } from "@template/domain/calc";
import { ChainId } from "@template/domain/chains";
import { useChainStrategies } from "./use-chain-strategies";
import { useDraftStrategies } from "./use-draft-strategies";

export type StrategyFilter = "draft" | "strategies" | "archived";

/** The chain statuses each top-level filter tab spans. */
const FILTER_STATUSES: Record<StrategyFilter, StrategyStatus[]> = {
  draft: [],
  // Active and paused fetch together; the list's own filter splits them.
  strategies: ["active", "paused"],
  archived: ["archived"],
};

export const useStrategies = (chainId: ChainId, filter: StrategyFilter) => {
  const { strategyHandles: draftStrategies } = useDraftStrategies(chainId);
  const { data: liveStrategies, ...helpers } = useChainStrategies(chainId, FILTER_STATUSES[filter]);

  return { data: filter === "draft" ? draftStrategies : liveStrategies, ...helpers };
};
