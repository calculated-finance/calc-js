import { toUtf8 } from "@cosmjs/encoding";
import { createFileRoute } from "@tanstack/react-router";
import { Strategy, StrategyHandle } from "@template/domain/src/calc";
import { Chain, CHAINS, CHAINS_BY_ID } from "@template/domain/src/chains";
import { TransactionData, type Wallet } from "@template/domain/src/wallets";
import {
  Background,
  BackgroundVariant,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  ViewportPortal,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { v4 } from "uuid";
import { Code } from "../../components/create/code";
import { DistributeNode } from "../../components/create/distribute-node";
import { ManyNode } from "../../components/create/many-node";
import { ScheduleNode } from "../../components/create/schedule-node";
import { SignTransactionForm } from "../../components/create/sign-transaction-form";
import { StartStrategyForm } from "../../components/create/start-strategy-form";
import { StrategyNode } from "../../components/create/strategy-node";
import { SwapNode } from "../../components/create/swap-node";
import { Modal, ModalContent, ModalHeader, ModalTitle } from "../../components/ui/modal";
import { useConnectedWallet } from "../../hooks/use-connection";
import { useDraftStrategies } from "../../hooks/use-draft-strategies";
import { useNodeModalStore } from "../../hooks/use-node-modal-store";
import { useNodeVisibilityStore } from "../../hooks/use-node-visibility";
import { useStrategies } from "../../hooks/use-strategies";
import { useStrategy } from "../../hooks/use-strategy";
import { useStrategyChain } from "../../hooks/use-strategy-chain";
import { useWallets } from "../../hooks/use-wallets";
import { layoutStrategy } from "../../lib/layout/layout-strategy";

export const Route = createFileRoute("/create/")({
  component: () => (
    <ReactFlowProvider>
      <CreateStrategy />
    </ReactFlowProvider>
  ),
});

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
      <img src={wallet.icon} alt={wallet.type} className="mt-[-4px] ml-3 inline h-5 w-5" />
    </code>
  );
}

function DraftStrategyHandle({
  handle,
  isSelected,
  onSelect,
}: {
  handle: StrategyHandle;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const { data: strategy } = useStrategy(handle);
  const { update, deleteStrategy } = useDraftStrategies(handle.chainId);

  const { setOpenId } = useNodeModalStore();

  return (
    <>
      <code key={handle.id} className={`flex gap-2 text-lg text-zinc-200 ${!isSelected ? "opacity-35" : ""}`}>
        {isSelected ? "* " : ""}
        {(!isSelected || !isDeleting) && (
          <Code
            onClick={() => {
              setIsDeleting(false);
              onSelect();
            }}
            className={`${isSelected ? "" : "ml-[18.5px] cursor-pointer hover:underline"}`}
          >
            {`${handle.label}${isSelected ? " |" : ""}`}
          </Code>
        )}
        {isSelected && (
          <>
            {!isDeleting && (
              <>
                {" "}
                <code onClick={() => setIsStarting(true)} className="cursor-pointer text-green-300 hover:underline">
                  Start
                </code>
                {" 🚀"}
                <code> | </code>
                <code onClick={() => setIsDeleting(true)} className="cursor-pointer text-red-300 hover:underline">
                  Delete
                </code>
                {" 🗑️"}
              </>
            )}
            {isDeleting && (
              <div className="flex items-center gap-2">
                <code>Are you sure?</code>{" "}
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
                  className="cursor-pointer pl-[2px] text-green-300 hover:underline"
                  onClick={() => {
                    setIsDeleting(false);
                  }}
                >
                  No
                </code>
              </div>
            )}
          </>
        )}
      </code>
      <Modal open={!!isStarting} onOpenChange={(open) => (open ? null : setIsStarting(false))}>
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

function ActiveStrategyHandle({
  handle,
  isSelected,
  onSelect,
}: {
  handle: StrategyHandle;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [executableTransactionData, setExecutableTransactionData] = useState<{
    chain: Chain;
    getDataWithSender: (sender: String) => TransactionData;
    callToAction?: string;
    onBack: () => void;
  }>();

  if (handle.status !== "active") {
    return null;
  }

  return (
    <>
      <code key={handle.id} className={`flex gap-2 text-lg text-zinc-200 ${!isSelected ? "opacity-35" : ""}`}>
        {isSelected ? "* " : ""}
        <Code onClick={onSelect} className={`${isSelected ? "" : "ml-[18.5px] cursor-pointer hover:underline"}`}>
          {`${handle.label}${isSelected ? " |" : ""}`}
        </Code>
        {isSelected && (
          <>
            <code
              onClick={() => {
                setExecutableTransactionData({
                  chain: CHAINS_BY_ID[handle.chainId],
                  getDataWithSender: (sender) => ({
                    type: "cosmos",
                    msgs: [
                      {
                        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                        value: {
                          sender,
                          contract: handle.contract_address,
                          msg: toUtf8(
                            JSON.stringify({
                              withdraw: [],
                            }),
                          ),
                          funds: [],
                        },
                      },
                    ],
                  }),
                  callToAction: "Withdraw Funds",
                  onBack: () => setExecutableTransactionData(undefined),
                });
              }}
              className="cursor-pointer text-green-300 hover:underline"
            >
              Withdraw
            </code>
            {" 🏛️"}
            <code> | </code>
            <code
              onClick={() => {
                setExecutableTransactionData({
                  chain: CHAINS_BY_ID[handle.chainId],
                  getDataWithSender: (sender) => ({
                    type: "cosmos",
                    msgs: [
                      {
                        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                        value: {
                          sender,
                          contract: CHAINS_BY_ID[handle.chainId].managerContract,
                          msg: toUtf8(
                            JSON.stringify({
                              update_strategy_status: {
                                contract_address: handle.contract_address,
                                status: "paused",
                              },
                            }),
                          ),
                          funds: [],
                        },
                      },
                    ],
                  }),
                  callToAction: "Pause Strategy",
                  onBack: () => setExecutableTransactionData(undefined),
                });
              }}
              className="cursor-pointer text-blue-300 hover:underline"
            >
              Pause
            </code>
            {" ⏸️"}
            <code> | </code>
            <code
              onClick={() => {
                setExecutableTransactionData({
                  chain: CHAINS_BY_ID[handle.chainId],
                  getDataWithSender: (sender) => ({
                    type: "cosmos",
                    msgs: [
                      {
                        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                        value: {
                          sender,
                          contract: CHAINS_BY_ID[handle.chainId].managerContract,
                          msg: toUtf8(
                            JSON.stringify({
                              update_strategy_status: {
                                contract_address: handle.contract_address,
                                status: "archived",
                              },
                            }),
                          ),
                          funds: [],
                        },
                      },
                    ],
                  }),
                  callToAction: "Archive Strategy",
                  onBack: () => setExecutableTransactionData(undefined),
                });
              }}
              className="cursor-pointer text-red-300 hover:underline"
            >
              Archive
            </code>
            {" 📂"}
            <code> | </code>
            <code
              onClick={() => {
                navigator.clipboard.writeText(handle.contract_address);
              }}
              className="cursor-pointer text-zinc-300 hover:underline"
            >
              Copy
            </code>
            {" 📋"}
          </>
        )}
      </code>
      <Modal
        open={!!executableTransactionData}
        onOpenChange={(open) => (open ? null : setExecutableTransactionData(undefined))}
      >
        <ModalHeader className="hidden">
          <ModalTitle>title</ModalTitle>
        </ModalHeader>
        <ModalContent showCloseButton={false}>
          {executableTransactionData && (
            <SignTransactionForm
              chain={executableTransactionData.chain}
              getDataWithSender={executableTransactionData.getDataWithSender}
              callToAction={executableTransactionData.callToAction}
            />
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

const nodeTypes = {
  scheduleNode: ScheduleNode,
  swapNode: SwapNode,
  manyNode: ManyNode,
  strategyNode: StrategyNode,
  distributeNode: DistributeNode,
  loadingStrategies: ({ data: { status } }: { data: { status: "draft" | "active" | "paused" | "archived" } }) => (
    <code className="text-lg text-zinc-500">Fetching {status} strategies...</code>
  ),
  loadingStrategy: ({ data: { label } }: { data: { label: string } }) => (
    <code className="text-lg text-zinc-500">Fetching {label || "strategy"}...</code>
  ),
};

export function ConnectionItem({ wallet }: { wallet: Wallet }) {
  const { switchChain, disconnect } = useWallets();

  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isSwitchingWalletChain, setIsSwitchingWalletChain] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {wallet.connection?.status === "connecting" ? (
        <code>Connecting {wallet.type}...</code>
      ) : wallet.connection?.status === "disconnecting" ? (
        <code>Disconnecting {wallet.type}...</code>
      ) : (
        wallet.connection?.status === "connected" && (
          <code className="text-right text-lg">
            {isDisconnecting ? (
              <code className="flex justify-end gap-2 text-lg">
                Are you sure?{" "}
                <code
                  onClick={() => {
                    disconnect(wallet);
                    setIsDisconnecting(false);
                  }}
                  className="cursor-pointer text-lg text-red-300 hover:underline"
                >
                  Yes
                </code>
                <code>/</code>
                <code
                  onClick={() => setIsDisconnecting(false)}
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
                  onClick={() => wallet.connection.status === "connected" && setIsDisconnecting(true)}
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
      {wallet.connection?.status === "connected" &&
        (typeof wallet.connection.chain !== "string" ? (
          <div className="flex flex-col items-end gap-2">
            {!isSwitchingWalletChain ? (
              <code className="text-right text-lg">
                <code
                  style={{
                    color: wallet.connection.chain.color,
                  }}
                >
                  {wallet.connection.chain.displayName}
                </code>
                <code> | </code>
                <code
                  onClick={() => setIsSwitchingWalletChain(true)}
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
                    switchChain(wallet, chain.id);
                    setIsSwitchingWalletChain(false);
                  }}
                >
                  {chain.displayName}
                </code>
              ))
            )}
          </div>
        ) : wallet.connection.chain === "switching_chain" ? (
          <code className="text-right text-lg">Switching Chain...</code>
        ) : wallet.connection.chain === "adding_chain" ? (
          <code className="text-right text-lg">Adding Chain...</code>
        ) : (
          wallet.connection.chain === "unsupported" && (
            <code
              className="cursor-pointer text-right text-lg hover:underline"
              onClick={() => setIsSwitchingWalletChain(true)}
            >
              Unsupported Chain
            </code>
          )
        ))}
    </div>
  );
}

export default function CreateStrategy() {
  const { wallet } = useConnectedWallet();
  const { chain, setChain: setStrategyChain } = useStrategyChain();
  const [isSwitchingStrategyChain, setIsSwitchingStrategyChain] = useState(false);

  const [strategyFilter, setStrategyFilter] = useState<"draft" | "active" | "paused" | "archived">("active");
  const { data: strategyHandles, isLoading: isLoadingStrategies } = useStrategies(chain.id, strategyFilter);
  const [strategyHandle, setStrategyHandle] = useState<StrategyHandle>();

  const { add, update, deleteStrategy } = useDraftStrategies(chain.id);
  const { data: strategy, isPending: isPendingStrategy } = useStrategy(strategyHandle);

  const { fitView } = useReactFlow();

  useEffect(() => {
    if (strategyHandle && strategyHandles?.[strategyHandle.id]) {
      return;
    }
    setStrategyHandle(Object.values(strategyHandles || {})[0]);
    fitView();
  }, [strategyFilter, strategyHandles, strategyHandle, strategy]);

  const [isShowingWallets, setIsShowingWallets] = useState(false);

  const { wallets, connect } = useWallets();
  const { isVisible } = useNodeVisibilityStore();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const layoutNodes = useCallback(() => {
    if (isLoadingStrategies) {
      setNodes([
        { id: "loading", type: "loadingStrategies", data: { status: strategyFilter }, position: { x: 0, y: 0 } },
      ] as any);
      setEdges([]);
      return;
    }

    if (isPendingStrategy && strategyHandle) {
      setNodes([
        { id: "loading", type: "loadingStrategy", data: { label: strategyHandle.label }, position: { x: 0, y: 0 } },
      ] as any);
      setEdges([]);
      return;
    }

    if (!strategy) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const layout = layoutStrategy(
      { strategy, update },
      {
        startX: 0,
        startY: 0,
        nodeSpacing: 50,
      },
    );

    setNodes(layout.nodes as any);
    setEdges(layout.edges as any);
    fitView();
  }, [strategyFilter, isPendingStrategy, isLoadingStrategies, strategy, strategyHandle, setNodes, setEdges]);

  useEffect(() => {
    layoutNodes();
  }, [layoutNodes, strategy]);

  const { setOpenId } = useNodeModalStore();

  const [startingStrategy, setStartingStrategy] = useState<Strategy>();

  const connectedWallets = useMemo(() => wallets.filter((w) => w.connection.status === "connected"), [wallets]);
  const disconnectedWallets = useMemo(() => wallets.filter((w) => w.connection.status === "disconnected"), [wallets]);

  return (
    <div className="flex h-screen w-screen">
      <ReactFlow
        nodes={nodes}
        edges={
          edges.map((edge: any) => ({
            ...edge,
            style: {
              ...edge.style,
              transition: "opacity 0.3s",
              opacity: !isVisible ? 0 : 1,
              pointerEvents: !isVisible ? "none" : "auto",
            },
          })) as never[]
        }
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        preventScrolling={true}
        fitView
        fitViewOptions={{
          padding: 20,
          maxZoom: 2,
          minZoom: 0.9,
        }}
        maxZoom={2}
        minZoom={0.2}
        className="h-screen w-screen"
      >
        <Background id="1" gap={20} variant={BackgroundVariant.Dots} />
        {
          <Panel position="top-left" className="flex flex-col gap-2">
            <div className="flex items-start gap-6 pt-1 pl-2">
              <code
                onClick={() => setStrategyFilter("draft")}
                className={`cursor-pointer text-lg hover:underline ${strategyFilter === "draft" ? "text-zinc-200 underline" : "text-zinc-600"}`}
              >
                Drafts
              </code>
              <code
                onClick={() => setStrategyFilter("active")}
                className={`cursor-pointer text-lg hover:underline ${strategyFilter === "active" ? "text-zinc-200 underline" : "text-zinc-600"}`}
              >
                Active
              </code>
              <code
                onClick={() => setStrategyFilter("paused")}
                className={`cursor-pointer text-lg hover:underline ${strategyFilter === "paused" ? "text-zinc-200 underline" : "text-zinc-600"}`}
              >
                Paused
              </code>
              <code
                onClick={() => setStrategyFilter("archived")}
                className={`cursor-pointer text-lg hover:underline ${strategyFilter === "archived" ? "text-zinc-200 underline" : "text-zinc-600"}`}
              >
                Archived
              </code>
              <div className="flex flex-col items-start gap-2">
                <code
                  onClick={() => setIsSwitchingStrategyChain(true)}
                  className="cursor-pointer text-lg hover:underline"
                  style={{
                    color: chain.color,
                  }}
                >
                  {chain.displayName}
                </code>
                {isSwitchingStrategyChain &&
                  CHAINS.filter((c) => !!c.managerContract).map((c) => (
                    <code
                      key={c.id}
                      style={{ color: c.color }}
                      className="cursor-pointer text-lg hover:underline"
                      onClick={() => {
                        setIsSwitchingStrategyChain(false);
                        setStrategyChain(c.id);
                      }}
                    >
                      {c.displayName}
                    </code>
                  ))}
              </div>
            </div>
            {strategyFilter === "draft" && (
              <div className="flex flex-col gap-4 pl-2">
                <code
                  onClick={() => {
                    const connectedChainWallet = wallets.find(
                      (w) => w.supportedChains.some((c) => c.id === chain.id) && w.connection.status === "connected",
                    );
                    const handle = {
                      id: `${v4()}`,
                      chainId: chain.id,
                      owner:
                        connectedChainWallet?.connection.status === "connected"
                          ? connectedChainWallet.connection.address
                          : "",
                      label: "New Strategy",
                      status: "draft" as const,
                    };
                    add(handle);
                    setStrategyFilter("draft");
                    setStrategyHandle(handle);
                    setOpenId(handle.id);
                  }}
                  className="text-blue-300"
                >
                  <code className="cursor-pointer text-lg hover:underline">Create draft</code>
                  {" ✍🏻"}
                </code>
              </div>
            )}
          </Panel>
        }
        <Panel position="bottom-left">
          <div className="flex flex-col items-start gap-4 pb-2 pl-[10px]">
            {Object.values(strategyHandles || {})
              .filter((s) => s.status === strategyFilter)
              .map((s) => {
                const isSelected = strategyHandle?.id === s.id;
                return s.status === "draft" ? (
                  <DraftStrategyHandle
                    key={s.id}
                    handle={s}
                    isSelected={isSelected}
                    onSelect={() => {
                      setStrategyHandle(s);
                    }}
                  />
                ) : (
                  <ActiveStrategyHandle
                    key={s.id}
                    handle={s}
                    isSelected={isSelected}
                    onSelect={() => {
                      setStrategyHandle(s);
                    }}
                  />
                );
              })}
          </div>
        </Panel>
        <Panel position="top-right">
          <div className="flex flex-col items-end gap-8 pt-1 pr-1">
            {wallet ? (
              <ConnectionItem wallet={wallet} />
            ) : !isShowingWallets && wallets.length - connectedWallets.length > 0 ? (
              <code
                onClick={() => setIsShowingWallets(!isShowingWallets)}
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
                      connect(wallet);
                      setIsShowingWallets(false);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </Panel>
        <ViewportPortal>
          <Modal open={!!startingStrategy} onOpenChange={(open) => (open ? null : setStartingStrategy(undefined))}>
            <ModalHeader className="hidden">
              <ModalTitle>title</ModalTitle>
            </ModalHeader>
            <ModalContent showCloseButton={false}>
              {startingStrategy && (
                <StartStrategyForm strategy={startingStrategy} update={update} deleteStrategy={deleteStrategy} />
              )}
            </ModalContent>
          </Modal>
        </ViewportPortal>
      </ReactFlow>
    </div>
  );
}
