import { createFileRoute } from "@tanstack/react-router";
import { Strategy } from "@template/domain/src/calc";
import { Connection, type Wallet } from "@template/domain/src/wallets";
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
import { ManyNode } from "../../components/create/many-node";
import { ScheduleNode } from "../../components/create/schedule-node";
import { StrategyNode } from "../../components/create/strategy-node";
import { SwapNode } from "../../components/create/swap-node";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import { useNodeModalStore } from "../../hooks/use-node-modal-store";
import { useNodeVisibilityStore } from "../../hooks/use-node-visibility";
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
    <div
      className="flex h-[120px] w-[120px] cursor-pointer items-center justify-center rounded-lg border border-zinc-400 bg-black transition-colors hover:bg-zinc-900"
      onClick={connect}
    >
      <img src={wallet.icon} alt={wallet.type} className="h-1/2 w-1/2 rounded-xl object-cover" />
    </div>
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

  const { add, update, deleteStrategy, strategies } = useStrategyStore();
  const [strategy, setStrategy] = useState<Strategy>();

  useEffect(() => {
    if (!strategy && !strategies) setStrategy(undefined);
    else setStrategy(strategy && strategies[strategy.id] ? strategies[strategy.id] : Object.values(strategies)[0]);
  }, [strategies]);

  const [isShowingWallets, setIsShowingWallets] = useState(false);
  const [switchingChainsConnection, setSwitchingChainsConnection] = useState<Connection>();

  const { wallets, connect, connections, switchChain, disconnect } = useWallets();
  const { isVisible, setVisible: setFlowVisible } = useNodeVisibilityStore();

  useEffect(() => {
    setFlowVisible(!isShowingWallets && !switchingChainsConnection);
  }, [isShowingWallets, switchingChainsConnection]);

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

  const { fitView } = useReactFlow();

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
    fitView();
  }, [layoutNodes, strategy]);

  const [isDisconnecting, setIsDisconnecting] = useState<string>();

  function ConnectionItem({ connection }: { connection: Connection }) {
    return (
      <div className="flex flex-col gap-2">
        {connection?.status === "connecting" ? (
          <code>Connecting...</code>
        ) : (
          connection?.status === "connected" && (
            <code className="text-right text-lg">
              {isDisconnecting == connection.account.address ? (
                <code className="text-lg">
                  Are you sure?{" "}
                  <code
                    onClick={() => {
                      disconnect(connection.wallet);
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
                    ({connection.wallet.type}) {connection.account.address.substring(0, 5)}...
                    {connection.account.address.substring(connection.account.address.length - 7)}:{" "}
                  </code>
                  <code
                    onClick={() => setIsDisconnecting(connection.account.address)}
                    className="cursor-pointer text-lg text-red-300 hover:underline"
                  >
                    Disconnect
                  </code>
                </>
              )}
            </code>
          )
        )}
        {connection?.status === "connected" &&
          (typeof connection.chain !== "string" ? (
            <code
              style={{
                color: connection.chain.color,
              }}
              className="text-right text-lg"
            >
              <code>{connection.chain.displayName}: </code>
              <code
                onClick={() => setSwitchingChainsConnection(connection)}
                className="cursor-pointer text-green-300 hover:underline"
              >
                Switch
              </code>
            </code>
          ) : connection.chain === "switching_chain" ? (
            <code className="text-right text-lg">Switching Chain...</code>
          ) : connection.chain === "adding_chain" ? (
            <code className="text-right text-lg">Adding Chain...</code>
          ) : (
            connection.chain === "unsupported" && (
              <code
                className="cursor-pointer text-right text-lg hover:underline"
                onClick={() => setSwitchingChainsConnection(connection)}
              >
                Unsupported Chain
              </code>
            )
          ))}
      </div>
    );
  }

  const [isStarting, setIsStarting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { setOpenId } = useNodeModalStore();

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
          minZoom: 1,
        }}
        maxZoom={2}
        minZoom={0.2}
        className="h-screen w-screen"
      >
        <Background id={`1`} gap={20} variant={BackgroundVariant.Dots} />
        {!isShowingWallets && !switchingChainsConnection && (
          <Panel position="top-left" className="flex flex-col items-start gap-4">
            <div className="flex items-start gap-6 pt-1 pl-2">
              <code className="cursor-pointer text-lg text-zinc-200 underline">Drafts</code>
              <code className="cursor-pointer text-lg text-zinc-600 hover:underline">Active</code>
              <code className="cursor-pointer text-lg text-zinc-600 hover:underline">Paused</code>
              <code className="cursor-pointer text-lg text-zinc-600 hover:underline">Archived</code>
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
        {!isShowingWallets && !switchingChainsConnection && (
          <Panel position="bottom-left">
            {strategyFilter === "draft" && (
              <div className="flex flex-col items-start gap-4 pb-4 pl-2">
                <div className="flex flex-col gap-4">
                  {Object.values(strategies)
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
                                setIsStarting(false);
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
                                    onClick={() => setIsStarting(!isStarting)}
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
        {!isShowingWallets && !switchingChainsConnection && (
          <Panel position="top-right">
            <div className="flex flex-col items-end gap-8 pt-1 pr-1">
              {connections
                .filter((c) => c.status === "connected")
                .map((connection, i) => (
                  <ConnectionItem key={i} connection={connection} />
                ))}
              <code
                onClick={() => setIsShowingWallets(!isShowingWallets)}
                className="cursor-pointer text-lg hover:underline"
              >
                Connect
              </code>
            </div>
          </Panel>
        )}
        <ViewportPortal>
          <Dialog open={isShowingWallets} onOpenChange={setIsShowingWallets}>
            <DialogContent
              className="flex items-center justify-center border-none bg-transparent"
              overlayClassName="bg-transparent"
              showCloseButton={false}
            >
              <div className="flex flex-wrap justify-center gap-14">
                {wallets.map((wallet) => (
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
            </DialogContent>
          </Dialog>
          <Dialog
            open={!!switchingChainsConnection}
            onOpenChange={(open) => (open ? null : setSwitchingChainsConnection(undefined))}
          >
            <DialogContent
              className="flex items-center justify-center border-none bg-transparent"
              overlayClassName="bg-transparent"
              showCloseButton={false}
            >
              <div className="flex flex-wrap justify-center gap-14">
                {switchingChainsConnection?.status === "connected" &&
                  switchingChainsConnection.wallet.supportedChains.map((chain) => (
                    <code
                      key={chain.id}
                      style={{ color: chain.color }}
                      className="cursor-pointer text-lg hover:underline"
                      onClick={() => {
                        switchChain(switchingChainsConnection.wallet, chain.id);
                        setSwitchingChainsConnection(undefined);
                      }}
                    >
                      {chain.displayName}
                    </code>
                  ))}
              </div>
            </DialogContent>
          </Dialog>
        </ViewportPortal>
      </ReactFlow>
    </div>
  );
}
