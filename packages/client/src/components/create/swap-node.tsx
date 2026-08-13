import { Swap } from "@template/domain/calc";
import { formatNumber } from "@template/domain/numbers";
import "@xyflow/react/dist/style.css";
import { useState } from "react";
import { type CustomNodeData, type SwapNodeParams } from "../../lib/layout/layout";
import { AddAction } from "./add-action";
import { BaseNode } from "./base-node";
import { Code } from "./code";
import { JsonEditor } from "./json-editor";
import { SwapEditor } from "./swap-editor";

export function SwapNode({ data: { id, swap, update, remove, addNext, hasOutgoing } }: CustomNodeData<SwapNodeParams>) {
  const [isEditingJson, setIsEditingJson] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <BaseNode
      id={id}
      onDelete={remove}
      handleLeft
      handleRight={hasOutgoing}
      isHelping={isHelpOpen}
      setHelp={() => { setIsHelpOpen(!isHelpOpen); }}
      isEditingJson={isEditingJson}
      setIsEditingJson={() => { setIsEditingJson(!isEditingJson); }}
      isValid={swap.routes.length > 0}
      title={<code className="rounded bg-zinc-900 px-1 py-[1px] font-mono text-4xl text-zinc-100">swap</code>}
      summary={
        <div className="flex flex-col text-xl text-zinc-300">
          <code>swap</code>
          <Code className="rounded px-1 font-mono">{`${swap.swap_amount.displayName} -> ${swap.minimum_receive_amount.displayName}`}</Code>
        </div>
      }
      details={
        <Code className="text-sm">{`swap ${formatNumber(swap.swap_amount.amount || 0)} ${swap.swap_amount.displayName} into at least ${formatNumber(swap.minimum_receive_amount.amount || 0)} ${swap.minimum_receive_amount.displayName}  with
          a maximum slippage of ${swap.maximum_slippage_bps / 100}%`}</Code>
      }
      modal={
        isEditingJson ? (
          <JsonEditor
            value={swap}
            schema={Swap}
            onSave={() => {
              setIsEditingJson(false);
            }}
            onExit={() => {
              setIsEditingJson(false);
            }}
          />
        ) : (
          <SwapEditor
            swap={swap}
            update={update}
            isHelpOpen={isHelpOpen}
            footer={
              addNext && (
                <div className="pt-4">
                  <AddAction
                    onAdd={addNext}
                    isHelpOpen={isHelpOpen}
                    helpMessage="Add the next step to run after this swap completes."
                  />
                </div>
              )
            }
          />
        )
      }
    />
  );
}
