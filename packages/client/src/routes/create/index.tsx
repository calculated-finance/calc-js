import { useCreateActionStore } from '@/hooks/use-action-store'
import { createFileRoute } from '@tanstack/react-router'
import { Action } from '@template/domain/src/calc'
import { Connection, type Wallet } from '@template/domain/src/wallets'
import {
  Background,
  BackgroundVariant,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  ViewportPortal,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { StrategyNode } from '../../components/create/strategy-node'
import { SwapNode } from '../../components/create/swap-node'
import { Dialog, DialogContent } from '../../components/ui/dialog'
import { useNodeVisibilityStore } from '../../hooks/use-node-visibility'
import { useWallets } from '../../hooks/use-wallets'
import { layoutAction } from '../../lib/layout/layout'

export const Route = createFileRoute('/create/')({
  component: () => (
    <ReactFlowProvider>
      <CreateStrategy />
    </ReactFlowProvider>
  ),
})

function ConnectWallet({
  wallet,
  connect,
}: {
  wallet: Wallet
  connect: () => void
}) {
  return (
    <div
      className="flex h-[120px] w-[120px] cursor-pointer items-center justify-center rounded-lg border border-zinc-400 bg-black transition-colors hover:bg-zinc-900"
      onClick={connect}
    >
      <img
        src={wallet.icon}
        alt={wallet.type}
        className="h-1/2 w-1/2 rounded-xl object-cover"
      />
    </div>
  )
}

const nodeTypes = {
  swapNode: SwapNode,
  manyNode: StrategyNode,
}

let nodeIdCounter = 0

export default function CreateStrategy() {
  const { action, updateAction, removeAction } = useCreateActionStore()

  const [isShowingWallets, setIsShowingWallets] = useState(false)
  const [switchingChainsConnection, setSwitchingChainsConnection] =
    useState<Connection>()

  const { wallets, connect, connections, switchChain, disconnect } =
    useWallets()

  const { isVisible, setVisible: setFlowVisible } = useNodeVisibilityStore()

  useEffect(() => {
    setFlowVisible(!isShowingWallets && !switchingChainsConnection)
  }, [isShowingWallets, switchingChainsConnection])

  const handleRootUpdate = useCallback(
    (action: Action) => {
      if (action === undefined) {
        removeAction()
      }
      updateAction(action)
    },
    [updateAction]
  )

  const handleRootRemove = useCallback(() => {
    removeAction()
  }, [removeAction])

  const generateId = useCallback(() => `node-${++nodeIdCounter}`, [])

  const layoutContext = useMemo(
    () => ({
      startX: 100,
      startY: 100,
      nodeSpacing: 50,
      generateId,
    }),
    [generateId]
  )

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const layoutNodes = useCallback(() => {
    if (!action) return

    nodeIdCounter = 0

    const layout = layoutAction(
      { action, update: handleRootUpdate, remove: handleRootRemove },
      layoutContext
    )

    setNodes(layout.nodes as any)
    setEdges(layout.edges as any)
  }, [
    action,
    layoutContext,
    setNodes,
    setEdges,
    handleRootUpdate,
    handleRootRemove,
  ])

  useEffect(() => {
    layoutNodes()
  }, [layoutNodes])

  function ConnectionItem({ connection }: { connection: Connection }) {
    return (
      <div className="flex flex-col gap-2">
        {connection?.status === 'connecting' ? (
          <code>Connecting...</code>
        ) : (
          connection?.status === 'connected' && (
            <code
              onClick={() => disconnect(connection.wallet)}
              className="cursor-pointer text-lg hover:underline"
            >
              {connection.wallet.type}:{' '}
              {connection.account.address.substring(0, 5)}...
              {connection.account.address.substring(
                connection.account.address.length - 7
              )}
            </code>
          )
        )}
        {connection?.status === 'connected' &&
          (typeof connection.chain !== 'string' ? (
            <code
              style={{
                color: connection.chain.color,
              }}
              className="cursor-pointer text-right text-lg hover:underline"
              onClick={() => setSwitchingChainsConnection(connection)}
            >
              {connection.chain.displayName}
            </code>
          ) : connection.chain === 'switching_chain' ? (
            <code className="text-right text-lg">Switching Chain...</code>
          ) : connection.chain === 'adding_chain' ? (
            <code className="text-right text-lg">Adding Chain...</code>
          ) : (
            connection.chain === 'unsupported' && (
              <code
                className="cursor-pointer text-right text-lg hover:underline"
                onClick={() => setSwitchingChainsConnection(connection)}
              >
                Unsupported Chain
              </code>
            )
          ))}
      </div>
    )
  }

  return (
    <div className="flex h-screen w-screen">
      <ReactFlow
        nodes={nodes}
        edges={
          edges.map((edge: any) => ({
            ...edge,
            style: {
              ...edge.style,
              transition: 'opacity 0.3s',
              opacity: !isVisible ? 0 : 1,
              pointerEvents: !isVisible ? 'none' : 'auto',
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
        className="h-screen w-screen"
      >
        <Background
          id="1"
          gap={30}
          color="#FFB636"
          offset={25}
          className="opacity-60"
          variant={BackgroundVariant.Dots}
        />
        <Background
          id="2"
          gap={30}
          color="#9CCBF0"
          className="opacity-60"
          variant={BackgroundVariant.Dots}
        />
        {!isShowingWallets && !switchingChainsConnection && (
          <Panel position="top-left">
            <div className="flex items-start gap-6 pt-1 pl-1">
              <code className="cursor-pointer text-lg text-zinc-200 underline">
                Drafts
              </code>
              <code className="cursor-pointer text-lg text-zinc-600 hover:underline">
                Active
              </code>
              <code className="cursor-pointer text-lg text-zinc-600 hover:underline">
                Paused
              </code>
              <code className="cursor-pointer text-lg text-zinc-600 hover:underline">
                Archived
              </code>
            </div>
          </Panel>
        )}
        {!isShowingWallets && !switchingChainsConnection && (
          <Panel position="top-right">
            <div className="flex flex-col items-end gap-8 pt-1 pr-1">
              {connections
                .filter(c => c.status === 'connected')
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
                {wallets.map(wallet => (
                  <ConnectWallet
                    key={wallet.type}
                    wallet={wallet}
                    connect={() => {
                      connect(wallet)
                      setIsShowingWallets(false)
                    }}
                  />
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <Dialog
            open={!!switchingChainsConnection}
            onOpenChange={open =>
              open ? null : setSwitchingChainsConnection(undefined)
            }
          >
            <DialogContent
              className="flex items-center justify-center border-none bg-transparent"
              overlayClassName="bg-transparent"
              showCloseButton={false}
            >
              <div className="flex flex-wrap justify-center gap-14">
                {switchingChainsConnection?.status === 'connected' &&
                  switchingChainsConnection.wallet.supportedChains.map(
                    chain => (
                      <code
                        key={chain.id}
                        style={{ color: chain.color }}
                        className="cursor-pointer text-lg hover:underline"
                        onClick={() => {
                          switchChain(
                            switchingChainsConnection.wallet,
                            chain.id
                          )
                          setSwitchingChainsConnection(undefined)
                        }}
                      >
                        {chain.displayName}
                      </code>
                    )
                  )}
              </div>
            </DialogContent>
          </Dialog>
        </ViewportPortal>
      </ReactFlow>
    </div>
  )
}
