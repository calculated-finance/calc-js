import { formatNumber } from "@template/domain/numbers";
import { useConnectedWallet } from "../../hooks/use-connection";
import { useScrollFade } from "../../hooks/use-scroll-fade";
import { useWalletBalances } from "../../hooks/use-wallet-balances";

/**
 * The connected wallet's app-layer balances, bottom-right of the canvas.
 * Scrolls with edge fades like the strategy list.
 */
export function WalletBalances() {
  const { wallet } = useConnectedWallet();
  const address = wallet?.connection.status === "connected" ? wallet.connection.address : undefined;

  const { data: balances } = useWalletBalances(address);
  const { ref, onScroll, maskImage } = useScrollFade();

  if (!address || !balances?.length) return null;

  return (
    <div
      ref={ref}
      onScroll={onScroll}
      className="nowheel flex max-h-[33vh] flex-col items-end gap-2 overflow-y-auto pr-[10px] pb-2 pl-4"
      style={{ scrollbarWidth: "thin", maskImage, WebkitMaskImage: maskImage }}
    >
      {balances.map((balance) => (
        <code key={balance.denom} className="flex items-baseline gap-2 text-lg">
          <span className="text-zinc-200">{formatNumber(balance.amount)}</span>
          <span style={{ color: balance.color }}>{balance.displayName.toUpperCase()}</span>
        </code>
      ))}
    </div>
  );
}
