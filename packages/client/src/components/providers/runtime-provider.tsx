import { CalcService } from "@template/domain/calc";
import { WalletService } from "@template/domain/clients";
import { Effect, Layer, ManagedRuntime } from "effect";
import React, { createContext } from "react";

export interface AppRuntimes {
  /** Chain-query services (CalcService and its CosmWasm clients). */
  calc: ManagedRuntime.ManagedRuntime<CalcService, unknown>;
  /** Wallet discovery/connection services. */
  wallet: ManagedRuntime.ManagedRuntime<WalletService, unknown>;
}

const memoMap = Effect.runSync(Layer.makeMemoMap);

/**
 * App-lifetime runtimes, created once at module scope. Deliberately NOT tied
 * to component lifecycle: StrictMode's probe unmount would dispose a
 * component-owned runtime and the remount would then hang on the dead
 * instance. Calc and wallet stay separate runtimes because CalcService's
 * layer connects to chain RPCs at build time and the wallet stream must not
 * wait behind that; the shared memoMap dedupes common layers.
 */
const runtimes: AppRuntimes = {
  calc: ManagedRuntime.make(CalcService.Default, memoMap),
  wallet: ManagedRuntime.make(WalletService.Default, memoMap),
};

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    void runtimes.calc.dispose();
    void runtimes.wallet.dispose();
  });
}

export const RuntimeContext = createContext<AppRuntimes>(runtimes);

export const RuntimeProvider = ({ children }: { children: React.ReactNode }) => {
  return <RuntimeContext.Provider value={runtimes}>{children}</RuntimeContext.Provider>;
};
