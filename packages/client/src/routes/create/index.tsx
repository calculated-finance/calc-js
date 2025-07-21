import { useCreateActionStore } from "@/hooks/use-action-store";
import { createFileRoute } from "@tanstack/react-router";
import { Action, ManyAction, SwapAction } from "@template/domain/src/calc";
import type { Wallet } from "@template/domain/src/wallets";
import {
  Background,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useViewport,
  ViewportPortal,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Schema } from "effect";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BaseNode } from "../../components/create/base-node";
import { SwapNode } from "../../components/create/swap-node";
import { useWalletContext } from "../../components/providers/wallet-provider";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import { useNodeVisibilityStore } from "../../hooks/use-node-visibility";
import {
  layoutAction,
  type ActionNodeParams,
  type CustomNodeData,
} from "../../lib/layout/layout";

export const Route = createFileRoute("/create/")({
  component: () => (
    <ReactFlowProvider>
      <CreateStrategy />
    </ReactFlowProvider>
  ),
});

function ManyNode({
  data: {
    action: { many },
    update,
  },
}: CustomNodeData<ActionNodeParams<ManyAction>>) {
  const { fitView, getNodes } = useReactFlow();
  const { zoom } = useViewport();

  return (
    <BaseNode
      handleLeft
      handleRight
      title={
        <code className="text-4xl font-mono bg-zinc-900 px-1 py-[1px] rounded text-zinc-100">
          GROUP
        </code>
      }
      summary={
        <div className="text-xl text-zinc-300 flex flex-col gap-1.5">
          Execute {many.length}{" "}
          <code className="font-mono px-1 py-[1px] rounded text-zinc-100">
            actions
          </code>
        </div>
      }
      details={
        <div className="text-md text-zinc-300">
          {`Execute ${many.length}`}
          <code className="font-mono px-1 py-[1px] rounded text-zinc-100">
            actions
          </code>
          in parallel
        </div>
      }
      modal={(closeModal) => (
        <div className="font-bold">
          <button
            onClick={() => {
              update({
                many: [
                  ...many,
                  Schema.decodeSync(SwapAction)({
                    swap: {
                      swap_amount: { amount: "50000003210", denom: "rune" },
                      minimum_receive_amount: {
                        amount: "12312321861",
                        denom: "x/ruji",
                      },
                      adjustment: "fixed" as const,
                      routes: [],
                      maximum_slippage_bps: 100,
                    },
                  }),
                ],
              });
              closeModal();
              setTimeout(() => {
                fitView({
                  nodes: getNodes(),
                  maxZoom: zoom,
                  duration: 450,
                  interpolate: "smooth",
                });
              }, 100);
            }}
          >
            Add Action
          </button>
        </div>
      )}
    />
  );
}

function ConnectWallet({
  wallet,
  connect,
}: {
  wallet: Wallet;
  connect: () => void;
}) {
  return (
    <div
      className="w-[120px] h-[120px] flex justify-center items-center border rounded-lg border-zinc-400 cursor-pointer bg-black hover:bg-zinc-900 transition-colors"
      onClick={connect}
    >
      <img
        src={wallet.icon}
        alt={wallet.type}
        className="w-1/2 h-1/2 object-cover rounded-xl"
      />
    </div>
  );
}

function SwitchChain(wallet: Wallet) {
  return (
    <div className="flex flex-col gap-2">
      {wallet.supportedChains.map((chain) => (
        <code
          key={chain.id}
          style={{ color: chain.color }}
          className="text-lg hover:underline cursor-pointer"
        >
          {chain.displayName}
        </code>
      ))}
    </div>
  );
}

const nodeTypes = {
  swapNode: SwapNode,
  manyNode: ManyNode,
};

let nodeIdCounter = 0;

export default function CreateStrategy() {
  const { action, updateAction, removeAction } = useCreateActionStore();

  const [isShowingWallets, setIsShowingWallets] = useState(false);
  const [isShowingChains, setIsShowingChains] = useState(false);

  const { wallets, connect, connection, switchChain, disconnect } =
    useWalletContext();

  const { isVisible, setVisible: setFlowVisible } = useNodeVisibilityStore();

  useEffect(() => {
    setFlowVisible(!isShowingWallets && !isShowingChains);
  }, [isShowingWallets, isShowingChains]);

  const handleRootUpdate = useCallback(
    (action: Action) => {
      if (action === undefined) {
        removeAction();
      }
      updateAction(action);
    },
    [updateAction]
  );

  const handleRootRemove = useCallback(() => {
    removeAction();
  }, [removeAction]);

  const generateId = useCallback(() => `node-${++nodeIdCounter}`, []);

  const layoutContext = useMemo(
    () => ({
      startX: 100,
      startY: 100,
      nodeSpacing: 50,
      generateId,
    }),
    [generateId]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const layoutNodes = useCallback(() => {
    if (!action) return;

    nodeIdCounter = 0;

    const layout = layoutAction(
      { action, update: handleRootUpdate, remove: handleRootRemove },
      layoutContext
    );

    setNodes(layout.nodes as any);
    setEdges(layout.edges as any);
  }, [
    action,
    layoutContext,
    setNodes,
    setEdges,
    handleRootUpdate,
    handleRootRemove,
  ]);

  useEffect(() => {
    layoutNodes();
  }, [layoutNodes]);

  return (
    <div className="h-screen w-screen flex">
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
          minZoom: 1,
          maxZoom: 10,
        }}
        maxZoom={2}
        minZoom={0.3}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        className="w-screen h-screen"
      >
        <Background id="1" gap={30} color="#FFB636" offset={30} />
        <Background id="2" gap={30} color="#9CCBF0" />
        {!isShowingWallets && (
          <Panel position="top-right">
            <div className="flex flex-col gap-2 items-end">
              {connection?.status === "disconnected" ? (
                <code
                  onClick={() => setIsShowingWallets(!isShowingWallets)}
                  className="text-lg hover:underline cursor-pointer"
                >
                  Connect
                </code>
              ) : connection?.status === "connecting" ? (
                <Button
                  disabled
                  className="bg-black text-zinc-200 border-zinc-300 border hover:bg-zinc-800 transition-colors"
                >
                  <code>Connecting...</code>
                </Button>
              ) : (
                connection?.status === "connected" && (
                  <code
                    onClick={() => disconnect(connection.wallet)}
                    className="text-lg hover:underline cursor-pointer"
                  >
                    {connection.wallet.type}:{" "}
                    {connection.account.address.substring(0, 6)}...
                    {connection.account.address.substring(
                      connection.account.address.length - 4
                    )}{" "}
                  </code>
                )
              )}
              {connection?.status === "connected" &&
                (typeof connection.chain !== "string" ? (
                  <code
                    style={{ color: connection.chain.color }}
                    className="text-lg hover:underline cursor-pointer"
                    onClick={() => setIsShowingChains(!isShowingChains)}
                  >
                    {connection.chain.displayName}
                  </code>
                ) : connection.chain === "switching_chain" ? (
                  <code className="text-lg">Switching Chain...</code>
                ) : connection.chain === "adding_chain" ? (
                  <code className="text-lg">Adding Chain...</code>
                ) : (
                  connection.chain === "unsupported_chain" && (
                    <code
                      className="text-lg hover:underline cursor-pointer"
                      onClick={() => setIsShowingChains(!isShowingChains)}
                    >
                      Unsupported Chain
                    </code>
                  )
                ))}
            </div>
          </Panel>
        )}
        <ViewportPortal>
          <Dialog open={isShowingWallets} onOpenChange={setIsShowingWallets}>
            <DialogContent
              className="bg-transparent border-none flex justify-center items-center "
              overlayClassName="bg-transparent"
              showCloseButton={false}
            >
              <div className="flex gap-14 flex-wrap justify-center">
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
            open={connection?.status === "connected" && isShowingChains}
            onOpenChange={setIsShowingChains}
          >
            <DialogContent
              className="bg-transparent border-none flex justify-center items-center"
              overlayClassName="bg-transparent"
              showCloseButton={false}
            >
              <div className="flex gap-14 flex-wrap justify-center">
                {connection?.status === "connected" &&
                  connection.wallet.supportedChains.map((chain) => (
                    <code
                      key={chain.id}
                      style={{ color: chain.color }}
                      className="text-lg hover:underline cursor-pointer"
                      onClick={() => {
                        switchChain(connection.wallet, chain.id);
                        setIsShowingChains(false);
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
