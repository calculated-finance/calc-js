---
name: find-component
description: Use proactively before creating a new React component, hook, or utility. TRIGGER when the user says "I need a <description> component/hook", "let's build a …", or is about to scaffold UI. Searches `packages/rujira.ui`, `packages/main`, and `packages/docs` for an existing implementation to reuse or extend.
allowed-tools: [Read, Grep, Glob]
---

Before creating a new component or hook, search for an existing implementation matching what the user wants to build.

## Steps

### 1 — Parse the request

The argument describes what the user wants to build: e.g. "token amount input", "chain selector dropdown", "price display", "use-debounce hook", "wallet balance hook". If no argument is given, ask the user to describe what they need.

### 2 — Search packages/rujira.ui first

The shared UI library is the canonical source. Search:
- `packages/rujira.ui/src/components/` — React components
- `packages/rujira.ui/src/hooks/` — shared hooks
- `packages/rujira.ui/src/helpers/` — utility functions

Use keyword variants (e.g. for "amount input" search: `Amount`, `Input`, `TokenInput`, `AssetInput`).

### 3 — Search packages/main/src

If nothing found in rujira.ui, search the main app for a similar component that may be a candidate for extraction:
- Feature folders (`swap/`, `trade/`, `portfolio/`, `borrow/`, `strategies/`)
- Shared component folders if they exist

### 4 — Check docs/

If `packages/docs` exists, check whether the component is already documented/showcased there — this confirms it is an officially supported shared component.

### 5 — Report findings

For each match found, report:
```
Found: <ComponentName or hookName>
File: <path:line>
Package: <rujira.ui | main | landing>
Exported: <yes | no>
Docs entry: <yes | no>
Usage count: <N files import this>

Summary of what it does:
<2-3 sentence description based on reading the file>

Props / signature:
<key props or hook return type>
```

### 6 — Recommend

Based on findings, give one of these recommendations:

**A — Reuse as-is:** "Use `<ComponentName>` from `packages/rujira.ui`. Import: `import { X } from 'rujira.ui'`."

**B — Extend:** "Use `<ComponentName>` as a base and add `<prop>`. Consider invoking the `extract-shared` skill if the extension is general enough to go back into rujira.ui."

**C — Create new (with guidance):** "No match found. When creating, place it in `packages/rujira.ui/src/components/<name>/` if it is reusable, or `packages/main/src/<feature>/components/` if it is feature-specific. Follow the BEM SCSS pattern (see `scss-bem` skill) and add an entry to `packages/docs`."
