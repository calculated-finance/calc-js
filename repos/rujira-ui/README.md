# Rujira UI Monorepo

Rujira UI is a `pnpm` workspace monorepo containing the shared UI kit, shared chain/client library, the main app, docs, and landing site.

## Monorepo Structure

```text
.
├── packages/
│   ├── main/          # Main Rujira application
│   ├── rujira.ui/     # Shared UI components, hooks, wallet context, design primitives
│   ├── rujira.js/     # Shared chain/account/message utilities and protocol logic
│   ├── docs/          # rujira.ui docs + component playground
│   ├── landing/       # Marketing/landing site
│   └── trading-view/  # TradingView charting (git submodule, read-only)
├── package.json
├── pnpm-workspace.yaml
└── .prettierrc
```

## Package Roles

| Package | Purpose | Used By |
| --- | --- | --- |
| `packages/rujira.ui` | Shared React UI system: buttons, inputs, cards, icons, charts, hooks, i18n, wallet UI/context | `main`, `docs`, `landing` |
| `packages/rujira.js` | Shared TypeScript chain library: assets, addresses, signers, messages, network helpers, formatting utils | `main`, `rujira.ui` |
| `packages/main` | Main product app (Relay/GraphQL + trading/portfolio/strategies flows) | End users |
| `packages/docs` | Internal/external docs site for `rujira.ui` usage and examples | Developers |
| `packages/landing` | Public-facing landing pages | Public web |

### How `main` Consumes `rujira.ui` + `rujira.js`

`packages/main` imports both workspace libraries directly:

```ts
import { Button, DenomInput, TranslationProvider } from "rujira.ui";
import { Asset, MsgExecute, priceFormatter } from "rujira.js";
```

Typical division:

- `rujira.ui`: presentation + interaction primitives (components, hooks, wallet UX)
- `rujira.js`: protocol/domain logic (assets, tx messages, addresses, signers, formatting helpers)

## Tech Stack

- Package/workspace management: `pnpm` workspaces
- Runtime/toolchain: Node.js, pnpm (see `.tool-versions`)
- Language: TypeScript (strict mode enabled across packages)
- Frontend: React + Vite
- Styling: SCSS + utility/class conventions in `rujira.ui`
- Routing: `react-router-dom`
- Data layer in main app: GraphQL + Relay (`react-relay`, `relay-runtime`, `relay-compiler`)
- Testing: Vitest (`rujira.ui`, `rujira.js`)
- Quality: ESLint + Prettier
- Monitoring/build extras in main: Sentry Vite plugin, bundle visualizer

## Getting Started

```bash
pnpm install
```

Run apps:

```bash
# Main app
pnpm main

# Component docs
pnpm docs

# Landing site
pnpm landing
```

## Formatting and Consistency (Prettier)

This repo uses root `.prettierrc`:

- `tabWidth: 2`
- `semi: true`
- `singleQuote: false`
- `trailingComma: es5`
- `bracketSameLine: true`

Format everything from repo root:

```bash
pnpm exec prettier --write .
```

Format only changed files:

```bash
pnpm exec prettier --write README.md packages/main/src/**/*.{ts,tsx} packages/rujira.ui/src/**/*.{ts,tsx}
```

## Code Conventions Across Repo

- TypeScript first (`.ts`/`.tsx`) with `strict` compiler options.
- React component files use PascalCase (for example: `PositionSwap.tsx`, `CardComponent.tsx`).
- Hooks follow `useX` naming (`useQueryParam`, `useLocalStorage`, `useWindowSize`).
- Shared UI primitives should live in `rujira.ui`; business/protocol logic should live in `rujira.js` or `main/services`.
- Do not hand-edit Relay-generated files under `__generated__`.
- Keep imports explicit and workspace-local (`rujira.ui`, `rujira.js`) where possible.
- Keep code style aligned via Prettier before merge.

## GraphQL + Relay Workflow (`packages/main`)

`packages/main` is the GraphQL/Relay consumer package.

Key files:

- Relay config in [`packages/main/package.json`](packages/main/package.json) under `"relay"`.
- Schema file: [`packages/main/data/schema.graphql`](packages/main/data/schema.graphql)
- Generated artifacts: `packages/main/src/**/__generated__/*.graphql.ts`

When updating queries/fragments/subscriptions:

1. Edit GraphQL usage in `packages/main/src` (`graphql` tagged queries/fragments/subscriptions).
2. Regenerate artifacts:
   ```bash
   cd packages/main
   pnpm run relay
   ```
3. Commit both source changes and regenerated `__generated__` files together.

Notes:

- `relay` script clears existing `__generated__` directories before compiling.
- Main app build also validates/fetches schema and runs Relay generation during build flow (see `packages/main/vite.config.ts`).

## UI Documentation
You can view documentation on our UI and components here:
https://ui.rujira.network/install

## AI Documentation

- [CLAUDE.md](CLAUDE.md) — guidance for Claude Code agents working in this repo
- [CONVENTIONS.md](CONVENTIONS.md) — coding standards (Prettier, TypeScript, ESLint, React)
- [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) — setup and onboarding
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — deep architecture reference
- UI component docs: <https://ui.rujira.network/install>

Domains:

- LLM summary: <https://docs.rujira.network/llms.txt>
- Full docs: <https://docs.rujira.network/llms-full.txt>
