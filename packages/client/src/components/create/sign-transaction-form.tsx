import type { Chain } from "@template/domain/src/chains";
import type { TransactionData, Wallet } from "@template/domain/src/wallets";
import { useEffect, useMemo, useState } from "react";
import { useWallets } from "../../hooks/use-wallets";

export function SignTransactionForm({ chain, getDataWithSender, onBack }: { chain: Chain; getDataWithSender: (sender: String) => TransactionData, onBack: () => void }) {
  const { wallets, connect, simulateTransaction, signTransaction } = useWallets();

  const viableConnections = useMemo(
    () =>
      wallets
        .filter(
          (wallet) =>
            wallet.connection.status === "connected" &&
            typeof wallet.connection.chain !== "string" &&
            wallet.connection.chain.id === chain.id,
        )
        .reduce(
          (acc, wallet) => ({
            ...acc,
            [wallet.type]: wallet,
          }),
          {} as Record<string, Wallet>,
        ),
    [wallets, chain.id],
  );

  const [sender, setSender] = useState<Wallet>();

  useEffect(() => {
    if (!sender && Object.values(viableConnections).length > 0) {
      setSender(Object.values(viableConnections)[0]);
    }
  }, [viableConnections]);

  const [simulationResult, setSimulationResult] = useState<string>();

  useEffect(() => {
      if (!sender || sender.connection.status !== "connected") return;
      const data = getDataWithSender(sender.connection.address);

      simulateTransaction(sender, chain, data).then(result => {
          setSimulationResult(`Expected gas: ${result}`);
      }).catch(error => {
          setSimulationResult(`Simulation failed: ${error.message}`);
      });
  }, [sender]);

  const viableWallets = useMemo(
    () =>
      wallets.filter(
        (wallet) =>
          !viableConnections[wallet.type] &&
          wallet.supportedChains.some((supportedChain) => supportedChain.id === chain.id),
      ),
    [wallets, chain.id],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <code className="text-sm text-zinc-400">signing_wallet</code>
        {Object.values(viableConnections).map((wallet) =>
          wallet.connection.status === "connected" ? (
            <code key={wallet.connection.label}>{wallet.connection.label}</code>
          ) : null,
        )}
      </div>
      {viableWallets.length > 0 && (
        <div className="flex flex-col gap-2">
          <code className="text-sm text-zinc-400">connect_wallet</code>
          {viableWallets.map((wallet) => (
            <button
              key={wallet.type}
              className="rounded bg-zinc-900 p-2 hover:bg-zinc-800"
            onClick={() => connect(wallet)}
          >
            {wallet.type}
          </button>
        ))}
      </div>)}
      <div className="flex flex-col gap-2">
        <code className="text-sm text-zinc-400">simulation_result</code>
        <code>{simulationResult}</code>
      </div>
      <div className="flex w-full gap-8 justify-end"><code onClick={onBack} className="cursor-pointer text-lg text-red-300 hover:underline">Back</code>
      {!!sender && !!simulationResult &&  (
          <code onClick={() => {
            if (sender.connection.status !== "connected") return;
            signTransaction(sender, chain, getDataWithSender(sender.connection.address)).then(() => {
              alert("Transaction signed successfully!");
            }).catch(error => {
              console.log(error);
              alert(`Failed to sign transaction: ${error.message}`);
            });
          }} className="cursor-pointer text-lg text-green-300 hover:underline">Execute</code>
      )}
      </div>
    </div>
  );
}
