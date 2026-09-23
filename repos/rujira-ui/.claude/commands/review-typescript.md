---
name: review-typescript
description: Audit the TypeScript/React codebase and write a prioritized issue report.
argument-hint: "(no arguments)"
---

Audit this TypeScript/React codebase and write a prioritized issue report to `docs/static-snapshots/REVIEW_TYPESCRIPT.md`.

For the domain-level review checklist (decimal math, signer safety, Relay, i18n, immutability), defer to the `review-focus-areas` skill — do not duplicate it here.

## Steps

### 1 — Launch the `typescript-reviewer` agent

Use `subagent_type: typescript-reviewer` with the following comprehensive audit prompt. The agent will read actual source files — do not guess or summarise from memory.

**Audit checklist — check ALL of the following:**

#### Type Safety
- Explicit or implicit `any` — list every occurrence with file + line
- Missing return types on exported functions and components
- Unsafe type assertions (`as T`, `!` non-null) without a preceding type guard
- `@ts-ignore` / `@ts-expect-error` usage
- Loose types (`{}`, `object`) where a specific shape is known
- Type casts that erase structural type information (e.g. casting through a wide union)
- Seeds in `reduce` typed as a full record before the accumulator is built

#### Async Correctness
- Floating promises — `.then()` chains or `async` calls with no `.catch()` and no `await`
- `JSON.parse` without try/catch at boundary points (localStorage, API responses)
- Race conditions in `useEffect` — missing cleanup / cancellation token
- Async functions that unintentionally return `void`

#### React-specific Patterns
- Hooks called conditionally or in loops
- Missing items in `useEffect`, `useCallback`, `useMemo` dependency arrays
- Stale closure risk — functions reading state without `useCallback`
- Expensive computations / object literals inside render without `useMemo`
- `React.FC` / `FC` usage — prefer explicit `(props: Props): ReactNode`
- `key={index}` in lists where stable keys are available
- Props or `children` typed as `any` instead of `ReactNode` / specific types

#### Security
- `dangerouslySetInnerHTML` — is the value sanitized or safely constructed (e.g. `JSON.stringify` for ld+json)?
- `eval()` or `new Function()` usage
- Browser globals (`window`, `localStorage`, `document`) accessed without SSR guard outside a `useEffect`
- Environment variables used without null/empty-string guard

#### Idiomatic TypeScript
- `.map()` used purely for side effects (should be `.forEach()`)
- `||` where `??` is more appropriate (when `0` or `""` are valid values)
- Non-null assertions (`!`) that should be optional chaining (`?.`)
- Redundant type annotations on inferred values
- Type aliases that add no semantic value over the aliased type
- Typos in exported interface/type property names
- `as const` opportunities on literal arrays/objects
- Inconsistent `interface` vs `type` usage for the same kind of structure

#### Import Health
- Unused imports
- Direct `node_modules/**` path imports that bypass the package's `exports` map
- Barrel files (`export *`) that bundle large dependency sets
- Duplicate utility logic across files that should be extracted to a shared module
- Missing `@types/` packages for third-party dependencies

**Files to read deeply (always include these):**

_Main app entry points (`packages/main`)_
- `packages/main/src/main.tsx`
- `packages/main/src/ContextWrapper.tsx`
- `packages/main/src/Gate.tsx`
- `packages/main/src/node.ts`
- `packages/main/src/services/accounts.tsx`
- `packages/main/src/services/accountData.tsx`
- `packages/main/src/services/deposits.tsx`
- `packages/main/src/services/msg.ts`
- `packages/main/src/services/notifcation.tsx`
- `packages/main/src/hooks/` — all hooks

_Shared UI library (`packages/rujira.ui`)_
- `packages/rujira.ui/src/index.ts`
- `packages/rujira.ui/src/context/` — all providers
- `packages/rujira.ui/src/hooks/` — all hooks
- `packages/rujira.ui/src/wallets/` — wallet connectors
- `packages/rujira.ui/src/i18n/` — i18n setup

_Shared domain library (`packages/rujira.js`)_
- `packages/rujira.js/src/index.ts`
- `packages/rujira.js/src/signer.ts`
- `packages/rujira.js/src/signers/` — per-chain signers
- `packages/rujira.js/src/msgs/` — message builders
- `packages/rujira.js/src/accounts.ts`
- `packages/rujira.js/src/asset.ts`
- `packages/rujira.js/src/bigint.ts`
- `packages/rujira.js/src/prices.ts`
- `packages/rujira.js/src/ccl/`

_Feature folders to spot-check in `packages/main/src`_
- `portfolio/`, `strategies/`, `borrow/`, `merge/`, `leagues/`, `ecosystem/`, `home/`, `chart/`, `common/`

_Landing (`packages/landing`)_
- `packages/landing/src/` — entry + top-level components

> Skip `packages/trading-view` (git submodule — treat as read-only).

For every issue report: exact file path + line number, severity, category, the problematic code snippet (≤5 lines), and a concrete recommended fix.

---

### 2 — Write the report

After the agent completes, write `docs/static-snapshots/REVIEW_TYPESCRIPT.md` with the following structure:

```markdown
# TypeScript Code Review

**Date:** <today's date>
**Scope:** Full codebase audit — type safety, async correctness, React patterns,
           security, idiomatic TypeScript, import health.
**Tool:** `typescript-reviewer` agent + static analysis
**TypeScript config:** <strict mode status, any @ts-ignore count>

---

## Priority Summary

| # | Severity | Category | File (line) | Issue |
|---|----------|----------|-------------|-------|
...

---

## High Severity

### H1 — <Title>
**File:** `path/to/file.ts:line`

```ts
// problematic code
```

<problem description>

**Next step:** <concrete fix>

---

## Medium Severity
...

## Low Severity
...

## Quick Wins (highest impact / easiest to fix)
- **Hx + My** — description (time estimate)
...

---
*Generated by `/review-typescript`. Re-run at any time to refresh this document.*
```

**Severity guide:**
- **High** — runtime crash risk, unhandled rejection, security concern, broken type safety that hides real bugs
- **Medium** — performance regression, bad React patterns, misleading types, stale closures
- **Low** — style/idiomatic issues, dead code, minor inconsistencies

Each issue entry must include:
- Exact file path and line number
- The problematic code snippet
- A concrete, actionable next step (not just "use X" but *how*)

---

### 3 — Quick Wins section

Always end the report with a "Quick Wins" section listing the 5–8 highest-impact issues sorted by effort (easiest first), with a rough time estimate for each fix.
