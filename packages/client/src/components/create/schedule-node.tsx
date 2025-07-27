import { useForm } from "@tanstack/react-form";
import { Schedule, ScheduleAction } from "@template/domain/src/calc";
import "@xyflow/react/dist/style.css";
import cronstrue from "cronstrue";
import { Effect, Schema } from "effect";
import duration from "humanize-duration";
import { useState } from "react";
import { BaseNode } from "../../components/create/base-node";
import { type ActionNodeParams, type CustomNodeData } from "../../lib/layout/layout";
import { Input } from "../ui/input";
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
      ? `Every ${duration(schedule.cadence.time.duration.secs || 0, { largest: 2, round: true })}`
      : "blocks" in schedule.cadence
        ? `Every ${schedule.cadence.blocks.interval} blocks`
        : "cron" in schedule.cadence
          ? cronstrue.toString(schedule.cadence.cron.expr)
          : "";

  const form = useForm({
    defaultValues: Effect.runSync(Schema.encode(Schedule)(schedule)),
    validators: {
      onChange: ({ value }) => {
        const schedule = Effect.runSync(Schema.decode(Schedule)(value));
        const validationResult = Schema.standardSchemaV1(Schedule)["~standard"].validate(value);

        if ("issues" in validationResult) {
          return {
            fields: validationResult.issues?.reduce(
              (acc, issue) =>
                !issue.path
                  ? acc
                  : {
                      [issue.path.join(".")]: issue.message,
                      ...acc,
                    },
              {} as Record<string, string>,
            ),
          };
        }

        update({
          id,
          schedule,
        });
      },
    },
  });

  const [timeUnit, setTimeUnit] = useState<"seconds" | "minutes" | "hours" | "days">("minutes");

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
      summary={
        <code className="flex flex-col gap-1.5 text-xl text-zinc-300">{`${"time" in schedule.cadence ? "TIME" : "blocks" in schedule.cadence ? "BLOCKS" : "cron" in schedule.cadence ? "CRON" : ""} SCHEDULE`}</code>
      }
      details={<code className="text-sm text-zinc-300">{summary}</code>}
      modal={
        <div className="flex flex-col gap-8">
          {!isEditingJson && (
            <div className="flex flex-col gap-4">
              <code className="text-sm text-zinc-400">cadence</code>
              <div className="flex items-center justify-around">
                <code
                  onClick={() => {
                    update({
                      id,
                      schedule: {
                        ...schedule,
                        cadence: { time: { duration:{secs: 1000 * 60 * 30, nanos:0} } },
                      },
                    });
                  }}
                  className={`cursor-pointer text-sm hover:underline ${"time" in schedule.cadence ? "text-yellow-300" : "text-zinc-400"}`}
                >
                  TIME
                </code>
                <code>|</code>
                <code
                  onClick={() => {
                    update({
                      id,
                      schedule: {
                        ...schedule,
                        cadence: { blocks: { interval: 100 } },
                      },
                    });
                  }}
                  className={`cursor-pointer text-sm hover:underline ${"blocks" in schedule.cadence ? "text-yellow-300" : "text-zinc-400"}`}
                >
                  BLOCK
                </code>
                <code>|</code>
                <code
                  onClick={() => {
                    update({
                      id,
                      schedule: {
                        ...schedule,
                        cadence: { cron: { expr: "* * * * * *" } },
                      },
                    });
                  }}
                  className={`cursor-pointer text-sm hover:underline ${"cron" in schedule.cadence ? "text-yellow-300" : "text-zinc-400"}`}
                >
                  CRON
                </code>
                <code>|</code>
                <code
                  onClick={() => {}}
                  className={`cursor-pointer text-sm hover:underline ${"price" in schedule.cadence ? "text-yellow-300" : "text-zinc-400"}`}
                >
                  PRICE
                </code>
              </div>
              <div className="flex flex-col pt-4">
                {"time" in schedule.cadence && (
                  <form.Field
                    name="cadence.time.duration"
                    children={(field) => {
                      return (
                        <div className="flex flex-col gap-2">
                          <code className="text-sm text-zinc-400">duration</code>
                          <div className="flex items-center rounded bg-zinc-900">
                            <Input
                              placeholder="0"
                              className="w-full"
                              type="number"
                              value={field.state.value
                                ? (
                                  field.state.value.secs /
                                  {
                                    seconds: 1000,
                                    minutes: 60 * 1000,
                                    hours: 60 * 60 * 1000,
                                    days: 24 * 60 * 60 * 1000,
                                  }[timeUnit]
                                ).toFixed(0)
                                : 0}
                              onChange={(e) => field.handleChange({
                                nanos: 0,
                                secs: e.target.valueAsNumber *
                                  {
                                    seconds: 1000,
                                    minutes: 60 * 1000,
                                    hours: 60 * 60 * 1000,
                                    days: 24 * 60 * 60 * 1000,
                                  }[timeUnit],
                              })}
                              tabIndex={-1}
                              autoFocus={false} />
                            <code
                              onClick={() => setTimeUnit(
                                {
                                  seconds: "minutes" as const,
                                  minutes: "hours" as const,
                                  hours: "days" as const,
                                  days: "seconds" as const,
                                }[timeUnit]
                              )}
                              className="cursor-pointer pr-3 text-lg text-zinc-400 hover:underline"
                            >
                              {timeUnit}
                            </code>
                          </div>
                          {!field.state.meta.isValid && (
                            <p className="font-mono text-sm text-red-500/60">{field.state.meta.errors.join(", ")}</p>
                          )}
                        </div>
                      );
                    }}
                  />
                )}
                {"blocks" in schedule.cadence && (
                  <form.Field
                    name="cadence.blocks.interval"
                    children={(field) => (
                      <div className="flex flex-col gap-2">
                        <code className="text-sm text-zinc-400">interval</code>
                        <div className="flex items-center rounded bg-zinc-900">
                          <Input
                            placeholder="0"
                            className="w-full"
                            type="number"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                            tabIndex={-1}
                            autoFocus={false}
                          />
                          <code className="pr-3 text-lg text-zinc-400">blocks</code>
                        </div>
                        {!field.state.meta.isValid && (
                          <p className="font-mono text-sm text-red-500/60">{field.state.meta.errors.join(", ")}</p>
                        )}
                      </div>
                    )}
                  />
                )}
                {"cron" in schedule.cadence && (
                  <form.Field
                    name="cadence.cron.expr"
                    children={(field) => (
                      <div className="flex flex-col gap-2">
                        <code className="text-sm text-zinc-400">expression</code>
                        <div className="flex rounded bg-zinc-900">
                          <Input
                            placeholder="* * * * * *"
                            className="w-full"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            tabIndex={-1}
                            autoFocus={false}
                          />
                        </div>
                        {"cron" in schedule.cadence && <code className="text-sm text-zinc-400 text-right mt-[-5px]">{cronstrue.toString(schedule.cadence.cron.expr)}</code>}
                        {!field.state.meta.isValid && (
                          <p className="font-mono text-sm text-red-500/60">{field.state.meta.errors.join(", ")}</p>
                        )}
                      </div>
                    )}
                  />
                )}
              </div>
            </div>
          )}
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
        </div>
      }
    />
  );
}
