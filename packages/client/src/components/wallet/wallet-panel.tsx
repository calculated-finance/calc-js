import type { ChainId } from "@template/domain/chains";
import type { Wallet, WalletType } from "@template/domain/clients";
import { type ReactNode, useMemo, useState } from "react";
import { useWallets } from "../../hooks/use-wallets";

const WALLET_ICONS: Partial<Record<WalletType, string>> = {
  Keplr: "images/keplr.png",
  MetaMask: "images/metamask.svg",
};

function ConnectWallet({ wallet, connect }: { wallet: Wallet; connect: () => void }) {
  return (
    <code
      className="cursor-pointer text-xl hover:underline"
      style={{
        color: wallet.color,
        opacity: 0.9,
      }}
      onClick={connect}
    >
      {wallet.type}
      <img src={WALLET_ICONS[wallet.type]} alt={wallet.type} className="mt-[-4px] ml-3 inline h-5 w-5" />
    </code>
  );
}

function ConnectionItem({ wallet, children }: { wallet: Wallet; children?: ReactNode }) {
  const { switchChain, disconnect } = useWallets();

  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isSwitchingWalletChain, setIsSwitchingWalletChain] = useState(false);
  // The chain chosen in the picker; children stay hidden from the moment of
  // the click until the wallet settles on it, so the old chain's balances
  // never flash during the switch.
  const [pendingChainId, setPendingChainId] = useState<ChainId>();

  const settledChainId =
    wallet.connection.status === "connected" && wallet.connection.chain.status === "ready"
      ? wallet.connection.chain.chain.id
      : undefined;
  const isAwaitingSwitch = pendingChainId !== undefined && pendingChainId !== settledChainId;

  return (
    <div className="flex flex-col gap-2">
      {wallet.connection.status === "connecting" ? (
        <code>Connecting {wallet.type}...</code>
      ) : wallet.connection.status === "disconnecting" ? (
        <code>Disconnecting {wallet.type}...</code>
      ) : (
        wallet.connection.status === "connected" && (
          <code className="text-right text-lg">
            {isDisconnecting ? (
              <code className="flex justify-end gap-2 text-lg">
                Are you sure?{" "}
                <code
                  onClick={() => {
                    void disconnect(wallet);
                    setIsDisconnecting(false);
                  }}
                  className="cursor-pointer text-lg text-red-300 hover:underline"
                >
                  Yes
                </code>
                <code>/</code>
                <code
                  onClick={() => {
                    setIsDisconnecting(false);
                  }}
                  className="cursor-pointer pl-[2px] text-green-300 hover:underline"
                >
                  No
                </code>
              </code>
            ) : (
              <>
                <code className="text-right text-lg">
                  {wallet.connection.label} ({wallet.connection.address.substring(0, 5)}...
                  {wallet.connection.address.substring(wallet.connection.address.length - 7)}){" | "}
                </code>
                <code
                  onClick={() => {
                    if (wallet.connection.status === "connected") setIsDisconnecting(true);
                  }}
                  className="cursor-pointer text-lg text-red-300 hover:underline"
                >
                  Disconnect
                </code>
                {" 🚫"}
              </>
            )}
          </code>
        )
      )}
      {wallet.connection.status === "connected" &&
        (wallet.connection.chain.status === "ready" ? (
          <div className="flex flex-col items-end gap-2">
            {!isSwitchingWalletChain ? (
              <code className="text-right text-lg">
                <code
                  style={{
                    color: wallet.connection.chain.chain.color,
                  }}
                >
                  {wallet.connection.chain.chain.displayName}
                </code>
                <code> | </code>
                <code
                  onClick={() => {
                    setIsSwitchingWalletChain(true);
                  }}
                  className="cursor-pointer text-green-300 hover:underline"
                >
                  Switch
                </code>
                {" 🔀"}
              </code>
            ) : (
              wallet.supportedChains.map((chain) => (
                <code
                  key={chain.id}
                  style={{ color: chain.color }}
                  className="cursor-pointer text-right text-lg hover:underline"
                  onClick={() => {
                    setPendingChainId(chain.id);
                    // A rejected/failed switch otherwise vanishes: the domain
                    // layer flips the chain to "unsupported" but nothing logs.
                    switchChain(wallet, chain.id).catch((error: unknown) => {
                      console.error("switchChain failed", error);
                    });
                    setIsSwitchingWalletChain(false);
                  }}
                >
                  {chain.displayName}
                </code>
              ))
            )}
          </div>
        ) : wallet.connection.chain.status === "switching" ? (
          <code className="text-right text-lg">Switching Chain...</code>
        ) : wallet.connection.chain.status === "adding" ? (
          <code className="text-right text-lg">Adding Chain...</code>
        ) : (
          <code
            className="cursor-pointer text-right text-lg hover:underline"
            onClick={() => {
              setIsSwitchingWalletChain(true);
            }}
          >
            Unsupported Chain
          </code>
        ))}
      {/* e.g. the wallet balances — hidden while the chain switcher is open
          and while a chosen switch is still settling. */}
      {!isSwitchingWalletChain && !isAwaitingSwitch && children}
    </div>
  );
}

/** Top-right wallet corner: active connection details or the connect flow. */
export function WalletPanel({ wallet, children }: { wallet: Wallet | undefined; children?: ReactNode }) {
  const { wallets, connect } = useWallets();
  const [isShowingWallets, setIsShowingWallets] = useState(false);

  const connectedCount = useMemo(() => wallets.filter((w) => w.connection.status === "connected").length, [wallets]);
  const disconnectedWallets = useMemo(() => wallets.filter((w) => w.connection.status === "disconnected"), [wallets]);

  return (
    <div className="flex flex-col items-end gap-8 pt-1 pr-1">
      {wallet ? (
        <ConnectionItem wallet={wallet}>{children}</ConnectionItem>
      ) : !isShowingWallets && wallets.length - connectedCount > 0 ? (
        <code
          onClick={() => {
            setIsShowingWallets(!isShowingWallets);
          }}
          className="cursor-pointer text-lg hover:underline"
        >
          Connect
        </code>
      ) : (
        <div className="flex flex-col items-end gap-2">
          {disconnectedWallets.map((wallet) => (
            <ConnectWallet
              key={wallet.type}
              wallet={wallet}
              connect={() => {
                void connect(wallet);
                setIsShowingWallets(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
