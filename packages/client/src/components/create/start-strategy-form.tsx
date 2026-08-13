import { toUtf8 } from "@cosmjs/encoding";
import { Amount } from "@template/domain/assets";
import { Strategy, StrategyId } from "@template/domain/calc";
import { RUJIRA } from "@template/domain/chains";
import type { TransactionData } from "@template/domain/clients";
import { formatNumber } from "@template/domain/numbers";
import "@xyflow/react/dist/style.css";
import { Either, Schema } from "effect";
import { useEffect, useMemo, useState } from "react";
import { useAssets } from "../../hooks/use-assets";
import { useDecodedSchemaForm } from "../../hooks/use-schema-form";
import { useWallets } from "../../hooks/use-wallets";
import { getDefaultDeposits } from "../../lib/strategy";
import { errorMessage, isUserRejection } from "../../lib/wallet-errors";
import { Input } from "../ui/input";
import { Code } from "./code";

export function StartStrategyForm({
  strategy,
  update,
  deleteStrategy,
}: {
  strategy: Strategy;
  update: (value: Strategy) => void;
  deleteStrategy: (id: StrategyId) => void;
}) {
  const form = useDecodedSchemaForm(Strategy, strategy, update);
  const { wallets, simulateTransaction, signTransaction } = useWallets();
  const { assetsByDenom } = useAssets();

  const defaultDeposit = useMemo(() => getDefaultDeposits(strategy.nodes), [strategy.nodes]);

  const [deposit, setDeposit] = useState<Record<string, Amount>>(defaultDeposit);

  const sender = wallets.find(
    (wallet) =>
      wallet.connection.status === "connected" &&
      wallet.connection.chain.status === "ready" &&
      wallet.connection.chain.chain.id === strategy.chainId,
  );

  const buildData = (senderAddress: string): TransactionData | undefined => {
    const encoded = Schema.encodeUnknownEither(Strategy)(form.state.values);
    if (Either.isLeft(encoded)) return undefined;

    return {
      type: "cosmos",
      msgs: [
        {
          typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
          value: {
            sender: senderAddress,
            // TODO: use config to get the contract address
            contract: RUJIRA.managerContract,
            msg: toUtf8(
              JSON.stringify({
                instantiate: {
                  affiliates: [],
                  label: form.state.values.label,
                  nodes: encoded.right.nodes,
                  owner: senderAddress,
                },
              }),
            ),
            funds: Object.values(deposit)
              .filter((d) => d.amount > 0)
              .map((d) => Schema.encodeSync(Amount)(d))
              .sort((a, b) => a.denom.localeCompare(b.denom)),
          },
        },
      ],
    };
  };

  const [simulation, setSimulation] = useState<{ status: "simulating" } | { gas: number } | { failure: string }>();
  const [isExecuting, setIsExecuting] = useState(false);
  const [startError, setStartError] = useState<string>();

  // Debounced simulation of the exact transaction the button would sign,
  // re-run whenever the strategy or deposit changes.
  const depositKey = JSON.stringify(deposit);
  useEffect(() => {
    if (sender?.connection.status !== "connected") return;
    const address = sender.connection.address;

    const timer = setTimeout(() => {
      const data = buildData(address);
      if (!data) {
        setSimulation({ failure: "Fix the highlighted fields first." });
        return;
      }
      setSimulation({ status: "simulating" });
      simulateTransaction(sender, RUJIRA, data)
        .then((gas) => {
          setSimulation({ gas });
        })
        .catch((error: unknown) => {
          setSimulation({ failure: errorMessage(error) });
        });
    }, 400);
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on serialized inputs
  }, [sender, depositKey, strategy, simulateTransaction]);

  // The simulated gas priced in the chain's gas asset.
  const expectedFee = useMemo(() => {
    if (!simulation || !("gas" in simulation)) return undefined;
    const match = /^([\d.]+)(\D.*)$/.exec(RUJIRA.defaultGasPrice);
    if (!match) return `${formatNumber(simulation.gas)} gas`;
    const [, price, denom] = match;
    const asset = assetsByDenom[denom];
    const baseUnits = simulation.gas * Number(price);
    return asset
      ? `${formatNumber(baseUnits / 10 ** asset.significantFigures)} ${asset.displayName.toUpperCase()}`
      : `${formatNumber(baseUnits)} ${denom}`;
  }, [simulation, assetsByDenom]);

  const canStart = !!sender && !!simulation && "gas" in simulation && !isExecuting;

  const start = () => {
    if (!canStart || sender.connection.status !== "connected") return;
    const data = buildData(sender.connection.address);
    if (!data) return;

    setIsExecuting(true);
    setStartError(undefined);
    signTransaction(sender, RUJIRA, data)
      .then(() => {
        setIsExecuting(false);
        deleteStrategy(strategy.id);
      })
      .catch((error: unknown) => {
        setIsExecuting(false);
        // Always findable in the console, even for treated-as-decline cases.
        console.error("signTransaction failed", error);
        // Declining in the wallet is an expected outcome, not an error.
        if (isUserRejection(error)) return;
        setStartError(`Transaction failed: ${errorMessage(error)}`);
      });
  };

  return (
    <div className="w-100">
      <form className="flex flex-col gap-8 overflow-auto">
        <form.Field
          name="label"
          children={(field) => (
            <div className="flex flex-col gap-2">
              <code className="ml-1 text-sm text-zinc-400">label</code>
              <div className="flex rounded bg-zinc-900">
                <Input
                  placeholder="Strategy Label"
                  className="w-full"
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                  }}
                  tabIndex={-1}
                  autoFocus={false}
                />
              </div>
              {!field.state.meta.isValid && (
                <p className="font-mono text-sm text-red-500/60">{field.state.meta.errors.join(", ")}</p>
              )}
            </div>
          )}
        />
        <div className="flex flex-col gap-2">
          <code className="ml-1 text-sm text-zinc-400">deposit</code>
          {Object.values(deposit).map((entry) => (
            <div className="flex items-center gap-4 rounded bg-zinc-900" key={entry.denom}>
              <Input
                placeholder="0.00"
                className="w-full"
                value={entry.amount || ""}
                type="number"
                inputMode="decimal"
                onChange={(e) => {
                  const amount = e.target.value ? parseFloat(e.target.value) : 0;
                  setDeposit((prev) => ({
                    ...prev,
                    [entry.denom]: {
                      ...entry,
                      amount: isNaN(amount) ? 0 : amount,
                    },
                  }));
                }}
                tabIndex={-1}
                autoFocus={false}
              />
              <div className="flex-1 items-center pr-3">
                <code className="flex items-center gap-3 px-1 py-[1px] text-lg" style={{ color: entry.color }}>
                  {entry.displayName}
                </code>
              </div>
            </div>
          ))}
        </div>
        <div className="flex w-full flex-col items-end gap-2">
          {!sender && <code className="text-sm text-red-400/80">Connect a wallet to start this strategy.</code>}
          {startError && <code className="text-sm text-red-400/80">{startError}</code>}
          {simulation && "failure" in simulation && (
            <code className="text-sm text-red-500/80">Simulation failed: {simulation.failure}</code>
          )}
          <code
            onClick={start}
            className={`w-fit pr-1 text-end text-lg ${
              canStart ? "cursor-pointer text-green-300 hover:underline" : "cursor-not-allowed text-zinc-600"
            }`}
          >
            {isExecuting ? "Starting..." : "Start Strategy"}
          </code>
          <span className="flex items-baseline gap-2 pr-1">
            <code className="text-sm text-zinc-500">expected_gas:</code>
            {simulation && "gas" in simulation && expectedFee ? (
              <Code className="text-sm text-zinc-500">{expectedFee}</Code>
            ) : (
              <span className="inline-block h-3 w-3 animate-spin self-center rounded-full border border-zinc-600 border-t-transparent" />
            )}
          </span>
        </div>
      </form>
    </div>
  );
}
