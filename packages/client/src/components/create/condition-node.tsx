import { Condition } from "@template/domain/calc";
import "@xyflow/react/dist/style.css";
import { BigDecimal } from "effect";
import { useState } from "react";
import { BaseNode } from "../../components/create/base-node";
import { type ConditionNodeParams, type CustomNodeData } from "../../lib/layout/layout";
import { AddAction } from "./add-action";
import { Code } from "./code";
import { JsonEditor } from "./json-editor";

/** Human-readable labels per condition variant. */
const CONDITION_LABELS: Record<string, string> = {
  timestamp_elapsed: "time passed",
  blocks_completed: "blocks passed",
  fin_limit_order_filled: "order filled",
  strategy_status: "strategy status",
  oracle_price: "oracle price",
  asset_value_ratio: "value ratio",
};

const conditionKey = (condition: Condition): string => Object.keys(condition)[0];

const labelOf = (condition: Condition): string => {
  if ("balance_available" in condition) {
    return `check ${condition.balance_available.amount.displayName.toUpperCase()} balance`;
  }
  if ("can_swap" in condition) {
    const swap = condition.can_swap;
    // Non-breaking spaces keep the pair on one line when the label wraps.
    return `check ${swap.swap_amount.displayName.toUpperCase()}\u00A0/\u00A0${swap.minimum_receive_amount.displayName.toUpperCase()} liquidity`;
  }
  return CONDITION_LABELS[conditionKey(condition)] ?? conditionKey(condition);
};

const describe = (condition: Condition): string => {
  if ("can_swap" in condition) {
    const swap = condition.can_swap;
    return `can swap ${swap.swap_amount.amount} ${swap.swap_amount.displayName} for at least ${swap.minimum_receive_amount.amount} ${swap.minimum_receive_amount.displayName}`;
  }
  if ("balance_available" in condition) {
    const balance = condition.balance_available;
    return `at least ${balance.amount.amount} ${balance.amount.displayName} available`;
  }
  if ("timestamp_elapsed" in condition) {
    return `after ${new Date(Number(condition.timestamp_elapsed) / 1_000_000).toISOString()}`;
  }
  if ("blocks_completed" in condition) {
    return `after block ${condition.blocks_completed}`;
  }
  if ("oracle_price" in condition) {
    const oracle = condition.oracle_price;
    return `${oracle.asset} price ${oracle.direction} ${BigDecimal.format(oracle.price)}`;
  }
  if ("strategy_status" in condition) {
    return `strategy is ${condition.strategy_status.status}`;
  }
  if ("fin_limit_order_filled" in condition) {
    return `limit order at ${BigDecimal.format(condition.fin_limit_order_filled.price)} filled`;
  }
  return conditionKey(condition);
};

/**
 * Read-mostly node for the condition variants without a dedicated editor.
 * The success branch chains via addNext; the payload is edited as JSON.
 */
export function ConditionNode({
  data: { id, condition, remove, addNext, hasOutgoing, hasFailure },
}: CustomNodeData<ConditionNodeParams>) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isEditingJson, setIsEditingJson] = useState(false);

  const label = labelOf(condition);

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
      summary={<Code className="text-xl text-zinc-300">{label}</Code>}
      details={<Code className="text-sm text-zinc-300">{describe(condition)}</Code>}
      modal={
        <div className="flex flex-col gap-8">
          {!isEditingJson && (
            <div className="flex flex-col gap-2">
              <code className="text-sm text-zinc-400">condition</code>
              <Code className="text-lg text-zinc-200">{describe(condition)}</Code>
              <code className="text-sm text-zinc-500">Edit this condition via the JSON view.</code>
            </div>
          )}
          {!isEditingJson && addNext && (
            <AddAction
              onAdd={addNext}
              isHelpOpen={isHelpOpen}
              helpMessage="Select the next step to execute when this condition passes."
            />
          )}
          {isEditingJson && (
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
          )}
        </div>
      }
    />
  );
}
