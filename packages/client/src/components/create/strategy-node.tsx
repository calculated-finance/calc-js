import { useForm } from "@tanstack/react-form";
import { Action, Strategy } from "@template/domain/src/calc";
import "@xyflow/react/dist/style.css";
import { Schema } from "effect";
import { v4 } from "uuid";
import { BaseNode } from "../../components/create/base-node";
import { useAssets } from "../../hooks/use-assets";
import { useNodeModalStore } from "../../hooks/use-node-modal-store";
import { type CustomNodeData, type StrategyNodeParams } from "../../lib/layout/layout";
import { Input } from "../ui/input";

export function StrategyNode({ data: { strategy, update } }: CustomNodeData<StrategyNodeParams>) {
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

  const assets = useAssets();
  const { setOpenId } = useNodeModalStore();

  const addAction = (action: Omit<Action, "id">) => {
    const actionId = v4();
    update({
      ...strategy,
      action: {
        id: actionId,
        ...action,
      } as any,
    });
    setOpenId(actionId);
  };

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
        {!strategy.action && (
          <div className="flex flex-col gap-2">
            <code className="text-sm text-zinc-400">action</code>
            <div className="flex justify-around pt-2">
              <code
                onClick={() => {
                  addAction({
                    swap: {
                      adjustment: "fixed",
                      maximum_slippage_bps: 300,
                      routes: [
                        {
                          thorchain: {},
                        },
                      ],
                      minimum_receive_amount: {
                        amount: 100,
                        ...assets[0],
                      },
                      swap_amount: {
                        amount: 0.001,
                        ...assets[1],
                      },
                    },
                  });
                }}
                className="cursor-pointer text-purple-300 hover:underline"
              >
                Swap
              </code>
              <code>|</code>
              <code className="cursor-pointer text-green-300 hover:underline">Limit Order</code>
              <code>|</code>
              <code className="cursor-pointer text-blue-300 hover:underline">Distribute</code>
            </div>
            <div className="flex justify-around pt-4">
              <code className="cursor-pointer text-yellow-300 hover:underline">Schedule</code>
              <code>|</code>
              <code
                onClick={() => {
                  addAction({ many: [] });
                }}
                className="cursor-pointer text-red-300 hover:underline"
              >
                Group
              </code>
              <code>|</code>
              <code className="cursor-pointer text-orange-300 hover:underline">Conditional</code>
            </div>
          </div>
        )}
      </form>
    );
  };

  return (
    <BaseNode
      id={strategy.id}
      handleRight={!!strategy.action}
      title={<code className="rounded bg-zinc-900 px-1 py-[1px] font-mono text-4xl text-zinc-100">START</code>}
      summary={<div className="flex flex-col gap-1.5 text-xl text-zinc-300">{strategy.label}</div>}
      details={<div className="text-md text-zinc-300">{strategy.label}</div>}
      modal={renderForm()}
    />
  );
}
