import type { ChainId } from "@template/domain/chains";
import { CHAINS_BY_ID } from "@template/domain/chains";
import { useWallets } from "./use-wallets";

/**
 * The connected wallet's address for the given chain, when there is one.
 *
 * The wallet must actually be on the chain, not merely support it: a bech32
 * address only exists on its own chain, so a Keplr session on Cosmos Hub must
 * not supply a cosmos1… address for a THORChain query. EVM hex addresses are
 * chain-portable, so any wallet settled on an EVM chain can answer for any
 * EVM target. A wallet mid-switch (chain not "ready") supplies nothing.
 */
export const useConnectedAddress = (chainId: ChainId) => {
  const { wallets } = useWallets();
  const targetChain = CHAINS_BY_ID[chainId];
  const wallet = wallets.find((w) => {
    if (w.connection.status !== "connected" || w.connection.chain.status !== "ready") return false;
    const activeChain = w.connection.chain.chain;
    return activeChain.id === chainId || (activeChain.type === "evm" && targetChain.type === "evm");
  });
  return wallet?.connection.status === "connected" ? wallet.connection.address : undefined;
};
