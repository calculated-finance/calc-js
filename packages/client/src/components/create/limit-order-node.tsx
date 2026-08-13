import { FinLimitOrder } from "@template/domain/calc";
import "@xyflow/react/dist/style.css";
import { BigDecimal } from "effect";
import { useState } from "react";
import { BaseNode } from "../../components/create/base-node";
import { useAssets } from "../../hooks/use-assets";
import { type CustomNodeData, type LimitOrderNodeParams } from "../../lib/layout/layout";
import { AddAction } from "./add-action";
import { Code } from "./code";
import { JsonEditor } from "./json-editor";

const describePrice = (limitOrder: FinLimitOrder): string => {
  if ("fixed" in limitOrder.strategy) {
    return `at ${BigDecimal.format(limitOrder.strategy.fixed)}`;
  }
  const offset = limitOrder.strategy.offset;
  const amount =
    "exact" in offset.offset ? BigDecimal.format(offset.offset.exact) : `${offset.offset.percent / 100}%`;
  return `${amount} ${offset.direction} ${offset.side}`;
};

/**
 * Display node for FIN limit orders. Live strategies use these heavily
 * (TWAPs, grids); the payload is edited as JSON until a dedicated form
 * exists.
 */
export function LimitOrderNode({
  data: { id, limitOrder, remove, addNext },
}: CustomNodeData<LimitOrderNodeParams>) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isEditingJson, setIsEditingJson] = useState(false);

  const { assetsByDenom } = useAssets();
  const bidAsset = assetsByDenom[limitOrder.bid_denom]?.displayName ?? limitOrder.bid_denom;

  const bid =
    "fixed" in limitOrder.bid_amount
      ? `${String(limitOrder.bid_amount.fixed)} (base units)`
      : `${BigDecimal.format(limitOrder.bid_amount.fraction)} of balance`;

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
      title={<code className="rounded bg-zinc-900 px-1 py-[1px] font-mono text-4xl text-zinc-100">ORDER</code>}
      summary={
        <div className="flex flex-col gap-1.5 text-xl text-zinc-300">
          <code>LIMIT ORDER</code>
          <Code className="rounded px-1 font-mono">{`${limitOrder.side.toUpperCase()} ${bidAsset}`}</Code>
        </div>
      }
      details={
        <Code className="text-sm">{`${limitOrder.side === "base" ? "Sell" : "Buy"} with ${bid} ${bidAsset} ${describePrice(limitOrder)}`}</Code>
      }
      modal={
        <div className="flex flex-col gap-8">
          {!isEditingJson && (
            <div className="flex flex-col gap-2">
              <code className="text-sm text-zinc-400">limit_order</code>
              <code className="text-lg text-zinc-200">{`${limitOrder.side} side, bid ${bid} ${bidAsset}, ${describePrice(limitOrder)}`}</code>
              <code className="text-sm text-zinc-500">Edit this order via the JSON view.</code>
            </div>
          )}
          {!isEditingJson && addNext && (
            <AddAction
              onAdd={addNext}
              isHelpOpen={isHelpOpen}
              helpMessage="Add the next step to run after this order is (re)placed."
            />
          )}
          {isEditingJson && (
            <JsonEditor
              value={limitOrder}
              schema={FinLimitOrder}
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
