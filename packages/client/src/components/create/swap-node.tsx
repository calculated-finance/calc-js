import { useForm } from "@tanstack/react-form";
import { Swap, SwapAction } from "@template/domain/src/calc";
import { formatNumber } from "@template/domain/src/numbers";
import "@xyflow/react/dist/style.css";
import { Effect, Schema } from "effect";
import "prism-themes/themes/prism-duotone-sea.css";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import { useEffect, useRef, useState } from "react";
import Editor from "react-simple-code-editor";
import { Input } from "../../components/ui/input";
import { useAssets } from "../../hooks/use-assets";
import { useAvailableRoutes } from "../../hooks/use-available-routes";
import { type ActionNodeParams, type CustomNodeData } from "../../lib/layout/layout";
import { BaseNode } from "./base-node";

function JsonEditor<T, U>({ data, onExit }: { data: T; schema: U; onSave: (data: T) => void; onExit?: () => void }) {
  const [localCode] = useState<string>(JSON.stringify(data, null, 4));

  return (
    <div className="mt-4 max-h-150 w-300 overflow-auto" style={{ scrollbarWidth: "none" }}>
      <Editor
        textareaClassName="outline-none"
        value={localCode}
        onValueChange={() => {}}
        highlight={(code) => Prism.highlight(code, Prism.languages.json, "json")}
        autoFocus={true}
        tabIndex={-1}
        style={{
          maxWidth: "450px",
          backgroundColor: "#transparent",
          fontFamily: "monospace",
          fontSize: "1rem",
          lineHeight: "1.7",
          overflow: "visible",
          scrollbarWidth: "none",
          paddingRight: "50px",
        }}
      />
      <style>{`
        .max-h-100::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="absolute top-6 right-6 flex gap-4">
        <code
          className="cursor-pointer text-sm text-zinc-500 underline"
          onClick={() => {
            navigator.clipboard.writeText(localCode);
          }}
        >
          copy
        </code>
        <code className="cursor-pointer text-sm text-zinc-500 underline" onClick={onExit}>
          exit
        </code>
      </div>
    </div>
  );
}

export function SwapNode({ data: { action, update, remove } }: CustomNodeData<ActionNodeParams<SwapAction>>) {
  const form = useForm({
    defaultValues: action,
    validators: {
      onChange: ({ value }) => {
        const validationResult = Schema.standardSchemaV1(SwapAction)["~standard"].validate(value);

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
          className="cursor-pointer rounded bg-zinc-900 px-2 py-[1px] font-mono text-xl hover:underline"
          style={{ color: asset.color }}
          onClick={() => {
            const updatedAction = isSelectingSwapDenom
              ? {
                  ...form.state.values,
                  swap: {
                    ...form.state.values.swap,
                    swap_amount: {
                      ...asset,
                      amount: form.state.values.swap.swap_amount.amount,
                    },
                    routes: [],
                  },
                }
              : {
                  ...form.state.values,
                  swap: {
                    ...form.state.values.swap,
                    minimum_receive_amount: {
                      ...asset,
                      amount: form.state.values.swap.minimum_receive_amount.amount,
                    },
                    routes: [],
                  },
                };

            setIsSelectingReceiveDenom(false);
            setIsSelectingSwapDenom(false);
            update(updatedAction);
          }}
        >
          {asset.displayName}
        </code>
      ))}
    </div>
  );

  const [isEditingJson, setIsEditingJson] = useState(false);
  const [isBuying, setIsBuying] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const routes = useAvailableRoutes([action.swap.swap_amount.denom, action.swap.minimum_receive_amount.denom]);

  const modalRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (modalRef.current && modalRef.current.scrollHeight > modalRef.current.clientHeight) {
      modalRef.current.scrollTop = modalRef.current.scrollHeight;
    }
  };

  return (
    <BaseNode
      id={action.id}
      onDelete={remove}
      handleLeft
      title={<code className="rounded bg-zinc-900 px-1 py-[1px] font-mono text-4xl text-zinc-100">SWAP</code>}
      summary={
        <div className="flex flex-col gap-1.5 text-xl text-zinc-300">
          <code>SWAP</code>
          <div>
            <code className="rounded px-1 font-mono" style={{ color: action.swap.swap_amount.color }}>
              {action.swap.swap_amount.displayName}
            </code>
            {" --> "}
            <code className="rounded px-1 font-mono" style={{ color: action.swap.minimum_receive_amount.color }}>
              {action.swap.minimum_receive_amount.displayName}
            </code>
          </div>
        </div>
      }
      details={
        <p className="text-xs leading-5.5 text-zinc-300">
          Swap{" "}
          <code className="rounded bg-zinc-900 px-1 py-[1px] font-mono">
            {formatNumber(action.swap.swap_amount.amount || 0)}
          </code>
          <code className="rounded px-1 py-[1px] font-mono" style={{ color: action.swap.swap_amount.color }}>
            {action.swap.swap_amount.displayName}
          </code>{" "}
          into at least{" "}
          <code className="rounded bg-zinc-900 px-1 py-[1px] font-mono">
            {formatNumber(action.swap.minimum_receive_amount.amount || 0)}
          </code>
          <code className="rounded px-1 py-[1px] font-mono" style={{ color: action.swap.minimum_receive_amount.color }}>
            {action.swap.minimum_receive_amount.displayName}
          </code>{" "}
          with a maximum slippage of{" "}
          <code className="rounded bg-zinc-900 px-1 py-[1px] font-mono text-zinc-400">
            {action.swap.maximum_slippage_bps / 100}%
          </code>
        </p>
      }
      modal={
        <div
          ref={modalRef}
          className="max-h-[66vh] overflow-auto transition-all duration-300 ease-in-out"
          style={{ scrollbarWidth: "none" }}
        >
          <style>{`
            .max-h-\\[66vh\\]::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div
            className={`transition-all duration-300 ease-in-out ${
              isSelectingAnyAsset ? "h-0 overflow-hidden opacity-0" : "h-auto opacity-100"
            }`}
          >
            {!isSelectingAnyAsset && !isEditingJson && (
              <form>
                <div className="flex flex-col gap-4 text-xl">
                  <div className="absolute top-6 right-6 flex gap-4">
                    <code
                      className="cursor-pointer font-mono text-sm text-zinc-500 underline"
                      onClick={() => setIsEditingJson(true)}
                    >
                      json
                    </code>
                    <code
                      className="cursor-pointer font-mono text-sm text-zinc-500 underline"
                      onClick={() => setIsHelpOpen(!isHelpOpen)}
                    >
                      {isHelpOpen ? "hide" : "help"}
                    </code>
                  </div>
                  <form.Field
                    name="swap.swap_amount.amount"
                    children={(field) => (
                      <div className="flex flex-col gap-0">
                        <div
                          className={`transition-all duration-300 ease-in-out ${
                            isHelpOpen ? "px-1 pt-8 pb-2 opacity-100" : "max-h-0 overflow-hidden opacity-0"
                          } `}
                        >
                          <code className="text-sm text-pretty text-blue-400/80">
                            Enter the amount you want to swap. CALC may try to swap this exact amount, or use it to
                            calculate an adjusted amount if SCALED adjustment is selected.
                          </code>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div
                            className={`transition-all duration-300 ease-in-out ${
                              !isHelpOpen ? "opacity-100" : "max-h-0 overflow-hidden opacity-0"
                            } `}
                          >
                            <code className="ml-1 font-mono text-sm text-zinc-400">swap_amount</code>
                          </div>
                          <div className="flex gap-4 rounded bg-zinc-900">
                            <Input
                              type="number"
                              placeholder="0.00"
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                              inputMode="decimal"
                              onWheel={(e) => e.currentTarget.blur()}
                              tabIndex={-1}
                              autoFocus={false}
                            />
                            <div
                              className="mt-2.5 flex-1 cursor-pointer items-center pr-3"
                              onClick={() => setIsSelectingSwapDenom(true)}
                            >
                              <code
                                className="rounded px-1 py-[1px] font-mono hover:underline"
                                style={{ color: action.swap.swap_amount.color }}
                              >
                                {form.getFieldValue("swap.swap_amount").displayName}
                              </code>
                            </div>
                          </div>
                          {!field.state.meta.isValid && (
                            <p className="font-mono text-sm text-red-500/60">{field.state.meta.errors.join(", ")}</p>
                          )}
                        </div>
                      </div>
                    )}
                  />
                  <form.Field
                    name="swap.minimum_receive_amount.amount"
                    children={(field) => (
                      <div className="flex flex-col gap-0">
                        <div
                          className={`transition-all duration-300 ease-in-out ${
                            isHelpOpen ? "px-1 pt-4 pb-2 opacity-100" : "max-h-0 overflow-hidden opacity-0"
                          } `}
                        >
                          <code className="text-sm text-pretty text-blue-400/80">
                            Enter the minimum amount to receive each swap - basically set a price floor or ceiling. Hit
                            the switch button below to invert the direction.
                          </code>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div
                            className={`transition-all duration-300 ease-in-out ${
                              !isHelpOpen ? "opacity-100" : "max-h-0 overflow-hidden opacity-0"
                            } `}
                          >
                            <code className="ml-1 font-mono text-sm text-zinc-400">minimum_receive_amount</code>
                          </div>
                          <div className="flex rounded bg-zinc-900">
                            <Input
                              type="number"
                              placeholder="0.00"
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) => {
                                field.handleChange(e.target.valueAsNumber || 0);
                              }}
                              inputMode="decimal"
                              onWheel={(e) => e.currentTarget.blur()}
                              tabIndex={-1}
                              autoFocus={false}
                            />
                            <div
                              className="mt-2.5 flex-1 cursor-pointer items-center pr-3"
                              onClick={() => setIsSelectingReceiveDenom(true)}
                            >
                              <code
                                className="rounded px-1 py-[1px] font-mono hover:underline"
                                style={{
                                  color: action.swap.minimum_receive_amount.color,
                                }}
                              >
                                {form.getFieldValue("swap.minimum_receive_amount").displayName}
                              </code>
                            </div>
                          </div>
                        </div>
                        {!field.state.meta.isValid ? (
                          <p className="font-mono text-sm text-red-500/60">{field.state.meta.errors.join(", ")}</p>
                        ) : (
                          <div className="flex justify-end gap-2 pt-1">
                            <code className="text-sm text-zinc-200">
                              {isBuying ? "buy " : "sell "}
                              {isBuying
                                ? form.state.values.swap.minimum_receive_amount.displayName
                                : form.state.values.swap.swap_amount.displayName}{" "}
                              at {isBuying ? "<" : ">"} $
                              {isBuying
                                ? formatNumber(
                                    field.state.value === 0
                                      ? 0
                                      : form.state.values.swap.swap_amount.amount / field.state.value,
                                  )
                                : formatNumber(
                                    field.state.value === 0
                                      ? Number.NEGATIVE_INFINITY
                                      : field.state.value / form.state.values.swap.swap_amount.amount,
                                  )}{" "}
                              {isBuying
                                ? form.state.values.swap.swap_amount.displayName
                                : form.state.values.swap.minimum_receive_amount.displayName}
                            </code>
                            <code
                              className="mt-[-1px] mr-1 cursor-pointer text-sm text-zinc-500 underline"
                              onClick={() => setIsBuying(!isBuying)}
                            >
                              switch
                            </code>
                          </div>
                        )}
                      </div>
                    )}
                  />
                  <form.Field
                    name="swap.routes"
                    children={(field) => {
                      const hasFinRoute = field.state.value.some((r) => "fin" in r);
                      const canRouteOnFin = routes.some((r) => "fin" in r);
                      const hasThorchainRoute = field.state.value.some((r) => "thorchain" in r);
                      const canRouteOnThorchain = routes.some((r) => "thorchain" in r);
                      return (
                        <div className="flex flex-col gap-0">
                          <div
                            className={`transition-all duration-300 ease-in-out ${
                              isHelpOpen ? "pt mt-[-5px] px-1 pb-4 opacity-100" : "max-h-0 overflow-hidden opacity-0"
                            } `}
                          >
                            <code className="text-sm text-pretty text-blue-400/80">
                              Select the possible routes that the swap can take. CALC will use whichever route has the
                              best returns at the time. Not all pairs can be take all routes.
                            </code>
                          </div>
                          <div className="mt-[-12px] flex flex-col gap-2">
                            <div
                              className={`transition-all duration-300 ease-in-out ${
                                !isHelpOpen ? "opacity-100" : "max-h-0 overflow-hidden opacity-0"
                              } `}
                            >
                              <code className="ml-1 font-mono text-sm text-zinc-400">swap_routes</code>
                            </div>
                            <div className="flex h-9 w-full items-center gap-2 p-1">
                              <code
                                className="cursor-pointer rounded-xs px-3 py-1 text-sm"
                                style={{
                                  backgroundColor: hasFinRoute && canRouteOnFin ? "#B223EF" : "transparent",
                                  color: !canRouteOnFin ? "gray" : hasFinRoute ? "black" : "#B223EF",
                                  border: canRouteOnFin ? "1px solid #B223EF" : "1px solid gray",
                                }}
                                onClick={() => {
                                  if (!canRouteOnFin) {
                                    return;
                                  }
                                  field.handleChange(
                                    hasFinRoute
                                      ? field.state.value.filter((r) => !("fin" in r))
                                      : [...field.state.value, ...routes.filter((r) => "fin" in r)],
                                  );
                                }}
                              >
                                RUJIRA
                              </code>
                              <code
                                className="cursor-pointer rounded-xs px-3 py-1 text-sm"
                                style={{
                                  backgroundColor: hasThorchainRoute && canRouteOnThorchain ? "#2CBE8C" : "transparent",
                                  color: !canRouteOnThorchain ? "gray" : hasThorchainRoute ? "black" : "#2CBE8C",
                                  border: canRouteOnThorchain ? "1px solid #2CBE8C" : "1px solid gray",
                                }}
                                onClick={() => {
                                  if (!canRouteOnThorchain) {
                                    return;
                                  }

                                  field.handleChange(
                                    hasThorchainRoute
                                      ? field.state.value.filter((r) => !("thorchain" in r))
                                      : [...field.state.value, { thorchain: {} }],
                                  );
                                }}
                              >
                                THORCHAIN
                              </code>
                            </div>
                            {form.state.values.swap.routes.length == 0 && (
                              <p className="font-mono text-sm text-red-500/60">Must select at least 1 route</p>
                            )}
                          </div>
                        </div>
                      );
                    }}
                  />
                  <form.Field
                    name="swap.adjustment"
                    children={(field) => (
                      <div className="flex flex-col">
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-8">
                            <form.Field
                              name="swap.maximum_slippage_bps"
                              children={(field) => (
                                <div className="flex flex-1 flex-col gap-0">
                                  <div
                                    className={`transition-all duration-300 ease-in-out ${
                                      isHelpOpen
                                        ? "h-full px-1 pt-4 pb-2 opacity-100"
                                        : "max-h-0 overflow-hidden opacity-0"
                                    } `}
                                  >
                                    <code className="text-sm text-pretty text-blue-400/80">
                                      Enter the maximum slippage % allowed for each swap.
                                    </code>
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <div
                                      className={`transition-all duration-300 ease-in-out ${
                                        !isHelpOpen ? "opacity-100" : "max-h-0 overflow-hidden opacity-0"
                                      } `}
                                    >
                                      <code className="ml-1 font-mono text-sm text-zinc-400">max_slippage</code>
                                    </div>
                                    <div className="flex rounded bg-zinc-900">
                                      <Input
                                        type="number"
                                        placeholder="0"
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value / 100}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(Math.round(e.target.valueAsNumber) * 100)}
                                        inputMode="decimal"
                                        onWheel={(e) => e.currentTarget.blur()}
                                        tabIndex={-1}
                                        autoFocus={false}
                                      />
                                      <div className="flex items-center pr-4">
                                        <code className="font-mono text-xl text-zinc-500">%</code>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            />
                            <div className="flex flex-2 flex-col gap-0">
                              <div
                                className={`transition-all duration-300 ease-in-out ${
                                  isHelpOpen ? "h-full px-1 pt-4 pb-2 opacity-100" : "max-h-0 overflow-hidden opacity-0"
                                } `}
                              >
                                <code className="text-sm text-pretty text-blue-400/80">
                                  Select the adjustment type for the swap. FIXED will swap the exact amount, while
                                  SCALED will adjust the amount based on the price of the asset.
                                </code>
                              </div>
                              <div
                                className={`flex h-full flex-col gap-2 ${isHelpOpen ? "justify-center" : "justify-start"}`}
                              >
                                <div
                                  className={`transition-all duration-300 ease-in-out ${
                                    !isHelpOpen ? "opacity-100" : "max-h-0 overflow-hidden opacity-0"
                                  } `}
                                >
                                  <code className="font-mono text-sm text-zinc-400">adjustment</code>
                                </div>
                                <div className="flex h-full w-full items-center justify-around">
                                  <code
                                    className={`cursor-pointer px-6 py-2 text-sm hover:text-[#9CCBF0]/70 ${
                                      field.state.value === "fixed" ? "text-[#9CCBF0]" : "text-zinc-500"
                                    }`}
                                    onClick={() => {
                                      field.handleChange("fixed");
                                    }}
                                  >
                                    FIXED
                                  </code>
                                  <code className="text-xl text-zinc-400">|</code>
                                  <code
                                    className={`cursor-pointer px-6 py-2 text-sm hover:text-[#FFB636]/70 ${
                                      field.state.value !== "fixed" ? "text-[#FFB636]" : "text-zinc-500"
                                    }`}
                                    onClick={() => {
                                      field.handleChange({
                                        linear_scalar: {
                                          base_receive_amount: action.swap.minimum_receive_amount,
                                          minimum_swap_amount: null,
                                          scalar: 3,
                                        },
                                      });
                                      setTimeout(() => {
                                        scrollToBottom();
                                      }, 350);
                                    }}
                                  >
                                    SCALED
                                  </code>
                                </div>
                              </div>
                            </div>
                          </div>
                          <form.Field
                            name="swap.maximum_slippage_bps"
                            children={(_) =>
                              !form.state.fieldMeta["swap.maximum_slippage_bps"]?.isValid && (
                                <p className="font-mono text-sm text-red-500/60">
                                  {form.state.fieldMeta["swap.maximum_slippage_bps"]?.errors.join(", ")}
                                </p>
                              )
                            }
                          />
                        </div>
                        <div
                          className={`transition-all duration-300 ease-in-out ${
                            field.state.value !== "fixed"
                              ? "max-h-[500px] opacity-100"
                              : "max-h-0 overflow-hidden opacity-0"
                          }`}
                        >
                          <div className="flex gap-8 pt-8">
                            <form.Field
                              name="swap.adjustment.linear_scalar.scalar"
                              children={(field) => (
                                <div className="flex flex-col gap-0">
                                  <div
                                    className={`transition-all duration-300 ease-in-out ${
                                      isHelpOpen ? "px-1 pb-2 opacity-100" : "max-h-0 overflow-hidden opacity-0"
                                    } `}
                                  >
                                    <code className="text-sm text-pretty text-blue-400/80">
                                      Enter the scalar value for the swap adjustment. This will adjust the amount
                                      swapped based on the price of the asset. You can see some indication of swap
                                      amounts at different prices below.
                                    </code>
                                  </div>
                                  <div className="flex w-full gap-8">
                                    <div className="flex flex-1 flex-col gap-2">
                                      <div
                                        className={`transition-all duration-300 ease-in-out ${
                                          !isHelpOpen ? "opacity-100" : "max-h-0 overflow-hidden opacity-0"
                                        } `}
                                      >
                                        <code className="ml-1 font-mono text-sm text-zinc-400">multiplier</code>
                                      </div>
                                      <div className="flex rounded bg-zinc-900">
                                        <Input
                                          type="number"
                                          placeholder="0.00"
                                          id={field.name}
                                          name={field.name}
                                          value={field.state.value || ""}
                                          onBlur={field.handleBlur}
                                          onChange={(e) => {
                                            field.handleChange(e.target.valueAsNumber);
                                          }}
                                          inputMode="decimal"
                                          onWheel={(e) => e.currentTarget.blur()}
                                          tabIndex={-1}
                                          autoFocus={false}
                                        />
                                        <div className="flex items-center pr-4">
                                          <code className="font-mono text-xl text-zinc-500">x</code>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex w-full flex-2 flex-col gap-2">
                                      <div
                                        className={`transition-all duration-300 ease-in-out ${
                                          !isHelpOpen ? "opacity-100" : "max-h-0 overflow-hidden opacity-0"
                                        } `}
                                      >
                                        <code className="ml-1 font-mono text-sm text-zinc-400 opacity-0">gradient</code>
                                      </div>
                                      <div className="ml-1 flex h-full items-center justify-between">
                                        <div className="flex flex-col items-start gap-2.5">
                                          <code className="text-xs text-zinc-400">
                                            price (
                                            {isBuying
                                              ? form.state.values.swap.swap_amount.displayName
                                              : form.state.values.swap.minimum_receive_amount.displayName}
                                            )
                                          </code>
                                          <code className="text-xs text-zinc-400">swap_amount</code>
                                        </div>
                                        <div className="flex flex-col items-center gap-2.5">
                                          <code className="text-xs text-zinc-200">
                                            {formatNumber(
                                              (isBuying
                                                ? form.state.values.swap.swap_amount.amount /
                                                  form.state.values.swap.minimum_receive_amount.amount
                                                : form.state.values.swap.minimum_receive_amount.amount /
                                                  form.state.values.swap.swap_amount.amount) *
                                                (1 - Math.min(1, 1 / field.state.value)),
                                            )}
                                          </code>
                                          <code className="text-xs text-zinc-200">
                                            {formatNumber(form.state.values.swap.swap_amount.amount * 2)}
                                          </code>
                                        </div>
                                        <div className="flex flex-col items-center gap-2.5">
                                          <code className="text-xs text-zinc-200">
                                            {formatNumber(
                                              isBuying
                                                ? form.state.values.swap.swap_amount.amount /
                                                    form.state.values.swap.minimum_receive_amount.amount
                                                : form.state.values.swap.minimum_receive_amount.amount /
                                                    form.state.values.swap.swap_amount.amount,
                                            )}
                                          </code>
                                          <code className="text-xs text-zinc-200">
                                            {formatNumber(form.state.values.swap.swap_amount.amount)}
                                          </code>
                                        </div>
                                        <div className="flex flex-col items-end gap-2.5">
                                          <code className="text-xs text-zinc-200">
                                            {formatNumber(
                                              (isBuying
                                                ? form.state.values.swap.swap_amount.amount /
                                                  form.state.values.swap.minimum_receive_amount.amount
                                                : form.state.values.swap.minimum_receive_amount.amount /
                                                  form.state.values.swap.swap_amount.amount) *
                                                (1 + 1 / field.state.value || 1),
                                            )}
                                          </code>
                                          <code className="text-xs text-zinc-200">{formatNumber(0)}</code>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            />
                          </div>
                          <form.Field
                            name="swap.adjustment.linear_scalar.scalar"
                            children={(field) => (
                              <>
                                {field.state.meta.isValid ? null : (
                                  <p className="pt-2 font-mono text-sm text-red-500/60">
                                    {field.state.meta.errors.join(", ")}
                                  </p>
                                )}
                              </>
                            )}
                          />
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
              isSelectingAnyAsset || isEditingJson ? "h-auto opacity-100" : "h-0 overflow-hidden opacity-0"
            }`}
          >
            {isSelectingAnyAsset && assetSelector}
            {isEditingJson && (
              <JsonEditor
                data={Effect.runSync(Schema.encode(Swap)(form.state.values.swap))}
                schema={Swap}
                onSave={() => {
                  setIsEditingJson(false);
                }}
                onExit={() => {
                  setIsEditingJson(false);
                }}
              />
            )}
          </div>
        </div>
      }
    />
  );
}
