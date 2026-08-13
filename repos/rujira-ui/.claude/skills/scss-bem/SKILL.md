---
name: scss-bem
description: Use proactively when authoring or editing SCSS. TRIGGER when editing any `*.scss` file in `packages/main`, `packages/landing`, or `packages/rujira.ui`. Enforces BEM block/element/modifier naming, design tokens over hardcoded values, and the shared utility-class system.
allowed-tools: [Read, Grep, Glob]
---

Guardrails for SCSS authoring. Complements the reactive `/scss-audit` command — this skill fires while you write, not only when an audit is requested.

## Rules

1. **Block names match the feature folder.** `packages/main/src/swap/` → `.swap { … }`.
2. **Elements use double underscore**: `.swap__header`, `.swap__button`.
3. **Modifiers use double dash**: `.swap__button--active`, `.swap--loading`.
4. **No camelCase class names** in SCSS. If you see one, convert.
5. **Design tokens first.** Colors, spacing, and typography come from `packages/rujira.ui/src/scss/base/_variables.scss`. Hardcoded hex/rgb/px values are drift.
6. **Utility classes are applied in JSX, not redefined in SCSS.** `fs-16`, `fw-400`, `color-grey`, `col-8`, `ai-c`, `jc-c`, `dir-c` are the canonical set.
7. **Feature SCSS partials are imported once** in `packages/main/src/index.scss` (or the package equivalent). Don't import partials ad-hoc from components.
8. **Keep nesting shallow (≤3 levels).** Deep nesting reconstructs BEM incorrectly.

## Checks to run when this skill fires

- Grep the new file for hardcoded color hex, rgb, or rgba values — flag each with the token that should replace it.
- Look for class names that don't match the block — they should be promoted to `__element` or `--modifier`.
- Confirm the new partial is imported in the package's top-level SCSS entry.

## When to delegate

- Full SCSS drift audit across the monorepo → `/scss-audit` command.
- Extracting a duplicated pattern to `rujira.ui` → `extract-shared` skill.

## References

- `packages/rujira.ui/src/scss/base/_variables.scss` — design tokens
- `packages/rujira.ui/src/scss/` — shared mixins and utilities
