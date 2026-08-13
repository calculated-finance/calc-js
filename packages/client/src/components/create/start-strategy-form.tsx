import { toUtf8 } from "@cosmjs/encoding";
import { Amount } from "@template/domain/assets";
import { Strategy, StrategyId } from "@template/domain/calc";
import { RUJIRA } from "@template/domain/chains";
import "@xyflow/react/dist/style.css";
import { Either, Schema } from "effect";
import { useMemo, useState } from "react";
import { getDefaultDeposits } from "../../lib/strategy";
import { Input } from "../ui/input";
import { SignTransactionForm } from "./sign-transaction-form";
import { useDecodedSchemaForm } from "../../hooks/use-schema-form";

export function StartStrategyForm({
  strategy,
  update,
  deleteStrategy,
}: {
  strategy: Strategy;
  update: (value: Strategy) => void;
  deleteStrategy: (id: StrategyId) => void;
}) {
  const form = useDecodedSchemaForm(Strategy, strategy, update);

  const defaultDeposit = useMemo(() => getDefaultDeposits(strategy.nodes), [strategy.nodes]);

  const [deposit, setDeposit] = useState<Record<string, Amount>>(defaultDeposit);

  const [isSigning, setIsSigning] = useState(false);
  const [encodedStrategy, setEncodedStrategy] = useState<typeof Strategy.Encoded>();
  const [startError, setStartError] = useState<string>();

  return (
    <div className="w-100">
      <div
        className={`transition-all duration-500 ${
          !isSigning ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {!isSigning && (
          <form className="flex flex-col gap-8 overflow-auto">
            <form.Field
              name="label"
              children={(field) => (
                <div className="flex flex-col gap-2">
                  <code className="ml-1 text-sm text-zinc-400">label</code>
                  <div className="flex rounded bg-zinc-900">
                    <Input
                      placeholder="Strategy Label"
                      className="w-full"
                      value={field.state.value}
                      onChange={(e) => { field.handleChange(e.target.value); }}
                      tabIndex={-1}
                      autoFocus={false}
                    />
                  </div>
                  {!field.state.meta.isValid && (
                    <p className="font-mono text-sm text-red-500/60">{field.state.meta.errors.join(", ")}</p>
                  )}
                </div>
              )}
            />
            <div className="flex flex-col gap-2">
              <code className="ml-1 text-sm text-zinc-400">deposit</code>
              {Object.values(deposit).map((deposit) => (
                <div className="relative">
                  {deposit.amount < 9999999999999 && (
                    <div className="pointer-events-none absolute z-0 flex h-full w-full items-center gap-4">
                      <code className="pointer-events-none ml-4 text-xl opacity-0">{deposit.amount || "0.00"}</code>
                      <code className="pointer-events-auto cursor-pointer text-zinc-400 underline" onClick={() => {}}>
                        max
                      </code>
                    </div>
                  )}
                  <div className="flex items-center gap-4 rounded bg-zinc-900" key={deposit.denom}>
                    <Input
                      placeholder="0.00"
                      className="w-full"
                      value={deposit.amount || ""}
                      type="number"
                      inputMode="decimal"
                      onChange={(e) => {
                        const amount = e.target.value ? parseFloat(e.target.value) : 0;
                        setDeposit((prev) => ({
                          ...prev,
                          [deposit.denom]: {
                            ...deposit,
                            amount: isNaN(amount) ? 0 : amount,
                          },
                        }));
                      }}
                      tabIndex={-1}
                      autoFocus={false}
                    />
                    <div className="flex-1 items-center pr-3">
                      <code className="flex items-center gap-3 px-1 py-[1px] text-lg" style={{ color: deposit.color }}>
                        {deposit.displayName}{" "}
                      </code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex w-full flex-col items-end gap-2">
              {startError && <code className="text-sm text-red-400/80">{startError}</code>}
              <code
                onClick={() => {
                  // Encode up front so a mid-edit invalid state surfaces as a
                  // message instead of a render-path throw at signing time.
                  const encoded = Schema.encodeUnknownEither(Strategy)(form.state.values);
                  if (Either.isLeft(encoded)) {
                    setStartError("Fix the highlighted fields before starting the strategy.");
                    return;
                  }
                  setStartError(undefined);
                  setEncodedStrategy(encoded.right);
                  setIsSigning(true);
                }}
                className="w-fit cursor-pointer pr-1 text-end text-lg text-green-300 hover:underline"
              >
                Start Strategy
              </code>
            </div>
          </form>
        )}
      </div>
      <div
        className={`transition-all duration-500 ${
          isSigning ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {isSigning && encodedStrategy && (
          <SignTransactionForm
            chain={RUJIRA}
            getDataWithSender={(sender) => ({
              type: "cosmos",
              msgs: [
                {
                  typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                  value: {
                    sender,
                    // TODO: use config to get the contract address
                    contract: RUJIRA.managerContract,
                    msg: toUtf8(
                      JSON.stringify({
                        instantiate: {
                          affiliates: [],
                          label: form.state.values.label,
                          nodes: encodedStrategy.nodes,
                          owner: sender,
                        },
                      }),
                    ),
                    funds: Object.values(deposit)
                      .filter((d) => d.amount > 0)
                      .map((d) => Schema.encodeSync(Amount)(d))
                      .sort((a, b) => a.denom.localeCompare(b.denom)),
                  },
                },
              ],
            })}
            callToAction="Start Strategy"
            onBack={() => { setIsSigning(false); }}
            onSuccess={() => {
              deleteStrategy(strategy.id);
            }}
          />
        )}
      </div>
    </div>
  );
}
