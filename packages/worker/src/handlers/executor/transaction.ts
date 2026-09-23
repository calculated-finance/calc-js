import type { SigningCosmWasmClient } from "@cosmjs/cosmwasm";
import { sha256 } from "@cosmjs/crypto";
import { toHex, toUtf8 } from "@cosmjs/encoding";
import type { EncodeObject } from "@cosmjs/proto-signing";
import {
  BroadcastTxError,
  calculateFee,
  type GasPrice,
  type IndexedTx,
} from "@cosmjs/stargate";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import {
  BroadcastOutcomeUnknownError,
  isTxAlreadyKnown,
  type RpcEndpoint,
} from "./resilience.js";

/**
 * Submitting a transaction in explicit steps rather than through
 * `SigningCosmWasmClient.execute(..., "auto")`, which simulates, signs,
 * broadcasts and polls in one call. As one call, any failure while polling
 * looks like a failed submission, and failing over re-signs a second
 * transaction while the first is still in a mempool — which the chain then
 * rejects with "account sequence mismatch". Split up, we know exactly when
 * signed bytes may have left the process, and from then on only ever
 * rebroadcast those same bytes and poll for their hash.
 */

export type TransactionClient = Pick<
  SigningCosmWasmClient,
  "broadcastTxSync" | "getTx" | "sign" | "simulate"
>;

/** Matches cosmjs's "auto" fee multiplier. */
export const GAS_MULTIPLIER = 1.4;

/** CometBFT's tx hash: uppercase hex SHA-256 of the raw tx bytes. */
export const txHash = (txBytes: Uint8Array) =>
  toHex(sha256(txBytes)).toUpperCase();

export const schedulerExecuteMessage = (
  sender: string,
  scheduler: string,
  triggerIds: readonly string[]
): EncodeObject => ({
  typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
  value: MsgExecuteContract.fromPartial({
    sender,
    contract: scheduler,
    msg: toUtf8(JSON.stringify({ execute: triggerIds })),
    funds: [],
  }),
});

export type Broadcast = {
  rpcUrl: string;
  transactionHash: string;
  txBytes: Uint8Array;
};

/**
 * Simulates, signs and broadcasts through one endpoint.
 *
 * Errors before or at CheckTx (including sequence mismatches) mean nothing
 * reached a mempool and are thrown as-is, so the caller may retry or fail
 * over. A transport error during broadcast is thrown as
 * `BroadcastOutcomeUnknownError`, carrying the signed bytes.
 */
export const signAndBroadcast = async ({
  address,
  endpoint,
  gasPrice,
  messages,
}: {
  address: string;
  endpoint: RpcEndpoint<TransactionClient>;
  gasPrice: GasPrice;
  messages: EncodeObject[];
}): Promise<Broadcast> => {
  const { client, rpcUrl } = endpoint;
  const gas = await client.simulate(address, messages, "");
  const fee = calculateFee(Math.ceil(gas * GAS_MULTIPLIER), gasPrice);
  const txRaw = await client.sign(address, messages, fee, "");
  const txBytes = TxRaw.encode(txRaw).finish();
  const transactionHash = txHash(txBytes);

  try {
    await client.broadcastTxSync(txBytes);
  } catch (error) {
    if (isTxAlreadyKnown(error)) {
      return { rpcUrl, transactionHash, txBytes };
    }
    // CheckTx rejected it: nothing is in a mempool.
    if (error instanceof BroadcastTxError) throw error;
    throw new BroadcastOutcomeUnknownError({
      cause: error,
      rpcUrl,
      transactionHash,
      txBytes,
    });
  }

  return { rpcUrl, transactionHash, txBytes };
};

/**
 * Pushes already-signed bytes to the other endpoints until one accepts them.
 * Never re-signs. Returns the accepting endpoint, or undefined if none did.
 */
export const rebroadcast = async ({
  endpoints,
  onFailure,
  txBytes,
}: {
  endpoints: RpcEndpoint<TransactionClient>[];
  onFailure?: (details: { error: unknown; rpcUrl: string }) => void;
  txBytes: Uint8Array;
}) => {
  for (const { client, rpcUrl } of endpoints) {
    try {
      await client.broadcastTxSync(txBytes);
      return rpcUrl;
    } catch (error) {
      if (isTxAlreadyKnown(error)) return rpcUrl;
      onFailure?.({ error, rpcUrl });
    }
  }
  return undefined;
};

/**
 * Polls every `pollIntervalMs` for the tx until `deadlineMs`, on the first
 * endpoint, moving to the next only when one errors. Returns null if the tx
 * was not seen in a block in time.
 */
export const awaitInclusion = async ({
  deadlineMs,
  endpoints,
  now = Date.now,
  onPollFailure,
  pollIntervalMs,
  sleep = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms)),
  transactionHash,
}: {
  deadlineMs: number;
  endpoints: RpcEndpoint<TransactionClient>[];
  now?: () => number;
  onPollFailure?: (details: { error: unknown; rpcUrl: string }) => void;
  pollIntervalMs: number;
  sleep?: (ms: number) => Promise<void>;
  transactionHash: string;
}): Promise<IndexedTx | null> => {
  let offset = 0;

  while (now() + pollIntervalMs <= deadlineMs) {
    await sleep(pollIntervalMs);
    const { client, rpcUrl } = endpoints[offset % endpoints.length];

    try {
      const tx = await client.getTx(transactionHash);
      if (tx) return tx;
    } catch (error) {
      onPollFailure?.({ error, rpcUrl });
      offset++;
    }
  }

  return null;
};

/** The transaction landed in a block but its execution failed. */
export class TransactionFailedError extends Error {
  readonly code: number;
  readonly rawLog: string;
  readonly transactionHash: string;

  constructor(tx: Pick<IndexedTx, "code" | "hash" | "rawLog">) {
    super(`Transaction ${tx.hash} failed with code ${tx.code}: ${tx.rawLog}`);
    this.name = "TransactionFailedError";
    this.code = tx.code;
    this.rawLog = tx.rawLog;
    this.transactionHash = tx.hash;
  }
}
