# CLAUDE.md

Guidance for Claude Code when working in this repository. For deep architecture detail see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md). For coding standards see [`CONVENTIONS.md`](CONVENTIONS.md).

---

## Project Overview

**Rujira UI** — DeFi trading platform on THORChain. pnpm monorepo with five packages and two shared libraries.

| Package | Role |
|---------|------|
| `packages/main` | Primary app — React 18 + Vite + Relay + SCSS. Swaps, trading, portfolio, borrowing, strategies, multi-chain wallets. |
| `packages/landing` | Marketing site — React + Vite + SCSS. No GraphQL. |
| `packages/docs` | Component documentation and design system showcase. |
| `packages/rujira.ui` | Shared UI library — components, hooks, i18n, SCSS utilities, wallet providers. |
| `packages/rujira.js` | Shared domain library — signers, message builders, blockchain types, CCL. |
| `packages/trading-view` | TradingView charting (git submodule — treat as read-only). |

---

## Build and Test Commands

```bash
# Install
pnpm install

# Dev servers
pnpm run main        # Main app
pnpm run landing     # Landing page
pnpm run docs        # Component docs

# Build (main requires NODE_OPTIONS=--max-old-space-size=16384)
cd packages/main && pnpm run build

# Lint — zero warnings enforced
cd packages/main && pnpm run lint
cd packages/landing && pnpm run lint

# Tests (all workspace packages)
pnpm run test

# Run a single test file
cd packages/<pkg> && pnpm run test -- <path-to-test-file>

# Relay — regenerate GraphQL types after query/schema changes
cd packages/main && pnpm run relay

# Format a file
npx prettier --write <file>
```

---

## Quality Gates

After making changes, run these checks:

1. `cd packages/<pkg> && pnpm run lint` — ESLint with zero warnings enforced
2. `pnpm run test` — all workspace tests
3. `cd packages/main && pnpm run relay` — regenerate Relay types (if GraphQL changed)
4. `npx prettier --write <changed-files>` — formatting
5. `/review-typescript` — TypeScript + React code audit (writes a report)
6. `/check-bundle <package>` — verify no bundle size regressions (for significant changes)

The proactive skills listed below (`decimal-math`, `relay-fragments`, `immutability-check`, etc.) fire automatically while you work and enforce the review focus areas before code is even written.

---

## Code Conventions (summary)

> **Full details:** see [`CONVENTIONS.md`](CONVENTIONS.md)

- **Prettier**: double quotes, 2-space indent, trailing commas (es5), `bracketSameLine: true`.
- **TypeScript**: `strict: true`, `noUnusedLocals`, `noUnusedParameters` — no exceptions.
- **ESLint**: `--max-warnings 0`. Zero warnings policy.
- **React**: functional components + hooks only. No class components.
- **Immutability**: never mutate state or props. Use `map`/`filter`/spread.
- **Components**: PascalCase filenames, colocated with feature folders.

---

## Architecture

> **Deep dive:** see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

Relay + Phoenix WebSocket for data. React Context for feature-local state (12 providers in `ContextWrapper`). React Router v6 with feature-based routes gated via `VITE_ROUTES_ENABLED`/`VITE_ROUTES_DISABLED`. Multi-chain wallets (19 networks) with signer abstractions in `packages/rujira.js/src/`.

---

## Review Focus Areas

> **Full checklist:** use the `review-focus-areas` skill — it is the canonical list referenced by every review path.

Core domain concerns, each covered by a proactive skill that fires automatically:

- **Decimal precision & asset math** → `decimal-math` skill
- **Multi-chain wallet safety** → `signer-patterns` skill
- **Relay fragment correctness** → `relay-fragments` skill
- **State immutability** → `immutability-check` skill
- **i18n completeness** → `i18n-keys` skill
- **SCSS drift & BEM** → `scss-bem` skill (proactive) + `/scss-audit` (report)
- **Cross-package blast radius** → `plan-cross-package` skill

---

## Domain Documentation

- **LLM-friendly summary**: <https://docs.rujira.network/llms.txt>
- **Full documentation**: <https://docs.rujira.network/llms-full.txt>

---

## Environment Variables (`packages/main`)

`VITE_API` (GraphQL endpoint), `VITE_SOCKET` (WebSocket endpoint), `VITE_API_KEY` (auth). Route gating: `VITE_ROUTES_ENABLED` / `VITE_ROUTES_DISABLED` (comma-separated).

---

## Workspace Dependencies

`rujira.ui` and `rujira.js` are `workspace:*` dependencies. Changes to these shared libraries affect all consuming packages. The `plan-cross-package` skill fires automatically on shared-library edits and produces a blast radius report. `packages/trading-view` is a git submodule — treat as read-only.

---

## Skills & Task Routing

> **Full catalog:** see [`.claude/skills/README.md`](.claude/skills/README.md) for the authoritative list of proactive skills, user-invoked skills, and artifact-producing `/slash` commands. Subagents live in `.claude/agents/` (currently `typescript-reviewer`).

Agent support is split across proactive skills (auto-fire on matching edits — decimal math, Relay fragments, signer patterns, i18n, SCSS/BEM, immutability, cross-package blast radius, etc.), user-invoked skills (`explain-feature`, `trace-dependency`, `relay-trace`, `wallet-flow`, `debug-tx`, `debug-subscription`, `extract-shared`, `map-imports`, `domain-context`), and artifact commands (`/review-typescript`, `/scss-audit`, `/update-relay`, `/check-bundle`, `/ensure-huginn-structure`).

---

## Agent Priorities

Prioritise (highest first): **cross-package navigation** → **shared library reasoning** (`rujira.ui` vs `rujira.js` vs `main`) → **blockchain domain awareness** → **Relay/GraphQL tracing** → **refactor planning**. The weakest approach is single-file reasoning without cross-package context.
