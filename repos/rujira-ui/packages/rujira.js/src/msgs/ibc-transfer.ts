import { Account } from "../accounts";
import { EncodeObject } from "../signers/cosmos/proto-signing";
import { MsgTransfer } from "../signers/cosmos/types/ibc/applications/transfer/v1/tx";
import { BaseMsg, Msg } from "./msg";

export class MsgIbcTransfer extends BaseMsg implements Msg {
  constructor(
    public account: Account,
    private msg: Omit<
      MsgTransfer,
      "sender" | "timeoutHeight" | "timeoutTimestamp" | "sourcePort"
    >
  ) {
    super();
  }

  async toCosmosTx(): Promise<{ msgs: EncodeObject[]; memo: string }> {
    const value: MsgTransfer = {
      sender: this.account.address,
      timeoutTimestamp: BigInt(new Date().getTime() + 5 * 60 * 1000) * 1000000n,
      sourcePort: "transfer",
      timeoutHeight: {
        revisionHeight: 0n,
        revisionNumber: 0n,
      },
      ...this.msg,
    };
    const msg = {
      typeUrl: MsgTransfer.typeUrl,
      value,
    };
    return { msgs: [msg], memo: "" };
  }
}
