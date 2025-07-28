import type { Wallet } from "@template/domain/src/wallets";
import { useEffect, useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useWallets } from "./use-wallets";

interface ConnectionStore {
  wallet?: Wallet;
  setConnectedWallet: (wallet?: Wallet) => void;
}

export const useConnectionStore = create<ConnectionStore>()(
  persist(
    (set) => ({
      wallet: undefined,
      setConnectedWallet: (wallet) => set({ wallet: wallet }),
    }),
    {
      name: "calc_current_connection",
    },
  ),
);

export const useConnectedWallet = () => {
  const { wallets } = useWallets();
  const { wallet, setConnectedWallet } = useConnectionStore();

  const connectedWallets = useMemo(
    () => wallets.filter((wallet) => wallet.connection.status === "connected"),
    [wallets],
  );

  const connectedWallet = useMemo(() => {
    return connectedWallets.find(
      (w) =>
        w.connection.status === "connected" &&
        wallet?.connection.status === "connected" &&
        w.connection.address === wallet.connection.address &&
        w.connection.address === wallet.connection.address,
    );
  }, [connectedWallets, wallet]);

  useEffect(() => {
    if (wallet && connectedWallet) {
      setConnectedWallet(connectedWallet);
      return;
    }

    setConnectedWallet(connectedWallets.find((w) => w.connection.status === "connected"));
  }, [connectedWallets, wallet, setConnectedWallet]);

  return { wallet, setConnectedWallet };
};
