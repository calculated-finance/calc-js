import { Action, ManyAction } from "@template/domain/src/calc";
import "@xyflow/react/dist/style.css";
import { v4 } from "uuid";
import { BaseNode } from "../../components/create/base-node";
import { useAssets } from "../../hooks/use-assets";
import { useNodeModalStore } from "../../hooks/use-node-modal-store";
import { type ActionNodeParams, type CustomNodeData } from "../../lib/layout/layout";

export function ManyNode({
  data: {
    action: { id, many },
    update,
    remove,
  },
}: CustomNodeData<ActionNodeParams<ManyAction>>) {
  const { setOpenId } = useNodeModalStore();

  const addAction = (action: Omit<Action, "id">) => {
    const actionId = v4();
    update({
      id,
      many: [
        ...many,
        {
          id: actionId,
          ...action,
        } as any,
      ],
    });
    setOpenId(actionId);
  };

  const assets = useAssets();

  return (
    <BaseNode
      id={id}
      handleLeft
      handleRight={many.length > 0}
      onDelete={remove}
      title={<code className="rounded bg-zinc-900 px-1 py-[1px] font-mono text-4xl text-zinc-100">GROUP</code>}
      summary={<code className="flex flex-col gap-1.5 text-xl text-zinc-300">{many.length} ACTIONS</code>}
      details={<div className="text-sm text-zinc-300">{`Execute ${many.length} actions in parallel`}</div>}
      modal={
        <div className="flex w-100 flex-col gap-2">
          <code className="text-sm text-zinc-400">add_action</code>
          <div className="flex justify-around pt-2">
            <code
              onClick={() => {
                addAction({
                  swap: {
                    adjustment: "fixed",
                    maximum_slippage_bps: 300,
                    routes: [
                      {
                        thorchain: {},
                      },
                    ],
                    minimum_receive_amount: {
                      amount: 100,
                      ...assets[0],
                    },
                    swap_amount: {
                      amount: 0.001,
                      ...assets[1],
                    },
                  },
                });
              }}
              className="cursor-pointer text-purple-300 hover:underline"
            >
              Swap
            </code>
            <code>|</code>
            <code className="cursor-pointer text-green-300 hover:underline">Limit Order</code>
            <code>|</code>
            <code className="cursor-pointer text-blue-300 hover:underline">Distribute</code>
          </div>
          <div className="flex justify-around pt-4">
            <code className="cursor-pointer text-yellow-300 hover:underline">Schedule</code>
            <code>|</code>
            <code className="text-red-300/50">Group</code>
            <code>|</code>
            <code className="cursor-pointer text-orange-300 hover:underline">Conditional</code>
          </div>
        </div>
      }
    />
  );
}
