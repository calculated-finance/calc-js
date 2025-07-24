import { Action, Many, ManyAction } from "@template/domain/src/calc";
import "@xyflow/react/dist/style.css";
import { Effect, Schema } from "effect";
import { useState } from "react";
import { BaseNode } from "../../components/create/base-node";
import { type ActionNodeParams, type CustomNodeData } from "../../lib/layout/layout";
import { AddAction } from "./add-action";
import { JsonEditor } from "./json-editor";

export function ManyNode({
  data: {
    action: { id, many },
    update,
    remove,
  },
}: CustomNodeData<ActionNodeParams<ManyAction>>) {
  const addAction = (action: Action) => {
    update({
      id,
      many: [...many, action as any],
    });
  };

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isEditingJson, setIsEditingJson] = useState(false);

  return (
    <BaseNode
      id={id}
      handleLeft
      handleRight={many.length > 0}
      isHelping={isHelpOpen}
      setHelp={() => setIsHelpOpen(!isHelpOpen)}
      isEditingJson={isEditingJson}
      setIsEditingJson={() => setIsEditingJson(!isEditingJson)}
      onDelete={remove}
      title={<code className="rounded bg-zinc-900 px-1 py-[1px] font-mono text-4xl text-zinc-100">GROUP</code>}
      summary={
        <code className="flex flex-col gap-1.5 text-xl text-zinc-300">
          {many.length} ACTION{many.length !== 1 ? "S" : ""}
        </code>
      }
      details={<code className="text-sm text-zinc-300">{`Execute the following ${many.length} actions in order`}</code>}
      modal={
        <div>
          {!isEditingJson && (
            <AddAction
              onAdd={(action) => {
                if ("many" in action) {
                  throw new Error("Invalid action type for many node");
                }
                return addAction(action);
              }}
              isHelpOpen={isHelpOpen}
              helpMessage="Select an action to add to this group. Actions will all be executed in the same transaction, in the order they are added to the group. You can add and remove actions at any stage."
            />
          )}
          {isEditingJson && (
            <JsonEditor
              data={Effect.runSync(Schema.encode(Many)(many))}
              schema={Many}
              onSave={() => {
                setIsEditingJson(false);
              }}
              onExit={() => {
                setIsEditingJson(false);
              }}
            />
          )}
        </div>
      }
    />
  );
}
