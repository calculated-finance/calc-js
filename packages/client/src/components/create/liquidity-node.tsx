import { Condition, Swap } from "@template/domain/calc";
import "@xyflow/react/dist/style.css";
import { useState } from "react";
import { BaseNode } from "../../components/create/base-node";
import { formatNumber } from "@template/domain/numbers";
import { type ConditionNodeParams, type CustomNodeData } from "../../lib/layout/layout";
import { AddAction } from "./add-action";
import { Code } from "./code";
import { JsonEditor } from "./json-editor";
import { SwapEditor } from "./swap-editor";

/** The can_swap condition: edits the same Swap payload as the swap action. */
export function LiquidityNode({
  data: { id, condition, update, remove, addNext, hasOutgoing, hasFailure },
}: CustomNodeData<ConditionNodeParams>) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isEditingJson, setIsEditingJson] = useState(false);

  if (!("can_swap" in condition)) return null;
  const swap = condition.can_swap;

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
      isValid={swap.routes.length > 0}
      title={<code className="rounded bg-zinc-900 px-1 py-[1px] font-mono text-4xl text-zinc-100">if</code>}
      summary={
        <Code className="text-xl text-zinc-300">
          {`check ${swap.swap_amount.displayName.toUpperCase()}\u00A0/\u00A0${swap.minimum_receive_amount.displayName.toUpperCase()} liquidity`}
        </Code>
      }
      details={
        <Code className="text-sm">{`can swap ${formatNumber(swap.swap_amount.amount || 0)} ${swap.swap_amount.displayName} into at least ${formatNumber(swap.minimum_receive_amount.amount || 0)} ${swap.minimum_receive_amount.displayName}  with
          a maximum slippage of ${swap.maximum_slippage_bps / 100}%`}</Code>
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
        ) : (
          <SwapEditor
            swap={swap}
            update={(updated: Swap) => {
              update({ can_swap: updated });
            }}
            isHelpOpen={isHelpOpen}
            footer={
              addNext && (
                <div className="pt-4">
                  <AddAction
                    onAdd={addNext}
                    isHelpOpen={isHelpOpen}
                    helpMessage="Select the next step to execute when this liquidity is available."
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
