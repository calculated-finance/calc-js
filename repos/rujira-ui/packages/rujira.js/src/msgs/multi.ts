import { Account } from "../accounts";
import { QueryClient } from "../signers/cosmos";
import { ThorchainExtension } from "../signers/cosmos/modules/thorchain/queries";
import { EncodeObject } from "../signers/cosmos/proto-signing";
import { BaseMsg, Msg } from "./msg";

export class MsgMulti extends BaseMsg implements Msg {
  constructor(
    public account: Account,
    private msgs: Msg[]
  ) {
    super();
  }
  async toCosmosTx(): Promise<{ msgs: EncodeObject[]; memo: string }> {
    const encoded = await Promise.all(this.msgs.map((a) => a.toCosmosTx()));
    if (encoded.filter((a) => !!a.memo).length > 1)
      throw new Error(`MsgMulti does not support multiple memos`);
    return {
      msgs: encoded.flatMap((a) => a.msgs),
      memo: encoded.find((a) => !!a.memo)?.memo || "",
    };
  }
  withQueryClient(q: QueryClient & ThorchainExtension): void {
    this.msgs.forEach((x) => x.withQueryClient?.(q));
  }
}
