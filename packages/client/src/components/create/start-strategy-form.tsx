import { useForm } from "@tanstack/react-form";
import type { Amount } from "@template/domain/src/assets";
import { Strategy } from "@template/domain/src/calc";
import { RUJIRA_STAGENET } from "@template/domain/src/chains";
import "@xyflow/react/dist/style.css";
import { Schema } from "effect";
import { useMemo, useState } from "react";
import { useAddressBook } from "../../hooks/use-address-book";
import { getDefaultDeposits } from "../../lib/strategy";
import { Input } from "../ui/input";

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

  const { addressBook } = useAddressBook();

  const defaultDeposit = useMemo(() => (strategy.action ? getDefaultDeposits(strategy.action) : {}), [strategy]);

  const [deposit, setDeposit] = useState<Record<string, Amount>>(defaultDeposit);

  return (
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
      <form.Field
        name="owner"
        children={(field) => (
          <div className="flex flex-col gap-2">
            <code className="ml-1 text-sm text-zinc-400">owner</code>
            <div className="flex flex-wrap gap-2 px-1 pb-2">
              {Object.values(addressBook[RUJIRA_STAGENET.id] || {}).map(({ address, label }) => (
                <code
                  key={address}
                  onClick={() => field.handleChange(address)}
                  className={`cursor-pointer rounded-xs border-1 px-3 py-1 text-sm`}
                  style={{
                    backgroundColor: field.state.value === address ? RUJIRA_STAGENET.color : "transparent",
                    borderColor: field.state.value === address ? RUJIRA_STAGENET.color : "gray",
                    color: field.state.value === address ? "black" : "gray",
                  }}
                >
                  {label} ({address.substring(0, 5)}...{address.substring(address.length - 7)})
                </code>
              ))}
            </div>
          </div>
        )}
      />
      <div className="flex flex-col gap-2">
        <code className="ml-1 text-sm text-zinc-400">deposit</code>
        {Object.values(deposit).map((deposit) => (
          <div className="flex items-center gap-4 rounded bg-zinc-900">
            <Input
              key={deposit.denom}
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
        <code className="w-fit cursor-pointer pr-1 text-end text-lg text-green-300 hover:underline">
          Start Strategy
        </code>
      </div>
    </form>
  );
}
