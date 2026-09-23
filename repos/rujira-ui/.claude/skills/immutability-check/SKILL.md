---
name: immutability-check
description: Use proactively when editing any file that manipulates React state, Relay store data, or context values. TRIGGER on `setState`, `dispatch`, `commitMutation`, `updater`, `store.get(...).setValue(...)`, mutations like `.push()` / `.sort()` / `.splice()` / `Object.assign(` applied to state, props, or context values.
allowed-tools: [Read, Grep, Glob]
---

Guardrails for immutability. CLAUDE.md: "never mutate React state, Relay store data, or context values; use spread/map/filter". Mutation-driven bugs in React are easy to miss because the code runs fine in dev and fails under memoisation / strict mode.

## Rules

1. **Never mutate state.** Always produce a new object/array: spread (`{ ...x, foo: 1 }`), `map`, `filter`, `concat`, `slice`.
2. **Never mutate props.** Treat them as frozen.
3. **Never mutate context values.** The value handed to `Provider` must be fresh when something inside changes; use `useMemo` + new objects.
4. **Never mutate Relay store data directly.** Use `commitMutation` / `commitLocalUpdate` and create new records.
5. **Watch for aliasing.** `const x = state.list; x.push(y)` is still a mutation.
6. **Sort/reverse/splice always need a copy first** (`[...list].sort()`).

## Checks to run when this skill fires

- Grep the changed file for `.push(`, `.pop(`, `.shift(`, `.unshift(`, `.splice(`, `.sort(`, `.reverse(`, `Object.assign(`. Confirm none of them target state, props, or context values.
- Confirm every `setState` callback / reducer returns a *new* object/array.
- Confirm `Provider` value is memoised and reconstructed when content changes.
- If Relay updaters are used, confirm they create new records rather than mutating fetched records.

## When to delegate

- Cross-file audit → `/review-typescript` command (this rule is one item on its larger checklist).
- Context-tree change → `context-providers` skill.

## References

- `CONVENTIONS.md` — immutability section
- React docs on `useMemo` / Provider stability
