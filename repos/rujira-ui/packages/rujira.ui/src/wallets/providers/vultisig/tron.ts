import { Chain, VaultBase } from "@vultisig/sdk";
import { TronTx } from "rujira.js";
import { TronWeb } from "tronweb";
import { SignedTronTx, TronContext } from "../tronlink";
import { toRawSignature } from "./signature";

const tronRpcUrl = "https://tron-rpc.publicnode.com";

export class Tron implements TronContext {
  public tronWeb = new TronWeb({ fullHost: tronRpcUrl });

  constructor(private vault: VaultBase) {}

  getBandwidth(address: string): Promise<number> {
    return this.tronWeb.trx.getBandwidth(address);
  }

  async sign(tx: TronTx): Promise<SignedTronTx> {
    const signature = await this.vault.signBytes({
      data: tx.txID,
      chain: Chain.Tron,
    });

    return {
      ...tx,
      signature: [
        ...((tx as Partial<SignedTronTx>).signature || []),
        toRawSignature(signature),
      ],
    };
  }

  broadcast(tx: SignedTronTx): Promise<{ txid: string }> {
    return this.tronWeb.trx.sendRawTransaction(tx);
  }
}
