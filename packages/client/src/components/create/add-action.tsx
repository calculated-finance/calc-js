import type { Action } from "@template/domain/src/calc";
import { RUJIRA_STAGENET } from "@template/domain/src/chains";
import { v4 } from "uuid";
import { useAssets } from "../../hooks/use-assets";
import { useNodeModalStore } from "../../hooks/use-node-modal-store";

export function AddAction({
  onAdd,
  isHelpOpen,
  helpMessage,
}: {
  onAdd: (action: Action) => void;
  isHelpOpen?: boolean;
  helpMessage?: string;
}) {
  const { setOpenId } = useNodeModalStore();
  const assets = useAssets();

  const addAction = (action: Omit<Action, "id">) => {
    const actionId = v4();
    const newAction = {
      id: actionId,
      ...action,
    };
    onAdd(newAction as any);
    setOpenId(actionId);
  };

  return (
    <div>
      <div
        className={`transition-all duration-300 ease-in-out ${
          isHelpOpen ? "px-1 pb-2 opacity-100" : "max-h-0 overflow-hidden opacity-0"
        } `}
      >
        <code className="text-sm text-pretty text-blue-400/80">{helpMessage}</code>
      </div>
      <div className="flex flex-col gap-2">
        <div
          className={`transition-all duration-300 ease-in-out ${
            !isHelpOpen ? "opacity-100" : "max-h-0 overflow-hidden opacity-0"
          } `}
        >
          <code className="text-sm text-zinc-400">action</code>
        </div>
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
          <code
            onClick={() => {
              addAction({
                schedule: {
                  cadence: { cron: { expr: "0 23 12 * * SUN#2" } },
                  execution_rebate: [],
                  scheduler: RUJIRA_STAGENET.schedulerContract,
                },
              });
            }}
            className="cursor-pointer text-yellow-300 hover:underline"
          >
            Schedule
          </code>
          <code>|</code>
          <code
            onClick={() => {
              addAction({ many: [] });
            }}
            className="cursor-pointer text-red-300 hover:underline"
          >
            Group
          </code>
          <code>|</code>
          <code className="cursor-pointer text-orange-300 hover:underline">Conditional</code>
        </div>
      </div>
    </div>
  );
}
