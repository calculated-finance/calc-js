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
- Never import from `repos/**` in application code; dependencies come from
  npm via pnpm. The vendored tree exists purely for reading.

To update the vendored copy when the workspace's `effect` dependency is
bumped (replace the tag to match the new version):

```bash
git subtree pull --prefix=repos/effect https://github.com/Effect-TS/effect.git effect@<version> --squash
```
