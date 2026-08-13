import { Psbt } from "bitcoinjs-lib";
import { Buffer } from "buffer";
import { getAddress, Interface, TransactionRequest } from "ethers";
import { TronWeb } from "tronweb";
import { Payment as XrpPayment } from "xrpl";
import { Account, InboundAddress } from "../accounts";
import { Asset } from "../asset";
import { QueryClient } from "../signers/cosmos";
import { ThorchainExtension } from "../signers/cosmos/modules/thorchain/queries";
import { EncodeObject } from "../signers/cosmos/proto-signing";
import { MsgSend as CosmosMsgSend } from "../signers/cosmos/types/cosmos/bank/v1beta1/tx";
import { PsbtFactory, Utxo } from "../signers/utxo";
import { ERC20Allowance, Msg, type NativeTransfer, TronTx } from "./msg";

const EVM_NATIVE = "0x0000000000000000000000000000000000000000";

/**
 * MsgSend abstracts layer 1 sends & direct MsgSend on THORChain
 */
export class MsgSend implements Msg {
  protected q?: QueryClient & ThorchainExtension;
  private amount: bigint;

  constructor(
    public account: Account,
    protected asset: Asset,
    amount: bigint,
    protected recipient: string,
    protected memo: string = ""
  ) {
    // Adjust the 8dp input to the decimals of the source asset
    this.amount =
      (amount * 10n ** BigInt(asset?.metadata.decimals || 0)) / 10n ** 8n;
  }

  withQueryClient(q: QueryClient & ThorchainExtension): void {
    this.q = q;
  }

  public inboundAddress(): Promise<InboundAddress> {
    if (!this.q) throw new Error(`QueryClient required for MsgSend`);
    return this.q.thorchain.getInboundAddress(this.asset.chain);
  }

  async toPsbt(utxos: Utxo[]): Promise<{
    psbt: Psbt;
    fee: bigint;
    amount: bigint;
    memo: string;
    recipient: string;
  }> {
    const fac = new PsbtFactory();
    const inboundAddress = await this.inboundAddress();
    const base = await fac.buildPbst(
      { address: this.account.address, network: this.account.network },
      utxos,
      this.amount,
      this.recipient,
      inboundAddress.gasRate,
      this.toMemo()
    );

    return {
      ...base,
      amount: this.amount,
      memo: this.toMemo(),
      recipient: this.recipient,
    };
  }

  async toCosmosTx(): Promise<{ msgs: EncodeObject[]; memo: string }> {
    return {
      msgs: [
        {
          typeUrl: CosmosMsgSend.typeUrl,
          value: {
            fromAddress: this.account.address,
            amount: [
              {
                denom: this.asset.variants?.native?.denom,
                amount: this.amount.toString(),
              },
            ],
            toAddress: this.recipient,
          },
        },
      ],
      memo: this.toMemo(),
    };
  }

  async toEvmTxRequest(): Promise<{
    tx: TransactionRequest;
    erc20?: ERC20Allowance;
  }> {
    const asset = assetAddress(this.asset.asset);
    if (asset === EVM_NATIVE) {
      return {
        tx: {
          to: this.recipient,
          value: this.amount,
        },
      };
    }

    const iface = new Interface([
      "function transfer(address to, uint256 value) public returns (bool)",
    ]);

    const data = iface.encodeFunctionData("transfer", [
      this.recipient,
      this.amount,
    ]);

    return {
      tx: {
        to: assetAddress(this.asset.asset),
        data,
      },
    };
  }

  async toXrpPayment(): Promise<XrpPayment> {
    const MemoData = this.toMemo()
      ? Buffer.from(this.toMemo(), "utf8").toString("hex")
      : undefined;
    const inboundAddress = await this.inboundAddress();

    return {
      TransactionType: "Payment",
      Account: this.account.address,
      Destination: this.recipient,
      Amount: this.amount.toString(),
      Fee: (inboundAddress.gasRate / 50n).toString(),
      Memos: MemoData ? [{ Memo: { MemoData } }] : [],
    };
  }

  async toNativeTransfer(): Promise<NativeTransfer> {
    const memo = this.toMemo();

    return {
      recipient: this.recipient,
      amount: this.amount,
      memo: memo || undefined,
    };
  }

  async toTronTx(tronWeb: TronWeb): Promise<TronTx> {
    return tronWeb.transactionBuilder.sendTrx(
      this.recipient,
      Number(this.amount),
      this.account.address
    );
  }

  toMemo(): string {
    return this.memo;
  }
}

const assetAddress = (asset: string): string => {
  const raw = asset.split("-").at(1)?.replace("0X", "0x");
  return raw ? getAddress(raw) : EVM_NATIVE;
};
