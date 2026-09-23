import { Account } from "../accounts";
import { GAIA } from "../network";
import { QueryClient } from "../signers/cosmos";
import { ThorchainExtension } from "../signers/cosmos/modules/thorchain/queries";
import { EncodeObject } from "../signers/cosmos/proto-signing";
import { MsgTransfer } from "../signers/cosmos/types/ibc/applications/transfer/v1/tx";
import { MsgDeposit } from "./deposit";
import { BaseMsg, Msg } from "./msg";

export class MsgIbcDeposit extends BaseMsg implements Msg {
  protected q?: QueryClient & ThorchainExtension;

  constructor(
    public account: Account,
    private msg: MsgDeposit,
    private sourceChannel: string
  ) {
    super();
  }

  withQueryClient(q: QueryClient & ThorchainExtension): void {
    this.msg.withQueryClient?.(q);
  }

  async toCosmosTx(): Promise<{ msgs: EncodeObject[]; memo: string }> {
    const inboundAddress = await this.msg.inboundAddress(GAIA);
    if (!inboundAddress) throw new Error(`No inbound address for ${GAIA}`);
    const token = this.msg.sendValue(inboundAddress).amount[0];
    if (!token.denom) throw new Error("No token supplied");
    const value: MsgTransfer = {
      sender: this.account.address,
      timeoutTimestamp: BigInt(new Date().getTime() + 5 * 60 * 1000) * 1000000n,
      sourcePort: "transfer",
      timeoutHeight: {
        revisionHeight: 0n,
        revisionNumber: 0n,
      },
      sourceChannel: this.sourceChannel,
      token: { amount: token.amount, denom: token.denom },
      receiver: inboundAddress.address,
      memo: this.msg.toMemo(),
    };
    const msg = {
      typeUrl: MsgTransfer.typeUrl,
      value,
    };
    return { msgs: [msg], memo: "" };
  }
}
