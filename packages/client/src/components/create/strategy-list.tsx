import { toUtf8 } from "@cosmjs/encoding";
import type { Amount } from "@template/domain/assets";
import type { StrategyHandle } from "@template/domain/calc";
import { type Chain, COSMOS_CHAINS_BY_ID } from "@template/domain/chains";
import type { TransactionData } from "@template/domain/clients";
import { formatNumber } from "@template/domain/numbers";
import { Fragment, useState } from "react";
import { useDraftStrategies } from "../../hooks/use-draft-strategies";
import { useNodeModalStore } from "../../hooks/use-node-modal-store";
import { useScrollFade } from "../../hooks/use-scroll-fade";
import { useStrategiesBalances } from "../../hooks/use-strategies-balances";
import { useStrategy } from "../../hooks/use-strategy";
import { Modal, ModalContent, ModalHeader, ModalTitle } from "../ui/modal";
import { Code } from "./code";
import { SignTransactionForm } from "./sign-transaction-form";
import { StartStrategyForm } from "./start-strategy-form";

/**
 * A compact one-line balances summary, e.g. "32,207 RUNE | 12 TCY".
 * Inherits the row's font size; denoms take their asset colours, matching
 * the wallet balances panel.
 */
export function BalancesSummary({ balances }: { balances: Amount[] | undefined }) {
  if (!balances?.length) return null;
  return (
    <code className="flex items-baseline gap-2">
      {balances.map((balance, index) => (
        <Fragment key={balance.denom}>
          {index > 0 && <span>|</span>}
          <span className="text-zinc-200">{formatNumber(balance.amount)}</span>
          <span style={{ color: balance.color }}>{balance.displayName.toUpperCase()}</span>
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
      <code key={handle.id} className={`flex gap-2 text-lg text-zinc-200 ${!isSelected ? "opacity-35" : ""}`}>
        {isSelected ? "* " : ""}
        {(!isSelected || !isDeleting) && (
          <Code
            onClick={() => {
              setIsDeleting(false);
              onSelect();
            }}
            className={isSelected ? "" : "ml-[18.5px] cursor-pointer hover:underline"}
          >
            {`${handle.label}${isSelected ? " |" : ""}`}
          </Code>
        )}
        {isSelected && (
          <>
            {!isDeleting && (
              <>
                {" "}
                <code
                  onClick={() => {
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
                    setIsDeleting(true);
                  }}
                  className="cursor-pointer text-red-300 hover:underline"
                >
                  Delete
                </code>
                {" 🗑️"}
              </>
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
          </>
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
  isSelected,
  onSelect,
}: {
  handle: StrategyHandle;
  balances?: Amount[];
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
      <code key={handle.id} className={`flex gap-2 text-lg text-zinc-200 ${!isSelected ? "opacity-35" : ""}`}>
        {isSelected ? "* " : ""}
        <Code onClick={onSelect} className={isSelected ? "" : "ml-[18.5px] cursor-pointer hover:underline"}>
          {handle.label}
        </Code>
        {!!balances?.length && (
          <>
            <code>|</code>
            <BalancesSummary balances={balances} />
          </>
        )}
        {isSelected && (
          <>
            <code>|</code>
            <code
              onClick={() => {
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
                void navigator.clipboard.writeText(handle.contract_address);
              }}
              className="cursor-pointer text-zinc-300 hover:underline"
            >
              Copy
            </code>
            {" 📋"}
          </>
        )}
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
  recent: "Most recent",
  valuable: "Most valuable",
};

export function StrategyList({
  handles,
  filter,
  selectedId,
  onSelect,
}: {
  handles: Record<string | number, StrategyHandle>;
  filter: "draft" | "active" | "paused" | "archived";
  selectedId: string | number | undefined;
  onSelect: (handle: StrategyHandle) => void;
}) {
  const { ref, onScroll, maskImage } = useScrollFade();
  const { data: balancesByAddress } = useStrategiesBalances(Object.values(handles));
  const [sortBy, setSortBy] = useState<SortKey>("recent");

  const valueOf = (handle: StrategyHandle) =>
    handle.status !== "draft" ? (balancesByAddress?.[handle.contract_address]?.valueUsd ?? 0) : 0;
  const createdAt = (handle: StrategyHandle) => (handle.status !== "draft" ? (handle.created_at ?? 0) : 0);

  const rows = Object.values(handles)
    .filter((handle) => handle.status === filter)
    .sort((a, b) => (sortBy === "valuable" ? valueOf(b) - valueOf(a) : createdAt(b) - createdAt(a)));

  return (
    <div className="flex flex-col gap-3">
      {filter !== "draft" && (
        <div className="flex gap-4 pl-[10px]">
          {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
            <code
              key={key}
              onClick={() => {
                setSortBy(key);
              }}
              className={`cursor-pointer text-sm hover:underline ${
                sortBy === key ? "text-zinc-200 underline" : "text-zinc-600"
              }`}
            >
              {SORT_LABELS[key]}
            </code>
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
