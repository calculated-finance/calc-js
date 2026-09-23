import { Keplr, Window as KeplrWindow } from "@keplr-wallet/types";
import { Psbt } from "bitcoinjs-lib";
import { Eip1193Provider } from "ethers";
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

interface BitcoinProvider {
  connect: () => Promise<{ address: string; publicKey: string }>;
  signPsbt: (
    psbtHex: string,
    options?: { autofinalized?: boolean }
  ) => Promise<string>;
}

declare global {
  interface Window extends KeplrWindow {
    okxwallet?: Eip1193Provider & {
      bitcoin: BitcoinProvider;
      keplr: Keplr & { isOkWallet: true };
    };
  }
}

export class OkxAdapter implements Signer {
  constructor(
    private e: Eip6963Adapter,
    private c: CosmosAdapter,
    private b?: BitcoinProvider
  ) {}
  connect(): Promise<Address[]> {
    if (!this.b) throw new Error("Okx extension not found");
    const accs = this.b
      .connect()
      .then((res) => ({ address: res.address, networks: [BTC] }));

    return Promise.all([this.e.connect(), this.c.connect(), accs]).then((x) =>
      x.flat()
    );
  }
  async simulate(msg: Msg): Promise<Simulation> {
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
        throw new Error(`${type} not supported by CTRL Wallet`);

      default:
        return utxo.simulate(new UtxoContext(msg.account.address), msg);
    }
  }
  async signAndBroadcast(simulation: Simulation, msg: Msg): Promise<TxResult> {
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
        throw new Error(`${type} not supported by CTRL Wallet`);

      default:
        if (!this.b) throw new Error("Okx extension not found");
        return utxo.signAndBroadcast(
          new UtxoContext(msg.account.address, async (psbt) => {
            const res = await this.b?.signPsbt(psbt.toHex(), {
              autofinalized: true,
            });
            if (!res) throw new Error("Okx extension not found");
            return Psbt.fromHex(res);
          }),
          msg
        );
    }
  }
  onChange?: ((cb: () => void) => void) | undefined;
  isAvailable() {
    return this.e.isAvailable();
  }

  public networks(): Network[] {
    return [BTC, ...this.c.networks(), ...this.e.networks()];
  }
}

// Construction reads `window.*` so it must be gated for SSR.
const provider: OkxAdapter =
  typeof window === "undefined"
    ? (null as unknown as OkxAdapter)
    : new OkxAdapter(
        new Eip6963Adapter("com.okex.wallet"),
        new CosmosAdapter(() => window.okxwallet?.keplr),
        window.okxwallet?.bitcoin
      );

export default provider;
