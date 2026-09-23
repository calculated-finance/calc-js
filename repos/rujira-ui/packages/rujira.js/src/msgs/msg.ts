import { Psbt } from "bitcoinjs-lib";
import { TransactionRequest } from "ethers";
import { TronWeb, Trx } from "tronweb";
import { Payment as XrpPayment } from "xrpl";
import { Account, InboundAddress } from "../accounts";
import { Network } from "../network";
import { QueryClient } from "../signers/cosmos";
import { ThorchainExtension } from "../signers/cosmos/modules/thorchain/queries";
import { EncodeObject } from "../signers/cosmos/proto-signing";
import { Utxo } from "../signers/utxo";

export interface ERC20Allowance {
  amount: bigint;
  asset: {
    contract: string;
    decimals: number;
    symbol: string;
  };
}

export interface UtxoTx {
  recipient: string;
  value: bigint;
  fee: bigint;
  memo: string;
}

export type TronTx = Exclude<Parameters<Trx["sign"]>[0], string>;

export interface NativeTransfer {
  amount: bigint;
  memo?: string;
  recipient: string;
}

/**
 * A generic representation of a message type
 * This can either be encoded as a L1 with a memo, base layer with a MsgDeposit, or app layer with MsgExecuteContract
 */
export interface Msg {
  /**
   * Returns the intended sender of the Msg
   */
  account: Account;

  /**
   * Called from Cosmos signers for cosmos compatible networks.
   * For MsgSwap, MsgBond, etc, this will construct a MsgDeposit tx with the correct memo and funds
   * For MsgExecuteContract and app-layer interactions, this will construct a native MsgExecuteContract with the correct memo and funds
   * If this is called for any network except `"THOR"`, the function should error
   * @param account
   * @param inboundAddress
   */
  toCosmosTx(): Promise<{ msgs: EncodeObject[]; memo: string }>;

  /**
   * Called from EVM signers
   * @param account
   * @param inboundAddress
   */
  toEvmTxRequest(): Promise<{ tx: TransactionRequest; erc20?: ERC20Allowance }>;

  /**
   * Called from UTXO signers.
   * @param account
   * @param inboundAddress
   */
  toPsbt(utxos: Utxo[]): Promise<{
    psbt: Psbt;
    fee: bigint;
    amount: bigint;
    memo: string;
    recipient: string;
  }>;

  /**
   * Called from XRP signers
   * @param account
   * @param inboundAddress
   */
  toXrpPayment(): Promise<XrpPayment>;

  /**
   * Called from native coin signers that can submit simple transfers.
   * @param account
   * @param inboundAddress
   */
  toNativeTransfer(): Promise<NativeTransfer>;

  /**
   * Called from TRON signers
   * @param account
   * @param inboundAddress
   */
  toTronTx(tronWeb: TronWeb): Promise<TronTx>;

  toDeposit?(): { amount: bigint; symbol: string } | null;

  withQueryClient?(q: QueryClient & ThorchainExtension): void;
  inboundAddress?(network: Network): Promise<InboundAddress>;
}

export class BaseMsg {
  toCosmosTx(): Promise<{ msgs: EncodeObject[]; memo: string }> {
    throw new Error("toCosmosTx not implemented.");
  }
  toEvmTxRequest(): Promise<{
    tx: TransactionRequest;
    erc20?: ERC20Allowance;
  }> {
    throw new Error("toEvmTxRequest not implemented.");
  }
  toPsbt(): Promise<{
    psbt: Psbt;
    fee: bigint;
    amount: bigint;
    memo: string;
    recipient: string;
  }> {
    throw new Error("Method not implemented.");
  }
  toXrpPayment(): Promise<XrpPayment> {
    throw new Error("toXrpPayment not implemented.");
  }
  toNativeTransfer(): Promise<NativeTransfer> {
    throw new Error("toNativeTransfer not implemented.");
  }
  toTronTx(): Promise<TronTx> {
    throw new Error("toTronTx not implemented.");
  }
}
