import { Fragment } from "react";
import { useAssets } from "../../hooks/use-assets";
import { useNodeModalStore } from "../../hooks/use-node-modal-store";
import type { NodeBody } from "../../lib/graph";
import { ACTION_DEFINITIONS, type ActionDefinition, type ActionKey } from "./action-definitions";

interface ComingSoon {
  label: string;
  colorClassName: string;
}

/** Picker rows: implemented step types mixed with not-yet-wired stubs. */
const PICKER_ROWS: (ActionDefinition | ComingSoon)[][] = [
  [ACTION_DEFINITIONS.swap, { label: "Limit Order", colorClassName: "text-green-300" }, ACTION_DEFINITIONS.distribute],
  [ACTION_DEFINITIONS.schedule, { label: "Conditional", colorClassName: "text-orange-300" }],
];

const isImplemented = (entry: ActionDefinition | ComingSoon): entry is ActionDefinition => "key" in entry;

export function AddAction({
  onAdd,
  disabledActions,
  denoms,
  isHelpOpen,
  helpMessage,
}: {
  /** Inserts the node; returns the new node's React Flow id to open its modal. */
  onAdd: (body: NodeBody) => string | undefined;
  disabledActions?: ActionKey[];
  denoms?: string[];
  isHelpOpen?: boolean;
  helpMessage?: string;
}) {
  const { setOpenId } = useNodeModalStore();
  const { assets } = useAssets();

  const addAction = (definition: ActionDefinition) => {
    const newId = onAdd(definition.makeDefault({ assets, denoms }));
    if (newId) setOpenId(newId);
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
        {PICKER_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className={`flex justify-around ${rowIndex === 0 ? "pt-2" : "pt-4"}`}>
            {row.map((entry, entryIndex) => {
              const notYetWired = !isImplemented(entry);
              const disabled = isImplemented(entry) && (disabledActions?.includes(entry.key) ?? false);
              return (
                <Fragment key={entry.label}>
                  {entryIndex > 0 && <code>|</code>}
                  <code
                    onClick={() => {
                      if (isImplemented(entry) && !disabled) addAction(entry);
                    }}
                    className={`${entry.colorClassName} ${
                      disabled ? "cursor-not-allowed opacity-50" : notYetWired ? "opacity-40" : "cursor-pointer hover:underline"
                    }`}
                  >
                    {entry.label}
                  </code>
                </Fragment>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
