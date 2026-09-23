import { fromBech32 } from "@cosmjs/encoding";
import { Chain, type VaultBase, Vultisig } from "@vultisig/sdk";
import { JsonRpcProvider } from "ethers";
import {
  Account,
  Address,
  AVAX,
  BASE,
  BCH,
  BSC,
  BTC,
  DOGE,
  ETH,
  GAIA,
  LTC,
  Msg,
  Network,
  Signer,
  signers,
  Simulation,
  SOL,
  THOR,
  TON,
  TRON,
  TxResult,
  XRP,
} from "rujira.js";
import * as cosmos from "./cosmos";
import * as evm from "./eip1193";
import * as tron from "./tronlink";
import { walletType } from "./utils";
import * as utxo from "./utxo";
import { Cosmos } from "./vultisig/cosmos";
import { Evm } from "./vultisig/evm";
import * as native from "./vultisig/native";
import * as sol from "./vultisig/sol";
import { Sol } from "./vultisig/sol";
import * as ton from "./vultisig/ton";
import { Ton } from "./vultisig/ton";
import { Tron } from "./vultisig/tron";
import { Utxo } from "./vultisig/utxo";
import * as xrp from "./vultisig/xrp";
import { Xrp } from "./vultisig/xrp";
declare global {
  interface Window {
    vultisigSdk?: Vultisig;
  }
}

const CHAINS: Record<string, Network> = {
  [Chain.Avalanche]: AVAX,
  [Chain.BSC]: BSC,
  [Chain.Base]: BASE,
  [Chain.Bitcoin]: BTC,
  [Chain.BitcoinCash]: BCH,
  [Chain.Cosmos]: GAIA,
  [Chain.Dogecoin]: DOGE,
  [Chain.Ethereum]: ETH,
  [Chain.Litecoin]: LTC,
  [Chain.Solana]: SOL,
  [Chain.THORChain]: THOR,
  [Chain.Ton]: TON,
  [Chain.Tron]: TRON,
  [Chain.Ripple]: XRP,
};

class Vulticonnect implements Signer {
  private vaults: Record<string, string> = {};
  constructor(public sdk: () => Vultisig | undefined) {}
  async connect(): Promise<Address[]> {
    const vaults = (await this.sdk()?.listVaults()) || [];
    const addresses: Address[][] = await Promise.all(
      vaults.map(async (x) => {
        const addresses = await x.addresses();

        this.vaults = Object.values(addresses).reduce(
          (a, v) => ({ ...a, [v]: x.id }),
          this.vaults
        );
        const agg = Object.entries(addresses).reduce(
          (a: Record<string, Network[]>, v) => {
            const key = v[1];
            const current = a[key] || [];
            const network = CHAINS[v[0]];
            return network ? { ...a, [key]: [network, ...current] } : a;
          },
          {}
        );
        return Object.entries(agg).map(([address, networks]) => ({
          address,
          networks,
        }));
      })
    );

    return addresses.flat();
  }
  chains(): Record<string, Network> {
    return CHAINS;
  }
  async simulate(msg: Msg): Promise<Simulation> {
    const type = walletType(msg.account);
    switch (type) {
      case "cosmos":
        const client = await this.cosmosClient(msg);
        return cosmos.simulate(client, msg);
      case "evm":
        const signer = await this.evmSigner(msg);
        return evm.simulate(signer, msg);
      case "sol":
        return native.simulate(await this.solSigner(msg), msg);
      case "ton":
        return native.simulate(await this.tonSigner(msg), msg);
      case "xrp":
        return native.simulate(await this.xrpSigner(msg), msg);
      case "tron":
        return tron.simulate(await this.tronSigner(msg), msg);
      default:
        return utxo.simulate(await this.utxoSigner(msg, type[1]), msg);
    }
  }
  async signAndBroadcast(simulation: Simulation, msg: Msg): Promise<TxResult> {
    const type = walletType(msg.account);
    switch (type) {
      case "cosmos":
        const client = await this.cosmosClient(msg);
        return cosmos.signAndBroadcast(client, msg);
      case "evm":
        const signer = await this.evmSigner(msg);
        return evm.signAndBroadcast(signer, simulation, msg);
      case "sol":
        return sol.signAndBroadcast(await this.solSigner(msg), msg);
      case "ton":
        return ton.signAndBroadcast(await this.tonSigner(msg), msg);
      case "xrp":
        return xrp.signAndBroadcast(await this.xrpSigner(msg), msg);
      case "tron":
        return tron.signAndBroadcast(await this.tronSigner(msg), msg);

      default:
        return utxo.signAndBroadcast(await this.utxoSigner(msg, type[1]), msg);
    }
  }

  async cosmosClient(msg: Msg): Promise<signers.cosmos.CosmosClient> {
    const vault = await this.vault(msg.account);
    const walletCore = await this.sdk()?.wasmProvider.getWalletCore();
    const signer = new Cosmos(vault, walletCore);
    const config = cosmos.getConfig(fromBech32(msg.account.address).prefix);
    return cosmos.buildClient(config, signer);
  }

  async evmSigner(msg: Msg): Promise<Evm> {
    const chains: Partial<Record<Network, { url: string; chain: Chain }>> = {
      [ETH]: { url: "https://api.vultisig.com/eth/", chain: Chain.Ethereum },
      [BASE]: { url: "https://api.vultisig.com/base/", chain: Chain.Base },
      [BSC]: { url: "https://api.vultisig.com/bsc/", chain: Chain.BSC },
      [AVAX]: {
        url: "https://api.vultisig.com/avax/",
        chain: Chain.Avalanche,
      },
    };
    const config = chains[msg.account.network];
    if (!config) {
      throw new Error(`No Vultisig EVM RPC for ${msg.account.network}`);
    }

    const vault = await this.vault(msg.account);

    return new Evm(
      new JsonRpcProvider(config.url),
      vault,
      msg.account.address,
      config.chain
    );
  }

  async tronSigner(msg: Msg): Promise<Tron> {
    return new Tron(await this.vault(msg.account));
  }

  async tonSigner(msg: Msg): Promise<Ton> {
    return new Ton(await this.vault(msg.account));
  }

  async xrpSigner(msg: Msg): Promise<Xrp> {
    return new Xrp(await this.vault(msg.account));
  }

  async solSigner(msg: Msg): Promise<Sol> {
    return new Sol(await this.vault(msg.account));
  }

  async utxoSigner(msg: Msg, network: Network): Promise<Utxo> {
    const vault = await this.vault(msg.account);
    const walletCore = await this.sdk()?.wasmProvider.getWalletCore();
    return new Utxo(vault, walletCore, network, msg.account.address);
  }

  private async vault(account: Account): Promise<VaultBase> {
    const vault = await this.sdk()?.getVaultById(this.vaults[account.address]);
    if (!vault) throw new Error(`No vault found for ${account.address}`);
    return vault;
  }

  onChange?: ((cb: () => void) => void) | undefined;
  isAvailable(): boolean {
    return true;
  }
  disconnect?: (() => void) | undefined;

  networks(): Network[] {
    return [
      AVAX,
      BASE,
      BCH,
      BSC,
      BTC,
      DOGE,
      ETH,
      GAIA,
      LTC,
      SOL,
      THOR,
      TON,
      TRON,
      XRP,
    ];
  }
}

export default new Vulticonnect(() => window.vultisigSdk);
