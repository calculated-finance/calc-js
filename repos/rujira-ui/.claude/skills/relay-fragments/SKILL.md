---
name: relay-fragments
description: Use proactively when authoring or editing GraphQL. TRIGGER when a file contains a `graphql` tagged template literal, when editing `packages/main/data/schema.graphql`, or when calling `useFragment` / `useLazyLoadQuery` / `usePreloadedQuery` / `usePaginationFragment` / `useSubscription`. Enforces schema alignment, custom-scalar safety, and regeneration discipline.
allowed-tools: [Read, Grep, Glob, Bash]
---

Guardrails for Relay fragments, queries, and subscriptions. Mismatched fragments cause silent data loss and are one of the top risk areas flagged in CLAUDE.md.

## Rules

1. **Every field requested must exist on the schema type.** Cross-check against `packages/main/data/schema.graphql` before writing the operation.
2. **Custom scalars must be imported as types, not stringified.** `Address`, `AssetString`, `Bigint` have TypeScript representations — use them.
3. **Fragments compose via `...FragmentName` spreads.** Don't duplicate fields across parent and child fragments; let the child own them.
4. **Pagination uses `usePaginationFragment`** with `@connection` directives; don't hand-roll `after` cursors.
5. **Subscriptions must declare the same variables the Absinthe backend expects.** See the `debug-subscription` skill for the topic/variable matrix.
6. **After changing any `graphql` tag, regenerate.** `cd packages/main && pnpm run relay`. Commit the `__generated__` diff alongside the source change.
7. **Never edit `__generated__/*.graphql.ts` by hand.** It will be overwritten and your edit lost.

## Checks to run when this skill fires

- `grep` for the operation name to verify it is unique across the repo.
- Open the matching type in `schema.graphql`; confirm every field exists and nullability matches usage (`?.` on nullable fields).
- Verify the `__generated__` directory next to the source has an up-to-date file for the operation — if stale, prompt the user to run `pnpm run relay`.
- If the edit changes field selection, update destructuring / `?.` / null checks in the component.

## When to delegate

- Full trace from route → schema → subscription: use the `relay-trace` skill.
- Schema change needed (new field, new type): stop and report — schema changes are coordinated with the backend.
- Runtime subscription misbehaviour: use the `debug-subscription` skill.

## References

- `packages/main/data/schema.graphql`
- `packages/main/relay.config.js`
- `packages/main/src/services/relay.tsx`
