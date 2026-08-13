---
name: explain-feature
description: Use when the user asks to understand, explain, or map a feature or module end-to-end (route → components → data → styles → i18n → tests). Produces a comprehensive context report before the user makes changes.
allowed-tools: [Agent, Read, Grep, Glob]
---

Deep-dive into the feature or module the user names and produce a comprehensive context report. This is the go-to skill for understanding any part of the codebase before making changes.

## What to explore

Spawn an `Explore` agent (thoroughness: very thorough) to map the feature end-to-end. The agent should investigate:

### 1 — Entry point and routing
- Find the route in `packages/main/src/Gate.tsx`
- Identify the top-level component and how it is lazy-loaded
- Check if the route is gated via `VITE_ROUTES_ENABLED` / `VITE_ROUTES_DISABLED`

### 2 — Component tree
- List all components in the feature folder with their hierarchy
- For each component: what props it takes, what hooks it calls, what context it consumes
- Identify which components are feature-local vs imported from `rujira.ui`

### 3 — Data layer
- **Relay**: list all `graphql` template literals — queries, fragments, subscriptions
- **Context**: which React Contexts does the feature consume or provide?
- **Local state**: any significant `useState` / `useReducer` patterns
- **WebSocket subscriptions**: any real-time data via `useSubscription`, `useNodeSubscription`, `useEdgeSubscription`

### 4 — Cross-package dependencies
- What does this feature import from `rujira.ui`? (components, hooks, helpers)
- What does this feature import from `rujira.js`? (types, signers, messages, utilities)
- Are there any imports going the wrong direction (shared lib importing from main)?

### 5 — Styling
- List SCSS files and their BEM block names
- Check if the feature's SCSS partial is imported in `packages/main/src/index.scss`
- Note any design token usage or drift (hardcoded values that should use tokens)

### 6 — i18n
- Which translation namespace does this feature use?
- Are all keys present in all locale files?

### 7 — Test coverage
- Does the feature have tests? Where are they?
- What is tested vs what has no coverage?

## Output format

```
Feature: <name>
Route: <path> → <component file>
Package: packages/main/src/<path>/

Components (<N> total):
  <ComponentName> — <file:line> — <one-line description>
  └─ uses: <hooks/contexts/shared components>
  ...

Data layer:
  Relay queries:     <list or "none">
  Relay fragments:   <list or "none">
  Subscriptions:     <list or "none">
  Contexts consumed: <list>
  Contexts provided: <list or "none">

Cross-package imports:
  from rujira.ui: <list>
  from rujira.js: <list>

Styles:
  SCSS files: <list>
  Imported in index.scss: <yes/no>

i18n:
  Namespace: <name>
  Keys: <count> across <N> locales

Tests:
  <file list or "no tests found">

Key observations:
  - <anything notable: complexity hotspots, unusual patterns, potential issues>
```
