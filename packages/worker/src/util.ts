import type { Event } from "@cosmjs/stargate";

export const flattenAttributes = (
  event: Event
): { type: string; attributes: Record<string, string> } => ({
  type: event.type,
  attributes: event.attributes.reduce(
    (acc, attr) => ({
      ...acc,
      [attr.key]: attr.value,
    }),
    {}
  ),
});
