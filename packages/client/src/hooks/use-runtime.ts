import React from "react";
import { RuntimeContext } from "../components/providers/runtime-provider";

const useRuntimes = () => React.useContext(RuntimeContext);

/** Runtime for chain-query services (CalcService). */
export const useRuntime = () => useRuntimes().calc;

/** Runtime for wallet services (WalletService). */
export const useWalletRuntime = () => useRuntimes().wallet;

/** Runtime for the Rujira indexer client. */
export const useIndexerRuntime = () => useRuntimes().indexer;
