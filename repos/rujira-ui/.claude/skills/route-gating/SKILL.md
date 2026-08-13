---
name: route-gating
description: Use proactively when editing `packages/main/src/Gate.tsx`, adding a new route, or changing route enablement. TRIGGER when the change touches `Gate.tsx`, imports a new top-level route component, or references `VITE_ROUTES_ENABLED` / `VITE_ROUTES_DISABLED`.
allowed-tools: [Read, Grep, Glob]
---

Guardrails for route definitions. The app uses React Router v6 with a bespoke enable/disable gate via env-var comma-lists. Mis-gating a route means it either ships when it shouldn't, or silently disappears in production.

## Rules

1. **Every route is declared in `packages/main/src/Gate.tsx`.** Don't register routes elsewhere.
2. **Top-level route components are lazy-loaded** via `React.lazy` + `Suspense`. Adding a route without lazy loading regresses bundle splitting.
3. **Gating uses `VITE_ROUTES_ENABLED` and `VITE_ROUTES_DISABLED`** (comma-separated names). `DISABLED` wins over `ENABLED`.
4. **Route names in the env lists are stable identifiers** — renaming a route requires coordinating the env var across all deploy targets. Treat renames like a shared-API change.
5. **Nested routes live in the feature folder**, not in `Gate.tsx`. Only the top-level `<Route>` is in `Gate.tsx`.
6. **Default redirects** (e.g. `/` → `/swap`) also live in `Gate.tsx`.

## Checks to run when this skill fires

- Confirm the new route component is lazy-loaded.
- Confirm the route name is represented in the gating logic if it needs to be toggleable.
- Grep `VITE_ROUTES_ENABLED` and `VITE_ROUTES_DISABLED` across `.env.*` files to see which are known names.
- Verify the route's top-level component lives in `packages/main/src/<feature>/`.

## When to delegate

- Renaming an existing route → `plan-cross-package` skill (env-var change has deploy impact).
- End-to-end feature walkthrough → `explain-feature` skill.

## References

- `packages/main/src/Gate.tsx`
- `CLAUDE.md` — *Environment Variables* section
