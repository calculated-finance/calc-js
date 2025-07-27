import { ChainId } from "@template/domain/src/chains";

export const useStrategy = (
  chainId: ChainId,
  status: "draft" | "active" | "paused" | "archived",
  contractAddress: string,
) => {};
