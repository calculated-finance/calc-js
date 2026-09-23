import NumberFlow from "@number-flow/react";
import { numberFormatOptions } from "@template/domain/numbers";
import { useConnectedWallet } from "../../hooks/use-connection";
import { useScrollFade } from "../../hooks/use-scroll-fade";
import { useWalletBalances } from "../../hooks/use-wallet-balances";

/**
 * The connected wallet's app-layer balances, bottom-right of the canvas.
 * Scrolls with edge fades like the strategy list.
 */
export function WalletBalances() {
  const { wallet } = useConnectedWallet();
  // Only render balances for a settled chain: while the chain is switching
  // (or a switch failed into "unsupported") the connection still carries the
  // previous chain's address, and showing its balances is exactly the stale
  // display a switch is meant to replace.
  const connected = wallet?.connection.status === "connected" ? wallet.connection : undefined;
  const readyChain = connected?.chain.status === "ready" ? connected.chain.chain : undefined;
  const address = readyChain ? connected?.address : undefined;

  const { data: balances, isPending } = useWalletBalances(address, readyChain?.id);
  const { ref, onScroll, maskImage } = useScrollFade();

  // isPending: a fresh chain gets its own query key, so nothing renders
  // until the new chain's balances have actually loaded.
  if (!address || isPending || !balances?.length) return null;

  const totalUsd = balances.reduce((acc, balance) => acc + balance.valueUsd, 0);

  return (
    <div
      ref={ref}
      onScroll={onScroll}
      className="nowheel flex max-h-[33vh] flex-col items-end gap-2 overflow-y-auto pr-[10px] pb-2 pl-4"
      style={{ scrollbarWidth: "thin", maskImage, WebkitMaskImage: maskImage }}
    >
      <code className="flex items-baseline gap-2 text-lg">
        {/* Manual $ prefix: Intl currency style renders "US$" in some locales. */}
        <span className="text-zinc-200">
          $<NumberFlow value={totalUsd} format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
        </span>
        <span className="text-zinc-400">USD Total</span>
      </code>
      {balances.map((balance) => (
        <code key={balance.denom} className="flex items-baseline gap-2 text-lg">
          <span className="text-zinc-200">
            <NumberFlow value={balance.amount} format={numberFormatOptions(balance.amount)} />
          </span>
          <span style={{ color: balance.color }}>{balance.displayName.toUpperCase()}</span>
        </code>
      ))}
    </div>
  );
}
