import { CalcService } from "@template/domain/calc";
import { WalletService } from "@template/domain/clients";
import { Layer, ManagedRuntime } from "effect";
import React, { createContext, useEffect, useMemo } from "react";

const appLayer = Layer.mergeAll(CalcService.Default, WalletService.Default);

const makeAppRuntime = () => ManagedRuntime.make(appLayer);

export type AppRuntime = ReturnType<typeof makeAppRuntime>;

export const RuntimeContext = createContext<AppRuntime | null>(null);

/**
 * Owns the single Effect runtime for the app. Every hook that runs domain
 * services goes through this runtime (via useRuntime), so services are built
 * once, shared everywhere, and disposed when the provider unmounts.
 */
export const RuntimeProvider = ({ children }: { children: React.ReactNode }) => {
  const runtime = useMemo(() => makeAppRuntime(), []);

  useEffect(
    () => () => {
      void runtime.dispose();
    },
    [runtime],
  );

  return <RuntimeContext.Provider value={runtime}>{children}</RuntimeContext.Provider>;
};
