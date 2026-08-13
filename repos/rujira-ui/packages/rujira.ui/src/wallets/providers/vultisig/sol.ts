import { Chain, VaultBase } from "@vultisig/sdk";
import { Msg, SOL, TxResult } from "rujira.js";
import { NativeTransfer, NativeVault } from "./native";

export class Sol extends NativeVault {
  constructor(vault: VaultBase) {
    super(vault, Chain.Solana, SOL, 9);
  }

  send(transfer: NativeTransfer): Promise<string> {
    return this.sendTransfer(transfer);
  }
}

export const signAndBroadcast = async (
  context: Sol,
  msg: Msg
): Promise<TxResult> => {
  const transfer = await msg.toNativeTransfer();
  return {
    network: SOL,
    address: msg.account.address,
    txHash: await context.send(transfer),
    deposited: msg.toDeposit?.() || null,
  };
};
