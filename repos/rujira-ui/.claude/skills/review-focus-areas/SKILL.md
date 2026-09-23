---
name: review-focus-areas
description: Use when reviewing any code change in this repo — either invoked directly or referenced by other reviewers (e.g. `typescript-reviewer`). Lists the domain-specific concerns that deserve extra scrutiny in a DeFi / multi-chain React + Relay codebase.
allowed-tools: [Read, Grep, Glob]
---

Canonical review checklist for Rujira UI. Every other review skill/agent should defer here rather than duplicating the list.

## Domain concerns (highest leverage)

1. **Decimal precision & asset math** — see the `decimal-math` skill. Rounding errors can lose user funds. Check for `parseFloat`, `Number(`, `* 1e`, `Math.round` on amount-like values.
2. **Multi-chain wallet safety** — see the `signer-patterns` skill. Signer and message builder changes affect 19 networks. Verify chain-specific encoding, gas estimation, and that `translateError` covers any new error shape.
3. **Relay fragment correctness** — see the `relay-fragments` skill. Mismatched fragments cause silent data loss. Confirm `__generated__` is regenerated (`pnpm run relay`) after any `graphql` tag change.
4. **State immutability** — see the `immutability-check` skill. Never mutate state, props, context values, or Relay store data.
5. **i18n completeness** — see the `i18n-keys` skill. ESLint enforces key presence across locales; a missing key breaks the build for every language.
6. **Cross-package blast radius** — see the `plan-cross-package` skill. Changes to `rujira.ui` or `rujira.js` affect all consumers.

## Code-level concerns

7. **Type safety** — no implicit `any`, no unjustified `as` casts, no `!` non-null assertions without a preceding guard.
8. **Async correctness** — no floating promises, no `forEach(async)`, `JSON.parse` wrapped in try/catch.
9. **React hook hygiene** — complete dependency arrays, no hooks in loops/conditionals, `key` is a stable id not the index.
10. **Security** — no `eval`, sanitised `dangerouslySetInnerHTML`, env vars guarded at boundaries, no secrets in source.

## Severity guide

- **Block (HIGH)**: runtime crash, fund-loss risk, security vulnerability, broken type safety that hides real bugs.
- **Warn (MEDIUM)**: performance regression, bad React patterns, misleading types, stale closures.
- **Info (LOW)**: style, dead code, minor inconsistency.

## When to delegate

- TypeScript-focused audit that must produce a report → `/review-typescript` command.
- SCSS drift audit → `/scss-audit` command.
- Bundle regressions → `/check-bundle` command.
