import { fromBech32 } from "@cosmjs/encoding";
import { Psbt } from "bitcoinjs-lib";
import { Buffer } from "buffer";
import { getAddress, TransactionRequest } from "ethers";
import { TronWeb } from "tronweb";
import { Payment as XrpPayment } from "xrpl";
import { Account, InboundAddress } from "../accounts";
import { Asset } from "../asset";
import { THOR } from "../network";
import { QueryClient } from "../signers/cosmos";
import { ThorchainExtension } from "../signers/cosmos/modules/thorchain/queries";
import { EncodeObject } from "../signers/cosmos/proto-signing";
import { MsgSend } from "../signers/cosmos/types/cosmos/bank/v1beta1/tx";
import { MsgDeposit as MsgDepositBase } from "../signers/cosmos/types/thorchain/types/msg_deposit";
import { evmRouter } from "../signers/evm/router";
import { PsbtFactory, Utxo } from "../signers/utxo";
import { ERC20Allowance, Msg, type NativeTransfer, TronTx } from "./msg";

const EVM_NATIVE = "0x0000000000000000000000000000000000000000";

/**
 * MsgDeposit abstracts layer 1 deposits & direct MsgDeposit on THORChain
 */
export class MsgDeposit implements Msg {
  protected q?: QueryClient & ThorchainExtension;

  protected amount: bigint;
  constructor(
    public account: Account,
    protected asset: Asset,
    amount: bigint
  ) {
    // Adjust the 8dp input to the decimals of the source asset
    this.amount =
      (amount * 10n ** BigInt(asset?.metadata.decimals || 0)) / 10n ** 8n;
  }

  withQueryClient(q: QueryClient & ThorchainExtension): void {
    this.q = q;
  }

  public inboundAddress(chain = this.account.network): Promise<InboundAddress> {
    if (!this.q) throw new Error(`QueryClient required for MsgDeposit`);
    return this.q.thorchain.getInboundAddress(chain);
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
      inboundAddress.address,
      inboundAddress.gasRate,
      this.toMemo()
    );

    return {
      ...base,
      memo: this.toMemo(),
      recipient: inboundAddress.address,
    };
  }

  async toCosmosTx(): Promise<{ msgs: EncodeObject[]; memo: string }> {
    // the current implementation of MsgSend -> MsgDeposit calls `common.NewAsset(coin.Denom)`
    // to translate the sent denoms to THORChain asset notation.
    // The x/ prefix currently breaks the chain decoding check, so we need to encode
    // the message as a MsgDeposit instead of MsgSend.

    if (this.account.network === THOR) {
      return {
        msgs: [this.toMsgDeposit()],
        memo: "",
      };
    }
    const inboundAddress = await this.inboundAddress();
    return {
      msgs: [
        {
          typeUrl: MsgSend.typeUrl,
          value: {
            ...this.sendValue(inboundAddress),
            toAddress: inboundAddress.address,
          },
        },
      ],
      memo: this.toMemo(),
    };
  }

  sendValue(inboundAddress: InboundAddress) {
    // Adjust the 8dp inboundAddress.dustThreshold value to the decimals of the source asset
    const adjustedDust =
      (inboundAddress.dustThreshold *
        10n ** BigInt(this.asset.metadata.decimals || 0)) /
      10n ** 8n;

    if (adjustedDust && this.amount < adjustedDust) {
      throw new Error(
        `Input amount is less than the minimum of ${Number(inboundAddress.dustThreshold) / 10 ** 8} ${this.asset.metadata.symbol}`
      );
    }

    if (!this.asset.variants?.native?.denom)
      throw new Error(
        `asset.variants.native.denom not provided for ${this.asset.asset} in MsgDeposit`
      );

    return {
      fromAddress: this.account.address,
      amount: [
        {
          denom: this.asset.variants.native.denom,
          amount: this.amount.toString(),
        },
      ],
    };
  }

  async toEvmTxRequest(): Promise<{
    tx: TransactionRequest;
    erc20?: ERC20Allowance;
  }> {
    const inboundAddress = await this.inboundAddress();
    const contract = evmRouter(inboundAddress.router!);
    const expiration = BigInt(new Date().getTime() + 600000);
    const asset = assetAddress(this.asset.asset);

    const request = contract.depositWithExpiry(
      inboundAddress.address,
      asset,
      inboundAddress.dustThreshold && this.amount < inboundAddress.dustThreshold
        ? inboundAddress.dustThreshold
        : this.amount,
      this.toMemo(),
      expiration
    );

    return asset === EVM_NATIVE
      ? { tx: request }
      : {
          tx: { ...request, value: 0n },
          erc20: {
            amount: this.amount,
            asset: {
              contract: asset,
              decimals: this.asset.metadata.decimals,
              symbol: this.asset.metadata.symbol,
            },
          },
        };
  }

  toMemo(): string {
    throw new Error(`toMemo not implemented`);
  }

  toDeposit(): { amount: bigint; symbol: string } | null {
    return {
      // Revert back to 8dp
      amount:
        (this.amount * 10n ** 8n) /
        10n ** BigInt(this.asset?.metadata.decimals || 0),
      symbol: this.asset.metadata.symbol,
    };
  }
  toMsgDeposit(): {
    typeUrl: string;
    value: MsgDepositBase;
  } {
    const match = this.asset.asset.match(/([A-Z]+)[-\.](.*)/);
    if (!match) throw new Error(`Invalid Asset ${this.asset.asset}`);
    const [, chain, symbol] = match;
    const [ticker] = symbol.split("-");

    return {
      typeUrl: MsgDepositBase.typeUrl,
      value: {
        memo: this.toMemo(),
        signer: fromBech32(this.account.address).data,
        coins: [
          {
            asset: {
              chain,
              symbol,
              ticker,
              synth: false,
              trade: false,
              secured: this.asset.type === "SECURED",
            },
            decimals: 0,
            amount: this.amount.toString(),
          },
        ],
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
      Destination: inboundAddress.address,
      Amount: this.amount.toString(),
      Fee: (inboundAddress.gasRate / 50n).toString(),
      Memos: MemoData ? [{ Memo: { MemoData } }] : [],
    };
  }

  async toNativeTransfer(): Promise<NativeTransfer> {
    const inboundAddress = await this.inboundAddress();
    const memo = this.toMemo();

    return {
      recipient: inboundAddress.address,
      amount: this.amount,
      memo: memo || undefined,
    };
  }

  async toTronTx(tronWeb: TronWeb): Promise<TronTx> {
    const inboundAddress = await this.inboundAddress();
    const contractAddress = this.asset.asset.split("-").at(1);

    const tx = contractAddress
      ? (
          await tronWeb.transactionBuilder.triggerSmartContract(
            contractAddress,
            "transfer(address,uint256)",
            {},
            [
              { type: "address", value: inboundAddress.address },
              { type: "uint256", value: this.amount.toString() },
            ],
            this.account.address
          )
        ).transaction
      : await tronWeb.transactionBuilder.sendTrx(
          inboundAddress.address,
          Number(this.amount),
          this.account.address
        );

    return tronWeb.transactionBuilder.alterTransaction(tx, {
      data: this.toMemo(),
    });
  }
}

const assetAddress = (asset: string): string => {
  const raw = asset.split("-").at(1)?.replace("0X", "0x");
  return raw ? getAddress(raw) : EVM_NATIVE;
};
