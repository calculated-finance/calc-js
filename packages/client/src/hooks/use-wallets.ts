import React from "react";
import { WalletProviderContext } from "../components/providers/wallet-provider";

export const useWallets = () => {
  const context = React.useContext(WalletProviderContext);

  return context;
};
