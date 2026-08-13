import type { DeliverTxResponse } from "@cosmjs/stargate";
import { Data, Effect, Schema, Stream } from "effect";
import type { ChainId, ChainType } from "../chains.js";
import { Chain } from "../chains.js";

/**
 * The chain half of a connected wallet, as its own discriminated union so
 * consumers switch on one status field instead of `typeof chain !== "string"`
 * probing, and an unsupported chain keeps its id for display.
 */
export const ChainState = Schema.Union(
  Schema.Struct({
    status: Schema.Literal("ready"),
    chain: Chain,
  }),
  Schema.Struct({
    status: Schema.Literal("switching"),
  }),
  Schema.Struct({
    status: Schema.Literal("adding"),
  }),
  Schema.Struct({
    status: Schema.Literal("unsupported"),
    chainId: Schema.optional(Schema.Union(Schema.String, Schema.Number)),
  })
);

export type ChainState = Schema.Schema.Type<typeof ChainState>;

export const Connection = Schema.Union(
  Schema.Struct({
    status: Schema.Literal("disconnecting"),
  }),
  Schema.Struct({
    status: Schema.Literal("disconnected"),
  }),
  Schema.Struct({
    status: Schema.Literal("connecting"),
  }),
  Schema.Struct({
    status: Schema.Literal("connected"),
    chain: ChainState,
    address: Schema.NonEmptyTrimmedString,
    label: Schema.NonEmptyTrimmedString,
  })
);

export type Connection = Schema.Schema.Type<typeof Connection>;

export const WalletType = Schema.Literal("MetaMask", "Keplr");

export type WalletType = Schema.Schema.Type<typeof WalletType>;

export const Wallet = Schema.Struct({
  type: WalletType,
  supportedChains: Schema.Array(Chain),
  icon: Schema.optional(Schema.NonEmptyTrimmedString),
  color: Schema.NonEmptyTrimmedString,
  connection: Connection,
});

export type Wallet = Schema.Schema.Type<typeof Wallet>;

export const CosmosTransactionMsgs = Schema.Array(
  Schema.Struct({
    typeUrl: Schema.NonEmptyTrimmedString,
    value: Schema.Unknown,
  })
);

export type CosmosTransactionMsgs = Schema.Schema.Type<
  typeof CosmosTransactionMsgs
>;

export const TransactionData = Schema.Union(
  Schema.Struct({
    type: Schema.Literal("cosmos"),
    msgs: CosmosTransactionMsgs,
  })
);

export const CosmosChainId = Schema.Literal(
  "cosmoshub-4", // Cosmos Hub
  "thorchain" // Rujira
);

export const EvmChainId = Schema.Literal(
  1, // Ethereum Mainnet
  56 // Binance Smart Chain
);

export const TransactionCommon = Schema.Struct({
  signer: Schema.NonEmptyTrimmedString,
  memo: Schema.optional(Schema.NonEmptyTrimmedString),
  hash: Schema.optional(Schema.NonEmptyTrimmedString),
  events: Schema.optional(Schema.Array(Schema.Unknown)),
});

export const Transaction = Schema.Union(
  Schema.Struct({
    type: Schema.Literal("cosmos"),
    chainId: CosmosChainId,
    data: CosmosTransactionMsgs,
    ...TransactionCommon.fields,
  }),
  Schema.Struct({
    type: Schema.Literal("evm"),
    chainId: EvmChainId,
    data: Schema.Unknown,
    ...TransactionCommon.fields,
  })
);

export type Transaction = Schema.Schema.Type<typeof Transaction>;

export type TransactionSimulationResult = { type: "cosmos"; result: number };

export type TransactionSubmissionResult =
  | { type: "cosmos"; result: DeliverTxResponse }
  | {
      type: "evm";
      result: string;
    };


export type TransactionData = Schema.Schema.Type<typeof TransactionData>;

export class ChainTypeMismatchError extends Data.TaggedError(
  "ChainTypeMismatchError"
)<{
  required: ChainType;
  actual: ChainType;
}> {}

export class ChainNotSupportedError extends Data.TaggedError(
  "ChainNotSupportedError"
)<{
  walletType: string;
  chainId: ChainId;
}> {}

export class ChainNotAddedError extends Data.TaggedError("ChainNotAddedError")<{
  walletType: string;
  chainId: ChainId;
}> {}

export class SignerNotAvailableError extends Data.TaggedError(
  "SignerNotAvailableError"
)<{
  cause: string;
}> {}

export class ClientNotAvailableError extends Data.TaggedError(
  "ClientNotAvailableError"
)<{
  cause: string;
}> {}

export class AccountsNotAvailableError extends Data.TaggedError(
  "AccountsNotAvailableError"
)<{
  cause: string;
}> {}

export class ChainNotAvailableError extends Data.TaggedError(
  "ChainNotAvailableError"
)<{
  walletType: string;
}> {}

export class ConnectionRejectedError extends Data.TaggedError(
  "ConnectionRejectedError"
)<{
  walletType: string;
  reason?: string;
}> {}

export class RpcError extends Data.TaggedError("RpcError")<{
  walletType: string;
  message: string;
}> {}

export class TransactionSimulationFailed extends Data.TaggedError(
  "SimulationFailed"
)<{
  cause: string;
}> {}

export class TransactionSubmissionFailed extends Data.TaggedError(
  "TransactionSubmissionFailed"
)<{
  cause: string;
}> {}

export class DecodeTransactionFailed extends Data.TaggedError(
  "DecodeTransactionFailed"
)<{
  cause: string;
}> {}

export class TransactionFetchFailed extends Data.TaggedError(
  "TransactionFetchFailed"
)<{
  cause: string;
}> {}

export class BalancesFetchFailed extends Data.TaggedError(
  "BalancesFetchFailed"
)<{
  cause: string;
}> {}

export class OperationNotSupportedError extends Data.TaggedError(
  "OperationNotSupportedError"
)<{
  walletType: WalletType;
  operation: string;
}> {}

export type WalletError =
  | ClientNotAvailableError
  | AccountsNotAvailableError
  | ConnectionRejectedError
  | ChainNotAvailableError
  | ChainNotSupportedError
  | OperationNotSupportedError;

/**
 * The uniform contract every wallet integration implements. WalletService
 * dispatches purely through this interface, so adding a wallet means writing
 * one module that satisfies it and listing the module's service in
 * WalletService's registry below — nothing else changes.
 *
 * A wallet that cannot perform an operation (e.g. signing on a chain type it
 * doesn't support) fails with OperationNotSupportedError rather than omitting
 * the method, so capability gaps are typed and surface in the UI instead of
 * at runtime.
 */
export interface WalletClient {
  readonly type: WalletType;
  readonly wallet: Stream.Stream<Wallet>;
  readonly connect: (chainId?: ChainId) => Effect.Effect<unknown, WalletError | RpcError | ChainNotAddedError>;
  readonly disconnect: () => Effect.Effect<unknown, WalletError>;
  readonly switchChain: (chainId: ChainId) => Effect.Effect<unknown, WalletError | RpcError | ChainNotAddedError>;
  readonly simulateTransaction: (
    chain: Chain,
    data: TransactionData
  ) => Effect.Effect<number, WalletError | SignerNotAvailableError | AccountsNotAvailableError | TransactionSimulationFailed>;
  readonly signTransaction: (
    chain: Chain,
    data: TransactionData
  ) => Effect.Effect<unknown, WalletError | SignerNotAvailableError | AccountsNotAvailableError | TransactionSubmissionFailed>;
}

