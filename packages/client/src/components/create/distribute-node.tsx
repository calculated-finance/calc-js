import { useForm } from "@tanstack/react-form";
import { Distribute, DistributeAction } from "@template/domain/src/calc";
import "@xyflow/react/dist/style.css";
import { Effect, Schema } from "effect";
import { useState } from "react";
import { BaseNode } from "../../components/create/base-node";
import { useAssets } from "../../hooks/use-assets";
import { type ActionNodeParams, type CustomNodeData } from "../../lib/layout/layout";
import { Input } from "../ui/input";
import { Code } from "./code";
import { JsonEditor } from "./json-editor";

export function DistributeNode({
  data: {
    action: { id, distribute },
    update,
    remove,
  },
}: CustomNodeData<ActionNodeParams<DistributeAction>>) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isEditingJson, setIsEditingJson] = useState(false);

  const form = useForm({
    defaultValues: Effect.runSync(Schema.encode(Distribute)(distribute)),
    validators: {
      onChange: ({ value }) => {
        const validationResult = Schema.standardSchemaV1(Distribute)["~standard"].validate(value);

        if ("issues" in validationResult) {
          console.log("Validation issues:", validationResult.issues);
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

        update({
          id,
          distribute: Schema.decodeSync(Distribute)(value),
        });
      },
    },
  });

  const { assetsByDenom } = useAssets();

  return (
    <BaseNode
      id={id}
      handleLeft
      isHelping={isHelpOpen}
      setHelp={() => setIsHelpOpen(!isHelpOpen)}
      isEditingJson={isEditingJson}
      setIsEditingJson={() => setIsEditingJson(!isEditingJson)}
      onDelete={remove}
      title={<code className="rounded bg-zinc-900 px-1 py-[1px] font-mono text-4xl text-zinc-100">SEND</code>}
      summary={
        <code className="flex flex-col gap-1.5 text-xl text-zinc-300">
          {distribute.destinations.length} DESTINATION{distribute.destinations.length !== 1 ? "S" : ""}
        </code>
      }
      details={
        <code className="text-sm text-zinc-300">{`Distribute to ${distribute.destinations.length} destinations`}</code>
      }
      modal={
        <form>
          <div>
            {isEditingJson && (
              <JsonEditor
                data={Effect.runSync(Schema.encode(Distribute)(distribute))}
                schema={Distribute}
                onSave={() => {
                  setIsEditingJson(false);
                }}
                onExit={() => {
                  setIsEditingJson(false);
                }}
              />
            )}
            {!isEditingJson && (
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <code className="text-sm text-zinc-400">denoms</code>
                  <form.Field
                    name="denoms"
                    mode="array"
                    children={(field) => (
                      <div className="flex flex-wrap gap-2">
                        {field.state.value.map((denom) => (
                          <div key={denom} className="flex items-center gap-3 rounded bg-zinc-900 px-3 py-1">
                            <Code>{assetsByDenom[denom]?.displayName || denom}</Code>
                            <code className="mt-[-2px] cursor-pointer text-zinc-600 hover:text-zinc-300">x</code>
                          </div>
                        ))}
                      </div>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <code className="text-sm text-zinc-400">destinations</code>
                  <form.Field
                    name="destinations"
                    mode="array"
                    children={(destinations) => (
                      <div className="flex flex-col gap-2">
                        {destinations.state.value.length > 0 ? (
                          destinations.state.value.map((destination, i) =>
                            "bank" in destination.recipient ? (
                              <div className="relative flex flex-col gap-2" key={i}>
                                <div className="flex items-center gap-2" key={i}>
                                  <form.Field
                                    name={`destinations[${i}].recipient.bank.address`}
                                    children={(field) => (
                                      <div className="flex flex-6 items-center gap-4 rounded bg-zinc-900">
                                        <Input
                                          key={`${i}-address`}
                                          placeholder="address"
                                          className="w-full"
                                          value={field.state.value || ""}
                                          onChange={(e) => field.handleChange(e.target.value)}
                                          data-1p-ignore
                                          autoFocus={false}
                                          tabIndex={-1}
                                        />
                                        <code className="pr-3.5">📕</code>
                                      </div>
                                    )}
                                  />
                                  <form.Field
                                    name={`destinations[${i}].shares`}
                                    children={(field) => (
                                      <div className="flex flex-2 gap-4 rounded bg-zinc-900">
                                        <Input
                                          key={`${i}-shares`}
                                          placeholder="shares"
                                          className="w-full"
                                          type="number"
                                          value={field.state.value || ""}
                                          onChange={(e) => {
                                            field.handleChange(e.target.value);
                                          }}
                                          autoFocus={false}
                                          tabIndex={-1}
                                        />
                                      </div>
                                    )}
                                  />
                                  <code
                                    onClick={() => {
                                      destinations.handleChange(
                                        destinations.state.value.filter((_, index) => index !== i),
                                      );
                                    }}
                                    className="flex cursor-pointer items-center rounded pl-2 text-xl text-zinc-400 hover:text-zinc-200"
                                  >
                                    x
                                  </code>
                                </div>
                              </div>
                            ) : null,
                          )
                        ) : (
                          <code className="text-lg text-red-500/60">No destinations</code>
                        )}
                      </div>
                    )}
                  />
                </div>
                <div className="flex w-full flex-col gap-2">
                  <code className="text-sm text-zinc-400">add_destination</code>
                  <form.Field
                    name="destinations"
                    mode="array"
                    children={(destinations) => (
                      <div className="flex justify-around gap-8 pt-2">
                        <code
                          onClick={() => {
                            destinations.handleChange([
                              ...destinations.state.value,
                              {
                                label: null,
                                shares: "",
                                recipient: {
                                  bank: {
                                    address: "",
                                  },
                                },
                              },
                            ]);
                          }}
                          className="cursor-pointer text-lg text-green-300 hover:underline"
                        >
                          Address
                        </code>
                        <code> | </code>
                        <code className="cursor-not-allowed text-lg text-blue-300 opacity-50 hover:underline">
                          Strategy
                        </code>
                        <code> | </code>
                        <code className="cursor-not-allowed text-lg text-red-300 opacity-50 hover:underline">
                          Withdraw
                        </code>
                      </div>
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        </form>
      }
    />
  );
}
