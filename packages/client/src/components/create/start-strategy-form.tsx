import { useForm } from "@tanstack/react-form";
import { Strategy } from "@template/domain/src/calc";
import { RUJIRA_STAGENET } from "@template/domain/src/chains";
import "@xyflow/react/dist/style.css";
import { Schema } from "effect";
import { useAddressBook } from "../../hooks/use-address-book";
import { Input } from "../ui/input";

export function StartStrategyForm({ strategy, update }: { strategy: Strategy; update: (value: Strategy) => void }) {
  const form = useForm({
    defaultValues: strategy,
    validators: {
      onChange: ({ value }) => {
        const validationResult = Schema.standardSchemaV1(Strategy)["~standard"].validate(value);

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

        update(value);
      },
    },
  });

  const { addressBook } = useAddressBook();

  return (
    <form className="flex w-100 flex-col gap-8">
      <form.Field
        name="label"
        children={(field) => (
          <div className="flex flex-col gap-2">
            <code className="text-sm text-zinc-400">label</code>
            <div className="flex rounded bg-zinc-900">
              <Input
                placeholder="Strategy Label"
                className="w-full"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                tabIndex={-1}
                autoFocus={false}
              />
            </div>
            {!field.state.meta.isValid && (
              <p className="font-mono text-sm text-red-500/60">{field.state.meta.errors.join(", ")}</p>
            )}
          </div>
        )}
      />
      <form.Field
        name="owner"
        children={(field) => (
          <div className="flex flex-col gap-2">
            <code className="text-sm text-zinc-400">owner</code>
            <div className="flex flex-wrap gap-2 px-1 pb-2">
              {Object.values(addressBook[RUJIRA_STAGENET.id] || {}).map(({ address, label }) => (
                <code
                  key={address}
                  onClick={() => field.handleChange(address)}
                  className={`cursor-pointer rounded-xs border-1 px-3 py-1 text-sm`}
                  style={{
                    backgroundColor: field.state.value === address ? RUJIRA_STAGENET.color : "transparent",
                    borderColor: field.state.value === address ? RUJIRA_STAGENET.color : "gray",
                    color: field.state.value === address ? "black" : "gray",
                  }}
                >
                  {label} ({address.substring(0, 5)}...{address.substring(address.length - 7)})
                </code>
              ))}
            </div>
            {/* <div className="flex rounded bg-zinc-900">
              <Input
                className="text-xs"
                style={{
                  fontSize: "1rem",
                }}
                placeholder="Strategy Owner"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                tabIndex={-1}
                autoFocus={false}
              />
            </div> */}
            {!field.state.meta.isValid && (
              <p className="font-mono text-sm text-red-500/60">{field.state.meta.errors.join(", ")}</p>
            )}
          </div>
        )}
      />
      <div className="flex w-full justify-end">
        <code className="w-fit cursor-pointer rounded pr-1 text-end text-lg text-green-300 hover:underline">Start</code>
      </div>
    </form>
  );
}
