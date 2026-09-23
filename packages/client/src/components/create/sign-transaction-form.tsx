import type { Chain } from "@template/domain/chains";
import { TransactionData, type Wallet } from "@template/domain/clients";
import { formatNumber } from "@template/domain/numbers";
import { useEffect, useMemo, useState } from "react";
import { useAssets } from "../../hooks/use-assets";
import { txResultOf, useTransactionStore } from "../../hooks/use-transaction-store";
import { useWallets } from "../../hooks/use-wallets";
import { errorMessage } from "../../lib/wallet-errors";
import { Code } from "./code";

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
  const { assetsByDenom } = useAssets();

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

  const [simulationResult, setSimulationResult] = useState<{ gas: number } | { failure: string }>();

  useEffect(() => {
    if (effectiveSender?.connection.status !== "connected") return;
    const data = getDataWithSender(effectiveSender.connection.address);

    simulateTransaction(effectiveSender, chain, data)
      .then((result) => {
        setSimulationResult({ gas: result });
      })
      .catch((error: unknown) => {
        setSimulationResult({ failure: errorMessage(error) });
      });
  }, [effectiveSender, chain, getDataWithSender, simulateTransaction]);

  // The simulated gas priced in the chain's gas asset, e.g. "0.02 RUNE".
  const expectedFee = useMemo(() => {
    if (!simulationResult || !("gas" in simulationResult)) return undefined;
    if (!("defaultGasPrice" in chain)) return `${formatNumber(simulationResult.gas)} gas`;
    const match = /^([\d.]+)(\D.*)$/.exec(chain.defaultGasPrice);
    if (!match) return `${formatNumber(simulationResult.gas)} gas`;
    const [, price, denom] = match;
    const asset = assetsByDenom[denom];
    const baseUnits = simulationResult.gas * Number(price);
    return asset
      ? `${formatNumber(baseUnits / 10 ** asset.significantFigures)} ${asset.displayName.toUpperCase()}`
      : `${formatNumber(baseUnits)} ${denom}`;
  }, [simulationResult, chain, assetsByDenom]);

  const viableWallets = useMemo(
    () =>
      wallets.filter(
        (wallet) =>
          !viableConnectionsByWalletType[wallet.type] &&
          wallet.supportedChains.some((supportedChain) => supportedChain.id === chain.id),
      ),
    [wallets, viableConnectionsByWalletType, chain.id],
  );

  const { track } = useTransactionStore();

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
          {simulationResult ? (
            <>
              {onBack && (
                <code onClick={onBack} className="cursor-pointer text-lg text-zinc-400 hover:underline">
                  Back
                </code>
              )}
              <code
                onClick={() => {
                  if (effectiveSender.connection.status !== "connected") return;
                  const action = callToAction ?? "Transaction";
                  // The shared transaction modal owns the lifecycle from here:
                  // executing state, outcome, and decline handling.
                  const promise = signTransaction(
                    effectiveSender,
                    chain,
                    getDataWithSender(effectiveSender.connection.address),
                  );
                  track(action, promise);
                  promise
                    .then((response) => {
                      if (txResultOf(action, response).status === "success") onSuccess?.();
                    })
                    .catch(() => {
                      // Surfaced by the transaction modal.
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
      {expectedFee && (
        <div className="flex w-full justify-end pt-1">
          <Code className="text-sm text-zinc-500">{`expected_gas: ${expectedFee}`}</Code>
        </div>
      )}
      {simulationResult && "failure" in simulationResult && (
        <code className="text-sm text-red-500/80">Simulation failed: {simulationResult.failure}</code>
      )}
    </div>
  );
}
