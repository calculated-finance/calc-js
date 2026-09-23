import { useEffect } from "react";
import { txResultOf, useTransactionStore } from "../../hooks/use-transaction-store";
import { errorMessage, isUserRejection } from "../../lib/wallet-errors";
import { Modal, ModalContent, ModalHeader, ModalTitle } from "../ui/modal";

/**
 * The shared transaction lifecycle modal. Flows hand their in-flight
 * broadcast promise to the store via track(action, promise); this modal
 * shows the executing state, awaits the promise, and renders the success
 * or failure outcome. A wallet decline just dismisses it.
 */
export function TransactionModal() {
  const { execution, result, setResult, clear } = useTransactionStore();

  useEffect(() => {
    if (!execution) return;
    let cancelled = false;
    execution.promise
      .then((response) => {
        if (!cancelled) setResult(txResultOf(execution.action, response));
      })
      .catch((error: unknown) => {
        // Always findable in the console, even for treated-as-decline cases.
        console.error("transaction failed", error);
        if (cancelled) return;
        // Declining in the wallet is an expected outcome, not an error.
        if (isUserRejection(error)) {
          clear();
          return;
        }
        setResult({ status: "failure", action: execution.action, message: errorMessage(error) });
      });
    return () => {
      cancelled = true;
    };
  }, [execution, setResult, clear]);

  return (
    <Modal
      open={!!execution}
      onOpenChange={(open) => {
        if (!open) clear();
      }}
    >
      <ModalHeader className="hidden">
        <ModalTitle>title</ModalTitle>
      </ModalHeader>
      <ModalContent showCloseButton={false}>
        {execution && (
          <div className="flex max-w-120 min-w-100 flex-col gap-4">
            {!result ? (
              <>
                <code className="text-lg text-zinc-300">{execution.action}</code>
                <code className="text-lg text-zinc-500">Executing transaction...</code>
              </>
            ) : (
              <>
                <code className={`text-lg ${result.status === "success" ? "text-green-300" : "text-red-400/90"}`}>
                  {result.action} {result.status === "success" ? "succeeded ✅" : "failed ❌"}
                </code>
                {result.hash && (
                  <div className="flex items-baseline gap-2">
                    <code className="text-sm text-zinc-400">tx_hash:</code>
                    <code className="text-sm break-all text-zinc-200">{result.hash}</code>
                    <code
                      onClick={() => {
                        if (result.hash) void navigator.clipboard.writeText(result.hash);
                      }}
                      className="cursor-pointer text-sm"
                    >
                      📋
                    </code>
                  </div>
                )}
                {result.message && <code className="text-sm break-all text-red-500/60">{result.message}</code>}
                <div className="flex justify-end pt-2">
                  <code onClick={clear} className="cursor-pointer text-lg text-zinc-300 hover:underline">
                    Done
                  </code>
                </div>
              </>
            )}
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
