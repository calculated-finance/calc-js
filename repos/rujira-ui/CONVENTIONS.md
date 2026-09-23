# Conventions

This document describes the coding conventions, style, and quality gates observed in this repo. It is intended to be used by automated merge request review.

**Scope**
- Applies to all packages under `packages/` and root tooling unless a package overrides a rule.

**Code Placement**
- Presentation and interaction primitives (components, hooks, wallet UX) belong in `packages/rujira.ui`.
- Protocol/domain logic (assets, tx messages, addresses, signers, formatting helpers) belongs in `packages/rujira.js`.
- App-specific business logic belongs in `packages/main/src` (e.g. `main/services`), never in the shared libraries.
- Keep workspace imports explicit — import from `rujira.ui` / `rujira.js`, not deep relative paths into other packages.

**Repo Structure**
- `packages/main`: main app (React + Vite + Relay + SCSS).
- `packages/landing`: marketing/landing app (React + Vite + SCSS).
- `packages/docs`: component/docs app (React + Vite + SCSS).
- `packages/rujira.ui`: shared UI library, SCSS utilities, i18n, and components.
- `packages/rujira.js`: shared JS/TS library.

**Tooling**
- Node tooling uses `pnpm` with a monorepo workspace (`pnpm-workspace.yaml`).
- Build tool is Vite (`vite.config.ts` per app).
- TypeScript is the primary language across packages.
- React 18 is used across UI apps and UI library.
- Relay is used in `packages/main` for GraphQL data.

**Formatting (Prettier)**
- Prettier is configured at repo root in `.prettierrc`.
- Required formatting:
- `tabWidth: 2`
- `semi: true`
- `singleQuote: false` (double quotes)
- `trailingComma: es5`
- `bracketSameLine: true`
- Formatting is expected for TypeScript, TSX, JS, JSON, and SCSS.
- Format the whole repo with `pnpm exec prettier --write .` (or pass specific paths to scope it).

**Linting (ESLint)**
- ESLint is used in `packages/main`, `packages/landing`, `packages/docs`, `packages/rujira.ui`, `packages/rujira.js`.
- Common baseline:
- `eslint:recommended`
- `plugin:@typescript-eslint/recommended`
- `plugin:react-hooks/recommended` for React apps (landing/docs/main).
- `eslint-plugin-react-refresh` used in React apps with `react-refresh/only-export-components: warn`.
- `eslint-plugin-i18next-no-undefined-translation-keys` is enforced in `packages/main` and `packages/rujira.ui` to validate translation keys.
- Lint scripts:
- `packages/main`: `eslint . --ext ts,tsx --max-warnings 0`
- `packages/landing`: `eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0`
- `packages/docs`: `eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0`

**TypeScript**
- All UI packages target `ES2022` and use `moduleResolution: "bundler"` with `jsx: "react-jsx"`.
- `packages/rujira.js` uses `moduleResolution: "node"` and emits to `./lib/esm`.
- Strict type checking is enabled across packages:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`
- `noEmit: true` for app packages; libraries emit via `tsc -b`.

**React Conventions**
- Functional components with hooks are the default.
- Hooks from React and Relay are widely used; avoid class components.
- Component files are generally PascalCase (`FooBar.tsx`) and colocated with feature folders (e.g. `packages/main/src/strategies/components/`).
- Hook files and exports follow `useX` naming (`useQueryParam`, `useLocalStorage`, `useWindowSize`).
- Prefer functional style:
- Favor pure functions and declarative data flow.
- Avoid side effects in render paths; isolate effects in hooks.

**Immutability**
- Treat state and props as immutable; never mutate arrays/objects in place.
- Prefer `map`/`filter`/`reduce` and object/array spreads over mutating methods like `push`, `splice`, `sort` (unless copying first).
- When updating nested structures, create new objects at each modified level.

**GraphQL and Relay (packages/main)**
- GraphQL queries/fragments/subscriptions are defined with `graphql` template literals in `.ts`/`.tsx` files.
- Relay config is in [`packages/main/package.json`](packages/main/package.json) under `"relay"`.
- Schema lives at [`packages/main/data/schema.graphql`](packages/main/data/schema.graphql).
- Generated artifacts live at `packages/main/src/**/__generated__/*.graphql.ts`; do not edit by hand.
- Regenerate with `cd packages/main && pnpm run relay`. The `relay` script clears existing `__generated__` directories before compiling.
- The main app build also validates/fetches the schema and runs Relay generation during its Vite flow (see `packages/main/vite.config.ts`).
- When changing GraphQL operations, commit the source `graphql` tag changes and the regenerated `__generated__` files together.

**i18n Conventions**
- Translations are stored in `packages/rujira.ui/src/i18n/locales/<lang>/<namespace>.json`.
- Translation keys must be string literals and exist in the namespace mapping.
- Namespace mapping is defined in `packages/rujira.ui/namespaceMapping.cjs`.
- `packages/main` applies namespace-specific linting rules by folder (e.g. `src/swap/**` uses the `swap` namespace).

**Styling and SCSS**
- Styling is primarily SCSS with `@import`-based structure.
- Global SCSS variables live in `packages/rujira.ui/src/scss/base/_variables.scss`.
- Base utilities and component styles are defined in `packages/rujira.ui/src/scss` and imported by apps.
- `packages/main/src/index.scss` imports feature-level partials per domain (e.g. `swap`, `trade`, `portfolio`).
- Class naming follows a BEM-like pattern (`block__element--modifier`) mixed with utility classes (e.g. `fs-16`, `fw-400`, `color-grey`, `col-8`).

**Generated and Vendor Code**
- Do not manually edit `__generated__` GraphQL files.
- `packages/main` has a postinstall script that copies TradingView charting library bundles into `public/`.
- Keep vendor assets and generated artifacts out of manual edits unless explicitly required.

**Quality Gates for MR Review**
- Code must pass TypeScript strict mode without new errors.
- ESLint must pass with zero warnings where configured (`--max-warnings 0`).
- Prettier formatting must match `.prettierrc` settings.
- No new unused locals or parameters.
- React hooks rules must be respected (no conditional hooks, proper deps).
- GraphQL changes must update the corresponding Relay `__generated__` files.
- i18n keys must be string literals and present in the mapped namespace JSON.
- Avoid editing generated or vendor files unless the change is intentional and documented.
