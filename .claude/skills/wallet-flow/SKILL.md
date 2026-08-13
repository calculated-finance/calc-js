---
name: wallet-flow
description: Use when the user asks about wallet connection, transaction signing, or broadcast for a specific chain (ETH, BTC, THOR, COSMOS, TON, TRON, XRP) or wallet provider (Vultisig, Keplr, MetaMask, Ledger, TON Connect). Traces the connect → sign → broadcast pipeline across `AccountsContext`, signers, and message builders.
allowed-tools: [Read, Grep, Glob]
---

Trace the wallet connection and transaction signing flow for the chain, action, or provider the user names.

## Steps

### 1 — Identify scope

Parse the argument:
- **Chain name** (ETH, BTC, THOR, COSMOS, TON, TRON, XRP): trace the full connect → sign → broadcast flow for that chain.
- **Action** (connect, sign, broadcast): trace that specific step across all chains, showing where chains diverge.
- **Wallet provider** (Vultisig, Keplr, MetaMask, Ledger, TON Connect): trace how that specific provider integrates.

### 2 — Trace AccountsContext

Read `packages/rujira.ui/src/` and `packages/main/src/` to find `AccountsContext`. Identify:
- How wallets are connected and stored
- How the active account/chain is selected
- What is passed down to consuming components

### 3 — Trace the signer in rujira.js

Read `packages/rujira.js/src/` and find the signer implementation for the target chain. Identify:
- The `Signer` interface it implements
- The message builder used (e.g. `buildTransferMsg`, `buildSwapMsg`)
- Chain-specific SDK used (ethers for EVM, bitcoinjs-lib for BTC, cosmjs for Cosmos, etc.)
- Where `signAndBroadcast` or equivalent is called

### 4 — Trace transaction submission

Follow the flow from the signed transaction back to the UI:
- How errors are surfaced (thrown, returned, toast notification via `NotificationContext`?)
- How pending state is tracked (`PendingDepositStorageContext`?)
- How the UI reflects success/failure

### 5 — Output the flow

```
Chain / Action: <target>

Connect flow:
  UI trigger → <component:line>
  → AccountsContext.connect(<provider>) → <file:line>
  → Wallet SDK: <sdk name and method>
  → Account stored as: <type shape>

Sign flow:
  Component calls → <function:line>
  → rujira.js Signer: <SignerClass:file:line>
  → Message builder: <buildXMsg():file:line>
  → SDK sign: <method>

Broadcast flow:
  → <broadcastMethod():file:line>
  → RPC endpoint: <how configured>
  → Success: <how UI is updated>
  → Failure: <error path>

Chain-specific notes:
  <anything unique to this chain: UTXO vs account model, gas handling, etc.>
```

If the chain is not yet implemented, report what partial support exists and what is missing.
