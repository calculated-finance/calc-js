import { Keplr, Window as KeplrWindow } from "@keplr-wallet/types";
import { Psbt } from "bitcoinjs-lib";
import {
  Address,
  BTC,
  Msg,
  Network,
  Signer,
  Simulation,
  TxResult,
} from "rujira.js";
import { CosmosAdapter } from "./cosmos";
import { Eip6963Adapter } from "./eip6963";
import { walletType } from "./utils";
import * as utxo from "./utxo";
import { UtxoContext } from "./utxo";

declare global {
  interface Window extends KeplrWindow {}
}

export class KeplrAdapter implements Signer {
  private c: CosmosAdapter;
  constructor(
    private e: Eip6963Adapter,
    k: () => Keplr | undefined
  ) {
    this.c = new CosmosAdapter(k);
  }
  onChange = (cb: () => void) => {
    window.addEventListener("keplr_keystorechange", cb);
    this.e.onChange(cb);
  };

  isAvailable(): boolean {
    return this.c.isAvailable();
  }

  public async connect(): Promise<Address[]> {
    return Promise.allSettled([
      this.c.connect(),
      this.e.connect(),
      this.getBitcoinAccounts(),
    ]).then((x) =>
      x.reduce(
        (a: Address[], v) =>
          v.status === "fulfilled" ? [...v.value, ...a] : a,
        []
      )
    );
  }

  async getBitcoinAccounts(): Promise<Address[]> {
    const k = window.keplr?.bitcoin;
    if (!k) throw new Error("No Keplr Bitcoin provider");
    return k
      .connectWallet()
      .then((addrs) => addrs.map((address) => ({ address, networks: [BTC] })));
  }

  public async simulate(msg: Msg): Promise<Simulation> {
    const type = walletType(msg.account);
    switch (type) {
      case "cosmos":
        return this.c.simulate(msg);
      case "evm":
        return this.e.simulate(msg);
      case "sol":
      case "ton":
      case "xrp":
      case "tron":
        throw new Error(`${type} not supported by Keplr Wallet`);

      default:
        return utxo.simulate(new UtxoContext(msg.account.address), msg);
    }
  }

  public async signAndBroadcast(
    simulation: Simulation,
    msg: Msg
  ): Promise<TxResult> {
    const type = walletType(msg.account);
    switch (type) {
      case "cosmos":
        return this.c.signAndBroadcast(simulation, msg);
      case "evm":
        return this.e.signAndBroadcast(simulation, msg);
      case "sol":
      case "ton":
      case "xrp":
      case "tron":
        throw new Error(`${type} not supported by Keplr Wallet`);
      default:
        return utxo.signAndBroadcast(
          new UtxoContext(msg.account.address, async (psbt) => {
            const res = await window.keplr.bitcoin.signPsbt(psbt.toHex(), {
              autoFinalized: true,
            });
            return Psbt.fromHex(res);
          }),
          msg
        );
    }
  }
  public networks(): Network[] {
    return [BTC, ...this.c.networks(), ...this.e.networks()];
  }
}

// Construction reads `window.*` so it must be gated for SSR (Next.js, Remix, etc.).
// The provider is never consumed on the server, so casting the null branch is safe.
const provider: KeplrAdapter =
  typeof window === "undefined"
    ? (null as unknown as KeplrAdapter)
    : new KeplrAdapter(new Eip6963Adapter("app.keplr"), () => window.keplr);

export default provider;
