import { Chain, VaultBase, getPublicKey } from "@vultisig/sdk";
import { Psbt, Transaction } from "bitcoinjs-lib";
import { Buffer } from "buffer";
import { BCH, BTC, DOGE, LTC, Network, TxResult, signers } from "rujira.js";
import { UtxoQueryClient, UtxoSignerContext } from "../utxo";
import { WalletCore } from "./common";
import { secp256k1SignatureFromDer } from "./signature";

type Deposit = Exclude<TxResult["deposited"], null>;

export class Utxo implements UtxoSignerContext {
  constructor(
    private vault: VaultBase,
    private walletCore: WalletCore,
    private network: Network,
    private address: string
  ) {}

  fetchUtxos(): Promise<signers.utxo.Utxo[]> {
    return new UtxoQueryClient(this.network, this.address).fetch();
  }

  async sign(psbt: Psbt): Promise<Psbt> {
    await psbt.signAllInputsAsync({
      publicKey: this.publicKey(),
      sign: async (hash) => {
        const signature = await this.vault.signBytes({
          data: Buffer.from(hash).toString("hex"),
          chain: this.chain(),
        });
        return secp256k1SignatureFromDer(signature.signature);
      },
    });
    psbt.finalizeAllInputs();
    return psbt;
  }

  async broadcast(
    address: string,
    tx: Transaction,
    deposit?: Deposit
  ): Promise<TxResult> {
    const txHash = await this.vault.broadcastRawTx({
      chain: this.chain(),
      rawTx: tx.toHex(),
    });

    return {
      network: this.network,
      address,
      txHash,
      deposited: deposit || null,
    };
  }

  private publicKey(): Uint8Array {
    return getPublicKey({
      chain: this.chain(),
      walletCore: this.walletCore,
      hexChainCode: this.vault.hexChainCode,
      publicKeys: this.vault.publicKeys,
    }).data();
  }

  private chain(): Chain {
    return utxoChain(this.network);
  }
}

export const utxoChain = (network: Network): Chain => {
  switch (network) {
    case BTC:
      return Chain.Bitcoin;
    case BCH:
      return Chain.BitcoinCash;
    case DOGE:
      return Chain.Dogecoin;
    case LTC:
      return Chain.Litecoin;
    default:
      throw new Error(`Unsupported Vultisig UTXO network: ${network}`);
  }
};
