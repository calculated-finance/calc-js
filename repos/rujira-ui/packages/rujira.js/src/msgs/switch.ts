import { Account } from "../accounts";
import { Asset } from "../asset";
import { MsgDeposit } from "./deposit";
import { Msg } from "./msg";

export class MsgSwitch extends MsgDeposit implements Msg {
  constructor(
    account: Account,
    asset: Asset,
    amount: bigint,
    private targetAddress: string
  ) {
    super(account, asset, amount);
  }

  toMemo(): string {
    const parts = [`switch`, this.targetAddress];
    return parts.join(":");
  }
}
