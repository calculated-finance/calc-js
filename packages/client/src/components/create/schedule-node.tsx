import { Schedule, ScheduleAction } from "@template/domain/src/calc";
import "@xyflow/react/dist/style.css";
import cronstrue from "cronstrue";
import { Effect, Schema } from "effect";
import hd from "humanize-duration";
import { useState } from "react";
import { BaseNode } from "../../components/create/base-node";
import { type ActionNodeParams, type CustomNodeData } from "../../lib/layout/layout";
import { AddAction } from "./add-action";
import { JsonEditor } from "./json-editor";

export function ScheduleNode({
  data: {
    action: { id, schedule },
    update,
    remove,
  },
}: CustomNodeData<ActionNodeParams<ScheduleAction>>) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isEditingJson, setIsEditingJson] = useState(false);

  const summary =
    "time" in schedule.cadence
      ? `Every ${hd(schedule.cadence.time.interval, { largest: 2, round: true })}`
      : "blocks" in schedule.cadence
        ? `Every ${schedule.cadence.blocks.interval} BLOCKS`
        : "cron" in schedule.cadence
          ? cronstrue.toString(schedule.cadence.cron.expr)
          : "";

  return (
    <BaseNode
      id={id}
      handleLeft
      handleRight={!!schedule.action}
      isHelping={isHelpOpen}
      setHelp={() => setIsHelpOpen(!isHelpOpen)}
      isEditingJson={isEditingJson}
      setIsEditingJson={() => setIsEditingJson(!isEditingJson)}
      onDelete={remove}
      title={<code className="rounded bg-zinc-900 px-1 py-[1px] font-mono text-4xl text-zinc-100">WHEN</code>}
      summary={<code className="flex flex-col gap-1.5 text-xl text-zinc-300">{summary.toUpperCase()}</code>}
      details={<code className="text-sm text-zinc-300">{summary}</code>}
      modal={
        <div className={isHelpOpen ? "pt-6" : ""}>
          {!isEditingJson && (
            <AddAction
              onAdd={(action) => {
                if ("schedule" in action) {
                  throw new Error("Invalid action type for schedule node");
                }
                return update({
                  id,
                  schedule: {
                    ...schedule,
                    action: action as any,
                  },
                });
              }}
              isHelpOpen={isHelpOpen}
              helpMessage="Select an action to execute when the schedule is triggered. The action will never execute before the schedule is due."
            />
          )}
          {isEditingJson && (
            <JsonEditor
              data={Effect.runSync(Schema.encode(Schedule)(schedule))}
              schema={Schedule}
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
