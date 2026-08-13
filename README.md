# CALC

Automated on-chain strategy platform for THORChain app-layer (Rujira):
a visual strategy builder, chain-executing workers, and a shared
Effect-based domain layer.

## Packages

- `packages/domain` — Effect schemas and services shared by every consumer:
  strategy/action types, CosmWasm clients, wallet integrations.
- `packages/client` — React strategy-builder UI (Vite, React Flow, TanStack).
- `packages/worker` — AWS Lambda handlers and long-running runners:
  scheduler (enqueues due triggers), executor (signs execute txs),
  indexer (ingests strategy events).

## Development

```bash
pnpm install
pnpm --filter client dev        # builder UI on http://localhost:5173
pnpm -r check                   # typecheck everything
pnpm --filter client test      # client unit tests
pnpm --filter client smoke     # headless browser smoke (needs playwright chromium)
```

`AGENTS.md` documents conventions for coding agents, including the vendored
Effect source in `repos/effect` and the Schema patterns in `agent-patterns/`.
