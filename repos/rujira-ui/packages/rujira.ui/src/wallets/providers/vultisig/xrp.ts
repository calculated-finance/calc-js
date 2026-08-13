import { Chain, VaultBase } from "@vultisig/sdk";
import { Buffer } from "buffer";
import { XRP } from "rujira.js";
import { Payment } from "xrpl";
import { XrpContext } from "../xaman";
import { NativeVault } from "./native";

export { signAndBroadcast } from "../xaman";

export class Xrp extends NativeVault implements XrpContext {
  constructor(vault: VaultBase) {
    super(vault, Chain.Ripple, XRP, 6);
  }

  async submit(payment: Payment): Promise<string> {
    const amount = payment.Amount;
    if (typeof amount !== "string") {
      throw new Error("XRP token payments are not supported");
    }

    return this.sendTransfer({
      recipient: payment.Destination,
      amount: BigInt(amount),
      memo: paymentMemo(payment),
    });
  }
}

const paymentMemo = (payment: Payment): string | undefined => {
  if (payment.Memos?.length && payment.Memos.length > 1) {
    throw new Error("Multiple memos not supported");
  }

  const memoData = payment.Memos?.[0]?.Memo?.MemoData;
  return memoData ? Buffer.from(memoData, "hex").toString("utf8") : undefined;
};
