import { useForm } from "@tanstack/react-form";
import { Effect, Schema } from "effect";
import { fieldErrors } from "../lib/validation";

/**
 * The builder edits schema values in one of two representations, and mixing
 * them up has bitten before (an out-of-range value validated in one direction
 * and crashed in the other). These hooks make the choice explicit:
 *
 * - `useEncodedSchemaForm`: fields bind to the ENCODED (JSON-friendly)
 *   representation; a valid change commits the DECODED result. Use when the
 *   encoded fields are what the user should see (cron strings, addresses).
 * - `useDecodedSchemaForm`: fields bind to the DECODED representation and a
 *   valid change commits it as-is. Use when fields carry human-facing units
 *   (decoded Amounts), where re-decoding would double-apply transformations.
 */

interface SchemaFormValidator {
  validate: (value: unknown) =>
    | { issues?: readonly { message: string; path?: readonly (PropertyKey | { key: PropertyKey })[] }[] }
    | { value: unknown }
    | Promise<unknown>;
}

const validateWith =
  <Commit>(validator: SchemaFormValidator, commit: (value: Commit) => void) =>
  ({ value }: { value: Commit }) => {
    const result = validator.validate(value);

    if ("issues" in result) {
      return { fields: fieldErrors(result.issues) };
    }

    commit(value);
    return undefined;
  };

export function useEncodedSchemaForm<A, I>(schema: Schema.Schema<A, I>, value: A, onCommit: (value: A) => void) {
  return useForm({
    defaultValues: Effect.runSync(Schema.encode(schema)(value)),
    validators: {
      onChange: validateWith(Schema.standardSchemaV1(schema)["~standard"], (formValue: I) => {
        onCommit(Schema.decodeSync(schema)(formValue));
      }),
    },
  });
}

export function useDecodedSchemaForm<A, I>(schema: Schema.Schema<A, I>, value: A, onCommit: (value: A) => void) {
  return useForm({
    defaultValues: value,
    validators: {
      onChange: validateWith(Schema.standardSchemaV1(schema)["~standard"], onCommit),
    },
  });
}
