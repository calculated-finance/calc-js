import type { Amount } from "@template/domain/assets";
import type { StrategyHandle } from "@template/domain/calc";
import NumberFlow from "@number-flow/react";
import { numberFormatOptions } from "@template/domain/numbers";
import { Fragment, useEffect, useRef, useState } from "react";
import { useScrollFade } from "../../hooks/use-scroll-fade";
import { useStrategiesBalances } from "../../hooks/use-strategies-balances";
import { Code } from "./code";

/** The denoms whose amounts changed in the latest balances refetch, with direction. */
export interface BalanceFlash {
  changes: Record<string, "up" | "down">;
  nonce: number;
}

/**
 * The row-dimming treatment, applied per element rather than on the row so
 * a flashing balance chip can reach full brightness inside a dim row.
 */
const DIM = "opacity-35 group-hover:opacity-100 transition-opacity duration-500";

function BalanceChip({
  balance,
  dimmed,
  direction,
  flashNonce,
}: {
  balance: Amount;
  dimmed: boolean;
  direction?: "up" | "down";
  flashNonce?: number;
}) {
  const [isColored, setIsColored] = useState(false);
  const [isBright, setIsBright] = useState(false);

  // Fade the changed amount to green (up) or red (down), 500ms each way.
  // The colour leads the brightness flash by 100ms on the way in and
  // follows it by 100ms on the way out. setState runs in timeouts so the
  // fade-in transitions.
  useEffect(() => {
    if (!flashNonce) return;
    const timers = [
      setTimeout(() => {
        setIsColored(true);
      }, 0),
      setTimeout(() => {
        setIsBright(true);
      }, 100),
      setTimeout(() => {
        setIsBright(false);
      }, 600),
      setTimeout(() => {
        setIsColored(false);
      }, 700),
    ];
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [flashNonce]);

  // A single transition-all: stacking transition-colors with the DIM
  // preset's transition-opacity would override transition-property and
  // make the colour snap instead of fade.
  const dimOpacity = dimmed && !isBright ? "opacity-35 group-hover:opacity-100" : "";
  const amountColor = isColored ? (direction === "down" ? "text-red-400" : "text-green-400") : "text-zinc-200";

  return (
    <>
      <span className={`transition-all duration-500 ${dimOpacity} ${amountColor}`}>
        <NumberFlow value={balance.amount} format={numberFormatOptions(balance.amount)} />
      </span>
      <span className={dimmed ? DIM : ""} style={{ color: balance.color }}>
        {balance.displayName.toUpperCase()}
      </span>
    </>
  );
}

/**
 * A compact one-line balances summary, e.g. "32,207 RUNE | 12 TCY".
 * Inherits the row's font size; denoms take their asset colours, matching
 * the wallet balances panel. Chips whose amounts just changed flash.
 */
export function BalancesSummary({
  balances,
  dimmed,
  flash,
}: {
  balances: Amount[] | undefined;
  dimmed: boolean;
  flash?: BalanceFlash;
}) {
  if (!balances?.length) return null;
  return (
    <code className="flex items-baseline gap-2">
      {balances.map((balance, index) => (
        <Fragment key={balance.denom}>
          {index > 0 && <span className={dimmed ? DIM : ""}>|</span>}
          <BalanceChip
            balance={balance}
            dimmed={dimmed}
            direction={flash?.changes[balance.denom]}
            flashNonce={flash?.changes[balance.denom] ? flash.nonce : undefined}
          />
        </Fragment>
      ))}
    </code>
  );
}

function DraftStrategyHandle({
  handle,
  isSelected,
  onSelect,
}: {
  handle: StrategyHandle;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <code
      key={handle.id}
      onClick={onSelect}
      className={`group flex gap-2 text-lg text-zinc-200 ${!isSelected ? "cursor-pointer opacity-35 hover:opacity-100" : ""}`}
    >
      <Code>{handle.label}</Code>
    </code>
  );
}

function ActiveStrategyHandle({
  handle,
  balances,
  flash,
  isSelected,
  onSelect,
}: {
  handle: StrategyHandle;
  balances?: Amount[];
  flash?: BalanceFlash;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <code
      key={handle.id}
      onClick={onSelect}
      className={`group flex gap-2 text-lg text-zinc-200 ${isSelected ? "" : "cursor-pointer"}`}
    >
      <Code className={isSelected ? "" : DIM}>{handle.label}</Code>
      {!!balances?.length && (
        <>
          <code className={isSelected ? "" : DIM}>|</code>
          <BalancesSummary balances={balances} dimmed={!isSelected} flash={flash} />
        </>
      )}
    </code>
  );
}

export type StatusKey = "draft" | "active" | "completed" | "paused" | "archived";

// ARCHIVED stays out of the picker: the deployed manager can't list
// archived strategies (its query filter only accepts active|paused).
const STATUS_LABELS: Partial<Record<StatusKey, string>> = {
  draft: "Draft",
  active: "Active",
  completed: "Completed",
  paused: "Paused",
};

/** The status picker, rendered by the route in the top-left panel. */
export function StatusFilter({
  status,
  onStatusChange,
}: {
  status: StatusKey;
  onStatusChange: (status: StatusKey) => void;
}) {
  return (
    <div className="flex items-baseline gap-4">
      {(Object.keys(STATUS_LABELS) as StatusKey[]).map((key, index) => (
        <Fragment key={key}>
          {index > 0 && <code className="text-lg text-zinc-600">|</code>}
          <code
            onClick={() => {
              onStatusChange(key);
            }}
            className={`cursor-pointer text-lg hover:underline ${status === key ? "text-zinc-200" : "text-zinc-600"}`}
          >
            {STATUS_LABELS[key]}
          </code>
        </Fragment>
      ))}
    </div>
  );
}

export function StrategyList({
  handles,
  status,
  selectedId,
  onSelect,
}: {
  handles: Record<string | number, StrategyHandle>;
  status: StatusKey;
  selectedId: string | number | undefined;
  onSelect: (handle: StrategyHandle) => void;
}) {
  const { ref, onScroll, maskImage } = useScrollFade();
  const { data: balancesByAddress } = useStrategiesBalances(Object.values(handles));

  // Diff each balances refetch against the previous one: strategies whose
  // amounts moved get their row pulsed and the changed chips flashed. This
  // keys off actual data, so it fires for real executions regardless of how
  // the refetch was triggered.
  const previousBalances = useRef<typeof balancesByAddress>(undefined);
  const [balanceFlashes, setBalanceFlashes] = useState<Record<string, BalanceFlash>>({});

  useEffect(() => {
    const previous = previousBalances.current;
    previousBalances.current = balancesByAddress;
    if (!previous || !balancesByAddress) return;

    const previousEntries = new Map(Object.entries(previous));
    const changed: Record<string, Record<string, "up" | "down">> = {};
    for (const [address, entry] of Object.entries(balancesByAddress)) {
      const before = previousEntries.get(address);
      if (!before) continue;
      const beforeAmounts = new Map(before.balances.map((balance) => [balance.denom, balance.amount]));
      const changes: Record<string, "up" | "down"> = {};
      for (const balance of entry.balances) {
        const previousAmount = beforeAmounts.get(balance.denom);
        if (previousAmount === undefined || previousAmount === balance.amount) continue;
        changes[balance.denom] = balance.amount > previousAmount ? "up" : "down";
      }
      if (Object.keys(changes).length > 0) changed[address] = changes;
    }
    if (Object.keys(changed).length === 0) return;

    // Deferred so the chips' fade-in transitions run.
    const timer = setTimeout(() => {
      setBalanceFlashes((prev) => {
        const prevEntries = new Map(Object.entries(prev));
        return Object.entries(changed).reduce(
          (acc, [address, changes]) => ({
            ...acc,
            [address]: { changes, nonce: (prevEntries.get(address)?.nonce ?? 0) + 1 },
          }),
          prev,
        );
      });
    }, 0);
    return () => {
      clearTimeout(timer);
    };
  }, [balancesByAddress]);


  const createdAt = (handle: StrategyHandle) => (handle.status !== "draft" ? (handle.created_at ?? 0) : 0);

  // COMPLETED = still active on-chain but holding nothing (fully executed
  // and swept). Unknown while balances load, so default to ACTIVE then.
  const statusOf = (handle: StrategyHandle): StatusKey => {
    if (handle.status === "active") {
      const entry = balancesByAddress?.[handle.contract_address];
      return entry?.valueUsd === 0 ? "completed" : "active";
    }
    return handle.status;
  };

  const matchesFilter = (handle: StrategyHandle) => statusOf(handle) === status;

  const rows = Object.values(handles)
    .filter(matchesFilter)
    .sort((a, b) => createdAt(b) - createdAt(a));

  // With nothing selected (page open, filter switch, deleted draft), select
  // the top row of the current filter. Deferred so selection lands after the
  // render that produced the rows.
  const topRowId = rows.at(0)?.id;

  useEffect(() => {
    if (selectedId !== undefined || topRowId === undefined) return;
    const timer = setTimeout(() => {
      const top = new Map(Object.entries(handles)).get(String(topRowId));
      if (top) onSelect(top);
    }, 0);
    return () => {
      clearTimeout(timer);
    };
  }, [selectedId, topRowId, handles, onSelect]);

  return (
    <div className="flex flex-col pb-4">
      {/* nowheel keeps wheel events scrolling this list instead of zooming
          the React Flow canvas underneath. */}
      <div
        ref={ref}
        onScroll={onScroll}
        className="nowheel flex max-h-[33vh] flex-col items-start gap-4 overflow-y-auto pr-4 pb-2 pl-[10px]"
        style={{ scrollbarWidth: "thin", maskImage, WebkitMaskImage: maskImage }}
      >
        {rows.map((handle) => {
          const isSelected = selectedId === handle.id;
          return handle.status === "draft" ? (
            <DraftStrategyHandle
              key={handle.id}
              handle={handle}
              isSelected={isSelected}
              onSelect={() => {
                onSelect(handle);
              }}
            />
          ) : (
            <ActiveStrategyHandle
              key={handle.id}
              handle={handle}
              balances={balancesByAddress?.[handle.contract_address]?.balances}
              flash={balanceFlashes[handle.contract_address]}
              isSelected={isSelected}
              onSelect={() => {
                onSelect(handle);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
