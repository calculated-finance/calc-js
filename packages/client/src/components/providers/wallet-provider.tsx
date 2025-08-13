import type { Chain, ChainId } from "@template/domain/src/chains";
import { TransactionData, Wallet, WalletService } from "@template/domain/src/clients/index";
import { Effect, ManagedRuntime, Stream } from "effect";
import React, { useEffect } from "react";
import { useMemoMap } from "../../hooks/use-memo-map";

type WalletProviderProps = {
  children: React.ReactNode;
};

type WalletProviderState = {
  wallets: Array<Wallet>;
  connect: (wallet: Wallet) => Promise<void>;
  switchChain: (wallet: Wallet, chainId: ChainId) => Promise<void>;
  disconnect: (wallet: Wallet) => void;
  simulateTransaction: (wallet: Wallet, chain: Chain, data: TransactionData) => Promise<number>;
  signTransaction: (wallet: Wallet, chain: Chain, data: TransactionData) => Promise<void>;
};

const initialState: WalletProviderState = {
  wallets: [],
  connect: () => {
    throw new Error("Connect function not provided yet");
  },
  switchChain: () => {
    throw new Error("Switch chain function not provided yet");
  },
  disconnect: () => {
    throw new Error("Disconnect function not provided yet");
  },
  simulateTransaction: () => {
    throw new Error("Simulate transaction function not provided yet");
  },
  signTransaction: () => {
    throw new Error("Sign transaction function not provided yet");
  },
};

export const WalletProviderContext = React.createContext<WalletProviderState>(initialState);

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [state, setState] = React.useState<WalletProviderState>(initialState);
  const { memoMap } = useMemoMap();

  useEffect(() => {
    ManagedRuntime.make(WalletService.Default, memoMap).runFork(
      Effect.gen(function* () {
        const walletService = yield* WalletService;

        const walletsFiber = yield* Effect.fork(
          Stream.runForEach(walletService.wallets, (wallets) =>
            Effect.sync(() => {
              setState(() => ({
                wallets,
                connect: (wallet: Wallet) => Effect.runPromise(walletService.connect(wallet)),
                switchChain: (wallet: Wallet, chainId: ChainId) =>
                  Effect.runPromise(walletService.switchChain(wallet, chainId)),
                disconnect: (wallet: Wallet) => Effect.runPromise(walletService.disconnect(wallet)),
                simulateTransaction: (wallet: Wallet, chain: Chain, data: TransactionData) =>
                  Effect.runPromise(walletService.simulateTransaction(wallet, chain, data).pipe(Effect.scoped)),
                signTransaction: (wallet: Wallet, chain: Chain, data: TransactionData) =>
                  Effect.runPromise(walletService.signTransaction(wallet, chain, data).pipe(Effect.scoped)),
              }));
            }),
          ),
        );

        yield* Effect.all([walletsFiber], {
          concurrency: "unbounded",
        });
      }),
    );
  }, []);

  return <WalletProviderContext.Provider value={state}>{children}</WalletProviderContext.Provider>;
};
