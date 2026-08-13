# Agent Notes

## Vendored reference repositories (`repos/`)

Use vendored repositories as read-only reference material when working with
related libraries. Prefer examples and patterns from vendored source code over
generated guesses or web search.

- `repos/effect` — the Effect-TS monorepo, vendored at the `effect@3.22.1`
  tag to match the version this workspace depends on. Do NOT reference the
  upstream `main` branch for API guidance: it tracks Effect 4.x, whose APIs
  differ from what this repo uses.
  - Library source: `repos/effect/packages/effect/src`
  - Real-world usage patterns: `repos/effect/packages/*/test`
- `repos/rujira-ui` — the Rujira web app (GitLab: thorchain/rujira-ui),
  vendored from `main`. Reference for how the official UI talks to FIN,
  staking, and the Rujira GraphQL indexer (`api.rujira.network/api/graphql` —
  the source of truth for FIN pair addresses; see `finV2`/`finV3` queries and
  `packages/main/data/schema.graphql`).
- `repos/calc-rs` — the CALC protocol CosmWasm contracts
  (github.com/calculated-finance/calc-rs), vendored at the `v2.0.0` tag
  (commit `dde324d3`), which is what the mainnet manager
  (`thor136rwqv...nu2qu`) speaks — verified by live smart query. This is the
  source of truth for contract execute/query/response shapes:
  - Generated TypeScript types for every message: `repos/calc-rs/calc.d.ts`
  - JSON Schemas per contract: `repos/calc-rs/contracts/{manager,scheduler,strategy}/schema/`
    (`raw/` holds per-message schemas: `execute.json`, `query.json`,
    `response_to_*.json`)
  - Compiled wasm + checksums: `repos/calc-rs/artifacts/`
  - NOTE: v2 models a strategy as a flat node graph (`nodes: Node[]`, each
    with `index` plus `next` or `on_success`/`on_failure`), not a nested
    action tree. Parts of `packages/domain/src/calc.ts` still model the
    pre-v2 shape (e.g. `StrategyConfig` expecting `{ strategy: { action } }`);
    check `calc.d.ts` before trusting the domain schemas for wire formats.
- Never import from `repos/**` in application code; dependencies come from
  npm via pnpm. The vendored tree exists purely for reading.

To update the vendored copy when the workspace's `effect` dependency is
bumped (replace the tag to match the new version):

```bash
git subtree pull --prefix=repos/effect https://github.com/Effect-TS/effect.git effect@<version> --squash
git subtree pull --prefix=repos/rujira-ui https://gitlab.com/thorchain/rujira-ui.git main --squash
git subtree pull --prefix=repos/calc-rs https://github.com/calculated-finance/calc-rs.git <tag> --squash
```

## Pattern references (`agent-patterns/`)

- `agent-patterns/effect-schema.md` — how to write Effect Schema code in
  this repo: codec model, filter-vs-transform (the clamp trap), decode/encode
  API choice, form integration, error message annotations, and a what-to-avoid
  list. Read it before adding or changing any schema.
