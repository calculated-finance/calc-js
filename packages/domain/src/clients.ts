import { Context, Effect, Layer, Stream } from "effect";
import type { ChainId } from "./chains.js";
import { Chain } from "./chains.js";
import { createKeplrSigningClient, KeplrService } from "./clients/keplr.js";
import {
  createQueryClientFromEnv,
  createSigningClientFromEnv,
} from "./clients/local.js";
import { MetaMaskService } from "./clients/metamask.js";
import type {
  Transaction,
  TransactionData,
  TransactionSimulationFailed,
  TransactionSimulationResult,
  TransactionSubmissionFailed,
  TransactionSubmissionResult,
  Wallet,
  WalletClient,
} from "./clients/model.js";
import { ClientNotAvailableError } from "./clients/model.js";

export * from "./clients/model.js";

export class WalletService extends Effect.Service<WalletService>()(
  "WalletService",
  {
    effect: Effect.gen(function* () {
      // The wallet registry: list a new integration's service here.
      const clients: ReadonlyArray<WalletClient> = [
        yield* MetaMaskService,
        yield* KeplrService,
      ];

      const clientsByType = new Map(clients.map((client) => [client.type, client]));

      const withClient = <A, E>(
        wallet: Wallet,
        f: (client: WalletClient) => Effect.Effect<A, E>
      ): Effect.Effect<A, E | ClientNotAvailableError> => {
        const client = clientsByType.get(wallet.type);
        return client
          ? f(client)
          : Effect.fail(new ClientNotAvailableError({ cause: wallet.type }));
      };

      return {
        wallets: Stream.zipLatestAll(...clients.map((client) => client.wallet)),

        connect: (wallet: Wallet, chainId?: ChainId) =>
          withClient(wallet, (client) => client.connect(chainId)),

        switchChain: (wallet: Wallet, chainId: ChainId) =>
          withClient(wallet, (client) => client.switchChain(chainId)),

        disconnect: (wallet: Wallet) => withClient(wallet, (client) => client.disconnect()),

        simulateTransaction: (wallet: Wallet, chain: Chain, data: TransactionData) =>
          withClient(wallet, (client) => client.simulateTransaction(chain, data)),

        signTransaction: (wallet: Wallet, chain: Chain, data: TransactionData) =>
          withClient(wallet, (client) => client.signTransaction(chain, data)),
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
