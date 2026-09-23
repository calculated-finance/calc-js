---
name: debug-subscription
description: Use when the user reports a Phoenix WebSocket subscription is not firing or returning wrong data (e.g. "balances not updating", "orders not refreshing", "finOrderFilled silent"). Checks variables, Relay environment, schema definition, and known subscription topics.
allowed-tools: [Read, Grep, Glob]
---

Debug why the Phoenix WebSocket subscription the user names is not firing or is returning unexpected data.

## Context

Real-time data in this app flows through Phoenix WebSockets via `@absinthe/socket`. Relay components use `useSubscription` (or `useNodeSubscription` / `useEdgeSubscription`). The Relay environment in `packages/main/src/services/relay.tsx` connects to `VITE_SOCKET/socket` with `VITE_API_KEY`. Subscriptions are adapter-translated from Phoenix channels into Relay-compatible streams.

Known subscription topics and their required variables:

| Subscription | Required Variables | Purpose |
|---|---|---|
| `finOrderUpdated` | `owner` | Order creation/modification |
| `finOrderFilled` | `contract`, `side`, `price`, `owner` | Order fills |
| `finRangeUpdated` | `owner` | Range position updates |
| `finRangeClosed` | `owner` | Range closures |
| `perpsAccountUpdated` | `contract`, `owner` | Perps position changes |
| `stakingAccountUpdated` | `owner` | Staking reward allocations |
| `balances` | `addresses[]` | Multi-chain balance updates |
| `autoInstanceCreated` | `owner` | Automation workflow instances |
| `mimirUpdated` | _(global)_ | THORChain Mimir parameter changes |
| `node` | `id` | Single Relay node update |
| `edge` | `prefix` | Connection edge streaming |

## Steps

### 1 — Identify the subscription

Parse the argument: it may be a subscription name (e.g. `balances`, `finOrderFilled`), a component name, or a symptom (e.g. "balance not updating", "orders not refreshing").

Locate the `useSubscription` / `useNodeSubscription` / `useEdgeSubscription` call:
- Read `packages/main/src/services/useNodeSubscription.tsx` for the base hooks
- Search `packages/main/src/` for the relevant feature component using the subscription

### 2 — Check the Relay environment

Read `packages/main/src/services/relay.tsx`. Verify:
- `VITE_SOCKET` is non-empty (check the env var guard)
- The Phoenix socket is created with the correct auth: `{ params: { token: VITE_API_KEY } }`
- The `subscriber` function returned to `Network.create()` is using the Absinthe socket adapter

### 3 — Check the subscription variables

Cross-reference the subscription variables in the component against the table above:
- Are all required variables passed and non-null/non-undefined?
- For `owner` variables — is a wallet connected? Check `AccountsContext.selected`
- For `addresses[]` — is the array non-empty?
- For `prefix` — is the prefix string correctly formed? (e.g. `FinCandle:{contract}/{resolution}`)

### 4 — Check the GraphQL subscription definition

Find the `graphql` subscription tag in the component. Verify:
- The subscription name matches a subscription defined in `packages/main/data/schema.graphql`
- The fields requested exist on the subscription payload type
- The `__generated__` file is up to date — if not, run `cd packages/main && pnpm run relay`

### 5 — Check the BalanceSubscriptionProvider (for balance issues)

If the issue is with balance updates, read `packages/rujira.ui/src/components/common/components/Balance.tsx`:
- Is `BalanceSubscriptionProvider` present in the context tree?
- Are connected wallet addresses being passed as the `addresses` variable?
- Is `AccountsContext` connected (i.e., is there a selected account)?

### 6 — Produce a diagnosis report

```
Subscription: <name>
Component: <file:line>
Hook used: <useSubscription | useNodeSubscription | useEdgeSubscription>

Variable check:
  <variable>: <value or "MISSING" or "null">
  ...

Relay environment:
  VITE_SOCKET: <set | MISSING>
  VITE_API_KEY: <set | MISSING>
  Absinthe adapter: <found | not found>

GraphQL definition:
  In schema.graphql: <yes | NO — potential mismatch>
  __generated__ up to date: <yes | no — run pnpm run relay>

Likely cause: <description>

Fix:
  <concrete steps>
```
