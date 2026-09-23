import { Account } from "../accounts";
import { Asset } from "../asset";
import { MsgDeposit } from "./deposit";
import { Msg } from "./msg";

export class MsgSecureDeposit extends MsgDeposit implements Msg {
  constructor(
    account: Account,
    asset: Asset,
    amount: bigint,
    private targetAddress: string
  ) {
    super(account, asset, amount);
  }

  toMemo(): string {
    const parts = [`secure+`, this.targetAddress];
    return parts.join(":");
  }
}

export class MsgSecureWithdraw extends MsgDeposit implements Msg {
  constructor(
    account: Account,
    asset: Asset,
    amount: bigint,
    private targetAddress: string
  ) {
    if (asset.type !== "SECURED") {
      throw new Error("Only Secured Assets can be withdrawn");
    }
    super(account, asset, amount);
  }
  toMemo(): string {
    const parts = [`secure-`, this.targetAddress];
    return parts.join(":");
  }
}
