# signer-patterns reference

## Chain matrix

| Family | Prefix | Signer dir | SDK | Gas model |
|--------|--------|------------|-----|-----------|
| EVM | `0x` | `signers/evm/` | `ethers` / `viem` | `eth_estimateGas` + EIP-1559 |
| UTXO | `bc1` / `1` / `3` | `signers/utxo/` | `bitcoinjs-lib` | fee rate × PSBT vsize |
| Cosmos | `thor`, `cosmos`, etc. | `signers/cosmos/` | `cosmjs` | gas × gasPrice (`fee.ts`) |
| TRON | `T` | `signers/tron/` | TronWeb | bandwidth + energy |
| XRP | `r`, `X` | `signers/xrp/` | xrpl.js | inbound gas rate |

## Signer interface (contract)

```ts
interface Signer {
  simulate(msg: Msg): Promise<Simulation>;
  signAndBroadcast(sim: Simulation, msg: Msg): Promise<TxResult>;
}

type Simulation = {
  symbol: string;
  decimals: number;
  amount: string;   // Bigint-string
  gas: string;      // Bigint-string
};

type TxResult = {
  network: string;
  address: string;
  txHash: string;
  deposited?: boolean;
};
```

## Typed errors

- `TxError` — generic signer failure
- `InsufficientAllowanceError` — ERC20 approval required before broadcast

Both are translated to user-friendly strings via `translateError(err)` in `packages/rujira.js/src/errors.ts`. Add a new regex + message there when introducing a new error shape.

## Adding a new chain

1. Add the prefix detection in `packages/rujira.js/src/accounts.ts`.
2. Create `packages/rujira.js/src/signers/<family>/` with a class implementing `Signer`.
3. Add message builders under `packages/rujira.js/src/msgs/` if the chain has new Msg types.
4. Expose from `packages/rujira.js/src/index.ts`.
5. Wire the wallet provider in `packages/rujira.ui/src/wallets/` and in `AccountsContext`.
6. Add any new error patterns to `errors.ts`.
7. Smoke-test connect, simulate, sign, broadcast, and pending deposit tracking.
