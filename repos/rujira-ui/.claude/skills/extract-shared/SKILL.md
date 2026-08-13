---
name: extract-shared
description: Use when the user asks whether code should move from `packages/main` into `packages/rujira.ui` or `packages/rujira.js`, or asks to audit a file/folder for duplication and extraction candidates. Produces a migration plan with blast radius per candidate.
allowed-tools: [Read, Grep, Glob]
---

Analyse the target the user names (file path, folder, or description) and identify logic that should be extracted into `packages/rujira.ui` or `packages/rujira.js`.

## Steps

### 1 — Read the target

If the argument is a file path, read it. If it is a folder, list the files and read the most relevant ones. If it is a description (e.g. "token formatting logic in the swap feature"), search `packages/main/src/` for matching files.

### 2 — Identify extraction candidates

For each piece of logic found, classify it as:

**UI / Hook candidate → rujira.ui**
- React components used in more than one feature
- Custom hooks (`useX`) with no feature-specific dependencies
- SCSS utility classes or variables duplicated across features
- i18n helpers

**Blockchain / Domain candidate → rujira.js**
- Amount/precision math (asset formatting, decimals)
- Address validation or formatting
- Chain-specific type guards or constants
- Message builders or transaction constructors
- Signer utilities not tied to a specific wallet SDK

**Keep in main (not a candidate)**
- Logic tightly coupled to a specific route's state
- Components that use feature-local context
- Relay fragment containers (these cannot move without schema changes)

### 3 — For each candidate, produce a migration plan

```
Candidate: <function/component name>
Current location: packages/main/src/<path>:line
Proposed destination: packages/<rujira.ui|rujira.js>/src/<path>

What to move:
  <description of the code block>

Required API changes:
  - <prop/param rename if needed>
  - <type adjustments>

Blast radius:
  - <N> files in packages/main currently import this
  - Downstream consumers: <list>

Migration steps:
  1. Copy to destination package
  2. Export from destination package's index
  3. Update all imports in packages/main
  4. Run: cd packages/rujira.ui && tsc -b   (or rujira.js)
  5. Run: cd packages/main && pnpm run lint
```

### 4 — Summary table

| Candidate | Current | Destination | Effort | Priority |
|-----------|---------|-------------|--------|----------|
| ... | ... | ... | S/M/L | H/M/L |

If nothing qualifies for extraction, say so explicitly and explain why the current placement is correct.
