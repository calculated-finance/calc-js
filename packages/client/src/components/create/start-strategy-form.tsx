import { toUtf8 } from '@cosmjs/encoding';
import { useForm } from "@tanstack/react-form";
import { Amount } from "@template/domain/src/assets";
import { Strategy } from "@template/domain/src/calc";
import { RUJIRA_STAGENET } from "@template/domain/src/chains";
import "@xyflow/react/dist/style.css";
import { Effect, Schema } from "effect";
import { useMemo, useState } from "react";
import { getDefaultDeposits } from "../../lib/strategy";
import { Input } from "../ui/input";
import { SignTransactionForm } from "./sign-transaction-form";


export function StartStrategyForm({ strategy, update }: { strategy: Strategy; update: (value: Strategy) => void }) {
  const form = useForm({
    defaultValues: strategy,
    validators: {
      onChange: ({ value }) => {
        const validationResult = Schema.standardSchemaV1(Strategy)["~standard"].validate(value);

        if ("issues" in validationResult) {
          return {
            fields: validationResult.issues?.reduce(
              (acc, issue) =>
                !issue.path
                  ? acc
                  : {
                      [issue.path.join(".")]: issue.message,
                      ...acc,
                    },
              {} as Record<string, string>,
            ),
          };
        }

        update(value);
      },
    },
  });

  const defaultDeposit = useMemo(() => (strategy.action ? getDefaultDeposits(strategy.action) : {}), [strategy]);

  const [deposit, setDeposit] = useState<Record<string, Amount>>(defaultDeposit);

  const [isSigning, setIsSigning] = useState(false);

  return (
    <div className="w-100">
      <div
      className={`transition-all duration-500 ${
        !isSigning ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
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
              onChange={(e) => field.handleChange(e.target.value)}
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
            <code className="px-1 py-[1px] text-lg" style={{ color: deposit.color }}>
              {deposit.displayName}
            </code>
            </div>
          </div>
          ))}
        </div>
        <div className="flex w-full justify-end gap-4">
          <code
          onClick={() => setIsSigning(true)}
          className="w-fit cursor-pointer pr-1 text-end text-lg text-green-300 hover:underline"
          >
          Sign Transaction
          </code>
        </div>
        </form>
      )}
      </div>
      <div
      className={`transition-all duration-500 ${
        isSigning ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      >
      {isSigning && (
        <SignTransactionForm
          chain={RUJIRA_STAGENET}
          getDataWithSender={(sender) => {
            function removeIds(obj: any): any {
              if (Array.isArray(obj)) {
                return obj.map(removeIds);
              }
              if (obj && typeof obj === "object") {
                const { id, ...rest } = obj;
                return Object.fromEntries(
                  Object.entries(rest).map(([k, v]) => [k, removeIds(v)])
                );
              }
              return obj;
            }

            const encodedStrategy = Effect.runSync(Schema.encode(Strategy)(form.state.values));
            const strategyWithoutIds = removeIds(encodedStrategy); // TODO: Manage this with schema transformations

            return {
              type: "cosmos",
              msgs: [
                {
                  typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                  value: {
                    sender,
                    // TODO: use config to get the contract address
                    contract: "sthor1xg6qsvyktr0zyyck3d67mgae0zun4lhwwn3v9pqkl5pk8mvkxsnscenkc0",
                    msg: toUtf8(
                      JSON.stringify({
                        instantiate_strategy: {
                          strategy: { ...strategyWithoutIds, owner: sender, state: null },
                          label: form.state.values.label,
                          affiliates: [],
                        },
                      })
                    ),
                    funds: Object.values(deposit)
                      .filter(d => d.amount > 0)
                      .map((d) => Effect.runSync(Schema.encode(Amount)(d)))
                      .sort((a, b) => a.denom.localeCompare(b.denom)),
                  },
                },
              ],
            };
          }}
          onBack={() => setIsSigning(false)}
        />
      )}
      </div>
    </div>
  );
}
