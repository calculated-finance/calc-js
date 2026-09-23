import { Socket } from "@effect/platform";
import { CalcService } from "@template/domain/calc";
import { WalletService } from "@template/domain/clients";
import { RujiraIndexer, RujiraIndexerEndpoints } from "@template/domain/indexer";
import { Effect, Layer, ManagedRuntime } from "effect";
import React, { createContext } from "react";

export interface AppRuntimes {
  /** Chain-query services (CalcService and its CosmWasm clients). */
  calc: ManagedRuntime.ManagedRuntime<CalcService, unknown>;
  /** Wallet discovery/connection services. */
  wallet: ManagedRuntime.ManagedRuntime<WalletService, unknown>;
  /** Rujira indexer client (GraphQL queries + subscriptions). */
  indexer: ManagedRuntime.ManagedRuntime<RujiraIndexer, unknown>;
}

const memoMap = Effect.runSync(Layer.makeMemoMap);

/**
 * The indexer's CORS whitelist doesn't include our origins, so the browser
 * reaches it through the dev/preview server's same-origin /rujira proxy
 * (see vite.config.ts). Whatever serves the built client must provide the
 * same route.
 */
const indexerEndpoints = Layer.succeed(RujiraIndexerEndpoints, {
  apiUrl: "/rujira/api/graphql",
  socketUrl: `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/rujira/socket/websocket?vsn=2.0.0`,
});

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
  indexer: ManagedRuntime.make(
    RujiraIndexer.Default.pipe(Layer.provide(Socket.layerWebSocketConstructorGlobal), Layer.provide(indexerEndpoints)),
    memoMap,
  ),
};

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    void runtimes.calc.dispose();
    void runtimes.wallet.dispose();
    void runtimes.indexer.dispose();
  });
}

export const RuntimeContext = createContext<AppRuntimes>(runtimes);

export const RuntimeProvider = ({ children }: { children: React.ReactNode }) => {
  return <RuntimeContext.Provider value={runtimes}>{children}</RuntimeContext.Provider>;
};
