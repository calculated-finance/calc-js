## v2 Domain Layer Note

Purpose: Provide an isolated, forward-compatible strategy graph domain ("v2") decoupled from legacy modules while embracing Effect for:

1. Declarative schema-driven decoding (`v2_parseGraph`) using capitalized Effect Schema constructors.
2. Precise, tagged domain errors (`v2_errors.ts`) for validation vs encoding concerns.
3. Total separation of pure model (`v2_strategyModel.ts`) from validation (`v2_strategyValidation.ts`) and wire encoding (`v2_strategyEncoding.ts`).
4. Composable, side-effect-safe builder API (`v2_strategyBuilder.ts`) returning Effects, enabling ergonomic integration in UI / service layers.

Key Files:

- v2_strategyModel.ts: Fundamental TS types (no Effect dependency except via consumers).
- v2_strategySchema.ts: Capitalized Schema API; payloads remain opaque (`unknown`) pending concrete action/condition variants.
- v2_strategyValidation.ts: Graph invariants (acyclic, reachable, single root connections validity) plus cycle prediction helper.
- v2_strategyEncoding.ts: Stable topological ordering for on-chain node array emission.
- v2_strategyBuilder.ts: In-memory mutable builder with immutable snapshots; now includes convenience `addActionAndConnect` / `addConditionAndConnect` helpers.
- v2_errors.ts: Tagged error taxonomy (Validation, Encoding, NotFound, Conflict, Invariant).
- v2_index.ts: Barrel export surface.

Design Choices:

- Map-based `nodes` retained for efficient mutation; exposed snapshot remains a shallow copy to discourage external mutation (callers should treat as immutable).
- Optional properties modelled as `prop?: T | undefined` to align with Effect Schema optional output under `exactOptionalPropertyTypes`.
- Payloads intentionally unvalidated: downstream layers may supply specific schemas and refine via `S.extend` / intersections without forcing the core to know on-chain specifics.
- Encoding performs a validation pass first to guarantee structural soundness before ordering.

Extensibility Hooks:

- Introduce branded node IDs later (e.g., `type V2NodeId = string & { readonly V2NodeId: unique symbol }`) with a schema refinement.
- Replace opaque `unknown` payloads with discriminated unions + schema composition for each action / condition variant.
- Add layering / environment via Effect Layers if persistence or external service lookups become necessary.

Testing Focus (to add / extend):

- Cycle prevention, unreachable node detection, encoding order determinism.
- Schema round-trip once payload schemas are concrete.

Migration Thoughts:

- Legacy strategy usage can adapter-transform into v2 graph then leverage validation + encoding for consistency.

End.
