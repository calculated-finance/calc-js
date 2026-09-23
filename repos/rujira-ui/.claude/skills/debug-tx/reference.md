# debug-tx reference

## Chain-family cheat sheet

| Address prefix | Family | Signer dir | Gas model |
|----------------|--------|------------|-----------|
| `0x…` | EVM | `packages/rujira.js/src/signers/evm/` | `eth_estimateGas` + EIP-1559 fees |
| `bc1…` / `1…` / `3…` | UTXO | `packages/rujira.js/src/signers/utxo/` | fee rate × PSBT size |
| `thor…` / cosmos bech32 | Cosmos | `packages/rujira.js/src/signers/cosmos/` | gas in `fee.ts` |
| `T…` | TRON | `packages/rujira.js/src/signers/tron/` | bandwidth + energy |
| `r…` / `X…` | XRP | `packages/rujira.js/src/signers/xrp/` | inbound gas rate |

## Known `translateError` patterns (summary)

Read `packages/rujira.js/src/errors.ts` for the authoritative list. Common categories:

- User rejection — wallet UI cancel
- Insufficient funds (native gas)
- Insufficient allowance (ERC20) — thrown as `InsufficientAllowanceError`
- Nonce mismatch (EVM)
- Replacement transaction underpriced
- UTXO not available / dust
- Cosmos sequence mismatch
- RPC timeouts

If the raw error doesn't match any pattern, add a new regex + user-friendly message.

## Pending deposit lifecycle

```
Submit → PendingDepositStorageContext.add()
       → PendingDepositLoadedContext subscribes
       → status transitions: pending → succeeded | refunded | failed
       → UI toast on terminal status
```

If a deposit never leaves `pending`, check:
- The subscription is active (`debug-subscription` skill)
- `txHash` is correct
- Chain explorer / RPC confirms the tx exists
