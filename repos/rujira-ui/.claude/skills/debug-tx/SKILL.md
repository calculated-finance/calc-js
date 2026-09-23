---
name: debug-tx
description: Use when the user reports a failing transaction — whether by error message ("insufficient funds", "user rejected", "allowance"), symptom ("stuck pending", "swap fails silently", "approval not working"), or feature context ("swap ETH→BTC failing"). Walks the simulate → confirm → sign → broadcast pipeline to find the failure point.
allowed-tools: [Read, Grep, Glob]
---

Trace and debug a failing transaction through the simulate → confirm → sign/broadcast pipeline.

## Context

All transactions follow this pipeline:
1. Create a `Msg` (e.g. `MsgSwap`, `MsgDeposit`)
2. Chain type is detected from `account.address` prefix (`0x`=EVM, `bc1`=BTC, `thor`=Cosmos, `T`=TRON, `r`/`X`=XRP)
3. `signer.simulate(msg)` estimates gas → returns `Simulation { symbol, decimals, amount, gas }`
4. User confirms the fee
5. `signer.signAndBroadcast(simulation, msg)` submits to chain
6. `TxResult { network, address, txHash, deposited? }` is returned
7. `PendingDepositStorageContext` tracks the deposit until confirmed

Errors are caught and translated via `translateError()` in `packages/rujira.js/src/errors.ts` (20+ regex patterns → user-friendly strings). `TxError` and `InsufficientAllowanceError` are the two typed error classes.

For the full error pattern table and chain-by-chain diagnostics, see `reference.md`.

## Steps

### 1 — Identify the failure point

Parse the argument — it may be:
- An error message (e.g. "insufficient funds", "user rejected", "allowance")
- A symptom (e.g. "transaction stuck pending", "swap fails silently", "ERC20 approval not working")
- A feature context (e.g. "swap ETH→BTC failing", "borrow transaction error")

Identify which stage the failure is happening at: **simulate**, **user confirmation**, **sign**, or **broadcast**.

### 2 — Read the error translation table

Read `packages/rujira.js/src/errors.ts`. List the `translateError()` regex patterns. Check if the raw error message matches any of them. If it does, the UI should already show a friendly message — if it doesn't, this may be a missing pattern.

Also check for `InsufficientAllowanceError` — this is thrown when an ERC20 token approval is needed before the transaction can proceed.

### 3 — Trace the Msg type

Search `packages/main/src/<feature>/` for the transaction initiation code. Find:
- Which `Msg` class is instantiated (e.g. `MsgSwap`, `MsgDeposit`)
- What `account` is passed (from `AccountsContext.signer(address)`)
- What parameters are passed to the Msg constructor

### 4 — Trace the signer

From the `account.address` prefix, identify which signer family is involved:
- `0x` → EVM signer (`signers/evm/`) — check `eth_estimateGas` and `sendTransaction`
- `bc1`/`1`/`3` → UTXO signer (`signers/utxo/`) — check `PsbtFactory`, UTXO availability, fee rate
- `thor`/cosmos bech32 → Cosmos signer (`signers/cosmos/`) — check RPC, gas calculation in `fee.ts`
- `T` → TRON signer — check bandwidth calculation
- `r`/`X` → XRP signer — check inbound gas rate

For EVM: check if `InsufficientAllowanceError` applies (ERC20 token, not native ETH). The EVM signer checks allowance via `router.ts` before broadcasting.

For UTXO: check if UTXOs are available and sufficient. `PsbtFactory` requires UTXOs from an external source — trace where they come from.

### 5 — Check pending deposit tracking

If the transaction was submitted but the UI shows no confirmation:
Read `packages/main/src/services/deposits.tsx`. Check:
- Is the deposit being stored in `PendingDepositStorageContext`?
- Is `PendingDepositLoadedContext` subscribing to status updates?
- What statuses are possible? (`pending` / `succeeded` / `refunded` / `failed`)

### 6 — Check error surfacing

Read how the feature calls `signAndBroadcast` and handles the result. Verify:
- Is the Promise awaited?
- Is the catch block calling `translateError()` and showing a toast?
- Is the error being swallowed silently?

### 7 — Diagnosis report

```
Transaction: <description>
Feature: packages/main/src/<feature>/
Msg type: <MsgX>
Chain family: <EVM | UTXO | Cosmos | TRON | XRP>
Failure stage: <simulate | confirm | sign | broadcast | pending tracking>

Error message: "<raw error>"
translateError() match: <pattern matched | NO MATCH — needs new pattern>
Typed error: <TxError | InsufficientAllowanceError | none>

Root cause: <description>

Fix:
  <concrete steps — code change, missing UTXO source, missing pattern in errors.ts, etc.>
```
