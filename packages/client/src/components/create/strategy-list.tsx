import { toUtf8 } from "@cosmjs/encoding";
import type { StrategyHandle } from "@template/domain/calc";
import { type Chain, COSMOS_CHAINS_BY_ID } from "@template/domain/chains";
import type { TransactionData } from "@template/domain/clients";
import { useState } from "react";
import { useDraftStrategies } from "../../hooks/use-draft-strategies";
import { useNodeModalStore } from "../../hooks/use-node-modal-store";
import { useStrategy } from "../../hooks/use-strategy";
import { Modal, ModalContent, ModalHeader, ModalTitle } from "../ui/modal";
import { Code } from "./code";
import { SignTransactionForm } from "./sign-transaction-form";
import { StartStrategyForm } from "./start-strategy-form";

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
  isSelected,
  onSelect,
}: {
  handle: StrategyHandle;
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
          {`${handle.label}${isSelected ? " |" : ""}`}
        </Code>
        {isSelected && (
          <>
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
  return (
    <div className="flex flex-col items-start gap-4 pb-2 pl-[10px]">
      {Object.values(handles)
        .filter((handle) => handle.status === filter)
        .map((handle) => {
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
              isSelected={isSelected}
              onSelect={() => {
                onSelect(handle);
              }}
            />
          );
        })}
    </div>
  );
}
