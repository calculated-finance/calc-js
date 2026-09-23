import { ChainInfo } from "@keplr-wallet/types";
import { Eip1193Provider } from "ethers";
import {
  Address,
  Msg,
  Network,
  Signer,
  Simulation,
  THOR,
  TxResult,
  signers,
} from "rujira.js";

import * as thor from "../config/thor";
import { buildClient, simulate } from "./cosmos";

interface Provider extends Eip1193Provider {
  on?: (event: string, cb: () => void) => any;
}

export class Eip712Adapter implements Signer {
  private chainInfo: ChainInfo = thor.main;
  constructor(private e: () => Provider | undefined) {}

  async connect(): Promise<Address[]> {
    const e = this.e();
    if (!e) throw new Error(``);
    const prefix = this.chainInfo.bech32Config?.bech32PrefixAccAddr;
    if (!prefix)
      throw new Error(
        `No bech32 prefix provided for ${this.chainInfo.chainId}`
      );
    const signer = new signers.cosmos.Eip712Signer(
      e,
      prefix,
      this.chainInfo.rpc
    );
    const accounts = await signer.getAccounts();
    return accounts.map((a) => ({
      address: a.address,
      networks: this.networks(),
    }));
  }

  async simulate(msg: Msg): Promise<Simulation> {
    await this.e()?.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x1" }],
    });
    const client = await this.buildClient();
    return simulate(client, msg);
  }
  async signAndBroadcast(_simulation: Simulation, msg: Msg): Promise<TxResult> {
    const encoded = await msg.toCosmosTx();
    const client = await this.buildClient();
    const res = await client.signAndBroadcast(
      msg.account.address,
      encoded.msgs,
      "auto",
      encoded.memo
    );
    signers.cosmos.assertIsDeliverTxSuccess(res);
    return {
      network: msg.account.network,
      address: msg.account.address,
      txHash: res.transactionHash,
      deposited: msg.toDeposit?.() || null,
    };
  }

  public async buildClient(): Promise<signers.cosmos.CosmosClient> {
    const prefix = this.chainInfo.bech32Config?.bech32PrefixAccAddr;
    if (!prefix)
      throw new Error(
        `No bech32 prefix provided for ${this.chainInfo.chainId}`
      );
    const e = this.e();
    if (!e) throw new Error(`No EVM provider found`);
    const signer = new signers.cosmos.Eip712Signer(
      e,
      prefix,
      this.chainInfo.rpc
    );
    return buildClient(this.chainInfo, signer);
  }

  onChange?: ((cb: () => void) => void) | undefined;
  isAvailable() {
    return true;
  }
  disconnect?: (() => void) | undefined;
  public networks(): Network[] {
    return [THOR];
  }
}
