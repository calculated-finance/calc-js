import { Keplr, Window as KeplrWindow } from "@keplr-wallet/types";
import { Address, Msg, Network, Signer, Simulation, TxResult } from "rujira.js";
import { CosmosAdapter } from "./cosmos";
import { Eip6963Adapter } from "./eip6963";

declare global {
  interface Window extends KeplrWindow {
    leap: Keplr;
    keplr: Keplr & { aptos: { name: "Leap Wallet" } };
  }
}

export class LeapAdapter implements Signer {
  private c: CosmosAdapter;
  constructor(
    private e: Eip6963Adapter,
    k: () => Keplr | undefined
  ) {
    this.c = new CosmosAdapter(k);
  }
  onChange?: ((cb: () => void) => void) | undefined;
  isAvailable(): boolean {
    return this.c.isAvailable();
  }

  public async connect(): Promise<Address[]> {
    return Promise.allSettled([this.c.connect(), this.e.connect()]).then((x) =>
      x.reduce(
        (a: Address[], v) =>
          v.status === "fulfilled" ? [...v.value, ...a] : a,
        []
      )
    );
  }

  public async simulate(msg: Msg): Promise<Simulation> {
    if (msg.account.address.startsWith("0x")) return this.e.simulate(msg);
    return this.c.simulate(msg);
  }

  public async signAndBroadcast(
    simulation: Simulation,
    msg: Msg
  ): Promise<TxResult> {
    if (msg.account.address.startsWith("0x"))
      return this.e.signAndBroadcast(simulation, msg);
    return this.c.signAndBroadcast(simulation, msg);
  }

  public networks(): Network[] {
    return [...this.c.networks(), ...this.e.networks()];
  }
}

// Construction reads `window.*` so it must be gated for SSR.
const provider: LeapAdapter =
  typeof window === "undefined"
    ? (null as unknown as LeapAdapter)
    : new LeapAdapter(
        new Eip6963Adapter("io.leapwallet.LeapWallet"),
        () => window.leap
      );

export default provider;
