---
name: map-imports
description: Use when the user asks to map dependencies, find blast radius, check for circular imports, or plan a refactor of a package, feature folder, or file. Produces inbound and outbound import graphs and flags coupling hotspots and wrong-direction imports.
allowed-tools: [Read, Grep, Glob]
---

Generate a dependency map showing how the target (a package name, feature folder, or file path) connects to the rest of the monorepo.

## Purpose

Before making changes to shared code or planning a refactor, you need to know what depends on what. This skill produces a visual import graph and identifies coupling hotspots, circular dependencies, and blast radius.

## Steps

### 1 — Determine scope

Parse the argument:
- **Package name** (e.g. `rujira.ui`, `rujira.js`, `main`) → map all exports and who consumes them
- **Feature folder** (e.g. `swap`, `trade/components`) → map all imports into and out of that folder
- **File path** (e.g. `packages/rujira.js/src/bigint.ts`) → map all importers of that file and all files it imports

### 2 — Map outbound imports (what this scope depends on)

For each file in scope, collect:
- Imports from other packages (`rujira.ui`, `rujira.js`, `node_modules`)
- Imports from other features within the same package
- Imports from `__generated__/` (Relay artifacts)

Group by source package and count.

### 3 — Map inbound imports (what depends on this scope)

Search all packages for imports pointing into the scope:
- `packages/main/src/` → who imports from this scope?
- `packages/landing/src/` → who imports from this scope?
- `packages/docs/src/` → who imports from this scope?
- `packages/rujira.ui/src/` → who imports from this scope?
- `packages/rujira.js/src/` → who imports from this scope?

### 4 — Identify issues

Flag:
- **Circular dependencies**: A imports B imports A
- **Wrong-direction imports**: `rujira.ui` importing from `main`, or `rujira.js` importing from `rujira.ui`
- **Heavy coupling**: files imported by 10+ consumers (high blast radius)
- **Barrel re-exports**: `index.ts` files that re-export large subtrees (bundle impact)
- **Unused exports**: public API surface not consumed by any package

### 5 — Output

```
Scope: <target>
Type: <package | feature | file>

Outbound dependencies (what this scope imports):
  rujira.ui     — <N> imports (<top symbols>)
  rujira.js     — <N> imports (<top symbols>)
  node_modules  — <N> packages (<top packages>)
  other features — <N> imports (<list>)
  __generated__ — <N> Relay artifacts

Inbound dependents (what imports from this scope):
  packages/main     — <N> files
  packages/landing  — <N> files
  packages/docs     — <N> files
  packages/rujira.ui — <N> files
  packages/rujira.js — <N> files

Coupling hotspots (most-imported symbols):
  <symbol> — imported by <N> files across <N> packages
  ...

Issues found:
  ⚠️ <issue description>
  ...

Blast radius for changes:
  <LOW | MEDIUM | HIGH> — <explanation>
  Files that would need updating: <N>
```
