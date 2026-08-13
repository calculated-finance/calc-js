import type { Chain, ChainId } from "@template/domain/chains";
import { TransactionData, Wallet, WalletService } from "@template/domain/clients";
import { Effect, Fiber, Stream } from "effect";
import React, { useEffect } from "react";
import { useWalletRuntime } from "../../hooks/use-runtime";

interface WalletProviderProps {
  children: React.ReactNode;
}

interface WalletProviderState {
  wallets: Wallet[];
  connect: (wallet: Wallet) => Promise<void>;
  switchChain: (wallet: Wallet, chainId: ChainId) => Promise<void>;
  disconnect: (wallet: Wallet) => Promise<void>;
  simulateTransaction: (wallet: Wallet, chain: Chain, data: TransactionData) => Promise<number>;
  signTransaction: (wallet: Wallet, chain: Chain, data: TransactionData) => Promise<void>;
}

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
  const runtime = useWalletRuntime();

  useEffect(() => {
    const fiber = runtime.runFork(
      Effect.gen(function* () {
        const walletService = yield* WalletService;

        yield* Stream.runForEach(walletService.wallets, (wallets) =>
          Effect.sync(() => {
            setState(() => ({
              wallets,
              connect: (wallet: Wallet) => Effect.runPromise(Effect.asVoid(walletService.connect(wallet))),
              switchChain: (wallet: Wallet, chainId: ChainId) =>
                Effect.runPromise(Effect.asVoid(walletService.switchChain(wallet, chainId))),
              disconnect: (wallet: Wallet) => Effect.runPromise(Effect.asVoid(walletService.disconnect(wallet))),
              simulateTransaction: (wallet: Wallet, chain: Chain, data: TransactionData) =>
                Effect.runPromise(walletService.simulateTransaction(wallet, chain, data).pipe(Effect.scoped)),
              signTransaction: (wallet: Wallet, chain: Chain, data: TransactionData) =>
                Effect.runPromise(walletService.signTransaction(wallet, chain, data).pipe(Effect.asVoid, Effect.scoped)),
            }));
          }),
        );
      }).pipe(
        Effect.tapErrorCause((cause) => Effect.logError("wallet stream failed", cause)),
      ),
    );

    return () => {
      void Effect.runFork(Fiber.interrupt(fiber));
    };
  }, [runtime]);

  return <WalletProviderContext.Provider value={state}>{children}</WalletProviderContext.Provider>;
};
