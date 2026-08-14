import type { StrategyHandle } from "@template/domain/calc";
import { COSMOS_CHAINS_BY_ID } from "@template/domain/chains";
import type { TransactionData } from "@template/domain/clients";
import { Fragment, useState } from "react";
import { useConnectedAddress } from "../../hooks/use-connected-address";
import { useDraftStrategies } from "../../hooks/use-draft-strategies";
import { useNodeModalStore } from "../../hooks/use-node-modal-store";
import { useStrategiesBalances } from "../../hooks/use-strategies-balances";
import { useStrategy } from "../../hooks/use-strategy";
import { type ChainHandle, statusUpdateData } from "../../lib/strategy-transactions";
import { Modal, ModalContent, ModalHeader, ModalTitle } from "../ui/modal";
import { SignTransactionForm } from "./sign-transaction-form";
import { StartStrategyForm } from "./start-strategy-form";
import { WithdrawForm } from "./withdraw-form";

interface Action {
  label: string;
  emoji: string;
  color: string;
  onClick: () => void;
}

function ActionsRow({ actions }: { actions: Action[] }) {
  return (
    // Outer gap spaces the buttons apart; each label keeps its emoji close
    // in its own flex item.
    <div className="flex items-baseline gap-4 text-lg text-zinc-200">
      {actions.map((action, index) => (
        <Fragment key={action.label}>
          {index > 0 && <code>|</code>}
          <span className="flex items-baseline gap-2">
            <code onClick={action.onClick} className={`cursor-pointer hover:underline ${action.color}`}>
              {action.label}
            </code>
            {action.emoji}
          </span>
        </Fragment>
      ))}
    </div>
  );
}

function DraftActions({ handle }: { handle: Extract<StrategyHandle, { status: "draft" }> }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const { data: strategy } = useStrategy(handle);
  const { update, deleteStrategy } = useDraftStrategies(handle.chainId);
  const { setOpenId } = useNodeModalStore();

  if (isDeleting) {
    return (
      <div className="flex items-baseline gap-2 text-lg text-zinc-200">
        <code>Are you sure?</code>
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
          className="cursor-pointer text-green-300 hover:underline"
          onClick={() => {
            setIsDeleting(false);
          }}
        >
          No
        </code>
      </div>
    );
  }

  return (
    <>
      <ActionsRow
        actions={[
          {
            label: "Create",
            emoji: "🚀",
            color: "text-green-300",
            onClick: () => {
              setIsStarting(true);
            },
          },
          {
            label: "Delete",
            emoji: "🗑️",
            color: "text-red-300",
            onClick: () => {
              setIsDeleting(true);
            },
          },
        ]}
      />
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

function ChainActions({ handle }: { handle: ChainHandle }) {
  const [transaction, setTransaction] = useState<{
    getDataWithSender: (sender: string) => TransactionData;
    callToAction: string;
  }>();
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const connectedAddress = useConnectedAddress(handle.chainId);

  // Restore is only offered when the archived strategy still holds funds;
  // the balances hook zero-fills touched denoms, so check amounts not length.
  const { data: balancesByAddress } = useStrategiesBalances([handle]);
  const balances = balancesByAddress?.[handle.contract_address]?.balances ?? [];
  const hasBalance = balances.some((balance) => balance.amount > 0);

  // Every action is owner-gated by the contract; a shared strategy opened
  // via URL is view-only for anyone else.
  if (handle.owner !== connectedAddress) return null;

  const withdraw: Action = {
    label: "Withdraw",
    emoji: "🏛️",
    color: "text-green-300",
    onClick: () => {
      setIsWithdrawing(true);
    },
  };

  const resume = (label: string, emoji: string, callToAction: string): Action => ({
    label,
    emoji,
    color: "text-blue-300",
    onClick: () => {
      setTransaction({ getDataWithSender: statusUpdateData(handle, "active"), callToAction });
    },
  });

  const actions: Action[] =
    handle.status === "active"
      ? [
          {
            label: "Pause",
            emoji: "⏸️",
            color: "text-blue-300",
            onClick: () => {
              setTransaction({
                getDataWithSender: statusUpdateData(handle, "paused"),
                callToAction: "Pause Strategy",
              });
            },
          },
          withdraw,
        ]
      : handle.status === "paused"
        ? [resume("Restart", "▶️", "Restart Strategy"), withdraw]
        : hasBalance
          ? [resume("Restore", "♻️", "Restore Strategy")]
          : [];

  if (actions.length === 0) return null;

  return (
    <>
      <ActionsRow actions={actions} />
      <Modal
        open={!!transaction}
        onOpenChange={(open) => {
          if (!open) setTransaction(undefined);
        }}
      >
        <ModalHeader className="hidden">
          <ModalTitle>title</ModalTitle>
        </ModalHeader>
        <ModalContent showCloseButton={false}>
          {transaction && (
            <SignTransactionForm
              chain={COSMOS_CHAINS_BY_ID[handle.chainId]}
              getDataWithSender={transaction.getDataWithSender}
              callToAction={transaction.callToAction}
              onSuccess={() => {
                setTransaction(undefined);
              }}
            />
          )}
        </ModalContent>
      </Modal>
      <Modal
        open={isWithdrawing}
        onOpenChange={(open) => {
          if (!open) setIsWithdrawing(false);
        }}
      >
        <ModalHeader className="hidden">
          <ModalTitle>title</ModalTitle>
        </ModalHeader>
        <ModalContent showCloseButton={false}>
          {isWithdrawing && (
            <WithdrawForm
              handle={handle}
              balances={balances}
              onSuccess={() => {
                setIsWithdrawing(false);
              }}
            />
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

/**
 * The contextual actions for the selected strategy, rendered as a flow node
 * just above the strategy layout. The node is positioned at the layout's
 * horizontal centre; the translate keeps the row centred on that point.
 */
export function StrategyActionsNode({ data: { handle } }: { data: { handle: StrategyHandle } }) {
  return (
    // pointer-events-auto: the node is neither draggable nor selectable, so
    // xyflow puts pointer-events:none on its wrapper; the content re-enables
    // them for its own clicks.
    <div style={{ transform: "translateX(-50%)" }} className="pointer-events-auto flex justify-center">
      {handle.status === "draft" ? <DraftActions handle={handle} /> : <ChainActions handle={handle} />}
    </div>
  );
}
