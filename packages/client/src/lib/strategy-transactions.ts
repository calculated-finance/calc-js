import { toUtf8 } from "@cosmjs/encoding";
import type { StrategyHandle } from "@template/domain/calc";
import { COSMOS_CHAINS_BY_ID } from "@template/domain/chains";
import type { TransactionData } from "@template/domain/clients";

/** A strategy handle that exists on-chain (anything but a local draft). */
export type ChainHandle = Extract<StrategyHandle, { contract_address: string }>;

/**
 * Builds the MsgExecuteContract payload for a manager-level status change.
 * The manager forwards `active` as an Execute and paused/archived as a
 * Cancel to the strategy contract, so resume/restore are both `active`.
 */
export const statusUpdateData =
  (handle: ChainHandle, status: "active" | "paused" | "archived") =>
  (sender: string): TransactionData => ({
    type: "cosmos",
    msgs: [
      {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: {
          sender,
          contract: COSMOS_CHAINS_BY_ID[handle.chainId].managerContract,
          msg: toUtf8(
            JSON.stringify({
              update_strategy_status: {
                contract_address: handle.contract_address,
                status,
              },
            }),
          ),
          funds: [],
        },
      },
    ],
  });

/**
 * Builds the MsgExecuteContract payload withdrawing the given base-unit coin
 * amounts from a strategy. The contract clamps each amount to the held
 * balance, skips zero amounts, and treats an empty list as a no-op.
 */
export const withdrawData =
  (handle: ChainHandle, coins: { denom: string; amount: string }[]) =>
  (sender: string): TransactionData => ({
    type: "cosmos",
    msgs: [
      {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: {
          sender,
          contract: handle.contract_address,
          msg: toUtf8(JSON.stringify({ withdraw: coins })),
          funds: [],
        },
      },
    ],
  });
