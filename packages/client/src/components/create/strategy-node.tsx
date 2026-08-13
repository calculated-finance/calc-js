import { Strategy } from "@template/domain/calc";
import { formatNumber } from "@template/domain/numbers";
import "@xyflow/react/dist/style.css";
import { useState } from "react";
import { BaseNode } from "../../components/create/base-node";
import { useStrategyBalances } from "../../hooks/use-strategy-balances";
import { useEncodedSchemaForm } from "../../hooks/use-schema-form";
import { appendNode } from "../../lib/graph";
import { type CustomNodeData, type StrategyNodeParams } from "../../lib/layout/layout";
import { Input } from "../ui/input";
import { AddAction } from "./add-action";
import { Code } from "./code";

export function StrategyNode({ data: { strategy, update } }: CustomNodeData<StrategyNodeParams>) {
  const form = useEncodedSchemaForm(Strategy, strategy, update);

  const { data: balances } = useStrategyBalances(strategy);

  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const renderForm = () => {
    return (
      <form className="flex w-100 flex-col gap-8">
        <form.Field
          name="label"
          children={(field) => (
            <div className="flex flex-col gap-2">
              <code className="text-sm text-zinc-400">label</code>
              <div className="flex rounded bg-zinc-900">
                <Input
                  placeholder="Strategy Label"
                  className="w-full"
                  value={field.state.value}
                  onChange={(e) => { field.handleChange(e.target.value); }}
                  tabIndex={-1}
                  autoFocus={false}
                  readOnly={strategy.status !== "draft"}
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
              <code className="text-sm text-zinc-400">owner</code>
              <div className="flex rounded bg-zinc-900">
                <Input
                  placeholder="Strategy Owner"
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
        {strategy.address && (
          <form.Field
            name="address"
            children={(field) => (
              <div className="flex flex-col gap-2">
                <code className="text-sm text-zinc-400">address</code>
                <div className="flex rounded bg-zinc-900">
                  <Input
                    placeholder="Strategy Address"
                    className="w-full"
                    value={field.state.value}
                    onChange={(e) => { field.handleChange(e.target.value); }}
                    tabIndex={-1}
                    autoFocus={false}
                    readOnly={strategy.status !== "draft"}
                  />
                </div>
                {!field.state.meta.isValid && (
                  <p className="font-mono text-sm text-red-500/60">{field.state.meta.errors.join(", ")}</p>
                )}
              </div>
            )}
          />
        )}
        {!!balances && (
          <div className="flex flex-col gap-2">
            <code className="text-sm text-zinc-400">balances</code>
            {balances.length > 0 ? (
              <code className="flex flex-wrap gap-2 text-lg">
                <Code>
                  {balances.map((b) => `${formatNumber(b.amount)} ${b.displayName.toUpperCase()}`).join(" | ")}
                </Code>
              </code>
            ) : (
              <Code>[]</Code>
            )}
          </div>
        )}
        {strategy.nodes.length === 0 && (
          <AddAction
            onAdd={(body) => {
              update({
                ...strategy,
                nodes: appendNode(strategy.nodes, body),
              });
              return `${strategy.id}:0`;
            }}
            isHelpOpen={isHelpOpen}
            helpMessage="Select the first step for this strategy. It's often most useful to start with a schedule, which gates everything after it."
          />
        )}
      </form>
    );
  };

  return (
    <BaseNode
      id={strategy.id}
      handleRight={strategy.nodes.length > 0}
      title={<code className="rounded bg-zinc-900 px-1 py-[1px] font-mono text-4xl text-zinc-100">START</code>}
      summary={<code className="flex flex-col gap-1.5 text-xl text-zinc-300">START</code>}
      details={<Code className="text-md text-zinc-300">{strategy.label}</Code>}
      modal={renderForm()}
      isHelping={isHelpOpen}
      setHelp={() => { setIsHelpOpen(!isHelpOpen); }}
    />
  );
}
