---
name: relay-trace
description: Use when the user asks to trace data flow for a feature or route (route → component → Relay fragment/query → schema → WebSocket subscription). Lists all `__generated__` files involved so the user knows what to regenerate.
allowed-tools: [Read, Grep, Glob]
---

Trace the full data flow for the feature or route the user names: route → component → Relay fragment/query → GraphQL schema → WebSocket subscription.

## Steps

### 1 — Locate the route

Read `packages/main/src/Gate.tsx` to find the route definition for the given path or feature name (e.g. `/swap`, `strategies`, `portfolio`). Identify the top-level component rendered by that route.

### 2 — Trace the component tree

Read the top-level component. For each child component encountered that uses Relay:
- Look for `useFragment`, `useLazyLoadQuery`, `usePreloadedQuery`, `usePaginationFragment`, `useSubscription`
- Record the fragment/query name, the component it lives in, and its `__generated__` counterpart

### 3 — Map fragments to schema fields

For each Relay fragment or query found:
1. Read the `graphql` template literal to identify the fields requested
2. Find the corresponding type in `packages/main/data/schema.graphql`
3. Note custom scalars used (`Address`, `AssetString`, `Bigint`)
4. Check if the query uses a subscription (`subscription`) — if so, note that it flows through Phoenix WebSocket via `@absinthe/socket`

### 4 — List __generated__ files

Glob for all `__generated__/*.graphql.ts` and `__generated__/*.graphql.d.ts` files that belong to this feature. These are the files that must be regenerated (via `pnpm run relay`) when the query changes.

### 5 — Output the trace

```
Feature: <name>
Route: <path> → <ComponentFile:line>

Component tree with Relay:
  <ComponentA> (packages/main/src/<path>)
    └─ useFragment(<FragmentName>) → __generated__/<FragmentName>.graphql.ts
       Fields: <field1>, <field2>, ...
       Schema type: <TypeName> in schema.graphql:line

  <ComponentB> (packages/main/src/<path>)
    └─ useLazyLoadQuery(<QueryName>) → __generated__/<QueryName>.graphql.ts
       Fields: ...

Real-time (subscriptions):
  <ComponentC> → useSubscription(<SubName>) via Phoenix WebSocket

All __generated__ files involved:
  - packages/main/src/<feature>/__generated__/<Name>.graphql.ts
  - ...

To regenerate after schema/query changes:
  cd packages/main && pnpm run relay
```

If the feature has no Relay usage (e.g. it uses only local state or context), report that explicitly and describe the state source instead.
