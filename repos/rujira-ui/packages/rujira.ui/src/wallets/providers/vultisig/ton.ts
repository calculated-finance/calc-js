import { Chain, VaultBase } from "@vultisig/sdk";
import { Msg, TON, TxResult } from "rujira.js";
import { NativeTransfer, NativeVault } from "./native";

export class Ton extends NativeVault {
  constructor(vault: VaultBase) {
    super(vault, Chain.Ton, TON, 9);
  }

  send(transfer: NativeTransfer): Promise<string> {
    return this.sendTransfer(transfer);
  }
}

export const signAndBroadcast = async (
  context: Ton,
  msg: Msg
): Promise<TxResult> => {
  const transfer = await msg.toNativeTransfer();
  return {
    network: TON,
    address: msg.account.address,
    txHash: await context.send(transfer),
    deposited: msg.toDeposit?.() || null,
  };
};
