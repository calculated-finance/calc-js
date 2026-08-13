import { createFileRoute } from "@tanstack/react-router";
import { CalcService, ChainStrategyHandle, type Node as CalcNode, StrategyHandle } from "@template/domain/calc";
import { type ChainId, COSMOS_CHAINS_BY_ID } from "@template/domain/chains";
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
import { Effect } from "effect";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import { actionNodeTypes } from "../../components/create/actions";
import { type StatusKey, StrategyList } from "../../components/create/strategy-list";
import { STRATEGY_TEMPLATES, type StrategyTemplate } from "../../components/create/templates";
import { useAssets } from "../../hooks/use-assets";
import { useFinPairs } from "../../hooks/use-fin-pairs";
import { WalletBalances } from "../../components/wallet/wallet-balances";
import { WalletPanel } from "../../components/wallet/wallet-panel";
import { useAddressBook } from "../../hooks/use-address-book";
import { useConnectedWallet } from "../../hooks/use-connection";
import { useDraftStrategies } from "../../hooks/use-draft-strategies";
import { useNodeModalStore } from "../../hooks/use-node-modal-store";
import { useNodeVisibilityStore } from "../../hooks/use-node-visibility";
import { useOrderUpdates } from "../../hooks/use-order-updates";
import { useRuntime } from "../../hooks/use-runtime";
import { useStrategies } from "../../hooks/use-strategies";
import { useStrategy } from "../../hooks/use-strategy";
import { useStrategyChain } from "../../hooks/use-strategy-chain";
import { useWallets } from "../../hooks/use-wallets";
import { NODE_SPACING } from "../../lib/layout/constants";
import { layoutStrategy } from "../../lib/layout/layout-strategy";

export const Route = createFileRoute("/create/")({
  // Shareable selection: /create?chain=thorchain&strategy=<contract_address>
  // The explicit optional-keys return type keeps the params optional for
  // navigation elsewhere (redirects from / would otherwise need a search).
  validateSearch: (search: Record<string, unknown>): { strategy?: string; chain?: ChainId } => ({
    strategy: typeof search.strategy === "string" && search.strategy.length > 0 ? search.strategy : undefined,
    chain:
      typeof search.chain === "string" && search.chain in COSMOS_CHAINS_BY_ID ? (search.chain as ChainId) : undefined,
  }),
  component: () => (
    <ReactFlowProvider>
      <CreateStrategy />
    </ReactFlowProvider>
  ),
});



/**
 * Fit the selected strategy into the middle two thirds of the viewport:
 * one sixth of padding on every side. minZoom must stay below the canvas
 * minimum so wide strategies can zoom out far enough to fit fully.
 */
const FIT_VIEW_OPTIONS = { padding: 1 / 6, maxZoom: 2, minZoom: 0.2 };

const nodeTypes = {
  ...actionNodeTypes,
  loadingStrategies: () => <code className="text-lg text-zinc-500">Fetching strategies...</code>,
  loadingStrategy: ({ data: { label } }: { data: { label: string } }) => (
    <code className="text-lg text-zinc-500">Fetching {label || "strategy"}...</code>
  ),
  strategyError: ({ data: { label } }: { data: { label: string } }) => (
    <code className="max-w-150 text-lg text-red-400/80">Failed to load {label || "strategy"} — see console</code>
  ),
};

export default function CreateStrategy() {
  const { wallet } = useConnectedWallet();
  useOrderUpdates();
  const { chain, setChain: setStrategyChain } = useStrategyChain();

  const [listStatus, setListStatus] = useState<StatusKey>("active");
  const { data: strategyHandles, isLoading: isLoadingStrategies } = useStrategies(chain.id);
  const [selectedHandle, setStrategyHandle] = useState<StrategyHandle>();

  // The active handle is derived: chain-strategy selections stick (they may
  // come from a shared URL before the listing includes them), while drafts
  // must still exist in the store so deletion clears the canvas. Nothing is
  // selected by default — the canvas stays empty until the user picks.
  const strategyHandle =
    selectedHandle && (selectedHandle.status !== "draft" || selectedHandle.id in strategyHandles)
      ? selectedHandle
      : undefined;

  const { strategy: sharedStrategyAddress, chain: sharedChainId } = Route.useSearch();
  const navigate = Route.useNavigate();
  const runtime = useRuntime();
  const { addEntry } = useAddressBook();
  // Block writing the URL until an inbound ?strategy= has been resolved,
  // otherwise the initial render would wipe the shared parameter. A ref is
  // enough: resolving also sets the selection, which re-runs the URL sync.
  const consumedSharedStrategy = useRef(!sharedStrategyAddress);

  useEffect(() => {
    if (sharedChainId && sharedChainId !== chain.id) setStrategyChain(sharedChainId);
    // Applied once: the URL seeds the chain, after that the picker owns it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // URL -> selection: resolve a shared contract address into a handle via
  // the manager, remember its owner so the listing includes the strategy,
  // and select it under its own status filter.
  useEffect(() => {
    if (!sharedStrategyAddress || consumedSharedStrategy.current) return;
    if (
      strategyHandle &&
      strategyHandle.status !== "draft" &&
      strategyHandle.contract_address === sharedStrategyAddress
    ) {
      consumedSharedStrategy.current = true;
      return;
    }

    const chainId = sharedChainId ?? chain.id;
    let cancelled = false;

    runtime
      .runPromise(
        Effect.gen(function* () {
          const CALC = yield* CalcService;
          return yield* CALC.queryManager(chainId, { strategy: { address: sharedStrategyAddress } }, ChainStrategyHandle);
        }),
      )
      .then((handle) => {
        if (cancelled) return;
        consumedSharedStrategy.current = true;
        addEntry({ chainId, address: handle.owner, label: "shared" });
        setListStatus(handle.status);
        setStrategyHandle({ ...handle, chainId });
      })
      .catch(() => {
        if (!cancelled) consumedSharedStrategy.current = true;
      });

    return () => {
      cancelled = true;
    };
  }, [sharedStrategyAddress, sharedChainId, strategyHandle, chain.id, runtime, addEntry]);

  // Selection -> URL: keep the address bar shareable for chain strategies.
  useEffect(() => {
    if (!consumedSharedStrategy.current) return;
    const nextStrategy =
      strategyHandle && strategyHandle.status !== "draft" ? strategyHandle.contract_address : undefined;
    if (nextStrategy === sharedStrategyAddress && chain.id === sharedChainId) return;
    void navigate({ search: { strategy: nextStrategy, chain: chain.id }, replace: true });
  }, [strategyHandle, chain.id, sharedStrategyAddress, sharedChainId, navigate]);

  const { add, update } = useDraftStrategies(chain.id);
  const { data: strategy, isPending: isPendingStrategy, error: strategyError } = useStrategy(strategyHandle);

  const { fitView } = useReactFlow();

  useEffect(() => {
    void fitView(FIT_VIEW_OPTIONS);
  }, [listStatus, strategyHandle, fitView]);

  const { wallets } = useWallets();
  const { isVisible } = useNodeVisibilityStore();
  const { setOpenId } = useNodeModalStore();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  // The generic matches the default, but without it the empty literal infers never[].
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const layoutNodes = useCallback(() => {
    if (isLoadingStrategies) {
      setNodes([{ id: "loading", type: "loadingStrategies", data: {}, position: { x: 0, y: 0 } }]);
      setEdges([]);
      return;
    }

    if (isPendingStrategy && strategyHandle) {
      setNodes([{ id: "loading", type: "loadingStrategy", data: { label: strategyHandle.label }, position: { x: 0, y: 0 } }]);
      setEdges([]);
      return;
    }

    // A failed fetch/decode must say so on the canvas; a silent blank reads
    // as "no strategy selected".
    if (strategyError && strategyHandle) {
      console.error("Failed to load strategy", strategyHandle, strategyError);
      setNodes([{ id: "error", type: "strategyError", data: { label: strategyHandle.label }, position: { x: 0, y: 0 } }]);
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
    void fitView(FIT_VIEW_OPTIONS);
  }, [isPendingStrategy, isLoadingStrategies, strategy, strategyError, strategyHandle, update, fitView, setNodes, setEdges]);

  useEffect(() => {
    layoutNodes();
  }, [layoutNodes, strategy]);

  const { assetsByDenom } = useAssets();
  const { pairsByDenom } = useFinPairs();

  const createDraft = (label = "New Strategy", nodes: CalcNode[] = []) => {
    const connectedChainWallet = wallets.find(
      (w) => w.supportedChains.some((c) => c.id === chain.id) && w.connection.status === "connected",
    );
    const handle = {
      id: v4(),
      chainId: chain.id,
      owner: connectedChainWallet?.connection.status === "connected" ? connectedChainWallet.connection.address : "",
      label,
      status: "draft" as const,
    };
    add({ ...handle, nodes });
    setListStatus("draft");
    setStrategyHandle(handle);
    setOpenId(handle.id);
  };

  const createFromTemplate = (template: StrategyTemplate) => {
    const connectedChainWallet = wallets.find(
      (w) => w.supportedChains.some((c) => c.id === chain.id) && w.connection.status === "connected",
    );
    const owner =
      connectedChainWallet?.connection.status === "connected" ? connectedChainWallet.connection.address : undefined;
    const nodes = template.makeNodes({ assetsByDenom, pairsByDenom, owner });
    if (nodes) createDraft(template.strategyLabel, nodes);
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
        fitViewOptions={FIT_VIEW_OPTIONS}
        maxZoom={2}
        minZoom={0.2}
        className="h-screen w-screen"
      >
        <Background id="1" gap={20} variant={BackgroundVariant.Dots} />
        <Panel position="top-left" className="flex flex-col gap-2">
          <div className="flex flex-col gap-4 pt-1 pl-2">
            <code
              onClick={() => {
                createDraft();
              }}
              className="text-blue-300"
            >
              <code className="cursor-pointer text-lg hover:underline">Create draft</code>
              {" ✍🏻"}
            </code>
            <div className="flex flex-col gap-2">
              <code className="text-sm text-zinc-400">templates</code>
              {STRATEGY_TEMPLATES.map((template) => (
                <code
                  key={template.key}
                  onClick={() => {
                    createFromTemplate(template);
                  }}
                  className="cursor-pointer text-lg text-purple-300 hover:underline"
                >
                  {template.label}
                </code>
              ))}
            </div>
          </div>
        </Panel>
        <Panel position="bottom-left">
          <StrategyList
            handles={strategyHandles}
            status={listStatus}
            onStatusChange={(next) => {
              // Explicitly deselect: chain-strategy selections are sticky and
              // would otherwise survive into the new filter's list.
              setStrategyHandle(undefined);
              setListStatus(next);
            }}
            selectedId={strategyHandle?.id}
            onSelect={setStrategyHandle}
          />
        </Panel>
        <Panel position="top-right">
          <WalletPanel wallet={wallet} />
        </Panel>
        <Panel position="bottom-right">
          <WalletBalances />
        </Panel>
      </ReactFlow>
    </div>
  );
}
