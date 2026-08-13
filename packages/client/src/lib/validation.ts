import type { StandardSchemaV1 } from "@standard-schema/spec";

const segmentKey = (segment: PropertyKey | { key: PropertyKey }): string =>
  typeof segment === "object" ? String(segment.key) : String(segment);

/**
 * Flattens standard-schema issues into a TanStack Form `fields` error map,
 * keyed by dot-joined path.
 */
export const fieldErrors = (
  issues: readonly StandardSchemaV1.Issue[] | undefined,
): Record<string, string> =>
  (issues ?? []).reduce<Record<string, string>>(
    (acc, issue) =>
      !issue.path?.length
        ? acc
        : {
            [issue.path.map(segmentKey).join(".")]: issue.message,
            ...acc,
          },
    {},
  );
