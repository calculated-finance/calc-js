import { Keplr, Window as KeplrWindow } from "@keplr-wallet/types";
import { Buffer } from "buffer";
import { Eip1193Provider } from "ethers";
import {
  Address,
  BCH,
  BTC,
  DOGE,
  gasToken,
  LTC,
  Msg,
  Network,
  Signer,
  Simulation,
  TxResult,
  XRP,
} from "rujira.js";
import { CosmosAdapter } from "./cosmos";
import { Eip6963Adapter } from "./eip6963";
import { TronLink, Tronlink } from "./tronlink";
import { walletType } from "./utils";
import { utxoNetworkTochain, UtxoQueryClient } from "./utxo";

export type Callback = (
  error: Error | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result?: any // https://github.com/vultisig/vultisig-windows/blob/baeb3e8099a0003404f9664c43b0183c26029041/clients/extension/src/utils/interfaces.ts#L11
) => void;

export type VulticonnectProvider = {
  request(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request: { method: string; params?: Array<any> | Record<string, any> },
    callback?: Callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any>;
};

declare global {
  export type VultisigWindow = {
    ethereum: Eip1193Provider;
    bitcoin: VulticonnectProvider;
    bitcoincash: VulticonnectProvider;
    dogecoin: VulticonnectProvider;
    litecoin: VulticonnectProvider;
    ripple: VulticonnectProvider;
    cosmos: VulticonnectProvider;
    thorchain: VulticonnectProvider;
    // ton: VultisigProvider;
    tron: TronLink;
    keplr: Keplr;
  };
  interface Window extends KeplrWindow {
    vultisig?: VultisigWindow;
  }
}

export class VulticonnectAdapter implements Signer {
  constructor(
    private e: Eip6963Adapter,
    private c: CosmosAdapter,
    private t: Tronlink
  ) {}
  async connect(): Promise<Address[]> {
    const vs = await this.vultisig();
    //changed this to Promise.allSettled to prevent a fail on 1 or more chains blocking other
    //connections from succeeding.
    const results = await Promise.allSettled([
      this.c.connect(),
      this.connectTo(vs.ripple, XRP),
      this.connectTo(vs.bitcoin, BTC),
      this.connectTo(vs.bitcoincash, BCH),
      this.connectTo(vs.dogecoin, DOGE),
      this.connectTo(vs.litecoin, LTC),
      // this.connectTo(vs.ton),
      // this.connectTo(vs.tron),
      this.t.connect(),
      this.e.connect(),
    ]);
    return results
      .filter((r) => r.status === "fulfilled")
      .flatMap((r) => (r as PromiseFulfilledResult<Address[]>).value);
  }

  async connectTo(
    provider: VulticonnectProvider,
    network: Network
  ): Promise<Address[]> {
    const accounts = await provider.request({
      method: "request_accounts",
    });
    const addresses = Array.isArray(accounts) ? accounts : [accounts];
    return addresses.map((account) => ({
      address: typeof account === "string" ? account : account.address,
      networks: [network],
    }));
  }

  async simulate(msg: Msg): Promise<Simulation> {
    switch (walletType(msg.account)) {
      case "cosmos":
        return this.c.simulate(msg);
      case "evm":
        return this.e.simulate(msg);
      case "tron":
        return this.t.simulate(msg);
      case "sol":
      case "ton":
        throw new Error(`${msg.account.network} not supported by Vulticonnect`);

      case "xrp":
        const inboundAddress = await msg.inboundAddress?.(msg.account.network);

        return {
          symbol: "XRP",
          decimals: 6,
          amount: inboundAddress?.gasRate || 0n,
          gas: inboundAddress?.gasRate || 0n,
        };
      default:
        const utxos = await new UtxoQueryClient(
          msg.account.network,
          msg.account.address
        ).fetch();
        const psbt = await msg.toPsbt(utxos);
        return {
          ...gasToken(msg.account.network),
          amount: psbt.fee,
          gas: 0n,
        };
    }
  }

  async signAndBroadcast(simulation: Simulation, msg: Msg): Promise<TxResult> {
    switch (walletType(msg.account)) {
      case "cosmos":
        return this.c.signAndBroadcast(simulation, msg);
      case "evm":
        return this.e.signAndBroadcast(simulation, msg);
      case "tron":
        return this.t.signAndBroadcast(simulation, msg);
      case "sol":
      case "ton":
        throw new Error(`${msg.account.network} not supported by Vulticonnect`);
      case "xrp":
        const payment = await msg.toXrpPayment();

        if (payment.Memos?.length && payment.Memos.length > 1) {
          throw new Error("Multiple memos not supported");
        }

        const utfo8Memo = payment.Memos?.[0]?.Memo?.MemoData
          ? Buffer.from(payment.Memos?.[0]?.Memo?.MemoData, "hex").toString(
              "utf8"
            )
          : null;

        return {
          network: msg.account.network,
          address: msg.account.address,
          deposited: msg.toDeposit?.() || null,
          txHash: await window?.vultisig?.ripple.request({
            method: "send_transaction",
            params: [
              {
                from: msg.account.address,
                to: payment.Destination,
                value: payment.Amount,
                data: utfo8Memo,
              },
            ],
          }),
        };
      default:
        const key = utxoNetworkTochain(msg.account.network);
        const utxos = await new UtxoQueryClient(
          msg.account.network,
          msg.account.address
        ).fetch();
        const token = gasToken(msg.account.network);
        const { amount, memo, recipient } = await msg.toPsbt(utxos);
        return {
          network: msg.account.network,
          address: msg.account.address,
          deposited: msg.toDeposit?.() || null,
          txHash: await window?.vultisig?.[key].request({
            method: "send_transaction",
            params: [
              {
                asset: {
                  chain: msg.account.network,
                  ticker: token.symbol,
                },
                from: msg.account.address,
                to: recipient,
                amount: { amount: Number(amount), decimals: token.decimals },
                data: memo,
              },
            ],
          }),
        };
    }
  }
  onChange?(cb: () => void) {
    this.e.onChange(cb);
  }
  isAvailable() {
    return this.e.isAvailable();
  }
  async vultisig(attempt = 0): Promise<VultisigWindow> {
    if (attempt >= 5) throw new Error(`Vulticonnect Extension not detected`);
    return (
      window.vultisig ||
      new Promise((resolve) => {
        setTimeout(() => {
          this.vultisig(attempt + 1)
            .then(resolve)
            .catch(resolve);
        }, 100);
      })
    );
  }
  public networks(): Network[] {
    return [
      "BCH",
      "BTC",
      "DOGE",
      "LTC",
      "XRP",
      // "TON",
      "TRON",
      ...this.c.networks(),
      ...this.e.networks(),
    ];
  }
}

export default new VulticonnectAdapter(
  new Eip6963Adapter("me.vultisig"),
  new CosmosAdapter(() => window.vultisig?.keplr),
  new Tronlink(() => window.vultisig?.tron)
);
