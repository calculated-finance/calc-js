export const errorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error));

/**
 * Wallet-standard rejection codes:
 * - 4001: EIP-1193 "User Rejected Request" (MetaMask and compliant EVM wallets)
 * - "ACTION_REJECTED": ethers v5/v6
 * - 5000..5002: WalletConnect v2 (user rejected / rejected chains / rejected methods)
 */
const REJECTION_CODES = new Set<number | string>([4001, "ACTION_REJECTED", 5000, 5001, 5002]);

/**
 * Message fragments wallets use for declines:
 * - "User rejected the request" / "User denied transaction signature" (MetaMask)
 * - "Request rejected" (Keplr's documented decline)
 * - "User cancelled the request" (some WalletConnect wallets, code -32000)
 * - "Rejected by user" (Rabby, Trust and friends)
 * - "User disapproved requested chains/methods" (WalletConnect)
 * - "An error has occurred" (Keplr's decline as observed in the wild)
 */
const REJECTION_PATTERNS =
  /user rejected|user denied|request rejected|user cancell?ed|rejected by (the )?user|user disapproved|an error has occurred/i;

/**
 * True when the failure is the user declining in their wallet — an expected
 * outcome, not an error worth surfacing. Checks codes and messages down the
 * cause chain, since wrappers (Effect, cosmjs, viem) bury the original error.
 */
export const isUserRejection = (error: unknown): boolean => {
  let current: unknown = error;
  for (let depth = 0; depth < 5 && current != null; depth++) {
    if (typeof current === "string") {
      return REJECTION_PATTERNS.test(current);
    }
    if (typeof current !== "object") break;
    const { code, message, cause } = current as { code?: unknown; message?: unknown; cause?: unknown };
    if ((typeof code === "number" || typeof code === "string") && REJECTION_CODES.has(code)) return true;
    if (typeof message === "string" && REJECTION_PATTERNS.test(message)) return true;
    current = cause;
  }
  return false;
};
