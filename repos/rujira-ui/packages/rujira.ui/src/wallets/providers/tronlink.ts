import {
  Address,
  Msg,
  Network,
  Signer,
  Simulation,
  TRON,
  type TronTx,
  TxResult,
} from "rujira.js";
import { TronWeb } from "tronweb";

export interface TronLink {
  request: (v: { method: string }) => Promise<any>;
  tronWeb: TronWeb;
  isTronLink?: boolean;
}

declare global {
  interface Window {
    tronLink?: TronLink;
  }
}
export type TronlinkContext = TronLink;
export type SignedTronTx = TronTx & { signature: string[] };

const BANDWIDTH_PRICE_SUN_PER_BYTE = 1;

export interface TronContext {
  tronWeb: TronWeb;
  getBandwidth(address: string): Promise<number>;
  sign(tx: TronTx): Promise<SignedTronTx>;
  broadcast(tx: SignedTronTx): Promise<{ txid: string }>;
}

export class Tronlink implements Signer {
  private tron: () => TronLink | undefined;

  constructor(tron: () => TronLink | undefined) {
    this.tron = tron;
  }
  async connect(): Promise<Address[]> {
    const t = this.tron();
    if (!t) throw new Error(`TronLink not found`);
    await t.request({ method: "tron_requestAccounts" });
    if (!t.tronWeb.defaultAddress.base58)
      throw new Error(`No account found on TronLink`);
    return [{ address: t.tronWeb.defaultAddress.base58, networks: [TRON] }];
  }
  async simulate(msg: Msg): Promise<Simulation> {
    return simulate(this.context(), msg);
  }
  async signAndBroadcast(_simulation: Simulation, msg: Msg): Promise<TxResult> {
    return signAndBroadcast(this.context(), msg);
  }
  onChange?: ((cb: () => void) => void) | undefined;
  isAvailable() {
    const tron = this.tron();
    return !!tron?.isTronLink;
  }
  public networks(): Network[] {
    return [TRON];
  }

  private context(): TronContext {
    const t = this.tron();
    if (!t) throw new Error(`TronLink not found`);

    return {
      tronWeb: t.tronWeb,
      getBandwidth: (address) => t.tronWeb.trx.getBandwidth(address),
      sign: (tx) => t.tronWeb.trx.sign(tx),
      broadcast: (tx) => t.tronWeb.trx.sendRawTransaction(tx),
    };
  }
}

export const simulate = async (
  context: TronContext,
  msg: Msg
): Promise<Simulation> => {
  const tx = await msg.toTronTx(context.tronWeb);
  const txSizeBytes = JSON.stringify(tx).length;
  const bandwidth = await context.getBandwidth(msg.account.address);

  const bandwidthRequired = Math.max(0, txSizeBytes - bandwidth);
  const bwCostSun = bandwidthRequired * BANDWIDTH_PRICE_SUN_PER_BYTE;

  return {
    symbol: "TRX",
    decimals: 6,
    amount: BigInt(bwCostSun),
    gas: BigInt(bwCostSun),
  };
};

export const signAndBroadcast = async (
  context: TronContext,
  msg: Msg
): Promise<TxResult> => {
  const tx = await msg.toTronTx(context.tronWeb);
  const signed = await context.sign(tx);
  const res = await context.broadcast(signed);
  return {
    network: TRON,
    address: msg.account.address,
    txHash: res.txid,
    deposited: msg.toDeposit?.() || null,
  };
};

export default new Tronlink(() => window.tronLink);
