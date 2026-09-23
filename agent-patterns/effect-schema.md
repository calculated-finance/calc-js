# Effect Schema patterns for this repo

Reference for writing `Schema` code in this project (Effect **3.22.1** — the
vendored source in `repos/effect` is pinned to match; do not follow 4.x docs).
Patterns below are drawn from the vendored source/tests and from this repo's
own schemas in `packages/domain/src/`.

Core mental model, from Effect's own docs (`repos/effect/packages/effect/schema-vs-zod.md`):
**parse, don't validate**. A `Schema<A, I>` is a bidirectional codec between a
decoded type `A` (what the app works with) and an encoded type `I` (what JSON,
localStorage, and contracts see). Every schema decision is really a decision
about which side of that boundary a value lives on.

```
        decode (I -> A)  — may transform, may fail
Encoded ────────────────────────────────────────► Type
  I     ◄──────────────────────────────────────── A
        encode (A -> I)  — may transform, may fail
```

## 1. Constructors and combinators we use

```ts
import { Schema } from "effect";

// structs — the workhorse (see packages/domain/src/calc.ts)
export const Swap = Schema.Struct({
  adjustment: SwapAmountAdjustment,
  maximum_slippage_bps: BasisPoints,
  minimum_receive_amount: Amount,
  routes: Schema.Array(SwapRoute),
  swap_amount: Amount,
});

// discriminated-by-key unions (contract-style enums)
export const Cadence = Schema.Union(BlockSchedule, TimeSchedule, CronSchedule);

// literals
export const WalletType = Schema.Literal("MetaMask", "Keplr", "Rabby Wallet");

// optionality — calc.ts convention for contract fields that may be absent/null
msg: Schema.optional(Schema.NullOr(Schema.String)),

// branded primitives (cosmwasm.ts)
export const AddrSchema = Schema.NonEmptyTrimmedString.pipe(
  Schema.brand("Addr"),
  Schema.maxLength(255),
);

// type extraction — always this pair, exported together
export type Swap = Schema.Schema.Type<typeof Swap>;
// encoded side when you need it (e.g. localStorage fixtures, form defaults):
type SwapEncoded = typeof Swap.Encoded;
```

Notes from the source (`repos/effect/packages/effect/src/Schema.ts`):

- Everything is `pipe`-able and most combinators are dual (data-first and
  data-last). Prefer `.pipe(...)` chains as in `cosmwasm.ts`.
- `Schema.NullOr(s)` is literally `Union(s, Null)`; `Schema.Union(x)` with one
  member returns `x` unchanged; `Schema.Literal()` with no args is `Never`.
- `Schema.Record({ key, value })` takes an **object**, not positional args.
- Use the `.annotations()` **method** rather than the standalone combinator so
  the specific schema class (with `.fields`, `.make`) is preserved.
- Decoded structs are `readonly` by default; `Schema.mutable(...)` strips it
  (used in calc.ts for `execution_rebate` where cosmjs wants mutable arrays).

## 2. Filters vs transforms — the trap that has already bitten us

**Filters refine; transforms change values.** They look interchangeable in a
pipe but behave completely differently on bad input:

- `Schema.between(0, 10)` is a **filter**: out-of-range input **fails** decode
  with a `ParseIssue`. Type and Encoded stay identical.
- `Schema.clamp(0, 10)` is a **transform** (`Schema.ts:5286`): out-of-range
  input is **silently coerced** into range on decode, and `encode` is
  `identity` — so decode-then-encode is *not* an identity for bad input.

The vendored test proves it (`test/Schema/Schema/BigInt/clampBigInt.test.ts`):
`clampBigInt(-1n, 1n)` decodes `3n` to `1n` — no error, value rewritten.

**Project rule:** user-editable fields use strict filters, never clamps.
We shipped a bug where `scalar: Schema.Positive.pipe(Schema.clamp(0, 10))`
let a typed `11` pass form validation (decode clamps) and then crash the node
on the encode round-trip (type-side filter rejects). The fix, now in
`calc.ts:16`:

```ts
scalar: Schema.Positive.pipe(Schema.between(0, 10)).pipe(
  Schema.annotations({
    message: () => ({
      message: "Please provide a multiplier between 0 and 10",
      override: true,
    }),
  }),
),
```

Clamps remain appropriate for values we *read* but never author, where
coercion beats failure (`Uint128` in `cosmwasm.ts` clamps chain-supplied
bigints to the u128 range).

## 3. Encoding and decoding

API axes (from `Schema.ts:417-660`): direction (`decode`/`encode`/`validate`)
× input trust (`Unknown` suffix or not) × result carrier (Effect / `Sync`
throws / `Either` / `Option` / `Promise`).

```ts
// Untrusted input (contract JSON, localStorage, network) => decodeUnknown*.
// use-chain-strategy.ts — raw contract config into a Strategy:
return yield* Schema.decodeUnknown(Strategy)({ ...handle, action });

// Trusted, typed input => decode/encode. Sync variants throw ParseError —
// only use where a failure is a programming error, not a data error:
const encoded = Effect.runSync(Schema.encode(Strategy)(strategy)); // persist path
const decoded = Schema.decodeSync(Schedule)(formValue);            // post-validate commit

// Non-throwing checks in tests: Either variants.
// packages/domain/test/schemas.test.ts:
const result = Schema.decodeUnknownEither(LinearScalarSwapAdjustment)(input);
expect(Either.isLeft(result)).toBe(true);
```

Rules:

- **`decodeUnknown` at trust boundaries.** If the value came from outside the
  type system (chain query, `JSON.parse`, form JSON editor), don't cast it to
  the encoded type to satisfy `decode` — pass it to `decodeUnknown*`.
- **Hoist parsers out of hot paths.** `Schema.decodeUnknown(schema)` returns a
  reusable function (two-stage application in the source); don't rebuild it
  per call in a loop.
- **Amounts transform units.** `Amount` (`assets.ts:105`) decodes raw integer
  strings into human units (divides by `10^significantFigures`) and encodes
  back. Decoding an already-decoded Amount **double-divides**. This is why the
  client has two form hooks (below) — never re-decode decoded values.

### Form integration (client)

`packages/client/src/hooks/use-schema-form.ts` is the only sanctioned way to
bind a schema to a TanStack form. Pick the representation explicitly:

- `useEncodedSchemaForm(schema, value, onCommit)` — fields bind to the
  **encoded** JSON-friendly shape; valid changes commit the **decoded** result.
  Use for cron strings, addresses, denom lists (schedule/distribute forms).
- `useDecodedSchemaForm(schema, value, onCommit)` — fields bind to the
  **decoded** shape and commit it as-is. Use when fields carry human units
  (swap amounts) where re-decoding would double-apply transforms.

Both route validation through `Schema.standardSchemaV1(schema)` and flatten
issues with `fieldErrors` (`src/lib/validation.ts`) — path segments may be
objects (`{ key }`), so never `issue.path.join(".")` directly.

`standardSchemaV1` caveats from the source (`Schema.ts:167-199`): requires
`R = never`, hard-codes `{ errors: "all" }`, and returns a `Promise` if the
schema has async parts — our schemas are sync (Amount's transform uses
`Effect.runSync` internally), keep them that way.

## 4. Transformation patterns

`Schema.transform` is for **total** mappings (cannot fail — callbacks return
plain values). If the mapping can fail, use `Schema.transformOrFail` and
return `ParseResult` values:

```ts
// Adapted from repos/effect/packages/effect/test/Schema/Schema/transformOrFail.test.ts
// and assets.ts's Amount — the project's canonical transformOrFail:
export const Amount = Schema.transformOrFail(
  Schema.Struct({ amount: Schema.Union(Schema.NonEmptyTrimmedString, Schema.Number), denom: Schema.NonEmptyTrimmedString }),
  Schema.Struct({ ...Asset.fields, amount: Schema.Number }),
  {
    strict: true,
    encode: (value) =>
      ParseResult.succeed({
        amount: /* scale up by 10^significantFigures */,
        denom: value.denom,
      }),
    decode: (value, _options, ast) => {
      const asset = lookupAsset(value.denom);
      if (!asset) {
        return ParseResult.fail(new ParseResult.Type(ast, value, `Unknown asset: ${value.denom}`));
      }
      return ParseResult.succeed({ /* scaled-down, enriched value */ });
    },
  },
);
```

- Failures are `ParseResult.fail(new ParseResult.Type(ast, actualValue, message))`
  — the `ast` argument is provided to your callback, pass it through.
- `strict: false` is the escape hatch when the type relation isn't statically
  provable; the in-repo precedent for a legitimate use is `clamp` itself.
- To reference "the already-decoded side" of a schema (e.g. as a transform
  target), use `Schema.typeSchema(self)`.
- Naming convention from upstream: `XFromY` means "decodes Y into X"
  (`NumberFromString`); a bare name means JSON-native encoding. Follow it for
  new transforms.

## 5. Error handling

Custom messages are **annotations holding a thunk** — never a bare string:

```ts
// numbers.ts / calc.ts convention:
Schema.annotations({
  message: () => ({
    message: "Please provide a valid % value",
    override: true,   // <-- required to replace nested issue messages
  }),
})
```

From the source (`SchemaAST.ts:100`, `ParseResult.ts:1820`): returning a plain
string normalizes to `override: false`, which means a more specific inner
failure (e.g. the underlying `Positive` filter) wins and your friendly text
never shows. **Use the object form with `override: true`** for user-facing
fields — every message in `calc.ts` does.

Filter-level messages attach as the second argument to the filter:

```ts
// repos/effect/packages/effect/test/Schema/Schema/filter.test.ts:137
const ValidString = Schema.Trim.pipe(Schema.minLength(1, { message: () => "ERROR_MIN_LENGTH" }));
```

Failure shapes:

- Effect-carrier APIs fail with `ParseError`; render trees with
  `ParseResult.TreeFormatter.formatIssueSync(error.issue)` or get structured
  `{ path, message }` rows with `ParseResult.ArrayFormatter`.
- In the client, form errors come pre-flattened via `fieldErrors`; in domain
  services, wrap failures in tagged errors
  (`class CalcError extends Schema.TaggedError<CalcError>()("CalcError", { cause: Schema.Defect })`)
  rather than leaking raw `ParseError`s.
- Tests assert failures with `decodeUnknownEither` + `Either.isLeft`
  (see `packages/domain/test/schemas.test.ts`) — don't assert on exact tree
  strings unless the message itself is the behavior under test.

## 6. What to avoid

- **`Schema.clamp` on user input.** Silent coercion + asymmetric encode =
  values that validate one way and crash the other. Use `between`. (§2)
- **Re-decoding decoded values.** `decodeSync` on a value that's already on
  the Type side double-applies transforms (Amount unit scaling). Choose the
  form hook that matches the representation instead. (§3)
- **Casting untrusted data to the encoded type** to call `decode`. Use
  `decodeUnknown*`; that's what it exists for.
- **Bare-string message annotations** when you want your message shown —
  without `{ override: true }` inner failures shadow it. (§5)
- **`issue.path.join(".")`** — path segments can be objects; use
  `fieldErrors` / map segments through `String(segment.key)`.
- **`Omit<UnionType, K>`** on schema-derived unions collapses the
  discriminant (lost `contract_address` on `StrategyHandle` once). Distribute
  with `Extract`/mapped types, or re-assert the union at the trust boundary
  with a single documented cast.
- **`Schema.transform` for fallible mappings** — it cannot fail by
  construction; reach for `transformOrFail`.
- **Following Effect 4.x examples.** Upstream `main` is 4.0-rc. Reference only
  `repos/effect` (pinned 3.22.1) or the 3.x docs.
- **Sync variants (`decodeSync`/`encodeSync`) on data that can legitimately be
  bad** — they throw. Reserve them for post-validation commits and
  persistence of values already proven valid; use Either/Effect variants
  everywhere else.
