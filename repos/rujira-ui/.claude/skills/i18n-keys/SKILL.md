---
name: i18n-keys
description: Use proactively when adding, renaming, or removing translation keys. TRIGGER when editing JSX/TSX that introduces a new visible string, calling `t(` / `useTranslation`, or touching files under `packages/rujira.ui/src/i18n/**` or any locale JSON. ESLint enforces key presence across locales; a missing key breaks the build.
allowed-tools: [Read, Grep, Glob]
---

Guardrails for i18n changes. The ESLint config enforces that every translation key used in code exists in every locale file — missing a key fails lint (`--max-warnings 0`) and breaks CI for every language.

## Rules

1. **Keys are added to every locale, not just the default.** After adding `t("swap.confirm")`, open every locale file under `packages/rujira.ui/src/i18n/` and add the key.
2. **Use the namespace from the feature.** Don't introduce a new top-level namespace unless the feature is new.
3. **Interpolation with `{{var}}` must match in every locale.** If the English string has `{{amount}}`, every translation needs it too.
4. **Pluralization uses i18next keys** (`_one`, `_other`); don't hand-roll count branching.
5. **Deletions must remove the key from every locale.** Orphaned keys are technically lint-clean but cause drift over time.
6. **Never inline user-facing strings** in JSX — always go through `t()`.

## Checks to run when this skill fires

- Grep the new/changed key name across every locale JSON — count the matches; should equal the number of locale files.
- Confirm the interpolation variables match across locales.
- Confirm the key is used (`t("…")` present somewhere) — unused keys indicate a rename that left an orphan.
- Run `pnpm run lint` at the package level to catch enforcement failures.

## When to delegate

- Feature-level string audit → `explain-feature` skill (section 6 covers i18n).
- Shared helper that wraps `t()` → `extract-shared` skill.

## References

- `packages/rujira.ui/src/i18n/` — i18next setup and locales
- `CONVENTIONS.md` — i18n conventions
