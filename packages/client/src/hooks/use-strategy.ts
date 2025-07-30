import { useQuery } from "@tanstack/react-query";
import type { StrategyHandle } from "@template/domain/src/calc";
import { useChainStrategy } from "./use-chain-strategy";
import { useDraftStrategies } from "./use-draft-strategies";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export const useStrategy = (handle: StrategyHandle | undefined) => {
  const { strategies } = useDraftStrategies(handle?.chainId);
  const { data: strategy } = useChainStrategy(handle);

  return useQuery({
    queryKey: [
      "strategy",
      handle?.chainId,
      handle?.id,
      handle?.status,
      handle?.status === "draft" ? JSON.stringify(strategies) : JSON.stringify(strategy),
    ],
    enabled: handle?.status === "draft" || !!strategy,
    placeholderData: (previous) =>
      previous !== undefined && previous.id === handle?.id && previous.status === "draft" ? previous : undefined,
    queryFn: () => {
      if (!handle) {
        throw new Error("No strategy handle provided");
      }

      if (handle.status === "draft") {
        const strategy = strategies[handle.id];

        if (!strategy) {
          throw new Error(`No strategy found for handle ${handle.id}`);
        }

        return strategy;
      }

      return strategy;
    },
  });
};
