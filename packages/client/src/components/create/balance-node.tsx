import { BalanceAvailable, Condition } from "@template/domain/calc";
import { formatNumber } from "@template/domain/numbers";
import "@xyflow/react/dist/style.css";
import { useEffect, useState } from "react";
import { BaseNode } from "../../components/create/base-node";
import { useAssets } from "../../hooks/use-assets";
import { useDecodedSchemaForm } from "../../hooks/use-schema-form";
import { type ConditionNodeParams, type CustomNodeData } from "../../lib/layout/layout";
import { Input } from "../ui/input";
import { AddAction } from "./add-action";
import { Code } from "./code";
import { JsonEditor } from "./json-editor";

/** The balance_available condition: minimum balance of a denom to proceed. */
export function BalanceNode({
  data: { id, condition, update, remove, addNext, hasOutgoing, hasFailure },
}: CustomNodeData<ConditionNodeParams>) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isEditingJson, setIsEditingJson] = useState(false);
  const [isSelectingDenom, setIsSelectingDenom] = useState(false);

  const { assets } = useAssets();

  const balance = "balance_available" in condition ? condition.balance_available : undefined;

  const form = useDecodedSchemaForm(BalanceAvailable, balance ?? ({} as BalanceAvailable), (updated) => {
    update({ balance_available: updated });
  });

  useEffect(() => {
    form.reset();
  }, [balance, form]);

  if (!balance) return null;

  return (
    <BaseNode
      id={id}
      handleLeft
      handleRight={hasOutgoing}
      handleBottom={hasFailure}
      isHelping={isHelpOpen}
      setHelp={() => { setIsHelpOpen(!isHelpOpen); }}
      isEditingJson={isEditingJson}
      setIsEditingJson={() => { setIsEditingJson(!isEditingJson); }}
      onDelete={remove}
      title={<code className="rounded bg-zinc-900 px-1 py-[1px] font-mono text-4xl text-zinc-100">if</code>}
      summary={
        <Code className="text-xl text-zinc-300">{`check ${balance.amount.displayName.toUpperCase()} balance`}</Code>
      }
      details={
        <Code className="text-sm">{`at least ${formatNumber(balance.amount.amount)} ${balance.amount.displayName} available`}</Code>
      }
      modal={
        isEditingJson ? (
          <JsonEditor
            value={condition}
            schema={Condition}
            onSave={() => {
              setIsEditingJson(false);
            }}
            onExit={() => {
              setIsEditingJson(false);
            }}
          />
        ) : isSelectingDenom ? (
          <div className="flex flex-wrap items-center justify-center gap-3 py-6">
            {assets.map((asset) => (
              <code
                key={asset.denom}
                className="cursor-pointer rounded bg-zinc-900 px-2 py-[1px] font-mono text-xl hover:underline"
                style={{ color: asset.color }}
                onClick={() => {
                  setIsSelectingDenom(false);
                  update({
                    balance_available: {
                      ...balance,
                      amount: { ...asset, amount: balance.amount.amount },
                    },
                  });
                }}
              >
                {asset.displayName}
              </code>
            ))}
          </div>
        ) : (
          <form>
            <div className="flex flex-col gap-4 text-xl">
              <form.Field
                name="amount.amount"
                children={(field) => (
                  <div className="flex flex-col gap-0">
                    <div
                      className={`transition-all duration-300 ease-in-out ${
                        isHelpOpen ? "px-1 pb-2 opacity-100" : "max-h-0 overflow-hidden opacity-0"
                      } `}
                    >
                      <code className="text-sm font-medium text-pretty text-[#9CCCF0]">
                        The minimum balance the strategy must hold for this check to pass. Use the failure branch to
                        handle running out of funds.
                      </code>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          !isHelpOpen ? "opacity-100" : "max-h-0 overflow-hidden opacity-0"
                        } `}
                      >
                        <code className="ml-1 font-mono text-sm text-zinc-400">minimum_balance</code>
                      </div>
                      <div className="flex gap-4 rounded bg-zinc-900">
                        <Input
                          type="number"
                          placeholder="0.00"
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => { field.handleChange(e.target.valueAsNumber); }}
                          inputMode="decimal"
                          onWheel={(e) => { e.currentTarget.blur(); }}
                          tabIndex={-1}
                          autoFocus={false}
                        />
                        <div
                          className="mt-2.5 flex-1 cursor-pointer items-center pr-3"
                          onClick={() => { setIsSelectingDenom(true); }}
                        >
                          <code
                            className="rounded px-1 py-[1px] font-mono hover:underline"
                            style={{ color: balance.amount.color }}
                          >
                            {form.getFieldValue("amount").displayName}
                          </code>
                        </div>
                      </div>
                      {!field.state.meta.isValid && (
                        <p className="font-mono text-sm text-red-500/60">{field.state.meta.errors.join(", ")}</p>
                      )}
                    </div>
                  </div>
                )}
              />
              <form.Field
                name="address"
                children={(field) => (
                  <div className="flex flex-col gap-2">
                    <div
                      className={`transition-all duration-300 ease-in-out ${
                        isHelpOpen ? "px-1 pb-2 opacity-100" : "max-h-0 overflow-hidden opacity-0"
                      } `}
                    >
                      <code className="text-sm font-medium text-pretty text-[#9CCCF0]">
                        Optional: check another account's balance instead of the strategy's own.
                      </code>
                    </div>
                    <div
                      className={`transition-all duration-300 ease-in-out ${
                        !isHelpOpen ? "opacity-100" : "max-h-0 overflow-hidden opacity-0"
                      } `}
                    >
                      <code className="ml-1 font-mono text-sm text-zinc-400">address (optional)</code>
                    </div>
                    <div className="flex rounded bg-zinc-900">
                      <Input
                        placeholder="the strategy itself"
                        className="w-full"
                        value={field.state.value ?? ""}
                        onChange={(e) => {
                          field.handleChange(e.target.value || null);
                        }}
                        data-1p-ignore
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
              {addNext && (
                <div className="pt-2">
                  <AddAction
                    onAdd={addNext}
                    isHelpOpen={isHelpOpen}
                    helpMessage="Select the next step to execute when the balance is available."
                  />
                </div>
              )}
            </div>
          </form>
        )
      }
    />
  );
}
