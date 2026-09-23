import type { Asset } from "@template/domain/assets";
import type { Node as CalcNode } from "@template/domain/calc";
import { useState } from "react";
import { useAssets } from "../../hooks/use-assets";
import { Input } from "../ui/input";
import { TruncateInput } from "../ui/truncate-input";
import { RUJI_DENOM, type StrategyTemplate, type TemplateContext, type TemplateParams, USDC_DENOM } from "./templates";

const TIME_UNITS = { seconds: 1, minutes: 60, hours: 60 * 60, days: 24 * 60 * 60 } as const;
type CadenceUnit = "blocks" | keyof typeof TIME_UNITS;
const NEXT_UNIT: Record<CadenceUnit, CadenceUnit> = {
  blocks: "seconds",
  seconds: "minutes",
  minutes: "hours",
  hours: "days",
  days: "blocks",
};

interface DestinationDraft {
  address: string;
  /** This destination's cut as a percentage; shares are percent x 100. */
  percent: string;
}

/**
 * The template initialization questions: which pair to trade, how much per
 * swap, slippage protection, the cadence, and (for auto-distribute
 * templates) where the funds should end up.
 */
export function TemplateSetupForm({
  template,
  context,
  onCreate,
  onCancel,
}: {
  template: StrategyTemplate;
  context: TemplateContext;
  onCreate: (label: string, owner: string, nodes: CalcNode[]) => void;
  onCancel: () => void;
}) {
  const { assets } = useAssets();

  const [swapAsset, setSwapAsset] = useState<Asset | undefined>(context.assetsByDenom[USDC_DENOM] ?? assets.at(0));
  const [receiveAsset, setReceiveAsset] = useState<Asset | undefined>(
    context.assetsByDenom[RUJI_DENOM] ?? assets.at(1),
  );
  // The label tracks the chosen pair until the user edits it by hand.
  const [editedLabel, setEditedLabel] = useState<string>();
  const label =
    editedLabel ??
    (swapAsset && receiveAsset ? template.strategyLabel(swapAsset, receiveAsset) : template.label);
  const [owner, setOwner] = useState(context.owner ?? "");
  const [swapAmount, setSwapAmount] = useState(100);
  const [slippagePercent, setSlippagePercent] = useState(2);
  const [cadenceValue, setCadenceValue] = useState(100);
  const [cadenceUnit, setCadenceUnit] = useState<CadenceUnit>("blocks");
  const [destinations, setDestinations] = useState<DestinationDraft[]>([
    { address: context.owner ?? "", percent: "100" },
  ]);

  const [selecting, setSelecting] = useState<"swap" | "receive">();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // The same expanding blue help blocks the node modals use. Collapsed, the
  // zero-height div would still occupy a flex gap slot — the negative margin
  // cancels it so field spacing is identical with help hidden.
  const help = (text: string) => (
    <div
      className={`transition-all duration-300 ease-in-out ${
        isHelpOpen ? "mt-0 px-1 pb-2 opacity-100" : "-mt-2 max-h-0 overflow-hidden opacity-0"
      }`}
    >
      <code className="text-sm font-medium text-pretty text-[#9CCCF0]">{text}</code>
    </div>
  );

  const totalPercent = destinations.reduce((acc, destination) => acc + Number(destination.percent || "0"), 0);

  // The creation requirements, always rendered as a checklist above the
  // Create draft button: green ticks when satisfied, red dashes when not.
  const checklist: { label: string; done: boolean }[] = [
    { label: "label set", done: label.trim() !== "" },
    { label: "swap amount set", done: swapAmount > 0 },
    {
      label: "swap and receive denoms differ",
      done: swapAsset !== undefined && receiveAsset !== undefined && swapAsset.denom !== receiveAsset.denom,
    },
    { label: "max slippage valid", done: slippagePercent >= 0 },
    { label: "cadence set", done: cadenceValue > 0 },
    ...(template.hasDestinations
      ? [
          {
            label: "destination addresses filled",
            done: destinations.every((destination) => destination.address.trim() !== ""),
          },
          {
            label: "destination percentages set",
            done: destinations.every((destination) => Number(destination.percent || "0") > 0),
          },
          {
            label: "destination percentages add up to 100",
            done: Math.abs(totalPercent - 100) < 0.001,
          },
        ]
      : []),
  ];

  const canCreate = swapAsset !== undefined && receiveAsset !== undefined && checklist.every((item) => item.done);

  const create = () => {
    if (!canCreate) return;
    const params: TemplateParams = {
      swapAsset,
      receiveAsset,
      swapAmount,
      maximumSlippageBps: Math.round(slippagePercent * 100),
      cadence:
        cadenceUnit === "blocks"
          ? { blocks: { interval: Math.round(cadenceValue) } }
          : { time: { duration: { secs: cadenceValue * TIME_UNITS[cadenceUnit], nanos: 0 } } },
      // Contract shares are relative weights with a 10,000 minimum total;
      // percent x 100 makes 100% = exactly 10,000.
      destinations: destinations.map(({ address, percent }) => ({
        address: address.trim(),
        shares: BigInt(Math.round(Number(percent || "0") * 100)),
      })),
    };
    onCreate(label.trim(), owner.trim(), template.makeNodes(context, params));
  };

  if (selecting) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3 py-6">
        {assets.map((asset) => (
          <code
            key={asset.denom}
            className="cursor-pointer rounded bg-zinc-900 px-2 py-[1px] font-mono text-xl hover:underline"
            style={{ color: asset.color }}
            onClick={() => {
              if (selecting === "swap") setSwapAsset(asset);
              else setReceiveAsset(asset);
              setSelecting(undefined);
            }}
          >
            {asset.displayName}
          </code>
        ))}
      </div>
    );
  }

  const denomChip = (asset: Asset | undefined, onClick: () => void) => (
    <div className="flex cursor-pointer items-center pr-3" onClick={onClick}>
      <code className="rounded px-1 py-[1px] font-mono hover:underline" style={{ color: asset?.color }}>
        {asset?.displayName ?? "select"}
      </code>
    </div>
  );

  return (
    <>
      <div className="absolute top-6 right-7.5">
        <code
          className="cursor-pointer font-mono text-sm text-zinc-500 underline"
          onClick={() => {
            setIsHelpOpen(!isHelpOpen);
          }}
        >
          {isHelpOpen ? "hide" : "help"}
        </code>
      </div>
      {/* Fills the drawer's height and scrolls when content exceeds it;
          with spare room the checklist's mt-auto sinks it to the bottom. */}
      <div className="flex h-full flex-col gap-4 overflow-y-auto text-xl" style={{ scrollbarWidth: "none" }}>
      <code className="text-lg text-zinc-200">{template.label}</code>
      <div className="flex flex-col gap-2">
        <code className="ml-1 font-mono text-sm text-zinc-400">label</code>
        {help("Name the draft so you can recognise it in the strategy list.")}
        <div className="flex rounded bg-zinc-900">
          <Input
            placeholder="label"
            className="w-full"
            value={label}
            onChange={(e) => {
              setEditedLabel(e.target.value);
            }}
            data-1p-ignore
            tabIndex={-1}
            autoFocus={false}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <code className="ml-1 font-mono text-sm text-zinc-400">swap_amount</code>
        {help("Enter the amount to swap on each execution, and pick the denom to swap from.")}
        <div className="flex gap-4 rounded bg-zinc-900">
          <Input
            type="number"
            placeholder="0.00"
            value={swapAmount || ""}
            onChange={(e) => {
              setSwapAmount(e.target.valueAsNumber || 0);
            }}
            inputMode="decimal"
            onWheel={(e) => {
              e.currentTarget.blur();
            }}
            tabIndex={-1}
            autoFocus={false}
          />
          {denomChip(swapAsset, () => {
            setSelecting("swap");
          })}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <code className="ml-1 font-mono text-sm text-zinc-400">receive_denom</code>
        {help("Pick the denom to receive. Each execution swaps the swap denom into this one.")}
        <div className="flex items-center justify-between rounded bg-zinc-900 py-2 pl-3">
          {denomChip(receiveAsset, () => {
            setSelecting("receive");
          })}
        </div>
      </div>
      <div className="flex gap-8">
        <div className="flex flex-1 flex-col gap-2">
          <code className="ml-1 font-mono text-sm text-zinc-400">max_slippage</code>
          {help("Enter the maximum slippage % allowed for each swap.")}
          <div className="flex rounded bg-zinc-900">
            <Input
              type="number"
              placeholder="0"
              value={slippagePercent}
              onChange={(e) => {
                setSlippagePercent(e.target.valueAsNumber || 0);
              }}
              inputMode="decimal"
              onWheel={(e) => {
                e.currentTarget.blur();
              }}
              tabIndex={-1}
              autoFocus={false}
            />
            <div className="flex items-center pr-4">
              <code className="font-mono text-xl text-zinc-500">%</code>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <code className="ml-1 font-mono text-sm text-zinc-400">every</code>
          {help("Set how often the strategy executes — click the unit to cycle blocks and time.")}
          <div className="flex items-center rounded bg-zinc-900">
            <Input
              type="number"
              placeholder="0"
              className="w-full"
              value={cadenceValue || ""}
              onChange={(e) => {
                setCadenceValue(e.target.valueAsNumber || 0);
              }}
              tabIndex={-1}
              autoFocus={false}
            />
            <code
              onClick={() => {
                setCadenceUnit(NEXT_UNIT[cadenceUnit]);
              }}
              className="cursor-pointer pr-3 text-lg text-zinc-400 hover:underline"
            >
              {cadenceUnit}
            </code>
          </div>
        </div>
      </div>
      {template.hasDestinations && (
        <div className="flex flex-col gap-2">
          <code className="ml-1 font-mono text-sm text-zinc-400">destinations</code>
          {help("Where funds go when the strategy drains: each address receives its percentage share.")}
          <div className="flex flex-col gap-2">
            {destinations.map((destination, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex flex-6 items-center rounded bg-zinc-900">
                  <TruncateInput
                    placeholder="address"
                    className="w-full"
                    value={destination.address}
                    onChange={(address) => {
                      setDestinations(destinations.map((d, i) => (i === index ? { ...d, address } : d)));
                    }}
                    data-1p-ignore
                    tabIndex={-1}
                    autoFocus={false}
                  />
                </div>
                <div className="flex flex-2 items-center rounded bg-zinc-900">
                  <Input
                    placeholder="0"
                    className="w-full"
                    type="number"
                    value={destination.percent}
                    onChange={(e) => {
                      setDestinations(
                        destinations.map((d, i) => (i === index ? { ...d, percent: e.target.value } : d)),
                      );
                    }}
                    tabIndex={-1}
                    autoFocus={false}
                  />
                  <code className="pr-3 font-mono text-zinc-500">%</code>
                </div>
                {destinations.length > 1 && (
                  <code
                    onClick={() => {
                      setDestinations(destinations.filter((_, i) => i !== index));
                    }}
                    className="flex cursor-pointer items-center rounded pl-2 text-xl text-zinc-400 hover:text-zinc-200"
                  >
                    x
                  </code>
                )}
              </div>
            ))}
            <code
              onClick={() => {
                setDestinations([...destinations, { address: "", percent: "" }]);
              }}
              className="cursor-pointer self-start pt-1 text-sm text-green-300 hover:underline"
            >
              + add destination
            </code>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <code className="ml-1 font-mono text-sm text-zinc-400">owner</code>
        {help("The address that owns the strategy — it can pause, withdraw, and update it.")}
        <div className="flex rounded bg-zinc-900">
          <TruncateInput
            placeholder="address"
            className="w-full"
            value={owner}
            onChange={setOwner}
            data-1p-ignore
            tabIndex={-1}
            autoFocus={false}
          />
        </div>
      </div>
      <div className="mt-auto flex flex-col gap-1 pt-1">
        {checklist.map((item) => (
          <code
            key={item.label}
            className={`font-mono text-sm ${item.done ? "text-green-300/70" : "text-red-500/60"}`}
          >
            {item.done ? "✓" : "-"} {item.label}
          </code>
        ))}
      </div>
      <div className="flex items-baseline justify-end gap-4 pt-2">
        <code onClick={onCancel} className="cursor-pointer text-lg text-zinc-400 hover:underline">
          Cancel
        </code>
        <code className="text-lg text-zinc-600">|</code>
        <code
          onClick={create}
          className={`text-lg ${canCreate ? "cursor-pointer text-green-300 hover:underline" : "cursor-not-allowed text-zinc-600"}`}
        >
          Create draft
        </code>
      </div>
      </div>
    </>
  );
}
