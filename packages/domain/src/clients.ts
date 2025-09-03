import type { DeliverTxResponse } from "@cosmjs/stargate";
import { Context, Data, Effect, Layer, Schema, Stream } from "effect";
import type { ChainId, ChainType } from "./chains.js";
import { Chain } from "./chains.js";
import { createKeplrSigningClient, KeplrService } from "./clients/keplr.js";
import {
  createQueryClientFromEnv,
  createSigningClientFromEnv,
} from "./clients/local.js";
import { MetaMaskService } from "./clients/metamask.js";

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
    chain: Schema.Union(
      Chain,
      Schema.Literal("switching_chain", "adding_chain", "unsupported")
    ),
    address: Schema.NonEmptyTrimmedString,
    label: Schema.NonEmptyTrimmedString,
  })
);

export type Connection = Schema.Schema.Type<typeof Connection>;

export const WalletType = Schema.Literal("MetaMask", "Keplr", "Rabby Wallet");

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
  "thorchain-stagenet-2" // Rujira Stagenet
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

export type ISigningClient = Context.Tag.Service<SigningClient>;

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

export type WalletError =
  | ClientNotAvailableError
  | AccountsNotAvailableError
  | ConnectionRejectedError
  | ChainNotAvailableError
  | ChainNotSupportedError;

export class WalletService extends Effect.Service<WalletService>()(
  "WalletService",
  {
    effect: Effect.gen(function* () {
      const metaMaskService = yield* MetaMaskService;
      const keplrService = yield* KeplrService;

      return {
        wallets: Stream.zipLatestAll(
          metaMaskService.wallet,
          keplrService.wallet
        ),

        connect: (wallet: Wallet, chainId?: ChainId) =>
          Effect.gen(function* () {
            switch (wallet.type) {
              case "MetaMask":
                yield* metaMaskService.connect(chainId);
                break;
              case "Keplr":
                yield* keplrService.connect(chainId);
                break;
              default:
                return yield* Effect.fail(
                  new ClientNotAvailableError({ cause: wallet.type })
                );
            }
          }),

        switchChain: (wallet: Wallet, chainId: ChainId) =>
          Effect.gen(function* () {
            switch (wallet.type) {
              case "MetaMask":
                yield* metaMaskService.switchChain(chainId);
                break;
              case "Keplr":
                yield* keplrService.switchChain(chainId);
                break;
              default:
                return yield* Effect.fail(
                  new ClientNotAvailableError({ cause: wallet.type })
                );
            }
          }),

        disconnect: (wallet: Wallet) =>
          Effect.gen(function* () {
            switch (wallet.type) {
              case "MetaMask":
                yield* metaMaskService.disconnect();
                break;
              case "Keplr":
                yield* keplrService.disconnect();
                break;
              default:
                return yield* Effect.fail(
                  new ClientNotAvailableError({ cause: wallet.type })
                );
            }
          }),

        simulateTransaction: (
          wallet: Wallet,
          chain: Chain,
          data: TransactionData
        ) =>
          Effect.gen(function* () {
            switch (wallet.type) {
              case "Keplr":
                return yield* keplrService.simulateTransaction(chain, data);
              default:
                return yield* Effect.fail(
                  new ClientNotAvailableError({ cause: wallet.type })
                );
            }
          }),

        signTransaction: (
          wallet: Wallet,
          chain: Chain,
          data: TransactionData
        ) =>
          Effect.gen(function* () {
            switch (wallet.type) {
              case "Keplr":
                return yield* keplrService.signTransaction(chain, data);
              default:
                return yield* Effect.fail(
                  new ClientNotAvailableError({ cause: wallet.type })
                );
            }
          }),
      };
    }),
    dependencies: [MetaMaskService.Default, KeplrService.Default],
  }
) {}

export class SigningClient extends Context.Tag("SigningClient")<
  SigningClient,
  {
    type: "cosmos" | "evm";
    chainId: ChainId;
    address: string;
    simulateTransaction: (
      transaction: Transaction
    ) => Effect.Effect<
      TransactionSimulationResult,
      TransactionSimulationFailed
    >;
    signAndSubmitTransaction: (
      transaction: Transaction
    ) => Effect.Effect<
      TransactionSubmissionResult,
      TransactionSubmissionFailed
    >;
  }
>() {
  static fromEnv = Layer.scoped(this, createSigningClientFromEnv());
  static fromKeplr = (chainId: ChainId) =>
    Layer.scoped(this, createKeplrSigningClient(chainId));
}

export class QueryClient extends Context.Tag("QueryClient")<
  QueryClient,
  {
    fetchTransactions: (
      address: string,
      afterBlock: number
    ) => Effect.Effect<Array<Transaction>, Error>;
    fetchBalances: (
      address: string
    ) => Effect.Effect<Array<{ denom: string; amount: string }>, Error>;
  }
>() {
  static fromEnv = Layer.scoped(this, createQueryClientFromEnv());
}
