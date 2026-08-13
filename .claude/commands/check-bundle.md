---
name: check-bundle
description: Analyse the Vite bundle — identify which chunk a dependency lands in, diagnose size regressions, or verify chunk splitting.
argument-hint: "<package name | symptom>"
---

Analyse the Vite bundle for `$ARGUMENTS` — identify which chunk a dependency lands in, diagnose size regressions, or verify chunk splitting is working as intended.

## Context

`packages/main/vite.config.ts` splits the output into 7 named chunks via `manualChunks`:

| Chunk | Contents |
|-------|----------|
| `vultisig.js` | `@vultisig/sdk` |
| `trustwallet.js` | `@trustwallet/wallet-core`, `protobufjs` |
| `cosmjs.js` | All `cosmjs` packages |
| `charts.js` | Charting dependencies |
| `ethers.js` | `viem`, `ethers` |
| `rujira.js` | `rujira.ui`, `rujira.js` workspace packages |
| `vendor.js` | Everything else in `node_modules` |

The build requires `NODE_OPTIONS=--max-old-space-size=16384` (16GB heap). The `visualizer()` Vite plugin generates a bundle analysis HTML file. Sentry source maps are uploaded via `sentryVitePlugin()`.

## Steps

### 1 — Parse the argument

The argument can be:
- A package name (e.g. `ethers`, `@vultisig/sdk`, `cosmjs`) — identify which chunk it belongs to and verify
- A symptom (e.g. "bundle too large", "vultisig chunk bloated", "wrong chunk")
- A new dependency just added — check where it will land and whether it should be in a dedicated chunk

### 2 — Read the Vite config

Read `packages/main/vite.config.ts`. Extract the full `manualChunks` configuration, all 10 plugins, and any existing chunk-size warnings config.

### 3 — Check chunk assignment

For a named package, trace through `manualChunks`:
- Does it match an existing chunk rule by package name prefix or exact match?
- If not matched by any rule, it falls into `vendor.js` — is that correct?
- If it's a workspace package (`rujira.ui`, `rujira.js`), does it match the `rujira.js` chunk rule?

### 4 — Check for unintended chunk inflation

Common causes of chunk size regression:
- A new import bringing in a large transitive dependency
- A package that should be in a dedicated chunk but falls through to `vendor.js`
- A workspace package change that added a new heavy dependency to `rujira.js` chunk
- `@trustwallet/wallet-core` or `protobufjs` ending up duplicated

Search for the dependency in `packages/main/package.json` and `packages/rujira.js/package.json` to understand if it's a direct or transitive dep.

### 5 — Check the visualizer output

If `dist/stats.html` exists from a recent build, note that the `visualizer()` plugin generates it. Advise the user to open it in a browser for a treemap of chunk contents.

### 6 — Check WASM and polyfill plugins

The config includes `wasm()`, `nodePolyfills()` (Buffer, global, process), `vultisigSdkShim()`, and `inject()` (auto Buffer import). If a dependency requires Node.js globals or WASM:
- Verify `nodePolyfills()` covers the required globals
- Check that WASM files are being handled (`.wasm` files should not land in `vendor.js` as inlined strings)

### 7 — Report

```
Dependency: <name>
Current chunk: <chunk name | vendor.js (fallthrough)>
Expected chunk: <correct chunk based on content type>

Size impact: <estimated based on package size>
Correct placement: <yes | NO — needs manualChunks update>

manualChunks change needed:
  // Add to vite.config.ts manualChunks:
  if (id.includes('<package-path>')) return '<chunk>';

Other findings:
  <any WASM, polyfill, or transitive dep issues>

Build command reminder:
  cd packages/main && NODE_OPTIONS=--max-old-space-size=16384 pnpm run build
  # Then open dist/stats.html for bundle treemap
```
