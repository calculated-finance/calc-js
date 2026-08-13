import { toUtf8 } from "@cosmjs/encoding";
import type { Amount } from "@template/domain/assets";
import type { StrategyHandle } from "@template/domain/calc";
import { type Chain, COSMOS_CHAINS_BY_ID } from "@template/domain/chains";
import type { TransactionData } from "@template/domain/clients";
import NumberFlow from "@number-flow/react";
import { numberFormatOptions } from "@template/domain/numbers";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDraftStrategies } from "../../hooks/use-draft-strategies";
import { useNodeModalStore } from "../../hooks/use-node-modal-store";
import { useScrollFade } from "../../hooks/use-scroll-fade";
import { useStrategiesBalances } from "../../hooks/use-strategies-balances";
import { useStrategy } from "../../hooks/use-strategy";
import { Modal, ModalContent, ModalHeader, ModalTitle } from "../ui/modal";
import { Code } from "./code";
import { SignTransactionForm } from "./sign-transaction-form";
import { StartStrategyForm } from "./start-strategy-form";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const { data: strategy } = useStrategy(handle);
  const { update, deleteStrategy } = useDraftStrategies(handle.chainId);

  const { setOpenId } = useNodeModalStore();

  return (
    <>
      <code
        key={handle.id}
        className={`group flex gap-2 text-lg text-zinc-200 ${!isSelected ? "opacity-35 hover:opacity-100" : ""}`}
      >
        {!isDeleting && (
          <Code
            onClick={() => {
              setIsDeleting(false);
              onSelect();
            }}
            className={isSelected ? "" : "cursor-pointer hover:underline"}
          >
            {handle.label}
          </Code>
        )}
        {!isDeleting && (
          <span className="hidden items-baseline gap-2 group-hover:flex">
            <code>|</code>
            <code
              onClick={() => {
                onSelect();
                setIsStarting(true);
              }}
              className="cursor-pointer text-green-300 hover:underline"
            >
              Start
            </code>
            {" 🚀"}
            <code> | </code>
            <code
              onClick={() => {
                onSelect();
                setIsDeleting(true);
              }}
              className="cursor-pointer text-red-300 hover:underline"
            >
              Delete
            </code>
            {" 🗑️"}
          </span>
        )}
        {isDeleting && (
          <div className="flex items-center gap-2">
            <code>Are you sure?</code>{" "}
            <code
              className="cursor-pointer text-red-300 hover:underline"
              onClick={() => {
                deleteStrategy(handle.id);
                setOpenId(null);
                setIsDeleting(false);
              }}
            >
              Yes
            </code>
            <code>/</code>
            <code
              className="cursor-pointer pl-[2px] text-green-300 hover:underline"
              onClick={() => {
                setIsDeleting(false);
              }}
            >
              No
            </code>
          </div>
        )}
      </code>
      <Modal
        open={isStarting}
        onOpenChange={(open) => {
          if (!open) setIsStarting(false);
        }}
      >
        <ModalHeader className="hidden">
          <ModalTitle>title</ModalTitle>
        </ModalHeader>
        <ModalContent showCloseButton={false}>
          {strategy && <StartStrategyForm strategy={strategy} update={update} deleteStrategy={deleteStrategy} />}
        </ModalContent>
      </Modal>
    </>
  );
}

/** Builds the MsgExecuteContract payload for a manager-level status change. */
const statusUpdateData =
  (handle: Extract<StrategyHandle, { contract_address: string }>, status: "paused" | "archived") =>
  (sender: string): TransactionData => ({
    type: "cosmos",
    msgs: [
      {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: {
          sender,
          contract: COSMOS_CHAINS_BY_ID[handle.chainId].managerContract,
          msg: toUtf8(
            JSON.stringify({
              update_strategy_status: {
                contract_address: handle.contract_address,
                status,
              },
            }),
          ),
          funds: [],
        },
      },
    ],
  });

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
  const [executableTransactionData, setExecutableTransactionData] = useState<{
    chain: Chain;
    getDataWithSender: (sender: string) => TransactionData;
    callToAction?: string;
    onBack: () => void;
  }>();

  if (handle.status !== "active") {
    return null;
  }

  const openTransaction = (getDataWithSender: (sender: string) => TransactionData, callToAction: string) => {
    setExecutableTransactionData({
      chain: COSMOS_CHAINS_BY_ID[handle.chainId],
      getDataWithSender,
      callToAction,
      onBack: () => {
        setExecutableTransactionData(undefined);
      },
    });
  };

  return (
    <>
      <code key={handle.id} className="group flex gap-2 text-lg text-zinc-200">
        <Code onClick={onSelect} className={isSelected ? "" : `cursor-pointer hover:underline ${DIM}`}>
          {handle.label}
        </Code>
        {!!balances?.length && (
          <>
            <code className={isSelected ? "" : DIM}>|</code>
            <BalancesSummary balances={balances} dimmed={!isSelected} flash={flash} />
          </>
        )}
        <span className="hidden items-baseline gap-2 group-hover:flex">
          <code>|</code>
            <code
              onClick={() => {
                onSelect();
                openTransaction(
                  (sender) => ({
                    type: "cosmos",
                    msgs: [
                      {
                        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                        value: {
                          sender,
                          contract: handle.contract_address,
                          msg: toUtf8(JSON.stringify({ withdraw: [] })),
                          funds: [],
                        },
                      },
                    ],
                  }),
                  "Withdraw Funds",
                );
              }}
              className="cursor-pointer text-green-300 hover:underline"
            >
              Withdraw
            </code>
            {" 🏛️"}
            <code> | </code>
            <code
              onClick={() => {
                onSelect();
                openTransaction(statusUpdateData(handle, "paused"), "Pause Strategy");
              }}
              className="cursor-pointer text-blue-300 hover:underline"
            >
              Pause
            </code>
            {" ⏸️"}
            <code> | </code>
            <code
              onClick={() => {
                onSelect();
                openTransaction(statusUpdateData(handle, "archived"), "Archive Strategy");
              }}
              className="cursor-pointer text-red-300 hover:underline"
            >
              Archive
            </code>
            {" 📂"}
            <code> | </code>
            <code
              onClick={() => {
                onSelect();
                void navigator.clipboard.writeText(handle.contract_address);
              }}
              className="cursor-pointer text-zinc-300 hover:underline"
            >
              Copy
            </code>
            {" 📋"}
          </span>
      </code>
      <Modal
        open={!!executableTransactionData}
        onOpenChange={(open) => {
          if (!open) setExecutableTransactionData(undefined);
        }}
      >
        <ModalHeader className="hidden">
          <ModalTitle>title</ModalTitle>
        </ModalHeader>
        <ModalContent showCloseButton={false}>
          {executableTransactionData && (
            <SignTransactionForm
              chain={executableTransactionData.chain}
              getDataWithSender={executableTransactionData.getDataWithSender}
              callToAction={executableTransactionData.callToAction}
            />
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

type SortKey = "recent" | "valuable";

const SORT_LABELS: Record<SortKey, string> = {
  recent: "RECENT",
  valuable: "VALUE",
};

export type StatusKey = "draft" | "active" | "completed" | "paused" | "archived";

// ARCHIVED stays out of the picker: the deployed manager can't list
// archived strategies (its query filter only accepts active|paused).
const STATUS_LABELS: Partial<Record<StatusKey, string>> = {
  draft: "DRAFT",
  active: "ACTIVE",
  completed: "COMPLETED",
  paused: "PAUSED",
};

export function StrategyList({
  handles,
  status,
  onStatusChange,
  selectedId,
  onSelect,
}: {
  handles: Record<string | number, StrategyHandle>;
  status: StatusKey;
  onStatusChange: (status: StatusKey) => void;
  selectedId: string | number | undefined;
  onSelect: (handle: StrategyHandle) => void;
}) {
  const { ref, onScroll, maskImage } = useScrollFade();
  const { data: balancesByAddress } = useStrategiesBalances(Object.values(handles));
  const [sortBy, setSortBy] = useState<SortKey>("recent");

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


  const valueOf = (handle: StrategyHandle) =>
    handle.status !== "draft" ? (balancesByAddress?.[handle.contract_address]?.valueUsd ?? 0) : 0;
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
    .sort((a, b) => (sortBy === "valuable" ? valueOf(b) - valueOf(a) : createdAt(b) - createdAt(a)));



  return (
    // Controls sit BELOW the list: the panel is bottom-anchored, so the list
    // grows upward and the controls keep a fixed position while toggling.
    <div className="flex flex-col-reverse gap-4.5 pb-4">
      {
        <div className="flex gap-4 pl-[10px]">
          <code className="text-sm text-zinc-500">sort_by:</code>
          {(Object.keys(SORT_LABELS) as SortKey[]).map((key, index) => (
            <Fragment key={key}>
              {index > 0 && <code className="text-sm text-zinc-600">|</code>}
              <code
                onClick={() => {
                  setSortBy(key);
                }}
                className={`cursor-pointer text-sm hover:underline ${
                  sortBy === key ? "text-zinc-200" : "text-zinc-600"
                }`}
              >
                {SORT_LABELS[key]}
              </code>
            </Fragment>
          ))}
        </div>
      }
      {(
        <div className="flex gap-4 pl-[10px]">
          <code className="text-sm text-zinc-500">filter:</code>
          {(Object.keys(STATUS_LABELS) as StatusKey[]).map((key, index) => (
            <Fragment key={key}>
              {index > 0 && <code className="text-sm text-zinc-600">|</code>}
              <code
                onClick={() => {
                  onStatusChange(key);
                }}
                className={`cursor-pointer text-sm hover:underline ${
                  status === key ? "text-zinc-200" : "text-zinc-600"
                }`}
              >
                {STATUS_LABELS[key]}
              </code>
            </Fragment>
          ))}
        </div>
      )}
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
