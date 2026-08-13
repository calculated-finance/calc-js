import { createFileRoute } from "@tanstack/react-router";
import { StrategyHandle } from "@template/domain/calc";
import { COSMOS_CHAINS_BY_ID } from "@template/domain/chains";
import {
  type Edge,
  type Node,
  Background,
  BackgroundVariant,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useState } from "react";
import { v4 } from "uuid";
import { actionNodeTypes } from "../../components/create/actions";
import { StrategyList } from "../../components/create/strategy-list";
import { WalletPanel } from "../../components/wallet/wallet-panel";
import { useConnectedWallet } from "../../hooks/use-connection";
import { useDraftStrategies } from "../../hooks/use-draft-strategies";
import { useNodeModalStore } from "../../hooks/use-node-modal-store";
import { useNodeVisibilityStore } from "../../hooks/use-node-visibility";
import { useStrategies } from "../../hooks/use-strategies";
import { useStrategy } from "../../hooks/use-strategy";
import { useStrategyChain } from "../../hooks/use-strategy-chain";
import { useWallets } from "../../hooks/use-wallets";
import { NODE_SPACING } from "../../lib/layout/constants";
import { layoutStrategy } from "../../lib/layout/layout-strategy";

export const Route = createFileRoute("/create/")({
  component: () => (
    <ReactFlowProvider>
      <CreateStrategy />
    </ReactFlowProvider>
  ),
});

type StrategyFilter = "draft" | "active" | "paused" | "archived";

const FILTERS: StrategyFilter[] = ["draft", "active", "paused", "archived"];

const FILTER_LABELS: Record<StrategyFilter, string> = {
  draft: "Drafts",
  active: "Active",
  paused: "Paused",
  archived: "Archived",
};

const nodeTypes = {
  ...actionNodeTypes,
  loadingStrategies: ({ data: { status } }: { data: { status: StrategyFilter } }) => (
    <code className="text-lg text-zinc-500">Fetching {status} strategies...</code>
  ),
  loadingStrategy: ({ data: { label } }: { data: { label: string } }) => (
    <code className="text-lg text-zinc-500">Fetching {label || "strategy"}...</code>
  ),
};

export default function CreateStrategy() {
  const { wallet } = useConnectedWallet();
  const { chain, setChain: setStrategyChain } = useStrategyChain();
  const [isSwitchingStrategyChain, setIsSwitchingStrategyChain] = useState(false);

  const [strategyFilter, setStrategyFilter] = useState<StrategyFilter>("active");
  const { data: strategyHandles, isLoading: isLoadingStrategies } = useStrategies(chain.id, strategyFilter);
  const [selectedHandle, setStrategyHandle] = useState<StrategyHandle>();

  // The active handle is derived: fall back to the first available handle
  // whenever the selection is missing from the current set.
  const strategyHandle =
    selectedHandle && strategyHandles?.[selectedHandle.id]
      ? selectedHandle
      : (Object.values(strategyHandles ?? {})[0] as StrategyHandle | undefined);

  const { add, update } = useDraftStrategies(chain.id);
  const { data: strategy, isPending: isPendingStrategy } = useStrategy(strategyHandle);

  const { fitView } = useReactFlow();

  useEffect(() => {
    void fitView();
  }, [strategyFilter, strategyHandle, fitView]);

  const { wallets } = useWallets();
  const { isVisible } = useNodeVisibilityStore();
  const { setOpenId } = useNodeModalStore();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  // The generic matches the default, but without it the empty literal infers never[].
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const layoutNodes = useCallback(() => {
    if (isLoadingStrategies) {
      setNodes([{ id: "loading", type: "loadingStrategies", data: { status: strategyFilter }, position: { x: 0, y: 0 } }]);
      setEdges([]);
      return;
    }

    if (isPendingStrategy && strategyHandle) {
      setNodes([{ id: "loading", type: "loadingStrategy", data: { label: strategyHandle.label }, position: { x: 0, y: 0 } }]);
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
        nodeSpacing: NODE_SPACING,
      },
    );

    // xyflow's Node data slot wants an index signature our param aliases
    // can't carry; the shapes are otherwise identical.
    setNodes(layout.nodes as unknown as Node[]);
    setEdges(layout.edges);
    void fitView();
  }, [strategyFilter, isPendingStrategy, isLoadingStrategies, strategy, strategyHandle, update, fitView, setNodes, setEdges]);

  useEffect(() => {
    layoutNodes();
  }, [layoutNodes, strategy]);

  const createDraft = () => {
    const connectedChainWallet = wallets.find(
      (w) => w.supportedChains.some((c) => c.id === chain.id) && w.connection.status === "connected",
    );
    const handle = {
      id: v4(),
      chainId: chain.id,
      owner: connectedChainWallet?.connection.status === "connected" ? connectedChainWallet.connection.address : "",
      label: "New Strategy",
      status: "draft" as const,
    };
    add(handle);
    setStrategyFilter("draft");
    setStrategyHandle(handle);
    setOpenId(handle.id);
  };

  return (
    <div className="flex h-screen w-screen">
      <ReactFlow
        nodes={nodes}
        edges={
          edges.map((edge) => ({
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
        <Panel position="top-left" className="flex flex-col gap-2">
          <div className="flex items-start gap-6 pt-1 pl-2">
            {FILTERS.map((filter) => (
              <code
                key={filter}
                onClick={() => {
                  setStrategyFilter(filter);
                }}
                className={`cursor-pointer text-lg hover:underline ${
                  strategyFilter === filter ? "text-zinc-200 underline" : "text-zinc-600"
                }`}
              >
                {FILTER_LABELS[filter]}
              </code>
            ))}
            <div className="flex flex-col items-start gap-2">
              <code
                onClick={() => {
                  setIsSwitchingStrategyChain(true);
                }}
                className="cursor-pointer text-lg hover:underline"
                style={{
                  color: chain.color,
                }}
              >
                {chain.displayName}
              </code>
              {isSwitchingStrategyChain &&
                Object.values(COSMOS_CHAINS_BY_ID)
                  .filter((c) => !!c.managerContract)
                  .map((c) => (
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
              <code onClick={createDraft} className="text-blue-300">
                <code className="cursor-pointer text-lg hover:underline">Create draft</code>
                {" ✍🏻"}
              </code>
            </div>
          )}
        </Panel>
        <Panel position="bottom-left">
          <StrategyList
            handles={strategyHandles ?? {}}
            filter={strategyFilter}
            selectedId={strategyHandle?.id}
            onSelect={setStrategyHandle}
          />
        </Panel>
        <Panel position="top-right">
          <WalletPanel wallet={wallet} />
        </Panel>
      </ReactFlow>
    </div>
  );
}
