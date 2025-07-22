import { ManyAction, SwapAction } from '@template/domain/src/calc'
import { useReactFlow, useViewport } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Schema } from 'effect'
import { BaseNode } from '../../components/create/base-node'
import {
  type ActionNodeParams,
  type CustomNodeData,
} from '../../lib/layout/layout'

export function StrategyNode({
  data: {
    action: { many },
    update,
  },
}: CustomNodeData<ActionNodeParams<ManyAction>>) {
  const { fitView, getNodes } = useReactFlow()
  const { zoom } = useViewport()

  return (
    <BaseNode
      handleRight={many.length > 0}
      title={
        <code className="rounded bg-zinc-900 px-1 py-[1px] font-mono text-4xl text-zinc-100">
          GROUP
        </code>
      }
      summary={
        <div className="flex flex-col gap-1.5 text-xl text-zinc-300">
          Execute {many.length}{' '}
          <code className="rounded px-1 py-[1px] font-mono text-zinc-100">
            actions
          </code>
        </div>
      }
      details={
        <div className="text-md text-zinc-300">
          {`Execute ${many.length}`}
          <code className="rounded px-1 py-[1px] font-mono text-zinc-100">
            actions
          </code>
          in parallel
        </div>
      }
      modal={closeModal => (
        <div className="font-bold">
          <button
            onClick={() => {
              update({
                many: [
                  ...many,
                  Schema.decodeSync(SwapAction)({
                    swap: {
                      swap_amount: { amount: '50000003210', denom: 'rune' },
                      minimum_receive_amount: {
                        amount: '12312321861',
                        denom: 'x/ruji',
                      },
                      adjustment: 'fixed' as const,
                      routes: [],
                      maximum_slippage_bps: 100,
                    },
                  }),
                ],
              })
              closeModal()
              setTimeout(() => {
                fitView({
                  nodes: getNodes(),
                  maxZoom: zoom,
                  duration: 450,
                  interpolate: 'smooth',
                })
              }, 100)
            }}
          >
            Add Action
          </button>
        </div>
      )}
    />
  )
}
