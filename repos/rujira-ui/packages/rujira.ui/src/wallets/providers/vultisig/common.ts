import { getPublicKey } from "@vultisig/sdk";

export type WalletCore = Parameters<typeof getPublicKey>[0]["walletCore"];
