import { useForm } from "@tanstack/react-form";
import { SwapAction } from "@template/domain/src/calc";
import { formatNumber } from "@template/domain/src/numbers";
import "@xyflow/react/dist/style.css";
import { BigDecimal, Schema } from "effect";
import { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { useAssets } from "../../hooks/use-assets";
import {
  type ActionNodeParams,
  type CustomNodeData,
} from "../../lib/layout/layout";
import { BaseNode } from "./base-node";

export function SwapNode({
  data: { action, update },
}: CustomNodeData<ActionNodeParams<SwapAction>>) {
  const form = useForm({
    defaultValues: action,
    validators: {
      onChange: ({ value }) => {
        const validationResult =
          Schema.standardSchemaV1(SwapAction)["~standard"].validate(value);

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
              {} as Record<string, string>
            ),
          };
        }

        update(value);
      },
    },
  });

  useEffect(form.reset, [action]);

  const [isSelectingSwapDenom, setIsSelectingSwapDenom] = useState(false);
  const [isSelectingReceiveDenom, setIsSelectingReceiveDenom] = useState(false);

  const assets = useAssets();

  const isSelectingAnyAsset = isSelectingSwapDenom || isSelectingReceiveDenom;

  const assetSelector = (
    <div className="flex flex-wrap items-center justify-center gap-3 py-6">
      {assets.map((asset) => (
        <code
          key={asset.denom}
          className="font-mono px-2 py-[1px] text-xl rounded cursor-pointer hover:underline bg-zinc-900"
          style={{ color: asset.color }}
          onClick={() => {
            isSelectingSwapDenom
              ? update({
                  swap: {
                    ...form.state.values.swap,
                    swap_amount: {
                      ...asset,
                      amount: form.state.values.swap.swap_amount.amount,
                    },
                  },
                })
              : update({
                  swap: {
                    ...form.state.values.swap,
                    minimum_receive_amount: {
                      ...asset,
                      amount:
                        form.state.values.swap.minimum_receive_amount.amount,
                    },
                  },
                });
            setIsSelectingReceiveDenom(false);
            setIsSelectingSwapDenom(false);
          }}
        >
          {asset.displayName}
        </code>
      ))}
    </div>
  );

  return (
    <BaseNode
      handleLeft
      title={
        <code className="text-4xl font-mono bg-zinc-900 px-1 py-[1px] rounded text-zinc-100">
          SWAP
        </code>
      }
      summary={
        <div className="text-xl text-zinc-300">
          Swap{" "}
          <code
            className="font-mono px-1 py-[1px] rounded"
            style={{ color: action.swap.swap_amount.color }}
          >
            {action.swap.swap_amount.displayName}
          </code>{" "}
          into{" "}
          <code
            className="font-mono  px-1 py-[1px] rounded"
            style={{ color: action.swap.minimum_receive_amount.color }}
          >
            {action.swap.minimum_receive_amount.displayName}
          </code>
        </div>
      }
      details={
        <p className="text-sm text-zinc-300 leading-5.5">
          Swap{" "}
          <code className="font-mono bg-zinc-900 px-1 py-[1px] rounded">
            {formatNumber(action.swap.swap_amount.amount)}
          </code>
          <code
            className="font-mono px-1 py-[1px] rounded"
            style={{ color: action.swap.swap_amount.color }}
          >
            {action.swap.swap_amount.displayName}
          </code>{" "}
          into at least{" "}
          <code className="font-mono bg-zinc-900 px-1 py-[1px] rounded">
            {formatNumber(action.swap.minimum_receive_amount.amount)}
          </code>
          <code
            className="font-mono px-1 py-[1px] rounded"
            style={{ color: action.swap.minimum_receive_amount.color }}
          >
            {action.swap.minimum_receive_amount.displayName}
          </code>{" "}
          with a maximum slippage of{" "}
          <code className="font-mono bg-zinc-900 px-1 py-[1px] rounded text-zinc-400">
            {action.swap.maximum_slippage_bps / 100}%
          </code>
        </p>
      }
      modal={(closeModal) => (
        <div className="transition-all duration-300 ease-in-out overflow-hidden ">
          <div
            className={`transition-all duration-300 ease-in-out ${
              isSelectingAnyAsset
                ? "opacity-0 h-0 overflow-hidden"
                : "opacity-100 h-auto"
            }`}
          >
            {!isSelectingAnyAsset && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                  closeModal();
                }}
              >
                <div className="flex flex-col gap-8 text-xl">
                  <form.Field
                    name="swap.swap_amount.amount"
                    children={(field) => (
                      <div className="flex flex-col gap-2">
                        <code className="font-mono ml-1 text-sm text-zinc-400">
                          swap_amount
                        </code>
                        <div className="flex bg-zinc-900 rounded gap-4">
                          <Input
                            type="number"
                            placeholder="0.00"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            style={{
                              background: "transparent",
                              fontSize: "1.25rem",
                              border: "none",
                              boxShadow: "none",
                            }}
                            onChange={(e) =>
                              field.handleChange(e.target.valueAsNumber)
                            }
                            inputMode="decimal"
                            onWheel={(e) => e.currentTarget.blur()}
                            tabIndex={-1}
                            autoFocus={false}
                          />
                          <div
                            className="flex-1 items-center mt-2.5 pr-3 cursor-pointer"
                            onClick={() => setIsSelectingSwapDenom(true)}
                          >
                            <code
                              className="font-mono px-1 py-[1px] rounded hover:underline"
                              style={{ color: action.swap.swap_amount.color }}
                            >
                              {
                                form.getFieldValue("swap.swap_amount")
                                  .displayName
                              }
                            </code>
                          </div>
                        </div>
                        {!field.state.meta.isValid && (
                          <p className="text-red-500/60 text-sm font-mono">
                            {field.state.meta.errors.join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                  />
                  <form.Field
                    name="swap.minimum_receive_amount.amount"
                    children={(field) => (
                      <div className="flex flex-col gap-2">
                        <code className="font-mono ml-1 text-sm text-zinc-400">
                          minimum_receive_amount
                        </code>
                        <div className="flex bg-zinc-900 rounded gap-4">
                          <Input
                            type="number"
                            placeholder="0.00"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            style={{
                              background: "transparent",
                              fontSize: "1.25rem",
                              border: "none",
                              boxShadow: "none",
                            }}
                            onChange={(e) =>
                              field.handleChange(e.target.valueAsNumber)
                            }
                            inputMode="decimal"
                            onWheel={(e) => e.currentTarget.blur()}
                            tabIndex={-1}
                            autoFocus={false}
                          />
                          <div
                            className="flex-1 items-center mt-2.5 pr-3 cursor-pointer"
                            onClick={() => setIsSelectingReceiveDenom(true)}
                          >
                            <code
                              className="font-mono px-1 py-[1px] rounded hover:underline"
                              style={{
                                color: action.swap.minimum_receive_amount.color,
                              }}
                            >
                              {
                                form.getFieldValue(
                                  "swap.minimum_receive_amount"
                                ).displayName
                              }
                            </code>
                          </div>
                        </div>
                        {!field.state.meta.isValid && (
                          <p className="text-red-500/60 text-sm font-mono">
                            {field.state.meta.errors.join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                  />
                  <form.Field
                    name="swap.adjustment"
                    children={(field) => (
                      <div className="flex flex-col">
                        <div className="grid grid-cols-2 gap-8">
                          <form.Field
                            name="swap.maximum_slippage_bps"
                            children={(field) => (
                              <div className="flex flex-col gap-2 ">
                                <code className="font-mono ml-1 text-sm text-zinc-400">
                                  slippage_tolerance
                                </code>
                                <div className="flex bg-zinc-900 rounded gap-4">
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value / 100}
                                    onBlur={field.handleBlur}
                                    style={{
                                      background: "transparent",
                                      fontSize: "1.25rem",
                                      border: "none",
                                      boxShadow: "none",
                                    }}
                                    onChange={(e) =>
                                      field.handleChange(
                                        Math.round(e.target.valueAsNumber * 100)
                                      )
                                    }
                                    inputMode="decimal"
                                    onWheel={(e) => e.currentTarget.blur()}
                                    tabIndex={-1}
                                    autoFocus={false}
                                  />
                                  <div className="flex items-center pr-4">
                                    <code className="font-mono text-xl text-zinc-400">
                                      %
                                    </code>
                                  </div>
                                </div>
                                {!field.state.meta.isValid && (
                                  <p className="text-red-500/70 text-sm font-mono">
                                    {field.state.meta.errors.join(", ")}
                                  </p>
                                )}
                              </div>
                            )}
                          />
                          <div className="flex flex-col gap-2">
                            <code className="font-mono text-sm text-zinc-400">
                              swap_adjustment
                            </code>
                            <div className="flex w-full justify-around items-center h-full">
                              <code
                                className={`text-sm cursor-pointer hover:underline ${
                                  field.state.value === "fixed"
                                    ? "text-green-500/90"
                                    : "text-zinc-500"
                                }`}
                                onClick={() => {
                                  field.handleChange("fixed");
                                }}
                              >
                                fixed
                              </code>
                              <code className="text-sm">|</code>
                              <code
                                className={`text-sm cursor-pointer hover:underline ${
                                  field.state.value !== "fixed"
                                    ? "text-orange-500/90"
                                    : "text-zinc-500"
                                }`}
                                onClick={() => {
                                  field.handleChange({
                                    linear_scalar: {
                                      base_receive_amount:
                                        action.swap.minimum_receive_amount,
                                      minimum_swap_amount: null,
                                      scalar: BigDecimal.unsafeFromNumber(3),
                                    },
                                  });
                                }}
                              >
                                scaled
                              </code>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`transition-all duration-300 ease-in-out ${
                            field.state.value !== "fixed"
                              ? "opacity-100 max-h-[500px]"
                              : "opacity-0 max-h-0 overflow-hidden"
                          }`}
                        >
                          <div className="flex gap-8 pt-8">
                            <form.Field
                              name="swap.adjustment.linear_scalar.base_receive_amount.amount"
                              children={(field) => (
                                <div className="flex flex-col gap-2">
                                  <code className="font-mono ml-1 text-sm text-zinc-400">
                                    base_receive_amount
                                  </code>
                                  <div className="flex bg-zinc-900 rounded gap-4">
                                    <Input
                                      type="number"
                                      placeholder="0.00"
                                      id={field.name}
                                      name={field.name}
                                      value={field.state.value}
                                      onBlur={field.handleBlur}
                                      style={{
                                        background: "transparent",
                                        fontSize: "1.25rem",
                                        border: "none",
                                        boxShadow: "none",
                                      }}
                                      onChange={(e) => {
                                        field.handleChange(
                                          e.target.valueAsNumber
                                        );
                                      }}
                                      inputMode="decimal"
                                      onWheel={(e) => e.currentTarget.blur()}
                                      tabIndex={-1}
                                      autoFocus={false}
                                    />
                                    <div className="flex items-center pr-4">
                                      <code className="font-mono text-xl"></code>
                                    </div>
                                  </div>
                                </div>
                              )}
                            />
                            <form.Field
                              name="swap.adjustment.linear_scalar.scalar"
                              children={(field) => (
                                <div className="flex flex-col gap-2">
                                  <code className="font-mono ml-1 text-sm text-zinc-400">
                                    multiplier
                                  </code>
                                  <div className="flex bg-zinc-900 rounded gap-4">
                                    <Input
                                      type="number"
                                      placeholder="0.00"
                                      id={field.name}
                                      name={field.name}
                                      value={
                                        field.state.value &&
                                        BigDecimal.unsafeToNumber(
                                          field.state.value
                                        )
                                      }
                                      onBlur={field.handleBlur}
                                      style={{
                                        background: "transparent",
                                        fontSize: "1.25rem",
                                        border: "none",
                                        boxShadow: "none",
                                      }}
                                      onChange={(e) => {
                                        field.handleChange(
                                          BigDecimal.unsafeFromNumber(
                                            e.target.valueAsNumber
                                          )
                                        );
                                      }}
                                      inputMode="decimal"
                                      onWheel={(e) => e.currentTarget.blur()}
                                      tabIndex={-1}
                                      autoFocus={false}
                                    />
                                    <div className="flex items-center pr-4">
                                      <code className="font-mono text-xl"></code>
                                    </div>
                                  </div>
                                </div>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </form>
            )}
          </div>
          <div
            className={`transition-all duration-300 ease-in-out ${
              isSelectingAnyAsset
                ? "opacity-100 h-auto"
                : "opacity-0 h-0 overflow-hidden"
            }`}
          >
            {isSelectingAnyAsset && assetSelector}
          </div>
        </div>
      )}
    />
  );
}
