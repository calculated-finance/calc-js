import TonConnect, {
  isWalletInfoCurrentlyEmbedded,
  isWalletInfoCurrentlyInjected,
  isWalletInfoRemote,
  Wallet,
} from "@tonconnect/sdk";
import {
  Address,
  Msg,
  Network,
  Signer,
  Simulation,
  TON,
  TxResult,
} from "rujira.js";
import { Address as TonAddress } from "ton-core";

class TonKeeper implements Signer {
  private _connector: TonConnect | undefined;
  private get connector(): TonConnect {
    if (!this._connector) {
      this._connector = new TonConnect({
        manifestUrl: `https://next.rujira.network/tonconnect-manifest.json`,
      });
    }
    return this._connector;
  }
  constructor() {}

  async connect(): Promise<Address[]> {
    const wallets = await this.connector.getWallets();
    const tonkeeper = wallets.find((a) => a.appName === "tonkeeper");
    if (!tonkeeper) throw new Error(`Tonkeeper not detected`);

    return new Promise<Wallet | null>((resolve, reject) => {
      this.connector.onStatusChange(resolve, reject);
      if (
        isWalletInfoCurrentlyEmbedded(tonkeeper) ||
        isWalletInfoCurrentlyInjected(tonkeeper)
      ) {
        this.connector.connect({ jsBridgeKey: tonkeeper.jsBridgeKey });
        return;
      }
      if (isWalletInfoRemote(tonkeeper)) {
        const url = this.connector.connect({
          universalLink: tonkeeper.universalLink,
          bridgeUrl: tonkeeper.bridgeUrl,
        });
        open(url);
        return;
      }
    }).then((wallet) => {
      return wallet
        ? [
            {
              address: TonAddress.parse(wallet.account.address).toString({
                bounceable: false,
              }),
              networks: [TON],
            },
          ]
        : [];
    });
  }
  simulate(_tx: Msg): Promise<Simulation> {
    throw new Error("Method not implemented.");
  }
  signAndBroadcast(_simulation: Simulation, _tx: Msg): Promise<TxResult> {
    throw new Error("Method not implemented.");
  }
  onChange?: ((cb: () => void) => void) | undefined;
  isAvailable(): boolean {
    return true;
  }
  disconnect() {
    this.connector.disconnect();
  }
  public networks(): Network[] {
    return [TON];
  }
}

export default new TonKeeper();
