import type { Chain } from "@template/domain/chains";
import { TransactionData, type Wallet } from "@template/domain/clients";
import { useEffect, useMemo, useState } from "react";
import { useWallets } from "../../hooks/use-wallets";

const errorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error));

export function SignTransactionForm({
  chain,
  getDataWithSender,
  callToAction,
  onBack,
  onSuccess,
}: {
  chain: Chain;
  getDataWithSender: (sender: string) => TransactionData;
  callToAction?: string;
  onBack?: () => void;
  onSuccess?: () => void;
}) {
  const { wallets, connect, simulateTransaction, signTransaction } = useWallets();

  const { viableConnections, viableConnectionsByWalletType } = useMemo(() => {
    const viableConnections = wallets.filter(
      (wallet) =>
        wallet.connection.status === "connected" &&
        wallet.connection.chain.status === "ready" &&
        wallet.connection.chain.chain.id === chain.id,
    );

    const viableConnectionsByWalletType = viableConnections.reduce<Partial<Record<string, Wallet>>>(
      (acc, wallet) => ({
        ...acc,
        [wallet.type]: wallet,
      }),
      {},
    );

    return { viableConnections, viableConnectionsByWalletType };
  }, [wallets, chain.id]);

  const [sender, setSender] = useState<Wallet>();

  const defaultSender = viableConnections[0] as Wallet | undefined;
  const effectiveSender = sender ?? defaultSender;

  const [simulationResult, setSimulationResult] = useState<string>();

  useEffect(() => {
    if (effectiveSender?.connection.status !== "connected") return;
    const data = getDataWithSender(effectiveSender.connection.address);

    simulateTransaction(effectiveSender, chain, data)
      .then((result) => {
        setSimulationResult(`Expected gas: ${result}`);
      })
      .catch((error: unknown) => {
        setSimulationResult(`Simulation failed: ${errorMessage(error)}`);
      });
  }, [effectiveSender, chain, getDataWithSender, simulateTransaction]);

  const viableWallets = useMemo(
    () =>
      wallets.filter(
        (wallet) =>
          !viableConnectionsByWalletType[wallet.type] &&
          wallet.supportedChains.some((supportedChain) => supportedChain.id === chain.id),
      ),
    [wallets, viableConnectionsByWalletType, chain.id],
  );

  const [isExecuting, setIsExecuting] = useState(false);

  const [error, setError] = useState<string>();

  return (
    <div className="flex min-w-100 flex-col gap-4">
      {viableConnections.length > 0 && (
        <div className="flex flex-col gap-2">
          <code className="text-sm text-zinc-400">signing_wallet</code>
          {viableConnections.map((wallet) =>
            wallet.connection.status === "connected" ? (
              <code
                key={wallet.connection.label}
                className={wallet === effectiveSender ? "" : "cursor-pointer opacity-50 hover:underline"}
                onClick={() => {
                  setSender(wallet);
                }}
              >
                {wallet.connection.label}
              </code>
            ) : null,
          )}
        </div>
      )}
      {viableWallets.length > 0 ? (
        <div className="flex flex-col gap-2">
          <code className="text-sm text-zinc-400">connect_wallet</code>
          <div className="flex flex-wrap gap-2 pt-2">
            {viableWallets.map((wallet) => (
              <code
                key={wallet.type}
                className="cursor-pointer text-xl hover:underline"
                style={{
                  color: wallet.color,
                  opacity: 0.9,
                }}
                onClick={() => {
                  void connect(wallet);
                }}
              >
                {wallet.type}
                <img src={wallet.icon} alt={wallet.type} className="mt-[-4px] ml-3 inline h-5 w-5" />
              </code>
            ))}
          </div>
        </div>
      ) : viableConnections.length > 0 ? null : (
        <div className="flex flex-col gap-2">
          <code className="text-sm text-red-500/80">No wallets available for this chain.</code>
        </div>
      )}
      {effectiveSender && (
        <div className="mb-[-4px] flex w-full justify-end gap-6">
          {isExecuting ? (
            <code className="text-lg text-zinc-500">Executing transaction...</code>
          ) : simulationResult ? (
            <>
              {onBack && (
                <code onClick={onBack} className="cursor-pointer text-lg text-zinc-400 hover:underline">
                  Back
                </code>
              )}
              <code
                onClick={() => {
                  if (effectiveSender.connection.status !== "connected") return;
                  setIsExecuting(true);
                  signTransaction(effectiveSender, chain, getDataWithSender(effectiveSender.connection.address))
                    .then(() => {
                      setIsExecuting(false);
                      onSuccess?.();
                    })
                    .catch((error: unknown) => {
                      setIsExecuting(false);
                      setError(`Transaction failed: ${errorMessage(error)}`);
                    });
                }}
                className="cursor-pointer text-lg text-green-300 hover:underline"
              >
                {callToAction ?? "Execute"}
              </code>
            </>
          ) : (
            <code className="text-lg text-zinc-500">Checking transaction...</code>
          )}
        </div>
      )}
      {error && (
        <div className="flex flex-col gap-2">
          <code className="text-sm text-red-500/80">{error}</code>
        </div>
      )}
    </div>
  );
}
