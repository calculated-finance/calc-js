import { create } from "zustand";

/** The outcome of a submitted transaction, rendered by TransactionModal. */
export interface TxResult {
  status: "success" | "failure";
  /** What was attempted, e.g. "Withdraw Funds". */
  action: string;
  /** The broadcast transaction hash, when one exists. */
  hash?: string;
  /** Failure detail. */
  message?: string;
}

/**
 * Interprets a broadcast response as a TxResult. signAndBroadcast resolves
 * even when the transaction failed on-chain — a non-zero code — so success
 * requires checking it.
 */
export const txResultOf = (action: string, response: unknown): TxResult => {
  const broadcast =
    typeof response === "object" && response !== null
      ? (response as { code?: number; transactionHash?: string; rawLog?: string })
      : undefined;
  const hash = broadcast?.transactionHash;
  if (broadcast?.code === undefined || broadcast.code === 0) {
    return { status: "success", action, hash };
  }
  // An empty rawLog falls through to the code message, so || not ??.
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const message = broadcast.rawLog?.trim() || `Transaction failed on-chain with code ${broadcast.code}`;
  return { status: "failure", action, hash, message };
};

interface TransactionStore {
  /** The transaction currently in flight; opens the modal in its loading state. */
  execution?: { action: string; promise: Promise<unknown> };
  /** Set once the promise settles; switches the modal to the outcome view. */
  result?: TxResult;
  track: (action: string, promise: Promise<unknown>) => void;
  setResult: (result: TxResult) => void;
  clear: () => void;
}

/**
 * Global so any flow can hand its in-flight broadcast to the shared
 * transaction modal, and the modal survives the reporting component
 * unmounting (e.g. a draft deleting itself after a successful start).
 */
export const useTransactionStore = create<TransactionStore>((set) => ({
  execution: undefined,
  result: undefined,
  track: (action, promise) => {
    set({ execution: { action, promise }, result: undefined });
  },
  setResult: (result) => {
    set({ result });
  },
  clear: () => {
    set({ execution: undefined, result: undefined });
  },
}));
