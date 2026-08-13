import { Schema } from "effect";
import { ChainId } from "./chains.js";

export const FinPair = Schema.Struct({
  address: Schema.NonEmptyTrimmedString,
  denoms: Schema.Array(Schema.NonEmptyTrimmedString),
});

export type FinPair = Schema.Schema.Type<typeof FinPair>;

// Intentionally empty: as of 2026-08-13 no FIN order-book contracts exist on
// THORChain mainnet (verified against the full on-chain wasm code list — only
// Levana/DAO-DAO/nami/RUJI/CALC contracts are deployed). Populate when FIN
// launches; the client's fin-route UI stays dormant until then.
export const PAIRS_BY_CHAIN_ID: Record<ChainId, ReadonlyArray<FinPair>> = {};
