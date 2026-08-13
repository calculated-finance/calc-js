import type { Wallet, WalletType } from "@template/domain/clients";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useWallets } from "./use-wallets";

interface ConnectionStore {
  /** The user's preferred wallet; the live Wallet object is always derived. */
  selectedWalletType?: WalletType;
  setSelectedWalletType: (type?: WalletType) => void;
}

export const useConnectionStore = create<ConnectionStore>()(
  persist(
    (set) => ({
      selectedWalletType: undefined,
      setSelectedWalletType: (selectedWalletType) => set({ selectedWalletType }),
    }),
    {
      name: "calc_current_connection",
    },
  ),
);

/**
 * The active wallet, derived from the live wallet stream: the selected wallet
 * if it is currently connected, otherwise the first connected wallet.
 */
export const useConnectedWallet = () => {
  const { wallets } = useWallets();
  const { selectedWalletType, setSelectedWalletType } = useConnectionStore();

  const connected = wallets.filter((wallet) => wallet.connection.status === "connected");
  const wallet = connected.find((w) => w.type === selectedWalletType) ?? (connected[0]);

  return {
    wallet,
    setConnectedWallet: (wallet?: Wallet) => {
      setSelectedWalletType(wallet?.type);
    },
  };
};
