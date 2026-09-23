---
name: update-relay
description: Walk the user through the full Relay update cycle — edit `graphql` tag, regenerate `__generated__`, update TypeScript usages, run lint.
argument-hint: "<feature | fragment | query name>"
---

Guide the full Relay update cycle for `$ARGUMENTS` (a feature name, fragment name, or query name).

For proactive guardrails on fragment authoring (custom scalars, nullability, regeneration discipline), see the `relay-fragments` skill.

## Steps

### 1 — Locate the current GraphQL operation

The argument can be:
- A feature name (e.g. `swap`, `strategies`) — search `packages/main/src/<name>/` for `graphql` template literals
- A fragment or query name (e.g. `SwapFragment`, `TradeQuery`) — search all of `packages/main/src/`

Read the file(s) containing the `graphql` tag. Note the current fields and the Relay operation name.

### 2 — Check the schema

Read `packages/main/data/schema.graphql`. Confirm:
- All fields in the operation exist on the schema types
- Any new fields the user wants to add are present in the schema
- Custom scalar types (`Address`, `AssetString`, `Bigint`) are used correctly

**If the schema needs a change:** Stop and report. Schema changes must be coordinated with the backend. The user must update `schema.graphql` manually (or receive an updated schema from the API team) before proceeding with Relay.

### 3 — Show the diff to apply

Show the exact change needed to the `graphql` tag — the before/after diff. Do not edit yet; confirm with the user.

### 4 — Apply the change

Edit the `graphql` template literal in the source file.

### 5 — Regenerate __generated__ files

Run the Relay compiler:
```bash
cd packages/main && pnpm run relay
```

### 6 — Check the __generated__ diff

Read the updated `__generated__/<OperationName>.graphql.ts` file. Confirm the generated TypeScript types match what is expected. Flag any:
- New nullable fields that need `?.` access in the component
- Removed fields that will cause TypeScript errors
- Type changes on existing fields (e.g. scalar type changes)

### 7 — Update TypeScript usages

Find every place the fragment/query data is destructured or accessed in the component and update:
- Destructuring patterns to include new fields
- Remove references to deleted fields
- Handle new nullable fields with `?.` or null checks

### 8 — Run quality gates

```bash
cd packages/main && pnpm run lint
```

### 9 — Report

```
Operation updated: <OperationName>
Type: <fragment | query | subscription>
Feature: <feature name>

Schema fields changed:
  + <added field>: <type>
  - <removed field>

__generated__ files regenerated:
  packages/main/src/<path>/__generated__/<Name>.graphql.ts

TypeScript usages updated:
  <file:line> — <what changed>

Quality gates:
  ✅ pnpm run relay — OK
  ✅ pnpm run lint  — OK
  (or ❌ with details)
```
