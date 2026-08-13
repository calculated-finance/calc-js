import { Condition } from "@template/domain/calc";
import "@xyflow/react/dist/style.css";
import { BigDecimal } from "effect";
import { useState } from "react";
import { BaseNode } from "../../components/create/base-node";
import { type ConditionNodeParams, type CustomNodeData } from "../../lib/layout/layout";
import { AddAction } from "./add-action";
import { JsonEditor } from "./json-editor";

/** Human-readable labels per condition variant. */
const CONDITION_LABELS: Record<string, string> = {
  timestamp_elapsed: "TIME PASSED",
  blocks_completed: "BLOCKS PASSED",
  can_swap: "CAN SWAP",
  fin_limit_order_filled: "ORDER FILLED",
  balance_available: "BALANCE",
  strategy_status: "STRATEGY STATUS",
  oracle_price: "ORACLE PRICE",
  asset_value_ratio: "VALUE RATIO",
};

const conditionKey = (condition: Condition): string => Object.keys(condition)[0];

const describe = (condition: Condition): string => {
  if ("can_swap" in condition) {
    const swap = condition.can_swap;
    return `Can swap ${swap.swap_amount.amount} ${swap.swap_amount.displayName} for at least ${swap.minimum_receive_amount.amount} ${swap.minimum_receive_amount.displayName}`;
  }
  if ("balance_available" in condition) {
    const balance = condition.balance_available;
    return `At least ${balance.amount.amount} ${balance.amount.displayName} available`;
  }
  if ("timestamp_elapsed" in condition) {
    return `After ${new Date(Number(condition.timestamp_elapsed) / 1_000_000).toISOString()}`;
  }
  if ("blocks_completed" in condition) {
    return `After block ${condition.blocks_completed}`;
  }
  if ("oracle_price" in condition) {
    const oracle = condition.oracle_price;
    return `${oracle.asset} price ${oracle.direction} ${BigDecimal.format(oracle.price)}`;
  }
  if ("strategy_status" in condition) {
    return `Strategy is ${condition.strategy_status.status}`;
  }
  if ("fin_limit_order_filled" in condition) {
    return `Limit order at ${BigDecimal.format(condition.fin_limit_order_filled.price)} filled`;
  }
  return conditionKey(condition);
};

/**
 * Read-mostly node for the condition variants without a dedicated editor.
 * The success branch chains via addNext; the payload is edited as JSON.
 */
export function ConditionNode({
  data: { id, condition, remove, addNext },
}: CustomNodeData<ConditionNodeParams>) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isEditingJson, setIsEditingJson] = useState(false);

  const label = CONDITION_LABELS[conditionKey(condition)] ?? conditionKey(condition).toUpperCase();

  return (
    <BaseNode
      id={id}
      handleLeft
      handleRight={!addNext}
      isHelping={isHelpOpen}
      setHelp={() => { setIsHelpOpen(!isHelpOpen); }}
      isEditingJson={isEditingJson}
      setIsEditingJson={() => { setIsEditingJson(!isEditingJson); }}
      onDelete={remove}
      title={<code className="rounded bg-zinc-900 px-1 py-[1px] font-mono text-4xl text-zinc-100">IF</code>}
      summary={<code className="flex flex-col gap-1.5 text-xl text-zinc-300">{label}</code>}
      details={<code className="text-sm text-zinc-300">{describe(condition)}</code>}
      modal={
        <div className="flex flex-col gap-8">
          {!isEditingJson && (
            <div className="flex flex-col gap-2">
              <code className="text-sm text-zinc-400">condition</code>
              <code className="text-lg text-zinc-200">{describe(condition)}</code>
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
