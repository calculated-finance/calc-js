import React from "react";
import { WalletProviderContext } from "../components/providers/wallet-provider";

export const useWallets = () => {
  const context = React.useContext(WalletProviderContext);

  if (context === undefined)
    throw new Error("useWallet must be used within a WalletProvider");

  return context;
};
