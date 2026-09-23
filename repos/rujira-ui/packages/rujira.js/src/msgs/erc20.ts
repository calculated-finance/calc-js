import { Psbt } from "bitcoinjs-lib";
import { Interface, TransactionRequest } from "ethers";
import { Account } from "../accounts";
import { InsufficientAllowanceError } from "../errors";
import { BaseMsg, Msg } from "./msg";

export class MsgErc20IncreaseAllowance extends BaseMsg implements Msg {
  protected approvalAmount: bigint;
  protected className = "MsgErc20IncreaseAllowance";
  constructor(
    public account: Account,
    private error: InsufficientAllowanceError
  ) {
    super();
    this.approvalAmount = error.required;
  }
  async toEvmTxRequest(): Promise<{ tx: TransactionRequest }> {
    const iface = new Interface([
      "function approve(address spender, uint256 addedValue) public returns (bool)",
    ]);

    const data = iface.encodeFunctionData("approve", [
      this.error.spender,
      this.approvalAmount,
    ]);

    return {
      tx: {
        to: this.error.asset.contract,
        from: this.account.address,
        data,
      },
    };
  }
  toPsbt(): Promise<{
    psbt: Psbt;
    fee: bigint;
    amount: bigint;
    memo: string;
    recipient: string;
  }> {
    throw new Error(`toPsbt not implemented for ${this.className}.`);
  }
}

export class MsgErc20ResetAllowance extends MsgErc20IncreaseAllowance {
  constructor(
    public account: Account,
    error: InsufficientAllowanceError
  ) {
    super(account, error);

    this.approvalAmount = 0n;
    this.className = "MsgErc20ResetAllowance";
  }
}
