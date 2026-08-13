---
name: decimal-math
description: Use proactively whenever code touches asset amounts, fees, prices, or the `Bigint` custom scalar. TRIGGER when editing `packages/rujira.js/src/bigint.ts`, `packages/rujira.js/src/prices.ts`, `packages/rujira.js/src/asset.ts`, any fee-math helpers, or when multiplying/dividing values that could carry decimals in any `.ts`/`.tsx`. Rounding errors can lose user funds — this skill enforces safe patterns.
allowed-tools: [Read, Grep, Glob]
---

Guardrails for decimal math in a DeFi codebase. CLAUDE.md calls this out as the single most dangerous class of bug: rounding errors can lose user funds.

## Rules

1. **Use the `Bigint` scalar everywhere amounts are transported.** `AssetString` / custom scalars in `packages/main/data/schema.graphql` are the source of truth; do not coerce to JS `number` except for display.
2. **Never use floating-point multiply/divide on amounts.** Use the helpers in `packages/rujira.js/src/bigint.ts` (`mul`, `div`, `toFixed`, `fromHuman`, `toHuman`) or the decimal helpers in `packages/rujira.ui/src/helpers/`.
3. **Carry decimals explicitly.** An amount without its `decimals` context is meaningless. Pass both or use a typed wrapper.
4. **Round deterministically.** For display use `toFixed(n)` with an explicit rounding mode; never `Math.round` on a converted value.
5. **Gas and fees are amounts too.** Simulation results (`Simulation { amount, decimals, gas, symbol }`) must not be massaged with plain arithmetic.
6. **Don't parse user input with `parseFloat`.** Use `fromHuman(str, decimals)` so trailing-zero and locale variants are handled.

## Checks to run when this skill fires

- Search the changed file for `parseFloat`, `Number(`, `* 1e`, `/ 1e`, `Math.pow(10`, `toFixed(` with a magic argument.
- Flag any `Number(...)` / `+...` conversion of something typed as `bigint` or `string` amount.
- Confirm display-side conversions live at the UI boundary only, not in business logic.

## When to escalate

- The user is adding a new asset type, new chain decimals, or a new fee schedule — run the `domain-context` skill first to confirm protocol parameters.
- The amount crosses a Relay boundary — confirm the scalar in `schema.graphql` is `Bigint`, not `Int` / `Float`.

## References

- `packages/rujira.js/src/bigint.ts` — canonical arithmetic helpers
- `packages/rujira.js/src/prices.ts` — price conversion
- `packages/rujira.js/src/asset.ts` — asset metadata incl. decimals
- `CONVENTIONS.md` — immutability and numerical patterns
