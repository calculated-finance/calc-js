import type { Wallet, WalletType } from "@template/domain/clients";
import { useMemo, useState } from "react";
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

function ConnectionItem({ wallet }: { wallet: Wallet }) {
  const { switchChain, disconnect } = useWallets();

  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isSwitchingWalletChain, setIsSwitchingWalletChain] = useState(false);

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
                    void switchChain(wallet, chain.id);
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
    </div>
  );
}

/** Top-right wallet corner: active connection details or the connect flow. */
export function WalletPanel({ wallet }: { wallet: Wallet | undefined }) {
  const { wallets, connect } = useWallets();
  const [isShowingWallets, setIsShowingWallets] = useState(false);

  const connectedCount = useMemo(() => wallets.filter((w) => w.connection.status === "connected").length, [wallets]);
  const disconnectedWallets = useMemo(() => wallets.filter((w) => w.connection.status === "disconnected"), [wallets]);

  return (
    <div className="flex flex-col items-end gap-8 pt-1 pr-1">
      {wallet ? (
        <ConnectionItem wallet={wallet} />
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
