import { Chain, VaultBase } from "@vultisig/sdk";
import { formatUnits } from "ethers";
import { gasToken, Msg, Network, Simulation } from "rujira.js";

export interface NativeContext {
  network: Network;
}

export interface NativeTransfer {
  amount: bigint;
  memo?: string;
  recipient: string;
}

export abstract class NativeVault implements NativeContext {
  constructor(
    protected vault: VaultBase,
    private chain: Chain,
    public network: Network,
    private decimals: number
  ) {}

  protected async sendTransfer(transfer: NativeTransfer): Promise<string> {
    const result = await this.vault.send({
      chain: this.chain,
      to: transfer.recipient,
      amount: formatUnits(transfer.amount, this.decimals),
      memo: transfer.memo,
    });

    if (result.dryRun) throw new Error("Unexpected dry-run result");
    return result.txHash;
  }
}

export const simulate = async (
  _context: NativeContext,
  msg: Msg
): Promise<Simulation> => {
  const token = gasToken(msg.account.network);
  const inboundAddress = await msg.inboundAddress?.(msg.account.network);

  return {
    ...token,
    amount: inboundAddress?.gasRate || 0n,
    gas: inboundAddress?.gasRate || 0n,
  };
};
