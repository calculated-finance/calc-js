import type { ChainId } from "@template/domain/src/chains";
import {
  Connection,
  Wallet,
  WalletService,
} from "@template/domain/src/wallets/index";
import { Effect, Layer, ManagedRuntime, Stream } from "effect";
import React, { useEffect } from "react";

type WalletProviderProps = {
  children: React.ReactNode;
};

type WalletProviderState = {
  wallets: Array<Wallet>;
  connections: Array<Connection>;
  connect: (wallet: Wallet) => Promise<void>;
  switchChain: (wallet: Wallet, chainId: ChainId) => Promise<void>;
  disconnect: (wallet: Wallet) => void;
};

const initialState: WalletProviderState = {
  wallets: [],
  connections: [],
  connect: () => {
    throw new Error("Connect function not provided yet");
  },
  switchChain: () => {
    throw new Error("Switch chain function not provided yet");
  },
  disconnect: () => {
    throw new Error("Disconnect function not provided yet");
  },
};

const memoMap = Effect.runSync(Layer.makeMemoMap);

const runtime = ManagedRuntime.make(WalletService.Default, memoMap);

export const WalletProviderContext =
  React.createContext<WalletProviderState>(initialState);

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [state, setState] = React.useState<WalletProviderState>(initialState);

  useEffect(() => {
    runtime.runFork(
      Effect.gen(function* () {
        const walletService = yield* WalletService;

        const walletsFiber = yield* Effect.fork(
          Stream.runForEach(walletService.wallets, (wallets) =>
            Effect.sync(() => {
              setState((prev) => ({
                ...prev,
                wallets,
                connect: (wallet: Wallet) =>
                  Effect.runPromise(walletService.connect(wallet)),
                switchChain: (wallet: Wallet, chainId: ChainId) =>
                  Effect.runPromise(walletService.switchChain(wallet, chainId)),
                disconnect: (wallet: Wallet) =>
                  Effect.runPromise(walletService.disconnect(wallet)),
              }));
            })
          )
        );

        const connectionFiber = yield* Effect.fork(
          Stream.runForEach(walletService.connection, (connection) =>
            Effect.sync(() => {
              setState((prev) => ({
                ...prev,
                connections: connection,
                connect: (wallet: Wallet) =>
                  Effect.runPromise(walletService.connect(wallet)),
                switchChain: (wallet: Wallet, chainId: ChainId) =>
                  Effect.runPromise(walletService.switchChain(wallet, chainId)),
                disconnect: (wallet: Wallet) =>
                  Effect.runPromise(walletService.disconnect(wallet)),
              }));
            })
          )
        );

        yield* Effect.all([walletsFiber, connectionFiber], {
          concurrency: "unbounded",
        });
      })
    );
  }, []);

  return (
    <WalletProviderContext.Provider value={state}>
      {children}
    </WalletProviderContext.Provider>
  );
};
