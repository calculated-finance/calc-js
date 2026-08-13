---
name: signer-patterns
description: Use proactively when editing chain signers, message builders, or adding a new chain. TRIGGER when changing files under `packages/rujira.js/src/signers/**`, `packages/rujira.js/src/msgs/**`, `packages/rujira.js/src/signer.ts`, or `packages/rujira.js/src/accounts.ts`. Enforces the Signer interface contract across the 19 supported networks.
allowed-tools: [Read, Grep, Glob]
---

Guardrails for multi-chain signer and message-builder changes. These changes affect 19 networks; one bad edit can break withdrawals on an entire chain family.

See `reference.md` for the full chain matrix and signer-per-family details.

## Rules

1. **Every signer implements the canonical `Signer` interface** in `packages/rujira.js/src/signer.ts`: `simulate(msg)`, `signAndBroadcast(sim, msg)`, and the standard result shapes.
2. **`simulate` must return `Simulation { symbol, decimals, amount, gas }`** — do not invent alternate shapes. Fee math uses the `decimal-math` skill's rules.
3. **Chain detection uses the address prefix in `accounts.ts`** (`0x`, `bc1`, `thor`, `T`, `r`/`X`). New chains add to this table; never sniff based on wallet provider alone.
4. **Errors from SDK calls are re-thrown as `TxError` / `InsufficientAllowanceError`** and then translated via `translateError()` in `packages/rujira.js/src/errors.ts`. If your new error path isn't matched by any regex there, add one.
5. **Message builders live in `packages/rujira.js/src/msgs/`.** Components build messages, signers consume them — keep that direction.
6. **EVM-specific**: check ERC20 allowance before broadcast via `router.ts`; throw `InsufficientAllowanceError` when missing.
7. **UTXO-specific**: PSBT requires an external UTXO source; trace where it comes from in the caller.
8. **Cosmos-specific**: gas calculation lives in `fee.ts`; sequence mismatches surface as retryable errors.

## Checks to run when this skill fires

- Confirm the changed signer still exports the standard methods.
- If a new error message is introduced, grep `errors.ts` for a matching pattern; add one if absent.
- If gas / fee logic changed, also invoke the `decimal-math` skill.
- If the ABI or message schema changed, confirm no callers still pass the old shape.

## When to delegate

- Connect/sign/broadcast flow walkthrough → `wallet-flow` skill.
- Failing transaction diagnosis → `debug-tx` skill.
- Cross-package blast check before rename → `plan-cross-package` skill.
