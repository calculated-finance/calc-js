import { useForm } from "@tanstack/react-form";
import { Strategy } from "@template/domain/src/calc";
import { formatNumber } from "@template/domain/src/numbers";
import "@xyflow/react/dist/style.css";
import { Effect, Schema } from "effect";
import { useState } from "react";
import { BaseNode } from "../../components/create/base-node";
import { useStrategyBalances } from "../../hooks/use-strategy-balances";
import { type CustomNodeData, type StrategyNodeParams } from "../../lib/layout/layout";
import { Input } from "../ui/input";
import { AddAction } from "./add-action";
import { Code } from "./code";

export function StrategyNode({ data: { strategy, update } }: CustomNodeData<StrategyNodeParams>) {
  const form = useForm({
    defaultValues: Effect.runSync(Schema.encode(Strategy)(strategy)),
    validators: {
      onChange: ({ value }) => {
        const validationResult = Schema.standardSchemaV1(Strategy)["~standard"].validate(value);

        if ("issues" in validationResult) {
          console.log(validationResult.issues);
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

        update(Schema.decodeSync(Strategy)(value));
      },
    },
  });

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
                  onChange={(e) => field.handleChange(e.target.value)}
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
                    onChange={(e) => field.handleChange(e.target.value)}
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
            {balances.length > 1 ? (
              <code className="flex flex-wrap gap-2 text-lg">
                <Code>
                  {balances.map((b) => `${formatNumber(b.amount)} ${b.displayName?.toUpperCase()}`).join(" | ")}
                </Code>
              </code>
            ) : (
              <Code>[]</Code>
            )}
          </div>
        )}
        {!strategy.action && (
          <AddAction
            onAdd={(action) =>
              update({
                ...strategy,
                action,
              })
            }
            isHelpOpen={isHelpOpen}
            helpMessage="Select the root action for this strategy. You can choose a simple action like a execute a swap or set a limit order, however it's often more useful to start with a schedule or a group action."
          />
        )}
      </form>
    );
  };

  return (
    <BaseNode
      id={strategy.id}
      handleRight={!!strategy.action}
      title={<code className="rounded bg-zinc-900 px-1 py-[1px] font-mono text-4xl text-zinc-100">START</code>}
      summary={<code className="flex flex-col gap-1.5 text-xl text-zinc-300">START</code>}
      details={<Code className="text-md text-zinc-300">{strategy.label}</Code>}
      modal={renderForm()}
      isHelping={isHelpOpen}
      setHelp={() => setIsHelpOpen(!isHelpOpen)}
    />
  );
}
