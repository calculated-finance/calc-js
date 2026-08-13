---
name: trace-dependency
description: Use when the user asks where a symbol (component, hook, type, utility, signer, SCSS variable) is used, or needs to assess rename/removal impact across the monorepo. Finds every import and usage across all packages and classifies cross-package contract risk.
allowed-tools: [Read, Grep, Glob]
---

Find every usage of the symbol the user names across the entire monorepo and report cross-package impact.

## Steps

### 1 — Identify the symbol

The argument is a symbol name: a component, hook, type alias, interface, utility function, signer class, or SCSS variable/mixin. If no argument is given, ask the user to provide a symbol name.

### 2 — Search all packages

Use Grep to search for import and usage patterns across:
- `packages/main/src/`
- `packages/landing/src/`
- `packages/docs/src/`
- `packages/rujira.ui/src/`
- `packages/rujira.js/src/`

Search for:
1. Import declarations: `import.*<symbol>` and `from.*<symbol>`
2. Direct usage in JSX/TSX: `<Symbol` and `{Symbol`
3. Type references: `: Symbol`, `<Symbol>`, `extends Symbol`
4. Re-exports: `export.*Symbol`

### 3 — Classify each usage

For every file found, classify the usage as:
- **Direct import** — the file uses the symbol directly
- **Re-export** — the file forwards the symbol to other consumers
- **Type-only** — only referenced in TypeScript type position
- **Cross-package** — the consuming file is in a different package than the definition

### 4 — Identify the definition

Locate where the symbol is defined (the canonical source file). Check if it is:
- Exported from `packages/rujira.ui` (shared UI)
- Exported from `packages/rujira.js` (shared domain logic)
- Local to `packages/main`
- Part of a `__generated__` Relay file (flag: do not edit manually)

### 5 — Report

Output a structured report:

```
Symbol: <name>
Defined in: <file:line>
Type: <component | hook | type | utility | signer | scss>

Cross-package usages:
  packages/main        — N files
  packages/landing     — N files
  packages/docs        — N files
  packages/rujira.ui   — N files (if consumed within the same package)

All usages:
  <file:line> — <usage type>
  ...

Cross-package contract risk:
  <HIGH | MEDIUM | LOW> — <reason>
  If HIGH: list the specific files that would break on a rename, signature change, or removal.
```

If the symbol is in a `__generated__` file, stop and warn: regenerate via `pnpm run relay` in `packages/main` instead of editing directly.
