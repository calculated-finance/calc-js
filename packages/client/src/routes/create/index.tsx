import { createFileRoute } from "@tanstack/react-router";
import { Strategy } from "@template/domain/src/calc";
import { type Wallet } from "@template/domain/src/wallets";
import {
  Background,
  BackgroundVariant,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  ViewportPortal,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { v4 } from "uuid";
import { Code } from "../../components/create/code";
import { ManyNode } from "../../components/create/many-node";
import { ScheduleNode } from "../../components/create/schedule-node";
import { StartStrategyForm } from "../../components/create/start-strategy-form";
import { StrategyNode } from "../../components/create/strategy-node";
import { SwapNode } from "../../components/create/swap-node";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import { Modal, ModalContent, ModalHeader, ModalTitle } from "../../components/ui/modal";
import { useNodeModalStore } from "../../hooks/use-node-modal-store";
import { useNodeVisibilityStore } from "../../hooks/use-node-visibility";
import { useStrategies } from "../../hooks/use-strategies";
import { useStrategyStore } from "../../hooks/use-strategy-store";
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
      }}
      onClick={connect}
    >
      {wallet.type}
    </code>
  );
}

const nodeTypes = {
  scheduleNode: ScheduleNode,
  swapNode: SwapNode,
  manyNode: ManyNode,
  strategyNode: StrategyNode,
};

let nodeIdCounter = 0;

export default function CreateStrategy() {
  const [strategyFilter, setStrategyFilter] = useState<"draft" | "active" | "paused" | "archived">("draft");

  const { add, update, deleteStrategy } = useStrategyStore();

  const { data: strategies } = useStrategies(strategyFilter);

  console.log({strategies})

  const [strategy, setStrategy] = useState<Strategy>();

  // useEffect(() => {
  //   if (!strategy || !strategies) setStrategy(undefined);
  //   else setStrategy(Object.values(strategies)[0]);
  // }, [strategies]);

  const [isShowingWallets, setIsShowingWallets] = useState(false);
  const [switchingChainsWallet, setSwitchingChainsWallet] = useState<Wallet>();

  const { wallets, connect, switchChain, disconnect } = useWallets();
  const { isVisible, setVisible: setFlowVisible } = useNodeVisibilityStore();

  useEffect(() => {
    setFlowVisible(!isShowingWallets && !switchingChainsWallet);
  }, [isShowingWallets, switchingChainsWallet]);

  const generateId = useCallback(() => `node-${++nodeIdCounter}`, []);

  const layoutContext = useMemo(
    () => ({
      startX: 0,
      startY: 0,
      nodeSpacing: 50,
      generateId,
    }),
    [generateId],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const layoutNodes = useCallback(() => {
    if (!strategy) {
      setNodes([]);
      setEdges([]);
      return;
    }

    nodeIdCounter = 0;

    const layout = layoutStrategy({ strategy, update }, layoutContext);

    setNodes(layout.nodes as any);
    setEdges(layout.edges as any);
  }, [strategy, layoutContext, setNodes, setEdges]);

  useEffect(() => {
    layoutNodes();
  }, [layoutNodes, strategy]);

  const [isDisconnecting, setIsDisconnecting] = useState<string>();

  function ConnectionItem({ wallet }: { wallet: Wallet }) {
    return (
      <div className="flex flex-col gap-2">
        {wallet.connection?.status === "connecting" ? (
          <code>Connecting {wallet.type}...</code>
        ) : wallet.connection?.status === "disconnecting" ? (
          <code>Disconnecting {wallet.type}...</code>
        ) : (
          wallet.connection?.status === "connected" && (
            <code className="text-right text-lg">
              {isDisconnecting == wallet.connection.address ? (
                <code className="text-lg">
                  Are you sure?{" "}
                  <code
                    onClick={() => {
                      disconnect(wallet);
                      setIsDisconnecting(undefined);
                    }}
                    className="cursor-pointer text-lg text-red-300 hover:underline"
                  >
                    Yes
                  </code>
                  <code> / </code>
                  <code
                    onClick={() => setIsDisconnecting(undefined)}
                    className="cursor-pointer text-green-300 hover:underline"
                  >
                    No
                  </code>
                </code>
              ) : (
                <>
                  <code className="text-right text-lg">
                    {wallet.connection.label} ({wallet.connection.address.substring(0, 5)}...
                    {wallet.connection.address.substring(wallet.connection.address.length - 7)}
                    ):{" "}
                  </code>
                  <code
                    onClick={() =>
                      wallet.connection.status === "connected" && setIsDisconnecting(wallet.connection.address)
                    }
                    className="cursor-pointer text-lg text-red-300 hover:underline"
                  >
                    Disconnect
                  </code>
                </>
              )}
            </code>
          )
        )}
        {wallet.connection?.status === "connected" &&
          (typeof wallet.connection.chain !== "string" ? (
            <code
              style={{
                color: wallet.connection.chain.color,
              }}
              className="text-right text-lg"
            >
              <code>{wallet.connection.chain.displayName}: </code>
              <code
                onClick={() => setSwitchingChainsWallet(wallet)}
                className="cursor-pointer text-green-300 hover:underline"
              >
                Switch
              </code>
            </code>
          ) : wallet.connection.chain === "switching_chain" ? (
            <code className="text-right text-lg">Switching Chain...</code>
          ) : wallet.connection.chain === "adding_chain" ? (
            <code className="text-right text-lg">Adding Chain...</code>
          ) : (
            wallet.connection.chain === "unsupported" && (
              <code
                className="cursor-pointer text-right text-lg hover:underline"
                onClick={() => setSwitchingChainsWallet(wallet)}
              >
                Unsupported Chain
              </code>
            )
          ))}
      </div>
    );
  }

  const [isDeleting, setIsDeleting] = useState(false);

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
          padding: 50,
          maxZoom: 2,
          minZoom: 0.5,
        }}
        maxZoom={2}
        minZoom={0.2}
        className="h-screen w-screen"
      >
        <Background id={`1`} gap={20} variant={BackgroundVariant.Dots} />
        {!isShowingWallets && !switchingChainsWallet && (
          <Panel position="top-left" className="flex flex-col items-start gap-4">
            <div className="flex items-start gap-6 pt-1 pl-2">
              <code onClick={() => setStrategyFilter("draft")} className="cursor-pointer text-lg text-zinc-200 underline">Drafts</code>
              <code onClick={() => setStrategyFilter("active")} className="cursor-pointer text-lg text-zinc-600 hover:underline">Active</code>
              <code onClick={() => setStrategyFilter("paused")} className="cursor-pointer text-lg text-zinc-600 hover:underline">Paused</code>
              <code onClick={() => setStrategyFilter("archived")} className="cursor-pointer text-lg text-zinc-600 hover:underline">Archived</code>
            </div>
            <div className="flex flex-col pl-2">
              <code
                onClick={() => {
                  const strategy = {
                    id: `${v4()}`,
                    action: undefined,
                    label: "New Strategy",
                    status: "draft" as const,
                  };
                  add(strategy);
                  setStrategy(strategy);
                  setOpenId(strategy.id);
                }}
                className="text-lg text-blue-300"
              >
                {"-> "}
                <code className="cursor-pointer hover:underline">Create Draft</code>
              </code>
            </div>
          </Panel>
        )}
        {!isShowingWallets && !switchingChainsWallet && (
          <Panel position="bottom-left">
            {strategyFilter === "draft" && (
              <div className="flex flex-col items-start gap-4 pb-4 pl-2">
                <div className="flex flex-col gap-4">
                  {Object.values(strategies || {})
                    .filter((s) => s.status === "draft")
                    .map((s) => {
                      const isSelected = strategy?.id === s.id;
                      return (
                        <code
                          key={s.id}
                          className={`text-lg ${s.id === strategy?.id ? "text-zinc-200" : "text-zinc-600"}`}
                        >
                          *{" "}
                          {(!isSelected || !isDeleting) && (
                            <Code
                              onClick={() => {
                                setIsDeleting(false);
                                setStrategy(s);
                              }}
                              className={`${isSelected ? "" : "cursor-pointer hover:underline"}`}
                            >
                              {s.label}
                            </Code>
                          )}
                          {s.id === strategy?.id && (
                            <code>
                              {!isDeleting && (
                                <>
                                  {": "}
                                  <code
                                    onClick={() => {
                                      setStartingStrategy(s);
                                    }}
                                    className="cursor-pointer text-green-300 hover:underline"
                                  >
                                    Start
                                  </code>
                                  <code> | </code>
                                  <code
                                    onClick={() => setIsDeleting(true)}
                                    className="cursor-pointer text-red-300 hover:underline"
                                  >
                                    Delete
                                  </code>
                                </>
                              )}
                              {isDeleting && (
                                <>
                                  <code>Are you sure?</code>{" "}
                                  <code
                                    className="cursor-pointer text-red-300 hover:underline"
                                    onClick={() => {
                                      deleteStrategy(s.id);
                                      setIsDeleting(false);
                                    }}
                                  >
                                    Yes
                                  </code>
                                  <code> / </code>
                                  <code
                                    className="cursor-pointer text-green-300 hover:underline"
                                    onClick={() => {
                                      setIsDeleting(false);
                                    }}
                                  >
                                    No
                                  </code>
                                </>
                              )}
                            </code>
                          )}
                        </code>
                      );
                    })}
                </div>
              </div>
            )}
          </Panel>
        )}
        {!switchingChainsWallet && (
          <Panel position="top-right">
            <div className="flex flex-col items-end gap-8 pt-1 pr-1">
              {wallets
                .filter(({ connection: { status } }) => status !== "disconnected")
                .map((wallet, i) => (
                  <ConnectionItem key={i} wallet={wallet} />
                ))}
              {!isShowingWallets && wallets.length - connectedWallets.length > 0 ? (
                <code
                  onClick={() => setIsShowingWallets(!isShowingWallets)}
                  className="cursor-pointer text-lg hover:underline"
                >
                  Connect
                </code>
              ) : (
                <div className="flex flex-col items-end gap-4">
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
        )}
        <ViewportPortal>
          <Dialog
            open={!!switchingChainsWallet}
            onOpenChange={(open) => (open ? null : setSwitchingChainsWallet(undefined))}
          >
            <DialogContent
              className="flex items-center justify-center border-none bg-transparent"
              overlayClassName="bg-transparent"
              showCloseButton={false}
            >
              <div className="flex flex-wrap justify-center gap-14">
                {switchingChainsWallet?.connection.status === "connected" &&
                  switchingChainsWallet.supportedChains.map((chain) => (
                    <code
                      key={chain.id}
                      style={{ color: chain.color }}
                      className="cursor-pointer text-lg hover:underline"
                      onClick={() => {
                        switchChain(switchingChainsWallet, chain.id);
                        setSwitchingChainsWallet(undefined);
                      }}
                    >
                      {chain.displayName}
                    </code>
                  ))}
              </div>
            </DialogContent>
          </Dialog>
          <Modal open={!!startingStrategy} onOpenChange={(open) => (open ? null : setStartingStrategy(undefined))}>
            <ModalHeader className="hidden"><ModalTitle>title</ModalTitle></ModalHeader>
            <ModalContent showCloseButton={false}>
              {startingStrategy && <StartStrategyForm strategy={startingStrategy} update={update} />}
            </ModalContent>
          </Modal>
        </ViewportPortal>
      </ReactFlow>
    </div>
  );
}
