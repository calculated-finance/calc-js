# Architecture

## Overview

Rujira UI is a DeFi trading platform built on THORChain. It provides cross-chain swaps, an on-chain orderbook (FIN), lending/borrowing, automated strategies, index vaults, and portfolio management — all unified under a single React SPA with multi-chain wallet support.

The codebase is a **pnpm monorepo** with five packages, two shared libraries, and vendored CosmJS forks.

```
rujira-ui/
├── packages/
│   ├── main/             # Primary trading application (React + Vite + Relay)
│   ├── landing/          # Marketing landing page
│   ├── docs/             # Component documentation & design system
│   ├── rujira.ui/        # Shared UI component library
│   ├── rujira.js/        # Shared blockchain/domain logic library
│   ├── trading-view/     # TradingView charting (git submodule)
│   └── vendor/
│       ├── cosmjs/       # Vendored CosmJS fork
│       └── cosmjs-types/ # Vendored CosmJS types
├── pnpm-workspace.yaml
└── package.json
```

---

## Monorepo Structure

### Packages

| Package | Type | Purpose | Key Dependencies |
|---------|------|---------|------------------|
| `rujira-main` | Application | Trading platform SPA | Relay, Absinthe, Vultisig SDK, ethers, cosmjs, bitcoinjs-lib |
| `rujira-landing` | Application | Marketing site | rujira.ui, motion |
| `rujira-docs` | Application | Component showcase | rujira.ui, rujira.js, prism-react-renderer |
| `rujira.ui` | Library (ESM+CJS) | React components, hooks, i18n, wallet providers, SCSS | i18next, motion, wallet SDKs |
| `rujira.js` | Library (ESM+CJS) | Signers, message builders, domain types, CCL | cosmjs, ethers, bitcoinjs-lib, ton, tronweb, viem, xrpl |

### Workspace Configuration

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'packages/vendor/cosmjs/packages/*'
  - 'packages/vendor/cosmjs-types'
```

Shared libraries are referenced as `workspace:*` in consuming packages. Changes to `rujira.ui` or `rujira.js` affect all apps.

### Build Tooling

- **Bundler:** Vite 5.2 (apps), tsc (libraries)
- **TypeScript:** 5.5.4 — strict mode across all packages (`strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`)
- **Linting:** ESLint 8.57 with `--max-warnings 0` (zero-warnings policy)
- **Formatting:** Prettier 3.3 (double quotes, 2-space indent, trailing commas, bracketSameLine)
- **Package Manager:** pnpm with `protobufjs: 8.0.0` override

---

## Package: `rujira-main` (Primary App)

### Bootstrapping & Entry Point

**`src/main.tsx`** renders the app into `#root` inside `<StrictMode>`. Initialization begins with `initEccLib(ecc)` for secp256k1 support.

The app is wrapped in 12 context providers composed via `ContextWrapper`, which uses `reduceRight` to nest them:

```
BrowserRouter
 └─ I18nProvider
     └─ RelayContext                    (GraphQL environment)
         └─ AccountsContext             (wallet connections)
             └─ NotificationContext     (browser push notifications)
                 └─ FavoritesContext    (favorite trading pairs)
                     └─ AccountDataContext          (account data loading)
                         └─ PendingDepositStorageContext  (localStorage deposits)
                             └─ PendingDepositLoadedContext (queried deposit status)
                                 └─ VultisigProvider       (Vultisig SDK)
                                     └─ GlobalModal        (portal-based modals)
                                         └─ BalanceSubscriptionProvider
                                             └─ <Wrapper> → <ErrorBoundary> → <Header> + <Pages>
```

**`Wrapper`** applies the `rujira--dark` CSS class for dark-themed routes (`/`, `/leaderboard`, `/merge`, `/switch`, `/ecosystem`), renders the `<Footer>`, and provides `<TxButtonTip>`.

**`ErrorBoundary`** is a class component that catches render errors and shows a fallback UI with the Header and error message.

### Routing

**`src/Gate.tsx`** defines the `route()` helper and `Link` component.

#### Route Table

| Path | Component | Notes |
|------|-----------|-------|
| `/` | `Home` | Landing/marketing |
| `/connect` | `Connect` | Wallet connection |
| `/swap` | redirect | Redirects to `/swap/ETH/BTC` |
| `/swap/:from?/:to?` | `Swap` | Cross-chain swaps |
| `/trade` | `TradeMarkets` | Market listing |
| `/trade/:base/:quote` | `Trade` | Orderbook for pair |
| `/borrow` | `Borrow` | Lending interface |
| `/portfolio/*` | `Portfolio` | Account dashboard (sub-routes) |
| `/strategies` | `Strategies` | Strategy listing |
| `/strategies/:category/:type/:assets` | `Strategy` | Strategy detail |
| `/strategies/:category/:assets` | `Strategy` | Strategy detail (alt) |
| `/index` | `Indexes` | Index vault listing |
| `/index/*` | `Index` | Index detail |
| `/merge/:asset?` | `Merge` | Token merging |
| `/ecosystem/:tab?` | `Ecosystem` | Ecosystem overview |
| `/leaderboard` | `Leaderboard` | Trading leaderboard |
| `/thorchain/:asset/TOR` | `TorChart` | THORChain asset chart |
| `/developer/deployment` | `Deployment` | Developer tools |
| `/developer/contract/:address` | `ContractPage` | Contract inspector |
| `/privacypolicy`, `/tou`, `/support` | Static pages | Legal/support |
| `*` | `NotFound` | 404 fallback |

#### Route Gating

Routes are controlled by environment variables:

- `VITE_ROUTES_ENABLED` — comma-separated whitelist. Combined with base routes (`/`, `ecosystem`, `portfolio`) that are always available.
- `VITE_ROUTES_DISABLED` — comma-separated blacklist. Disabled routes show a "Coming Soon..." tooltip on the `Link` component.

#### Multi-Language URLs

URLs are prefixed with a locale segment: `/en/swap`, `/de/swap`, etc.

- `I18nProvider` wraps routes with a `<Lang>` component that extracts the locale from the URL
- `useLocale()` hook provides `locale`, `localePrefix`, and `toRoot()` for locale-aware navigation
- `SUPPORTED_LANGUAGE_PATTERN` regex from `rujira.ui` matches valid locale prefixes
- The custom `Link` component applies `toRoot()` to all `to` props automatically

### Data Layer (Relay + GraphQL)

**`src/services/relay.tsx`** configures the Relay environment.

#### Transport Stack

```
React Component (useFragment, useLazyLoadQuery, useSubscription)
    │
    ▼
Relay Environment
    ├── Network.create(fetcher, subscriber)
    │       │
    │       ├── fetcher: HTTP POST to VITE_API
    │       └── subscriber: Absinthe socket (WebSocket)
    │
    └── Store (RecordSource)
```

#### WebSocket Integration

Real-time data flows through **Phoenix WebSockets** via `@absinthe/socket`:

```typescript
// Phoenix socket connects to VITE_SOCKET/socket with API key auth
phoenixSocket = new PhoenixSocket(VITE_SOCKET + "/socket", {
  params: { token: VITE_API_KEY }
});
conn = socket.create(phoenixSocket);
```

`@absinthe/socket-relay` adapts the Phoenix connection into Relay-compatible `fetcher` and `subscriber` functions.

#### BigInt Transformation

All GraphQL responses pass through `transformBigInts()`, which recursively converts numeric strings matching `/^\d+$/` to JavaScript `BigInt` values. This enables native BigInt handling for the `Bigint` custom scalar.

#### Custom Scalar Types

| Scalar | TypeScript Type | Usage |
|--------|----------------|-------|
| `Address` | `string` | Wallet/contract addresses |
| `AssetString` | `string` | Asset identifiers (e.g., `BTC.BTC`) |
| `Bigint` | `bigint` | Financial amounts, balances, prices |

#### Schema & Relay Compiler

- Schema: `packages/main/data/schema.graphql`
- Generated types: `__generated__/` directories (never edit manually)
- Regenerate: `pnpm run relay` (deletes `__generated__/` dirs, then runs `relay-compiler`)

### Subscriptions

**`src/services/useNodeSubscription.tsx`** provides two subscription hooks:

| Hook | Purpose | Variables |
|------|---------|-----------|
| `useNodeSubscription` | Subscribe to updates for a single Relay node by ID | `{ id }` |
| `useEdgeSubscription` | Subscribe to new edges in a connection (prefix-based) | `{ prefix }` |

#### Key Subscription Topics

| Subscription | Scope | Purpose |
|--------------|-------|---------|
| `finOrderUpdated` | owner | Order creation/modification |
| `finOrderFilled` | contract, side, price, owner | Order fills |
| `finRangeUpdated` | owner | Range position updates |
| `finRangeClosed` | owner | Range closures |
| `perpsAccountUpdated` | contract, owner | Perps position changes |
| `stakingAccountUpdated` | owner | Staking reward allocations |
| `balances` | addresses[] | Multi-chain balance updates |
| `autoInstanceCreated` | owner | Workflow automation instances |
| `mimirUpdated` | global | THORChain Mimir parameter changes |
| `node` | id | Single node update |
| `edge` | prefix | Connection edge streaming |

### State Management

All state is managed through React Context providers (no Redux/Zustand). Relay handles server-state; contexts handle client-state and coordination.

| Context | File | Purpose | Storage |
|---------|------|---------|---------|
| `AccountsContext` | `services/accounts.tsx` | Multi-chain wallet connections, address tracking, provider lifecycle | localStorage (provider keys, selected account) |
| `AccountDataContext` | `services/accountData.tsx` | Preloaded account data via Relay (balances, orders, positions) | Relay store |
| `PendingDepositStorageContext` | `services/deposits.tsx` | Track pending cross-chain deposits | localStorage (`rujira-pending-deposits-{MODE}`) |
| `PendingDepositLoadedContext` | `services/deposits.tsx` | Query and subscribe to deposit status (pending/succeeded/refunded/failed) | Relay store |
| `FavoritesContext` | `services/favorites.tsx` | User's favorite trading pairs (base64-encoded IDs) | localStorage (`rujira-favorites`) |
| `NotificationContext` | `services/notifcation.tsx` | Browser push notification permission and dispatch | localStorage (`rujira-push-dontshow`) |
| `QueryClient` | `services/queryClient.tsx` | CosmJS query client for THORChain RPC (`rpc.rujira.network`) | Singleton |
| `BalanceSubscriptionProvider` | `common/components/Balance.tsx` | Real-time balance subscriptions across connected wallets | Relay subscription |

#### AccountsContext Key Methods

- `connect(provider)` — Connect a wallet provider, discover addresses
- `select(account)` — Switch active account
- `disconnect(provider)` — Remove a provider's addresses
- `disconnectAll()` — Clear all connections
- `signer(address)` — Get the `Signer` instance for an address
- Auto-reconnect on mount via `Promise.allSettled` over stored provider keys
- `onChange()` callbacks for provider account/chain changes

### Feature Modules

Each feature module is self-contained with its own components, hooks, styles, and Relay fragments.

| Module | Entry | Purpose | Data Pattern |
|--------|-------|---------|-------------|
| `swap` | `Swap.tsx` | Cross-chain token swaps | Relay query + `SwapContext` |
| `trade` | `Trade.tsx`, `TradeMarkets.tsx` | On-chain orderbook (FIN) | Relay query + subscriptions (orders, fills, ranges) |
| `borrow` | `Borrow.tsx` | Lending and borrowing | Relay query |
| `portfolio` | `Portfolio.tsx` | Account dashboard with sub-routes | Preloaded account data fragments |
| `strategies` | `Strategies.tsx`, `Strategy.tsx` | Automated strategy listing and detail | Relay query |
| `merge` | `Merge.tsx` | Token merging/unwrapping | Relay query |
| `home` | `Home.tsx` | Landing page with feature carousel | Relay query |
| `index` | `Index.tsx`, `Indexes.tsx` | Index vault listing and detail | Relay query + chart |
| `leagues` | `Leaderboard.tsx` | Trading competition leaderboard | Relay query |
| `ecosystem` | `Ecosystem.tsx` | Partner and ecosystem overview | Relay query |
| `tor` | `TorChart.tsx` | THORChain asset price charts | Relay query + chart |
| `developer` | `Contract.tsx`, `Deployment.tsx` | Developer tools and contract inspector | Relay query |
| `chart` | `components/` | TradingView chart integration | `RelayChartDataProvider` |

**Common patterns across modules:**
- `<TranslationProvider namespace="moduleName">` wrapping for i18n scoping
- Relay fragments to declare data dependencies
- `<Suspense>` for loading states
- `usePreloadedAccountData()` for account-specific data

### Charting

**`src/services/RelayChartDataProvider.ts`** implements TradingView's `IBasicDataFeed` interface:

- `getBars()` — Fetches candle history via Relay query. Uses FinPair IDs (base64-encoded: `FinPair:{contract}`).
- `subscribeBars()` — Subscribes to live candle updates via edge subscriptions. Prefix format: `FinCandle:{contract}/{resolution}`.
- Returns `{ open, close, high, low, volume, time }` bar objects.

The **TradingView charting library** is a git submodule at `packages/trading-view/`. Post-install copies bundles to `public/charting-library/`.

### SEO Middleware

**`middleware.ts`** intercepts requests from social media crawlers (Twitter, Facebook, LinkedIn, Pinterest, Slack, etc.) and returns synthetic HTML with Open Graph and Twitter Card meta tags. Non-crawler requests pass through to the SPA.

SEO data is defined per route with placeholder substitution for dynamic segments (e.g., `[1]` = first path segment for `/swap/*`, `/trade/*`).

### Build & Bundling

**`vite.config.ts`** configures 10 plugins:

| Plugin | Purpose |
|--------|---------|
| `wasm()` | WASM module support |
| `vultisigSdkShim()` | Polyfill handling for Vultisig SDK |
| `nodePolyfills()` | Browser polyfills for Buffer, global, process |
| `inject()` | Auto-inject Buffer import |
| `react()` | React Fast Refresh (SWC) |
| `relay` | Relay compiler integration |
| `dsv()` | CSV/TSV data loading |
| `visualizer()` | Bundle analysis |
| `sentryVitePlugin()` | Sentry source maps |
| `verifySchema()` | Fetches GraphQL schema at build time |

#### Chunk Splitting

| Chunk | Contents |
|-------|----------|
| `vultisig.js` | `@vultisig/sdk` |
| `trustwallet.js` | `@trustwallet/wallet-core`, `protobufjs` |
| `cosmjs.js` | `cosmjs` packages |
| `charts.js` | Charting dependencies |
| `ethers.js` | `viem`, `ethers` |
| `rujira.js` | `rujira.ui`, `rujira.js` |
| `vendor.js` | All other `node_modules` |

#### Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_API` | Yes | GraphQL API endpoint |
| `VITE_SOCKET` | Yes | WebSocket endpoint |
| `VITE_API_KEY` | Yes | WebSocket authentication token |
| `VITE_THORCHAIN_MODULE_ADDRESS` | Yes | THORChain module contract address |
| `VITE_SENTRY_DSN` | No | Sentry error tracking DSN |
| `VITE_ROUTES_ENABLED` | No | Comma-separated route whitelist |
| `VITE_ROUTES_DISABLED` | No | Comma-separated route blacklist |

**Build requires 16GB Node heap:** `NODE_OPTIONS=--max-old-space-size=16384`

---

## Package: `rujira.ui` (Shared UI Library)

Published as both ESM and CJS. Exports components, hooks, contexts, i18n, helpers, wallet providers, and SCSS.

### Component Inventory

| Category | Components | Files |
|----------|-----------|-------|
| Balance | `OmniBalance` | `components/balance/` |
| Bridges | `BuyModal`, `DepositModal` | `components/bridges/` |
| Buttons | `Button` (polymorphic, motion-enabled), `Popout`, `TxButton` | `components/buttons/` |
| Cards | `Card`, `GradientCard`, `ShareCard` | `components/cards/` |
| Chart | `RangeLiquidityChart` | `components/chart/` |
| Footer | `Footer` | `components/footer/` |
| Header | `Header`, `Accounts`, `Pending`, `QuickLauncher`, `ResolveLink` | `components/header/` |
| Icons | `IconDenom`, `Icons`, `NetworkIcon`, `NetworkIcons`, `WalletIcons` | `components/icons/` |
| Inputs | `Checkbox`, `DecimalInput`, `DenomInput`, `Input`, `Numeric`, `Radio`, `Select`, `SwapSelect`, `Textarea`, `Toggle` | `components/inputs/` |
| Loader | `Loader` | `components/loader/` |
| Logos | `RujiraLogo` | `components/logos/` |
| Notices | `Warning` | `components/notices/` |
| Numbers | `Decimal`, `Fiat` | `components/numbers/` |
| Pagination | `Pagination` | `components/pagination/` |
| Progress | `Progress` | `components/progress/` |
| Slider | `Slider` | `components/slider/` |
| Table | `SortItem` | `components/table/` |

### Hooks

| Hook | File | Purpose |
|------|------|---------|
| `useClickOutside` | `hooks/useClickOutside.ts` | Detect clicks outside a ref element |
| `useEventCallback` | `hooks/useEventCallback.ts` | Stable callback ref (avoids stale closures) |
| `useEventListener` | `hooks/useEventListener.ts` | Declarative event listener with cleanup |
| `useIsTouchDevice` | `hooks/useIsTouchDevice.ts` | Detect touch-capable devices |
| `useIsomorphicLayoutEffect` | `hooks/useIsomorphicLayoutEffect.ts` | SSR-safe `useLayoutEffect` |
| `useLocalStorage` | `hooks/useLocalStorage.ts` | Persistent state backed by localStorage |
| `useQueryParam` | `hooks/useQueryParam.ts` | Read/write URL query parameters |
| `useWindowSize` | `hooks/useWindowSize.ts` | Reactive window dimensions |

### Context: GlobalModal

**`context/GlobalModal.tsx`** provides a portal-based modal system:

- Renders into `#modal` DOM element via `ReactDOM.createPortal`
- `showModal()` / `hideModal()` methods via `GlobalModalContext`
- Entrance/exit animations via `motion/react`
- Scroll locking (`document.body.overflow`)
- Supports title, confirm button, background close, custom className
- i18n-aware labels for close/cancel/confirm

### i18n System

**`i18n/config.ts`** initializes i18next with react-i18next.

| Setting | Value |
|---------|-------|
| Supported languages | `en` (English), `de` (German) |
| Detection chain | localStorage -> browser language -> `en` fallback |
| Namespaces | swap, trade, common, strategies, portfolio, index, borrow, header, ecosystem, merge, leagues |
| Default namespace | `swap` |

**Architecture:**

```
I18nProvider (i18n/I18nProvider.tsx)
  ├── LocaleContext: { locale, localePrefix, toRoot() }
  ├── useLocale() hook: access locale context
  └── <Lang> component: extracts locale from URL, sets i18next language

TranslationProvider (i18n/TranslationProvider.tsx)
  └── Provides default namespace to nested useTranslation() calls

Locale files: i18n/locales/{en,de}/{namespace}.json
```

ESLint enforces that translation keys exist in the correct namespace. In `packages/main`, rules are scoped by feature folder (e.g., `src/swap/**` uses the `swap` namespace).

### Wallet Integration Layer

**`wallets/providers/`** implements a registry pattern for multi-wallet, multi-chain support.

#### Provider Registry

`Provider.signer(key: Provider.Key)` returns the appropriate `Signer` instance. Providers are detected via EIP-6963 events (modern EVM wallets) or window globals (traditional extensions).

#### Supported Wallet Providers

| Provider | Key | Chains | Detection |
|----------|-----|--------|-----------|
| Vultisig | `"Vultisig"` | 17 networks (multi-chain) | Vultisig SDK |
| Vulticonnect | `"Vulticonnect"` | XRP, BTC, BCH, DOGE, LTC, THOR, TRON, Cosmos, EVM | `window.vultisig` |
| Keplr | `"Keplr"` | Cosmos, EVM, BTC | `window.keplr` |
| Leap | `"Leap"` | Cosmos, EVM | `window.leap` |
| MetaMask | `"Metamask"` | EVM | EIP-6963 (`io.metamask`) |
| OKX | `"Okx"` | Cosmos, EVM, BTC | `window.okxwallet` |
| CTRL/XDEFI | `"Ctrl"` | Cosmos, EVM, UTXO | `window.xfi` |
| Station | `"Station"` | Cosmos | `window.station` |
| Trust | `"Trust"` | EVM | EIP-6963 |
| Rabby | `"Rabby"` | EVM | EIP-6963 |
| Brave | `"Brave"` | EVM | EIP-6963 |
| Coinbase | `"Coinbase"` | EVM | EIP-6963 / provider |
| DaoDao | `"DaoDao"` | Cosmos | `@dao-dao/cosmiframe` |
| Ledger | `"Ledger"` | BTC | `@ledgerhq/device-management-kit` |
| TON Connect | `"Ton"` | TON | `@tonconnect/sdk` |
| Tronlink | `"Tronlink"` | TRON | `window.tronLink` |
| Xaman | `"Xaman"` | XRP | `xumm` SDK |

#### Provider Composition

Multi-chain providers compose smaller adapters:

```typescript
// Keplr combines Cosmos + EVM adapters
class KeplrAdapter {
  private c: CosmosAdapter;     // Cosmos chains
  constructor(
    private e: Eip6963Adapter,  // EVM chains
    k: () => Keplr
  ) {}
}
```

#### Address-Based Chain Detection

**`wallets/providers/utils.ts`** routes operations based on address format:

| Prefix | Chain Type |
|--------|-----------|
| `0x` | EVM (ETH, AVAX, BSC, BASE) |
| `bc1` | BTC |
| `bitcoincash:` or `q`/`p` | BCH |
| `D` | DOGE |
| `L` or `ltc1` | LTC |
| `r` or `X` | XRP |
| `T` | TRON |
| `thor`/`sthor` | THORChain |
| Other (bech32) | Cosmos |

#### Storage

**`wallets/storage.ts`** persists wallet connection state to `window.localStorage` for auto-reconnect across sessions.

### Styling

#### SCSS Architecture

```
src/scss/
├── index.scss              # Master import (46 imports)
├── base/
│   ├── _normalize.scss     # CSS reset
│   ├── _variables.scss     # Design tokens
│   ├── _typography.scss    # Font rules
│   ├── _flex.scss          # Flexbox utilities
│   ├── _colors.scss        # Color utility classes
│   ├── _display.scss       # Display utilities
│   ├── _spacing.scss       # Margin/padding utilities
│   └── _filters.scss       # CSS filter utilities
├── styled/                 # Shared component patterns (card, table, tabs, tag, etc.)
└── components/             # Per-component styles (button, header, input, modal, etc.)
```

#### Design Tokens

**Breakpoints:** xs(420), sm(576), md(768), lg(1024), xl(1440), xxl(1680), hd(1920), ultra(2560)

**Colors:**
- Primary: `#D615EB` (pink), `#8436F5` (purple), `#5A2AD1`, `#070E50`
- Secondary: `#60fbd0` (teal/success), `#1e92e6` (blue), `#f57c00` (orange/warning), `#e53935` (red/error)
- Neutrals: `#22242f` (dark), `#161721`, `#0c0a0f` (deep black), `#71909F` (grey)

**Naming:** BEM-like for components mixed with utility classes (`fs-16`, `fw-400`, `color-grey`, `col-8`, `ai-c`, `jc-c`, `dir-c`, `mt-2`, `w-10`).

### Helpers

**`helpers/index.ts`** provides utility functions:

| Function | Purpose |
|----------|---------|
| `nFormatter(bigint, digits, decimals)` | Format large numbers with k/M/B/T/P/E suffixes |
| `compress(string)` | Convert leading zeros to subscript notation (e.g., 0.0001 -> 0\_04\_1) |
| `floatToSubscript()` | Format small floats with subscript compression |
| `bigIntToDecimalString()` | Safe bigint-to-float string conversion |
| `formatApr(apr)` / `classApr(apr)` | Format APR values with status (AVAILABLE, NOT_APPLICABLE, SOON) |
| `isEmpty(obj)` | Check if object has properties |
| `uuidv4()` | Generate UUID v4 |

**`helpers/number.ts`** extends `Number.prototype.toLocaleDecimal()` for locale-aware number formatting.

---

## Package: `rujira.js` (Domain Logic Library)

Core blockchain interaction library. Chain-agnostic interfaces with chain-specific implementations.

### Core Domain Models

#### Network

19 supported blockchain networks:

```typescript
type Network =
  | "AVAX" | "BASE" | "BCH" | "BSC" | "BTC" | "DOGE" | "ETH"
  | "GAIA" | "KUJI" | "LTC" | "NOBLE" | "OSMO" | "SOL"
  | "TERRA" | "TERRA2" | "THOR" | "TON" | "TRON" | "XRP";
```

`gasToken(network)` returns `{ symbol, decimals }` for each network's native gas token.

#### Asset

```typescript
interface Asset {
  type: "LAYER_1" | "SECURED" | "NATIVE" | "SYNTH";
  chain: Network;
  asset: string;
  price?: { current: bigint | null; changeDay?: number | null } | null;
  metadata: { decimals: number; symbol: string };
  variants?: {
    layer1?: Asset | null;
    secured?: Asset | null;
    native?: { denom: string } | null;
  } | null;
}
```

#### Account

```typescript
type Address = string;
interface Account { address: Address; network: Network; }
interface BalanceAccount { address: Address; balance: bigint; asset: Asset; valueUsd: bigint; }
type Balance = { asset: Asset; balance: bigint; accounts: BalanceAccount[]; valueUsd: bigint; }
```

#### AccountProvider Interface

```typescript
interface AccountProvider<P> {
  accounts: { address: Address; provider: P }[] | undefined | null;
  selected?: { address: Address; provider: P };
  signer: (address: Address) => Signer;
  select: (account?) => void;
  connect: (provider: P) => ConnectionResponse;
  disconnect: (provider: P) => void;
  disconnectAll: () => void;
  isAvaialable: (provider: P) => boolean;
  isLoading?: boolean;
}
```

### Signer Interface

The core abstraction for all blockchain interactions:

```typescript
interface Signer {
  connect(): Promise<Address[]>;
  simulate(tx: Msg): Promise<Simulation>;
  signAndBroadcast(simulation: Simulation, tx: Msg): Promise<TxResult>;
  onChange?: (cb: () => void) => void;
  disconnect?: () => void;
  isAvailable(): boolean;
  networks(): Network[];
}

interface Simulation {
  symbol: string;      // Gas token symbol
  decimals: number;    // Token decimals
  amount: bigint;      // Gas fee in base units
  gas: bigint;         // Gas units estimate
}

type TxResult = {
  network: Network;
  address: string;
  txHash: string;
  deposited?: { amount: bigint; symbol: string };
  label?: string;
};
```

### Message Builders

**`src/msgs/msg.ts`** defines the `Msg` interface — a polymorphic transaction message that can be converted to any chain's native format:

```typescript
interface Msg {
  account: Account;

  toCosmosTx(): Promise<{ msgs: EncodeObject[]; memo: string }>;
  toEvmTxRequest(): Promise<{ tx: TransactionRequest; erc20?: ERC20Allowance }>;
  toPsbt(utxos: Utxo[]): Promise<{ psbt: Psbt; fee: bigint; amount: bigint }>;
  toXrpPayment(): Promise<XrpPayment>;
  toTronTx(tronWeb: TronWeb): Promise<TronTx>;

  withQueryClient?(q: QueryClient & ThorchainExtension): void;
  inboundAddress?(network: Network): Promise<InboundAddress>;
  toDeposit?(): { amount: bigint; symbol: string };
}
```

#### Message Types

| Message | File | Purpose |
|---------|------|---------|
| `MsgSwap` | `msgs/swap.ts` | Asset swaps via THORChain memo encoding |
| `MsgDeposit` | `msgs/deposit.ts` | Deposits to THORChain inbound addresses |
| `MsgSend` | `msgs/send.ts` | Direct token transfers |
| `MsgExecuteContract` | `msgs/exec.ts` | Smart contract execution |
| `MsgAddLiquidity` | `msgs/add-liquidity.ts` | Liquidity provision |
| `MsgWasm` | `msgs/wasm.ts` | CosmWasm contract calls |
| `MsgIbcTransfer` | `msgs/ibc-transfer.ts` | IBC cross-chain transfers |
| `MsgIbcDeposit` | `msgs/ibc-deposit.ts` | IBC-based deposits |
| `MsgAuthz` | `msgs/authz.ts` | Authorization/delegation |
| `MsgErc20` | `msgs/erc20.ts` | ERC20 token interactions |
| `MsgSecure` | `msgs/secure.ts` | Secured asset operations |
| `MsgSwitch` | `msgs/switch.ts` | Asset switching |
| `MsgMulti` | `msgs/multi.ts` | Multi-message batching |

### Transaction Flow

```
User Action (e.g., "Swap ETH → BTC")
    │
    ▼
Create Message (e.g., MsgSwap)
    │
    ▼
Detect Chain Type from account.address
    ├── 0x...         → EVM
    ├── bc1...        → UTXO (BTC)
    ├── thor.../cosmos → Cosmos
    ├── T...          → TRON
    └── r.../X...     → XRP
    │
    ▼
Route to Chain-Specific Signer
    │
    ▼
┌─────────────────────────────────┐
│         SIMULATION              │
│                                 │
│  Cosmos: RPC simulate()        │
│  EVM:    eth_estimateGas       │
│  UTXO:   fee from tx size      │
│  TRON:   bandwidth calculation  │
│  XRP:    inbound gas rate       │
│                                 │
│  Returns: Simulation            │
│  { symbol, decimals,            │
│    amount (fee), gas }          │
└─────────────────────────────────┘
    │
    ▼
User Confirms (reviews fee)
    │
    ▼
┌─────────────────────────────────┐
│       SIGN & BROADCAST          │
│                                 │
│  Cosmos: signAndBroadcast()     │
│  EVM:    sendTransaction()      │
│  UTXO:   signPsbt() + broadcast│
│  TRON:   sign() + sendRawTx()   │
│  XRP:    submit via provider    │
│                                 │
│  Returns: TxResult              │
│  { network, address, txHash,    │
│    deposited? }                 │
└─────────────────────────────────┘
    │
    ▼
Track Deposit (PendingDepositStorageContext)
```

### Chain-Specific Signers

**`src/signers/`** contains three signer families:

#### Cosmos (`signers/cosmos/`)

The largest signer implementation (~414 files) supporting THORChain, Cosmos Hub, Osmosis, Kujira, and Noble.

| Module | Purpose |
|--------|---------|
| `client.ts` | RPC client for signing and broadcasting |
| `amino.ts` | Amino codec encoding (legacy) |
| `proto-signing.ts` | Protobuf direct signing + EIP-712 signing |
| `fee.ts` | Gas price calculation per chain |
| `queryclient.ts` | Query client for chain state |
| `rpc/` | Comet38Client, HttpBatchClient implementations |
| `modules/` | Auth, THORChain, and Tx query modules |
| `crypto/` | SHA, RIPEMD, hash utilities |
| `types/` | Protobuf type definitions (Cosmos SDK, CosmWasm, THORChain) |

#### EVM (`signers/evm/`)

Supports ETH, AVAX, BASE, BSC, and TRON.

**`router.ts`** interfaces with THORChain's Router contract:

```typescript
depositWithExpiry(
  vault: address,      // THORChain vault address
  asset: address,      // ERC20 token or 0x0 for native
  amount: uint256,     // Token amount
  memo: string,        // THORChain memo
  expiration: uint256  // Unix timestamp
)
```

Key features: ERC20 allowance checking, EIP-1559 vs legacy gas detection, native vs token transfer routing.

#### UTXO (`signers/utxo/`)

Supports BTC, BCH, DOGE, LTC via the `PsbtFactory` class.

```typescript
class PsbtFactory {
  buildPbst(account, utxos, amount, recipient, satsperbyte, memo?)
    → { psbt: Psbt, fee: bigint, amount: bigint }
}
```

Features: UTXO selection, dynamic fee calculation (148 bytes/input, 34 bytes/output), OP_RETURN memo encoding, change output handling, network-specific address formats (bech32, CashAddr for BCH).

### Curve Calculation Library (CCL)

**`src/ccl/`** implements range liquidity pricing curves for FIN range orders.

```typescript
// Abstract base: weight function defines the curve shape
abstract class Ccl {
  abstract weight(price: number): number;
  ask(price: number, spread: number): number;
  bid(price: number, spread: number): number;
}

// Two model implementations
class CclLinear extends Ccl { ... }
class CclQuadratic extends Ccl { ... }

// Distribution generator (matches Rust RangeOfferIter)
function generateCclDistribution(config: CclRangeConfig): CclDistribution;
```

`CclDistribution` produces ask/bid buckets with geometric (delta-based) price spacing, weights, and percentages.

### Utilities

| Module | File | Purpose |
|--------|------|---------|
| `bigint` | `bigint.ts` | `bigintToFixed()` (bigint to decimal string), `bigintMin()` |
| `prices` | `prices.ts` | `priceFormatter()` with scientific notation for small values |
| `errors` | `errors.ts` | `translateError()` (20+ pattern matches for user-friendly messages), `TxError`, `InsufficientAllowanceError` |
| `deposits` | `deposits.ts` | `PendingDeposit` interface, `DepositProvider` |
| `instantiate2` | `instantiate2.ts` | CosmWasm Instantiate2 address prediction |

---

## Package: `rujira-landing` (Marketing Site)

Lightweight marketing page using shared `rujira.ui` components (Header, Footer) with motion animations.

**Routes:** `/` (Home), `/whatisrujira`, `/whatisruji`, `/roadmap`, `/getinvolved`

No GraphQL, no wallet integration.

---

## Package: `rujira-docs` (Component Documentation)

Storybook-like component showcase with 40+ documentation routes covering layout primitives (breakpoints, colors, flexbox, spacing), all UI components, and hooks. Features live component examples with syntax highlighting via `prism-react-renderer`.

---

## Cross-Cutting Concerns

### Error Handling

| Layer | Mechanism | Location |
|-------|-----------|----------|
| React render errors | `ErrorBoundary` class component | `main.tsx` |
| Transaction errors | `TxError` class, `translateError()` (20+ regex patterns) | `rujira.js/errors.ts` |
| Allowance errors | `InsufficientAllowanceError` | `rujira.js/errors.ts` |
| User notifications | `react-hot-toast` with themed toasts | `main.tsx` (toast options) |
| GraphQL errors | `logGraphQLErrors()` logging | `services/relay.tsx` |
| Error tracking | Sentry integration (optional via `VITE_SENTRY_DSN`) | `services/sentry.ts` |

### Testing

- **Framework:** Vitest (configured in `rujira.js`)
- **Test command:** `pnpm run test` (recursive across workspaces)
- **Test files:** `*.test.ts` pattern (primarily in `rujira.js` — CCL, bigint, message builders)
- **No test infrastructure** in `main`, `landing`, or `docs` packages currently

### Deployment

- **Platform:** Vercel (configured in `vercel.json`)
- **Build:** TypeScript check + Vite build with 16GB heap
- **Version:** `__APP_VERSION__` set to `VERCEL_GIT_COMMIT_SHA`
- **SSH:** `vercel-ssh.sh` for private git dependencies (TradingView submodule)

### GraphQL Schema

**`packages/main/data/schema.graphql`** defines the full API surface.

#### Query Categories

| Category | Root Field | Purpose |
|----------|-----------|---------|
| Trading | `finV3` | FIN pairs, analytics, ranges |
| Staking | `staking` | Staking data |
| Yields | `bow` | BOW liquidity pools |
| Lending | `ghostCreditAccount` | Ghost Credit lending |
| Perpetuals | `perps` | Perpetuals pools |
| Merging | `merge` | Merge pools |
| Indexes | `index` | Index vaults |
| Vesting | `vesting` | Vesting contracts |
| Leagues | `league` | Trading competitions |
| Analytics | `analytics` | Performance metrics |
| THORChain | `thorchainV2` | THORChain queries |
| Deployment | `deployment` | CosmWasm deployment tools |
| Relay | `node(id)`, `nodes(ids)` | Standard Relay node fetching |

---

*This document describes the architecture as of 2026-03-31. For build commands and conventions, see [CLAUDE.md](../CLAUDE.md).*
