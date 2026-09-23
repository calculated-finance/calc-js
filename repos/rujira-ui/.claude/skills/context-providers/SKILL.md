---
name: context-providers
description: Use proactively when editing `packages/main/src/ContextWrapper.tsx`, adding a new React Context, or changing provider order. TRIGGER when the change touches any `*Context`, `*Provider`, or the top-level context tree. The app has 12 providers with non-obvious ordering rules.
allowed-tools: [Read, Grep, Glob]
---

Guardrails for React Context changes. The app composes 12 providers in `ContextWrapper.tsx`; provider order matters because outer providers supply values the inner ones read during their own render.

## Rules

1. **Read `ContextWrapper.tsx` before reordering anything.** The current order reflects real dependency edges.
2. **A provider that consumes another provider's value must be nested inside it.** E.g. `BalanceSubscriptionProvider` depends on `AccountsContext` — it is nested inside.
3. **Contexts defined in `rujira.ui` are the shared ones** (wallets, accounts, notifications, pending deposits). Contexts local to `main` own feature-specific state.
4. **Don't mutate context values.** Return new objects from `useMemo` / reducers — the `immutability-check` skill has details.
5. **Keep provider value shapes stable.** Adding a required field is a breaking change for every consumer; check with `trace-dependency` first.
6. **Feature-scoped state stays in feature providers**, not in `ContextWrapper`. Only truly app-wide concerns go to the top.

## Checks to run when this skill fires

- Open `ContextWrapper.tsx` and walk the tree — confirm the new provider is placed *inside* every provider it consumes.
- Grep for `useContext(NewContext)` / `useNewContext` to sanity-check no consumer is rendered outside the provider.
- If you added a field to an existing context value, run `trace-dependency` on the context name to enumerate consumers.

## When to delegate

- API-breaking change to a shared context → `plan-cross-package` skill.
- New feature context → ensure the Provider lives in the feature folder, not `ContextWrapper`, unless it is truly app-wide.

## References

- `packages/main/src/ContextWrapper.tsx` — the canonical provider tree
- `packages/rujira.ui/src/context/` — shared providers
