import { Keplr } from "@keplr-wallet/types";
import { Eip6963Adapter } from "./eip6963";
import { KeplrAdapter } from "./keplr";

declare global {
  interface Window {
    station?: { keplr: Keplr };
  }
}

// Construction reads `window.*` so it must be gated for SSR.
const provider: KeplrAdapter =
  typeof window === "undefined"
    ? (null as unknown as KeplrAdapter)
    : new KeplrAdapter(
        new Eip6963Adapter("station"),
        () => window.station?.keplr
      );

export default provider;
