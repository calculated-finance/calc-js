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
import { StrategyActionsNode } from "../../components/create/strategy-actions";
import { type StatusKey, StatusFilter, StrategyList } from "../../components/create/strategy-list";
import { TemplateSetupForm } from "../../components/create/template-setup-form";
import { TransactionModal } from "../../components/create/transaction-modal";
import { STRATEGY_TEMPLATES, type StrategyTemplate } from "../../components/create/templates";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../../components/ui/drawer";
import { Modal, ModalContent, ModalHeader, ModalTitle } from "../../components/ui/modal";
import { useAssets } from "../../hooks/use-assets";
import { useFinPairs } from "../../hooks/use-fin-pairs";
import { WalletBalances } from "../../components/wallet/wallet-balances";
import { WalletPanel } from "../../components/wallet/wallet-panel";
import { useConnectedAddress } from "../../hooks/use-connected-address";
import { useConnectedWallet } from "../../hooks/use-connection";
import { useDraftStrategies } from "../../hooks/use-draft-strategies";
import { useNodeModalStore } from "../../hooks/use-node-modal-store";
import { useNodeVisibilityStore } from "../../hooks/use-node-visibility";
import { useOrderUpdates } from "../../hooks/use-order-updates";
import { useRuntime } from "../../hooks/use-runtime";
import { useStrategies } from "../../hooks/use-strategies";
import { useStrategy } from "../../hooks/use-strategy";
import { useStrategyChain } from "../../hooks/use-strategy-chain";
import { NODE_SPACING, NODE_WIDTH } from "../../lib/layout/constants";
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
  strategyActions: StrategyActionsNode,
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
  // the manager and select it under its own status filter. The selection is
  // sticky, so the shared strategy is viewable without joining the list.
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
        setListStatus(handle.status);
        setStrategyHandle({ ...handle, chainId });
      })
      .catch(() => {
        if (!cancelled) consumedSharedStrategy.current = true;
      });

    return () => {
      cancelled = true;
    };
  }, [sharedStrategyAddress, sharedChainId, strategyHandle, chain.id, runtime]);

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

  const { isVisible } = useNodeVisibilityStore();
  const { setOpenId } = useNodeModalStore();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  // The generic matches the default, but without it the empty literal infers never[].
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const layoutNodes = useCallback(() => {
    // Loading and error states render as a screen-centred overlay instead
    // of flow nodes, so the viewport doesn't zoom to fit a line of text.
    if (isLoadingStrategies || (strategyHandle && isPendingStrategy)) {
      setNodes([]);
      setEdges([]);
      return;
    }

    // A failed fetch/decode must say so on the canvas; a silent blank reads
    // as "no strategy selected".
    if (strategyError && strategyHandle) {
      console.error("Failed to load strategy", strategyHandle, strategyError);
      setNodes([]);
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
    const laidOut = layout.nodes as unknown as Node[];

    // Status-appropriate actions (pause/withdraw/restart/...) float above
    // the layout, centred on its horizontal extent.
    if (strategyHandle) {
      const minX = Math.min(...laidOut.map((node) => node.position.x));
      const maxX = Math.max(...laidOut.map((node) => node.position.x + NODE_WIDTH));
      const minY = Math.min(...laidOut.map((node) => node.position.y));
      laidOut.push({
        id: `${strategyHandle.id}:actions`,
        type: "strategyActions",
        position: { x: (minX + maxX) / 2, y: minY - NODE_SPACING * 2 },
        data: { handle: strategyHandle },
        draggable: false,
        selectable: false,
      });
    }

    setNodes(laidOut);
    setEdges(layout.edges);
    void fitView(FIT_VIEW_OPTIONS);
  }, [isPendingStrategy, isLoadingStrategies, strategy, strategyError, strategyHandle, update, fitView, setNodes, setEdges]);

  useEffect(() => {
    layoutNodes();
  }, [layoutNodes, strategy]);

  const { assetsByDenom } = useAssets();
  const { pairsByDenom } = useFinPairs();

  const connectedAddress = useConnectedAddress(chain.id);

  const createDraft = (
    label = "New Strategy",
    nodes: CalcNode[] = [],
    // Templates collect label/owner in their setup modal, so they skip the
    // follow-up strategy modal; the blank Create draft still opens it.
    options: { owner?: string; openModal?: boolean } = {},
  ) => {
    const handle = {
      id: v4(),
      chainId: chain.id,
      owner: options.owner ?? connectedAddress ?? "",
      label,
      status: "draft" as const,
    };
    add({ ...handle, nodes });
    setListStatus("draft");
    setStrategyHandle(handle);
    if (options.openModal ?? true) setOpenId(handle.id);
  };

  // Create Strategy opens a picker of draft options; templates then open a
  // setup drawer that collects their parameters before the draft is created.
  const [isPickingCreate, setIsPickingCreate] = useState(false);
  const [setupTemplate, setSetupTemplate] = useState<StrategyTemplate>();

  const templateContext = {
    assetsByDenom,
    pairsByDenom,
    owner: connectedAddress,
  };

  const overlay = isLoadingStrategies
    ? { text: "Fetching strategies...", isError: false }
    : strategyHandle && strategyError
      ? { text: `Failed to load ${strategyHandle.label || "strategy"} — see console`, isError: true }
      : strategyHandle && isPendingStrategy
        ? { text: `Fetching ${strategyHandle.label || "strategy"}...`, isError: false }
        : undefined;

  return (
    <div className="relative flex h-screen w-screen">
      {overlay && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <code className={`max-w-150 text-lg ${overlay.isError ? "text-red-400/80" : "text-zinc-500"}`}>
            {overlay.text}
          </code>
        </div>
      )}
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
            <StatusFilter
              status={listStatus}
              onStatusChange={(next) => {
                // Explicitly deselect: chain-strategy selections are sticky and
                // would otherwise survive into the new filter's list.
                setStrategyHandle(undefined);
                setListStatus(next);
              }}
            />
          </div>
        </Panel>
        <Panel position="bottom-left">
          <StrategyList
            handles={strategyHandles}
            status={listStatus}
            selectedId={strategyHandle?.id}
            onSelect={setStrategyHandle}
          />
        </Panel>
        <Panel position="top-right">
          <WalletPanel wallet={wallet}>
            <div className="pt-1">
              <WalletBalances />
            </div>
          </WalletPanel>
        </Panel>
        <Panel position="bottom-right">
          <code
            onClick={() => {
              setIsPickingCreate(true);
            }}
            className="text-blue-300"
          >
            <code className="cursor-pointer text-lg hover:underline">Create Strategy</code>
            {" ✍🏻"}
          </code>
        </Panel>
      </ReactFlow>
      <Modal
        open={isPickingCreate}
        onOpenChange={(open) => {
          if (!open) setIsPickingCreate(false);
        }}
      >
        <ModalHeader className="hidden">
          <ModalTitle>title</ModalTitle>
        </ModalHeader>
        <ModalContent showCloseButton={false}>
          <div className="flex max-w-100 flex-col gap-6">
            <div className="flex flex-col gap-1">
              <code
                onClick={() => {
                  setIsPickingCreate(false);
                  createDraft();
                }}
                className="cursor-pointer self-start text-lg text-blue-300 hover:underline"
              >
                New Strategy
              </code>
              <code className="text-sm text-zinc-400">an empty draft — add and connect the nodes yourself</code>
            </div>
            {STRATEGY_TEMPLATES.map((template) => (
              <div key={template.key} className="flex flex-col gap-1">
                <code
                  onClick={() => {
                    setIsPickingCreate(false);
                    setSetupTemplate(template);
                  }}
                  className="cursor-pointer self-start text-lg text-purple-300 hover:underline"
                >
                  {template.label}
                </code>
                <code className="text-sm text-zinc-400">{template.description}</code>
              </div>
            ))}
          </div>
        </ModalContent>
      </Modal>
      <Drawer
        direction="right"
        open={!!setupTemplate}
        onOpenChange={(open) => {
          if (!open) setSetupTemplate(undefined);
        }}
      >
        {/* Float the panel off the viewport edge so the modal-style rounded
            border reads on all sides. after:hidden kills vaul's overscroll
            cover, which extends right of the panel and paints over the
            border and gap. */}
        <DrawerContent className="!inset-y-2 !right-2 rounded-xl border bg-black after:hidden data-[vaul-drawer-direction=right]:sm:max-w-md">
          <DrawerHeader className="hidden">
            <DrawerTitle>title</DrawerTitle>
          </DrawerHeader>
          {/* relative: the form's absolute help toggle anchors to the panel. */}
          <div className="relative min-h-0 flex-1 px-6 pt-6 pb-6">
            {setupTemplate && (
              <TemplateSetupForm
                template={setupTemplate}
                context={templateContext}
                onCreate={(label, owner, templateNodes) => {
                  setSetupTemplate(undefined);
                  createDraft(label, templateNodes, { owner, openModal: false });
                }}
                onCancel={() => {
                  setSetupTemplate(undefined);
                }}
              />
            )}
          </div>
        </DrawerContent>
      </Drawer>
      {/* One shared lifecycle modal; every tx flow hands it its broadcast. */}
      <TransactionModal />
    </div>
  );
}
