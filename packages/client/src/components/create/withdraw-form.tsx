import { Amount } from "@template/domain/assets";
import { COSMOS_CHAINS_BY_ID } from "@template/domain/chains";
import { Schema } from "effect";
import { useState } from "react";
import { type ChainHandle, withdrawData } from "../../lib/strategy-transactions";
import { Input } from "../ui/input";
import { SignTransactionForm } from "./sign-transaction-form";

const encodeAmount = Schema.encodeSync(Amount);

/**
 * The withdraw form: one row per denom the strategy holds, defaulted to 0,
 * with a max link filling in the full balance. The entered amounts are
 * encoded to base units and passed into the strategy's withdraw call.
 */
export function WithdrawForm({
  handle,
  balances,
  onSuccess,
}: {
  handle: ChainHandle;
  balances: Amount[];
  onSuccess?: () => void;
}) {
  const [amounts, setAmounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(balances.map((balance) => [balance.denom, 0])),
  );

  const coins = balances.flatMap((balance) => {
    const amount = amounts[balance.denom] ?? 0;
    if (amount <= 0) return [];
    // The schema's encoded amount is typed string | number but always
    // formats to a base-unit string; String() narrows without changing it.
    const encoded = encodeAmount({ ...balance, amount: Math.min(amount, balance.amount) });
    return [{ denom: encoded.denom, amount: String(encoded.amount) }];
  });

  return (
    <div className="flex flex-col gap-4">
      <code className="ml-1 font-mono text-sm text-zinc-400">withdraw</code>
      {balances.map((balance) => (
        <div key={balance.denom} className="flex items-center gap-3 rounded bg-zinc-900">
          <Input
            type="number"
            placeholder="0"
            className="w-full"
            value={amounts[balance.denom] || ""}
            onChange={(e) => {
              setAmounts({ ...amounts, [balance.denom]: e.target.valueAsNumber || 0 });
            }}
            inputMode="decimal"
            onWheel={(e) => {
              e.currentTarget.blur();
            }}
            tabIndex={-1}
            autoFocus={false}
          />
          <code className="font-mono" style={{ color: balance.color }}>
            {balance.displayName.toUpperCase()}
          </code>
          <code
            onClick={() => {
              setAmounts({ ...amounts, [balance.denom]: balance.amount });
            }}
            className="cursor-pointer pr-3 text-sm text-zinc-400 hover:underline"
          >
            max
          </code>
        </div>
      ))}
      {coins.length > 0 ? (
        <SignTransactionForm
          chain={COSMOS_CHAINS_BY_ID[handle.chainId]}
          getDataWithSender={withdrawData(handle, coins)}
          callToAction="Withdraw Funds"
          onSuccess={onSuccess}
        />
      ) : (
        <code className="pt-2 text-sm text-zinc-500">enter an amount to withdraw</code>
      )}
    </div>
  );
}
