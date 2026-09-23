# Rujira UI — Junior Developer Guide

Welcome to the codebase. This document explains how everything fits together, using real examples from the code. Read it top to bottom the first time, then use it as a reference.

---

## Table of Contents

1. [What this app does](#1-what-this-app-does)
2. [The monorepo — three layers](#2-the-monorepo--three-layers)
3. [How the app starts up](#3-how-the-app-starts-up)
4. [Context providers — shared state without Redux](#4-context-providers--shared-state-without-redux)
5. [Routing — how pages work](#5-routing--how-pages-work)
6. [Feature modules — how a feature is structured](#6-feature-modules--how-a-feature-is-structured)
7. [Relay and GraphQL — where data comes from](#7-relay-and-graphql--where-data-comes-from)
8. [Real-time data — Phoenix WebSockets](#8-real-time-data--phoenix-websockets)
9. [Transactions — how a swap or deposit works](#9-transactions--how-a-swap-or-deposit-works)
10. [Wallet providers — connecting to a wallet](#10-wallet-providers--connecting-to-a-wallet)
11. [The shared UI library (rujira.ui)](#11-the-shared-ui-library-rujiraui)
12. [Styling — SCSS and utility classes](#12-styling--scss-and-utility-classes)
13. [i18n — translations](#13-i18n--translations)
14. [TypeScript rules you must follow](#14-typescript-rules-you-must-follow)
15. [Common tasks — where to start](#15-common-tasks--where-to-start)
16. [Learning resources](#16-learning-resources)

---

## 1. What this app does

Rujira UI is a DeFi (Decentralised Finance) trading platform built on top of **THORChain** — a blockchain protocol that allows swaps between native assets across different blockchains (e.g. swap real Bitcoin for real Ethereum, no wrapped tokens needed).

The platform offers:
- **Swaps** — trade one crypto asset for another across chains
- **FIN trading** — an on-chain orderbook (like a decentralised stock exchange)
- **Borrowing** — borrow against your crypto holdings
- **Strategies** — automated trading/liquidity strategies
- **Index vaults** — invest in a basket of assets
- **Portfolio** — view all your connected wallet balances

It is a **React single-page application** (SPA) — meaning the browser loads one HTML file and React handles all navigation without full page reloads.

---

## 2. The monorepo — three layers

The repository is a **monorepo**: one git repository that contains multiple packages. They share dependencies and can import from each other.

```
rujira-ui/
├── packages/
│   ├── main/          ← The actual app users see
│   ├── rujira.ui/     ← Shared UI components and hooks
│   ├── rujira.js/     ← Blockchain logic (signers, transactions)
│   ├── landing/       ← Marketing landing page
│   ├── docs/          ← Component documentation
│   └── trading-view/  ← TradingView chart library (git submodule)
```

Think of it as three layers:

```
┌─────────────────────────────────────┐
│  packages/main                      │  ← What users see
│  (React app, pages, features)       │
├─────────────────────────────────────┤
│  packages/rujira.ui                 │  ← How things look
│  (buttons, inputs, charts, hooks)   │
├─────────────────────────────────────┤
│  packages/rujira.js                 │  ← How things work
│  (signers, messages, blockchain)    │
└─────────────────────────────────────┘
```

**Key rule:** `main` can import from `rujira.ui` and `rujira.js`. Neither library imports from `main`. Changes to `rujira.ui` or `rujira.js` affect all packages that use them.

**References:**
- [pnpm workspaces](https://pnpm.io/workspaces) — how monorepos work in this project
- [Monorepo explained](https://monorepo.tools/) — general concept overview

---

## 3. How the app starts up

Entry point: `packages/main/src/main.tsx`

```typescript
// Initialises Bitcoin cryptography library
initEccLib(ecc);

// Renders the app into <div id="root"> in index.html
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ContextWrapper contexts={contexts}>
      <App />
    </ContextWrapper>
  </StrictMode>
);
```

`ContextWrapper` wraps the app in 12 context providers. It uses `reduceRight` to nest them:

```typescript
// ContextWrapper.tsx
export const ContextWrapper = ({ contexts, children }) =>
  contexts.reduceRight(
    (acc, CurrentContext) => <CurrentContext>{acc}</CurrentContext>,
    children
  );
```

`reduceRight` processes the array from right to left, so the first item in the array ends up as the outermost provider. This is a clever trick to avoid writing deeply nested JSX by hand.

The 12 providers, from outermost to innermost:
```
BrowserRouter → I18nProvider → RelayContext → AccountsContext
→ NotificationContext → FavoritesContext → AccountDataContext
→ PendingDepositStorageContext → PendingDepositLoadedContext
→ VultisigProvider → GlobalModal → BalanceSubscriptionProvider
→ <App>
```

**Why the order matters:** a provider lower in the tree can only consume contexts that are above it. `AccountDataContext` is below `AccountsContext` because it needs to know which wallet is connected.

**References:**
- [React `createRoot`](https://react.dev/reference/react-dom/client/createRoot)
- [React StrictMode](https://react.dev/reference/react/StrictMode)
- [Array.reduceRight](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight)

---

## 4. Context providers — shared state without Redux

This app uses **React Context** for all shared state — no Redux, no Zustand. Each context is responsible for one domain.

Here is a simplified version of how `FavoritesContext` works (the pattern is the same for all contexts):

```typescript
// 1. Define the shape of what the context provides
const FavoritesContext = createContext<{
  favorites: string[];
  toggle: (id: string) => void;
} | null>(null);

// 2. Provider component — holds the actual state
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useLocalStorage("rujira-favorites", []);

  const toggle = (id: string) =>
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );

  return (
    <FavoritesContext.Provider value={{ favorites, toggle }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// 3. Consumer hook — how components read from the context
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
}
```

**Key contexts you will use most:**

| Context | Hook | What it gives you |
|---------|------|-------------------|
| `AccountsContext` | `useAccounts()` | Connected wallets, addresses, signer |
| `SwapContext` | `useSwapContext()` | Swap form state (amounts, assets, quote) |
| `GlobalModal` | `useGlobalModal()` | `showModal()` / `hideModal()` |
| `NotificationContext` | `useNotification()` | Push notification permission |

**References:**
- [React Context docs](https://react.dev/learn/passing-data-deeply-with-context)
- [useContext hook](https://react.dev/reference/react/useContext)
- [When to use Context vs local state](https://react.dev/learn/managing-state)

---

## 5. Routing — how pages work

Routing lives in `packages/main/src/Gate.tsx`. The app uses **React Router v6**.

```typescript
// Gate.tsx — simplified
export default function Pages() {
  return (
    <Routes>
      <Route path="/:lang?" element={<Lang />}>
        {route("/", <Home />)}
        {route("/swap/:from?/:to?", <Swap />)}
        {route("/trade/:base/:quote", <Trade />)}
        {route("/portfolio/*", <Portfolio />)}
        {route("/borrow", <Borrow />)}
        {route("/strategies", <Strategies />)}
        {/* ... more routes */}
      </Route>
    </Routes>
  );
}
```

**Route gating:** routes can be enabled or disabled via environment variables. If a route is disabled, the `Link` component shows "Coming Soon..." instead of navigating.

```typescript
// The route() helper in Gate.tsx
function route(path: string, element: ReactElement) {
  if (isDisabled(path)) return <Route path={path} element={<NotFound />} />;
  return <Route path={path} element={element} />;
}
```

**Multi-language URLs:** every URL has a language prefix: `/en/swap`, `/de/swap`. The `/:lang?` route captures it. `useLocale()` gives you the current locale and a `toRoot()` helper that prepends the prefix to any path.

```typescript
const { locale, toRoot } = useLocale();
// toRoot("/swap/ETH/BTC") → "/en/swap/ETH/BTC"
```

All internal `<Link>` components use this automatically — you never write `/en/` manually.

**References:**
- [React Router v6 tutorial](https://reactrouter.com/en/main/start/tutorial)
- [useParams](https://reactrouter.com/en/main/hooks/use-params)
- [useNavigate](https://reactrouter.com/en/main/hooks/use-navigate)
- [Nested routes](https://reactrouter.com/en/main/route/route#nested-routes)

---

## 6. Feature modules — how a feature is structured

Every feature lives in `packages/main/src/<feature>/`. The swap feature is a good example:

```
packages/main/src/swap/
├── Swap.tsx                  ← Route entry component (what the router renders)
├── components/
│   ├── Context.tsx           ← Feature-local state (swap form state)
│   ├── InputSource.tsx       ← "From" asset selector
│   ├── InputDestination.tsx  ← "To" asset + destination address
│   ├── Quote.tsx             ← Shows the swap quote (rate, fees)
│   └── Actions.tsx           ← "Swap" button + transaction execution
└── __generated__/            ← Auto-generated GraphQL types (never edit)
```

**The entry component** (`Swap.tsx`) does three things:
1. Fetches the data it needs with Relay
2. Wraps children in the feature's context provider
3. Renders the layout

```typescript
// Swap.tsx (simplified)
export default function Swap() {
  const data = useLazyLoadQuery<SwapQuery>(graphql`
    query SwapQuery { thorchain { pools { asset price } } }
  `, {});

  return (
    <TranslationProvider namespace="swap">
      <Context>          {/* provides useSwapContext() to all children */}
        <div className="swap">
          <InputSource data={data} />
          <InputDestination />
          <Quote />
          <Actions />
        </div>
      </Context>
    </TranslationProvider>
  );
}
```

**The context** (`Context.tsx`) owns the form state. Here is the real swap context:

```typescript
// swap/components/Context.tsx
export const Context: FC<PropsWithChildren> = ({ children }) => {
  const [amount, setAmount] = useState(0n);          // BigInt — financial amounts
  const [source, setSource] = useState<BalanceAccount>();
  const [destination, setDestination] = useState<Destination>();
  const [slippageLimit, setSlippageLimit] = useState(100n); // 1% = 100 bps

  // URL params: /swap/ETH/BTC — from="ETH", to="BTC"
  const { from, to } = useParams<{ from: string; to: string }>();
  const nav = useNavigate();

  // Derived: only compute a quote when all inputs are filled
  const req = useMemo(() => {
    if (!source || !destination || !amount) return null;
    return { from: source.asset.asset, to: destination.asset.asset, amount, ... };
  }, [source, destination, amount, slippageLimit]);

  const quote = useQuote(req, true);  // calls the API

  return (
    <context.Provider value={{
      from, to, amount, setAmount, source, setSource,
      destination, setDestination, quote, slippageLimit, setSlippageLimit,
      // Changing asset updates the URL: /swap/ETH/BTC → /swap/SOL/BTC
      setFrom: (a) => to && nav(`../../${a}/${to}`, { relative: "path" }),
      setTo:   (a) => from && nav(`../../${from}/${a}`, { relative: "path" }),
    }}>
      {children}
    </context.Provider>
  );
};
```

Note: **amounts are always `bigint`**, never `number` or `string`. This is because JavaScript `number` cannot represent large financial amounts precisely. `100n` means `BigInt(100)`.

**References:**
- [BigInt in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
- [useMemo](https://react.dev/reference/react/useMemo)
- [useState](https://react.dev/reference/react/useState)

---

## 7. Relay and GraphQL — where data comes from

**GraphQL** is a query language for APIs. Instead of fetching a fixed REST endpoint, you describe exactly what data you want.

**Relay** is the GraphQL client this app uses. It is more opinionated than alternatives like Apollo — it generates TypeScript types for every query, and encourages co-locating data requirements with components (called **fragments**).

### Writing a query

```typescript
import { graphql, useLazyLoadQuery } from "react-relay";
import type { MyComponentQuery } from "./__generated__/MyComponentQuery.graphql";

// The graphql tag is processed at build time by the Relay compiler
const query = graphql`
  query MyComponentQuery($address: Address!) {
    account(address: $address) {
      balance
      asset { symbol decimals }
    }
  }
`;

function MyComponent({ address }: { address: string }) {
  // Relay fetches the data and returns it typed
  const data = useLazyLoadQuery<MyComponentQuery>(query, { address });
  return <div>{data.account.balance.toString()}</div>;
}
```

### Writing a fragment

Fragments declare a component's data dependencies. The parent fetches the data; the child reads from it via fragment:

```typescript
// Child component declares what it needs
const fragment = graphql`
  fragment PriceDisplay_asset on Asset {
    price { current }
    metadata { symbol decimals }
  }
`;

function PriceDisplay({ assetRef }) {
  const asset = useFragment(fragment, assetRef);
  return <span>{asset.metadata.symbol}</span>;
}
```

### After changing a query

Always run the Relay compiler after editing any `graphql` tag:

```bash
cd packages/main && pnpm run relay
```

This regenerates the `__generated__/` files. **Never edit `__generated__/` files manually** — they are overwritten every time the compiler runs.

### The schema

The API's full type system lives in `packages/main/data/schema.graphql`. The main query roots are:

| Root | What it covers |
|------|----------------|
| `finV3` | Trading pairs, orderbook, ranges |
| `thorchainV2` | THORChain pools, swaps, node data |
| `ghostCreditAccount` | Lending/borrowing |
| `staking` | Staking positions |
| `perps` | Perpetuals |
| `index` | Index vaults |
| `node(id)` | Relay standard node lookup |

**Custom scalars** — these types look like primitives in the schema but have special handling:

| Scalar | TypeScript type | Why |
|--------|----------------|-----|
| `Bigint` | `bigint` | Financial amounts — too large for `number` |
| `Address` | `string` | Blockchain address (validated externally) |
| `AssetString` | `string` | e.g. `"BTC.BTC"`, `"ETH.USDC-0x..."` |

**References:**
- [GraphQL introduction](https://graphql.org/learn/)
- [Relay tutorial](https://relay.dev/docs/tutorial/intro/)
- [useFragment](https://relay.dev/docs/api-reference/use-fragment/)
- [useLazyLoadQuery](https://relay.dev/docs/api-reference/use-lazy-load-query/)
- [Thinking in Relay](https://relay.dev/docs/principles-and-architecture/thinking-in-relay/)

---

## 8. Real-time data — Phoenix WebSockets

Some data updates in real time (live prices, order fills, balance changes). This uses **WebSockets** rather than HTTP.

The transport is a **Phoenix WebSocket** (a protocol from the Elixir/Phoenix backend framework) adapted into Relay via the `@absinthe/socket` library.

```typescript
// services/relay.tsx — how the connection is set up
const phoenixSocket = new PhoenixSocket(
  `${import.meta.env.VITE_SOCKET}/socket`,
  { params: { token: import.meta.env.VITE_API_KEY } }
);

const conn = socket.create(phoenixSocket);
const subscriber = createSubscriber(conn); // Absinthe → Relay adapter
```

In a component, you use `useSubscription`:

```typescript
const subscription = graphql`
  subscription BalanceSubscription($addresses: [Address!]!) {
    balances(addresses: $addresses) {
      address
      balance
      asset { metadata { symbol } }
    }
  }
`;

useSubscription({ subscription, variables: { addresses } });
```

There are also two convenience hooks for common patterns:

```typescript
// Subscribe to updates for a single object by its Relay ID
useNodeSubscription({ id: orderId });

// Subscribe to a stream of new edges (e.g. new order fills coming in)
useEdgeSubscription({ prefix: `FinCandle:${contract}/${resolution}` });
```

**References:**
- [WebSockets explained](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [GraphQL subscriptions](https://graphql.org/blog/subscriptions-in-graphql-and-relay/)
- [Relay useSubscription](https://relay.dev/docs/api-reference/use-subscription/)
- [Phoenix channels](https://hexdocs.pm/phoenix/channels.html) (the backend protocol)

---

## 9. Transactions — how a swap or deposit works

Every blockchain action is a **message** (`Msg`). The `Msg` interface in `packages/rujira.js` is the core abstraction:

```typescript
// packages/rujira.js/src/msgs/msg.ts
interface Msg {
  account: Account;  // who is sending this

  // Convert to the format each chain needs:
  toCosmosTx():           Promise<{ msgs: EncodeObject[]; memo: string }>;
  toEvmTxRequest():       Promise<{ tx: TransactionRequest; erc20?: ERC20Allowance }>;
  toPsbt(utxos: Utxo[]): Promise<{ psbt: Psbt; fee: bigint; amount: bigint; memo: string; recipient: string }>;
  toXrpPayment():         Promise<XrpPayment>;
  toTronTx(tronWeb):      Promise<TronTx>;
}
```

The full transaction flow:

```
1. User fills in the swap form
         ↓
2. Create a Msg (e.g. new MsgSwap({ account, from, to, amount }))
         ↓
3. Detect chain type from account.address prefix:
   0x...   → EVM (Ethereum, Avalanche, BSC, Base)
   bc1...  → Bitcoin (UTXO)
   thor... → THORChain (Cosmos)
   T...    → TRON
   r.../X  → XRP
         ↓
4. signer.simulate(msg)
   → EVM: eth_estimateGas
   → Cosmos: RPC simulate
   → UTXO: fee = inputs × 148 + outputs × 34 bytes × sat/byte
   → returns Simulation { fee, symbol, decimals }
         ↓
5. Show fee to user: "This will cost 0.0002 ETH"
         ↓
6. User clicks Confirm
         ↓
7. signer.signAndBroadcast(simulation, msg)
   → returns TxResult { txHash, network, address }
         ↓
8. Store in PendingDepositStorageContext (localStorage)
   Subscribe to deposit status updates via WebSocket
```

**Error handling:** when a transaction fails, `translateError()` converts raw chain error messages to readable text:

```typescript
// errors.ts — 20+ pattern matches
export function translateError(e: unknown): string {
  const msg = String(e);
  if (/insufficient funds/i.test(msg))    return "Insufficient balance";
  if (/user rejected/i.test(msg))         return "Transaction cancelled";
  if (/execution reverted/i.test(msg))    return "Transaction reverted by contract";
  // ... more patterns
}
```

There is also `InsufficientAllowanceError` — this is thrown for ERC20 tokens when the wallet hasn't approved the DEX router to spend the token. The UI catches this and shows an "Approve" step first.

**References:**
- [What is a blockchain transaction?](https://ethereum.org/en/developers/docs/transactions/)
- [UTXO vs Account model](https://river.com/learn/bitcoins-utxo-model/)
- [ERC20 allowance / approve pattern](https://docs.openzeppelin.com/contracts/4.x/erc20#allowance)
- [THORChain memos](https://dev.thorchain.org/concepts/memo-length-reduction.html)
- [Cosmos SDK messages](https://docs.cosmos.network/main/build/building-modules/messages-and-queries)

---

## 10. Wallet providers — connecting to a wallet

The app supports 17 wallet providers across 19 blockchains. They all implement the same `Signer` interface from `rujira.js`:

```typescript
interface Signer {
  connect():                                   Promise<Address[]>;
  simulate(tx: Msg):                           Promise<Simulation>;
  signAndBroadcast(sim: Simulation, tx: Msg):  Promise<TxResult>;
  isAvailable():                               boolean;
  networks():                                  Network[];
  onChange?(cb: () => void):                   void;
  disconnect?():                               void;
}
```

Providers are detected automatically:

| Detection method | Example providers |
|-----------------|-------------------|
| `window.keplr` | Keplr |
| `window.okxwallet` | OKX |
| `window.xfi` | CTRL/XDEFI |
| EIP-6963 event | MetaMask, Rabby, Trust, Brave, Coinbase |
| SDK | Vultisig, TON Connect, Ledger, Xaman |

EIP-6963 is the modern standard where wallets announce themselves by dispatching a `window.dispatchEvent` — no need to check `window.ethereum` which caused conflicts when multiple EVM wallets were installed.

In components, you interact with wallets through `AccountsContext`:

```typescript
const { accounts, selected, connect, disconnect, signer } = useAccounts();

// Connect a wallet
await connect("Keplr");

// Get a signer for signing transactions
const txSigner = signer(selected.address);
const simulation = await txSigner.simulate(myMsg);
```

**References:**
- [EIP-6963: Multi Injected Provider Discovery](https://eips.ethereum.org/EIPS/eip-6963)
- [What is a crypto wallet?](https://ethereum.org/en/wallets/)
- [WalletConnect (conceptual background)](https://docs.walletconnect.com/)

---

## 11. The shared UI library (rujira.ui)

`packages/rujira.ui` exports ready-made components, hooks, and utilities used by `main`, `landing`, and `docs`.

### Components

```
components/
├── buttons/      Button (polymorphic, supports any HTML element or component)
├── inputs/       DecimalInput, DenomInput, Select, Toggle, Checkbox, Slider
├── numbers/      Decimal, Fiat  (formatted number display)
├── icons/        IconDenom, NetworkIcon, WalletIcons
├── header/       Header, Accounts panel, QuickLauncher
├── cards/        Card, GradientCard, ShareCard
├── chart/        RangeLiquidityChart
├── loader/       Loader (spinner)
└── ...more
```

**Key rule: always check `rujira.ui` before writing a new component.** Run `/find-component <description>` to search.

### Hooks

| Hook | What it does |
|------|--------------|
| `useClickOutside(ref, handler)` | Call `handler` when user clicks outside `ref` |
| `useLocalStorage(key, default)` | `useState` that persists in `localStorage` |
| `useQueryParam(key)` | Read/write a URL query parameter as state |
| `useWindowSize()` | `{ width, height }` that updates on resize |
| `useIsTouchDevice()` | `true` on mobile/tablet |
| `useEventCallback(fn)` | Stable function reference that always sees current state |
| `useIsomorphicLayoutEffect` | `useLayoutEffect` that also works server-side |

### Helpers

```typescript
import { nFormatter, bigIntToDecimalString, formatApr } from "rujira.ui";

nFormatter(1_500_000n, 2, 0)     // → "1.5M"
bigIntToDecimalString(100000n, 6) // → "0.1"  (6 decimal places)
formatApr(500n)                   // → "5.00%"
```

**References:**
- [Custom hooks pattern](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [URL search params](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

---

## 12. Styling — SCSS and utility classes

Styles are written in **SCSS** (a CSS superset with variables, nesting, and mixins).

### Design tokens

All colours, spacing, and typography values live in `packages/rujira.ui/src/scss/base/_variables.scss`:

```scss
// Primary palette
$primary1: #D615EB;   // pink
$primary2: #8436F5;   // purple
$primary3: #5A2AD1;
$primary4: #070E50;

// Status colours
$teal:   #60fbd0;   // success / positive
$orange: #f57c00;   // warning
$red:    #e53935;   // error / negative
$blue:   #1e92e6;   // info

// Greys
$grey:      #71909F;
$darkGrey:  #22242f;
$black:     #161721;
$deepBlack: #0c0a0f;
```

**Never hardcode a hex value** that matches one of these tokens. Use the variable.

### Class naming — BEM + utilities

Component classes follow **BEM** (Block, Element, Modifier):

```scss
.swap { }                   // Block
.swap__header { }           // Element (double underscore)
.swap__button--active { }   // Modifier (double dash)
```

Utility classes handle spacing, typography, and layout:

```html
<!-- Typography -->
<p class="fs-16 fw-400">Normal text</p>
<p class="fs-20 fw-700">Bold heading</p>

<!-- Flexbox -->
<div class="dir-r ai-c jc-sb">  <!-- row, align-center, justify-space-between -->
  <div class="col-6">Left half</div>
  <div class="col-6">Right half</div>
</div>

<!-- Spacing -->
<div class="mt-2 mb-4 p-2">...</div>

<!-- Colours -->
<span class="color-grey">Muted text</span>
<span class="color-teal">Success text</span>
```

### Adding styles for a new feature

1. Create `packages/main/src/<feature>/<feature>.scss`
2. Add one line to `packages/main/src/index.scss`:
   ```scss
   @import "./myfeature/myfeature";
   ```
3. Use `.myfeature { }` as the BEM block name

**References:**
- [SCSS basics](https://sass-lang.com/guide/)
- [BEM methodology](https://getbem.com/introduction/)
- [CSS Flexbox guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [CSS custom properties (variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

## 13. i18n — translations

The app supports English and German. Translations live in:

```
packages/rujira.ui/src/i18n/locales/
├── en/
│   ├── swap.json
│   ├── trade.json
│   ├── common.json
│   └── ...
└── de/
    ├── swap.json
    ├── trade.json
    ├── common.json
    └── ...
```

In a component, wrap it in `TranslationProvider` and use `useTranslation`:

```typescript
// Wrap your feature entry with the namespace
<TranslationProvider namespace="swap">
  <SwapForm />
</TranslationProvider>

// Inside any child:
function SwapForm() {
  const { t } = useTranslation("swap");
  return <button>{t("confirmButton")}</button>;
}
```

The corresponding JSON file must have the key:

```json
// locales/en/swap.json
{
  "confirmButton": "Confirm Swap"
}
```

**ESLint enforces this** — if you use `t("someKey")` and `someKey` doesn't exist in the namespace JSON file, the linter will error. To add a new key, edit the relevant namespace JSON under `packages/main/src/i18n/locales/en/` — the proactive `i18n-keys` skill fires on translation edits and will guide you.

**References:**
- [i18next documentation](https://www.i18next.com/)
- [react-i18next](https://react.i18next.com/)
- [Internationalisation basics](https://developer.mozilla.org/en-US/docs/Glossary/Internationalization)

---

## 14. TypeScript rules you must follow

The project uses TypeScript in **strict mode** with zero tolerance for warnings. The linter blocks merging if any rule is violated.

### The non-negotiables

```typescript
// WRONG — implicit any
function process(data) { ... }

// RIGHT — explicit types
function process(data: SwapQuote): string { ... }

// WRONG — unused variable
const { foo, bar } = useData();  // if bar is unused, tsc will error

// WRONG — mutation
const items = [...existing];
items.push(newItem);    // mutating the copy is fine but avoid push on state

// RIGHT — immutable update
const items = [...existing, newItem];

// WRONG — || when 0 is a valid value
const amount = value || 0n;   // if value is 0n, this incorrectly falls through

// RIGHT — nullish coalescing
const amount = value ?? 0n;   // only falls through if value is null or undefined

// WRONG — non-null assertion without a guard
const el = document.getElementById("root")!;  // risky

// RIGHT — check first or assert with comment
const el = document.getElementById("root");
if (!el) throw new Error("Missing #root element");
```

### BigInt is everywhere

Financial amounts are always `bigint`. Operations look slightly different:

```typescript
const price = 100n;             // BigInt literal
const amount = BigInt("50000"); // from string
const total = price * amount;   // arithmetic works the same

// Converting for display (never for calculations)
const display = bigIntToDecimalString(amount, 6); // "0.05" (6 decimal places)

// BigInt doesn't work with Math.*
Math.max(a, b);         // WRONG — TypeError
a > b ? a : b;          // RIGHT
bigintMin(a, b);        // RIGHT — helper in rujira.js
```

### Run these before opening a PR

```bash
cd packages/main && pnpm run lint     # zero warnings allowed
cd packages/main && npx tsc --noEmit  # no type errors
cd packages/rujira.js && tsc -b       # if you changed rujira.js
cd packages/rujira.ui && tsc -b       # if you changed rujira.ui
```

**References:**
- [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript strict mode](https://www.typescriptlang.org/tsconfig#strict)
- [ESLint getting started](https://eslint.org/docs/latest/use/getting-started)
- [Nullish coalescing (`??`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)

---

## 15. Common tasks — where to start

| I want to... | Start here |
|---|---|
| Add a button to an existing page | Run `/find-component <description>` first, then edit the component in `packages/main/src/<feature>/components/` |
| Add a new page/route | Read `packages/main/src/Gate.tsx` — the `route-gating` skill fires on edits and walks you through `VITE_ROUTES_ENABLED` wiring |
| Show data from the API | Run `/relay-trace <feature>` to find the nearest query, add a field to the `graphql` tag, then run `/update-relay` |
| Add a translation string | Edit the namespace JSON under `packages/main/src/i18n/locales/en/` — the `i18n-keys` skill fires automatically |
| Debug "balance not updating" | Run `/debug-subscription balances` (checks `AccountsContext` and Phoenix WebSocket) |
| Debug a failing swap | Run `/debug-tx <error message>` |
| Find an existing component | Run `/find-component <description>` |
| Understand a transaction flow | Run `/wallet-flow ETH` or `/relay-trace swap` |
| Explain a feature end-to-end | Run `/explain-feature <name>` |
| Assess a rename/removal blast radius | Run `/trace-dependency <symbol>` or `/map-imports <path>` |
| Move code into a shared package | Run `/extract-shared <path>` |
| Add a new chain/signer | Edit under `packages/rujira.js/src/signers/` — the `signer-patterns` skill fires on signer edits |
| Audit SCSS for drift | Run `/scss-audit` |
| Review TypeScript changes | Run `/review-typescript` |
| Check bundle size impact | Run `/check-bundle <package>` |

---

## 16. Learning resources

### React

| Resource | What you'll learn |
|----------|-------------------|
| [React.dev — Learn React](https://react.dev/learn) | Official interactive tutorial — start here |
| [React hooks reference](https://react.dev/reference/react) | `useState`, `useEffect`, `useMemo`, `useCallback`, `useContext` |
| [You don't need an effect](https://react.dev/learn/you-might-not-need-an-effect) | Crucial — avoids a very common mistake |
| [Thinking in React](https://react.dev/learn/thinking-in-react) | How to break a UI into components |

### TypeScript

| Resource | What you'll learn |
|----------|-------------------|
| [TypeScript in 5 minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html) | Quick introduction |
| [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/intro.html) | Full reference |
| [Type challenges](https://github.com/type-challenges/type-challenges) | Practice exercises |
| [Matt Pocock's Total TypeScript](https://www.totaltypescript.com/tutorials) | Best practical video tutorials |

### GraphQL and Relay

| Resource | What you'll learn |
|----------|-------------------|
| [GraphQL — How to GraphQL](https://www.howtographql.com/) | GraphQL fundamentals |
| [Relay tutorial](https://relay.dev/docs/tutorial/intro/) | Step-by-step Relay guide |
| [Relay thinking in fragments](https://relay.dev/docs/principles-and-architecture/thinking-in-relay/) | The key mental model |
| [GraphQL schema basics](https://graphql.org/learn/schema/) | Types, queries, mutations |

### DeFi and blockchain concepts

| Resource | What you'll learn |
|----------|-------------------|
| [Ethereum.org — developers](https://ethereum.org/en/developers/docs/) | EVM, transactions, accounts |
| [THORChain docs](https://dev.thorchain.org/) | How THORChain swaps work |
| [What is a DEX?](https://ethereum.org/en/defi/#dex) | Decentralised exchanges explained |
| [UTXO vs Account model](https://river.com/learn/bitcoins-utxo-model/) | Why Bitcoin transactions work differently |
| [What are gas fees?](https://ethereum.org/en/developers/docs/gas/) | Transaction costs on EVM chains |
| [Cosmos SDK intro](https://docs.cosmos.network/main/learn/intro/overview) | How Cosmos-based chains (THOR, KUJI) work |
| [IBC protocol](https://ibc.cosmos.network/) | Cross-chain transfers in the Cosmos ecosystem |

### Tooling

| Resource | What you'll learn |
|----------|-------------------|
| [Vite guide](https://vitejs.dev/guide/) | The build tool |
| [pnpm workspaces](https://pnpm.io/workspaces) | Monorepo dependency management |
| [SCSS guide](https://sass-lang.com/guide/) | CSS with variables and nesting |
| [BEM methodology](https://getbem.com/introduction/) | CSS class naming convention |
| [React Router v6 tutorial](https://reactrouter.com/en/main/start/tutorial) | Client-side routing |

### Debugging

| Resource | What you'll learn |
|----------|-------------------|
| [React DevTools](https://react.dev/learn/react-developer-tools) | Inspect component tree and state |
| [Relay DevTools](https://relay.dev/docs/getting-started/step-by-step-guide/#relay-devtools) | Inspect the Relay store |
| [Chrome Network tab tutorial](https://developer.chrome.com/docs/devtools/network/) | Debug HTTP requests |
| [Chrome WebSocket inspection](https://developer.chrome.com/docs/devtools/network/reference/#frames) | Debug WebSocket messages |

---

## Quick orientation checklist

Before writing any code, run through this:

- [ ] Read `CLAUDE.md` — has the Task Routing table
- [ ] Read `CONVENTIONS.md` — formatting and linting rules
- [ ] Run `pnpm install` from the repo root
- [ ] Try `pnpm run main` — make sure the dev server starts
- [ ] Open the feature you're working on in `packages/main/src/`
- [ ] Check `packages/rujira.ui/src/components/` for any component you need before creating one
- [ ] After any `graphql` change: `cd packages/main && pnpm run relay`
- [ ] Before opening a PR: `pnpm run lint` and `tsc --noEmit`

---

*This document describes the codebase as of 2026-04-01. For architecture deep-dives see [ARCHITECTURE.md](ARCHITECTURE.md). For coding conventions see [../CONVENTIONS.md](../CONVENTIONS.md).*
