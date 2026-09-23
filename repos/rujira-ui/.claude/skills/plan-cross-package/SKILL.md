---
name: plan-cross-package
description: Use proactively before renames, signature changes, or API-breaking edits in shared code. TRIGGER when edits touch the public surface of `packages/rujira.ui` or `packages/rujira.js`, or when the user asks to rename/restructure a shared type, hook, or SCSS variable. Produces blast radius analysis and a three-option migration plan.
allowed-tools: [Read, Grep, Glob]
---

Plan a cross-package change — produce blast radius analysis and a three-option migration plan for the change the user describes.

## Steps

### 1 — Parse the change

The argument describes a proposed change, such as:
- Rename a type or interface (e.g. "rename `AssetAmount` to `TokenAmount` in rujira.js")
- Change a hook signature (e.g. "add required `chain` param to `useWalletBalance`")
- Rename or remove an SCSS variable (e.g. "rename `$color-accent` to `$color-primary`")
- Restructure a shared component's props

If the description is ambiguous, ask for clarification before proceeding.

### 2 — Run blast radius analysis

Use the `trace-dependency` skill's logic to find every file in every package that:
- Imports the changed symbol
- References it in a type position
- Uses it in JSX
- Re-exports it to downstream consumers

Also check:
- `packages/trading-view/` — treat as read-only (submodule). If it is affected, flag as HIGH risk and recommend an integration-layer wrapper instead of editing the submodule.
- `packages/vendor/` — treat as no-touch unless the change is intentional and coordinated.

### 3 — Produce a three-option plan

For each option, include: what changes, what stays the same, and the trade-offs.

```
## Blast Radius
  packages/main       — N files affected
  packages/landing    — N files affected
  packages/docs       — N files affected
  packages/rujira.ui  — N files affected
  packages/rujira.js  — definition lives here / N files affected
  trading-view        — NOT AFFECTED / ⚠️ AFFECTED (submodule — read-only)

## Option A — Minimal Change
  Scope: <which files change>
  Steps:
    1. ...
  Trade-offs: Least disruption. Does not clean up related inconsistencies.

## Option B — Shared Abstraction Fix
  Scope: <which files change, what new abstraction is introduced>
  Steps:
    1. ...
  Trade-offs: Cleans up the pattern everywhere. Larger diff, needs coordinated merge.

## Option C — Long-term Cleanup Path
  Scope: <full ideal end state>
  Steps:
    1. Phase 1 (non-breaking): ...
    2. Phase 2 (rename/remove): ...
  Trade-offs: Best long-term health. Requires multiple PRs or a feature flag period.

## Recommended
  <Option A|B|C> — <one sentence reason>

## Commands to run after the change
  cd packages/rujira.js && tsc -b
  cd packages/rujira.ui && tsc -b
  cd packages/main && pnpm run relay && pnpm run lint
  cd packages/landing && pnpm run lint
```
