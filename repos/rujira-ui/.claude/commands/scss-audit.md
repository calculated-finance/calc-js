---
name: scss-audit
description: Audit SCSS for duplicates, token drift, and BEM violations, then write the report to `docs/static-snapshots/scss_audit.md`.
argument-hint: "[package or feature scope — optional]"
---

Audit SCSS across all packages for duplicates, token drift, BEM violations, and inconsistent utility usage. `$ARGUMENTS` can narrow the scope to a specific package or feature (optional).

For proactive BEM/token enforcement while authoring, see the `scss-bem` skill.

## Steps

### 1 — Establish scope

If `$ARGUMENTS` specifies a package or feature (e.g. `swap`, `packages/main`, `rujira.ui`), limit the audit to that scope. Otherwise audit all three:
- `packages/main/src/**/*.scss`
- `packages/landing/src/**/*.scss`
- `packages/rujira.ui/src/scss/**/*.scss`

### 2 — Read the design token baseline

Read `packages/rujira.ui/src/scss/base/_variables.scss` to build a list of all defined CSS custom properties and SCSS variables. These are the canonical tokens — any hardcoded value that matches a token is a drift violation.

### 3 — Check for hardcoded values that should use tokens

Search all SCSS files for:
- Hardcoded hex colors (e.g. `#1a1a2e`, `rgba(...)`) that match or closely match a token
- Hardcoded pixel values for spacing/typography that correspond to a token
- Hardcoded font-size values (should use `fs-*` utility or a token)

### 4 — Check for duplicated rules

Find CSS rules or blocks that appear identically (or near-identically) in more than one file and could be extracted into a shared utility or mixin in `packages/rujira.ui/src/scss/`.

### 5 — Check BEM convention

For each feature SCSS file:
- Block names should match the feature folder name (e.g. `.swap { }`)
- Elements use double underscore: `.swap__header`
- Modifiers use double dash: `.swap__button--active`
- Report any class names that mix BEM with arbitrary naming or use camelCase

### 6 — Check utility class consistency

The repo uses utility classes like `fs-16`, `fw-400`, `color-grey`, `col-8`, `ai-c`, `jc-c`, `dir-c`. Check that:
- These utilities are always applied via className in JSX, not redefined in SCSS
- No SCSS file re-implements a utility that already exists

### 7 — Output a prioritized fix list

```
## SCSS Audit Report
Scope: <packages audited>
Date: <today>

### High Priority (token drift — visual inconsistency risk)
| File | Line | Issue | Fix |
|------|------|-------|-----|
| ...  | ...  | Hardcoded `#ff6b35` — use `$color-primary` | Replace with token |

### Medium Priority (duplication — maintenance risk)
| Files | Issue | Fix |
|-------|-------|-----|
| A.scss + B.scss | `.card { border-radius: 8px; ... }` duplicated | Extract to rujira.ui mixin |

### Low Priority (BEM / style issues)
| File | Line | Issue |
|------|------|-------|
| ...  | ...  | Class `.swapButton` should be `.swap__button` |

### Quick Wins (fix in < 30 min each)
1. ...
2. ...
```
