---
name: domain-context
description: Use when the user asks about Rujira protocol mechanics (swaps, FIN orderbook, lending, THORChain memos, strategies, tokenomics, CCL curves) and needs context beyond what the code reveals. Pulls from the official docs and maps protocol concepts to their codebase implementations.
allowed-tools: [Read, Grep, Glob, WebFetch]
---

Fetch and summarise Rujira protocol context for the topic the user names. When working on features that involve protocol-level logic, you need domain context beyond what the code tells you. This skill pulls from the official Rujira documentation and maps protocol concepts to their codebase implementations.

## Steps

### 1 — Fetch protocol documentation

Use WebFetch to retrieve:
- `https://docs.rujira.network/llms.txt` (LLM-friendly summary)

If the topic needs deeper detail, also fetch:
- `https://docs.rujira.network/llms-full.txt` (full documentation)

### 2 — Extract relevant sections

From the fetched documentation, extract everything relevant to the topic:
- Protocol mechanics (how it works on-chain)
- Parameters and configuration
- Transaction types involved
- Token flows and fee structures
- Error conditions and edge cases

### 3 — Map to codebase

For each protocol concept found, identify where it lives in the codebase:
- **Message types** → `packages/rujira.js/src/msgs/`
- **Signer logic** → `packages/rujira.js/src/signers/`
- **UI components** → `packages/main/src/<feature>/`
- **GraphQL types** → `packages/main/data/schema.graphql`
- **Amount/precision handling** → `packages/rujira.js/src/bigint.ts`, `packages/rujira.ui/src/helpers/`

### 4 — Output

```
Topic: <topic>

Protocol summary:
  <3-5 sentences explaining how this works at the protocol level>

Key concepts:
  <concept>: <definition>
  ...

Transaction flow:
  <step-by-step of what happens on-chain>

Codebase mapping:
  Protocol concept        → Code location
  <concept 1>             → <file:line or package/path>
  <concept 2>             → <file:line or package/path>
  ...

Parameters / constants:
  <any relevant thresholds, fee rates, limits>

Edge cases to watch:
  - <things that can go wrong, precision issues, chain-specific quirks>
```

If the documentation does not cover the requested topic, say so explicitly and suggest alternative sources or related topics that are documented.
