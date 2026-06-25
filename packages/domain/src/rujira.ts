import { Schema } from "effect";
import { ChainId } from "./chains.js";

export const FinPair = Schema.Struct({
  address: Schema.NonEmptyTrimmedString,
  denoms: Schema.Array(Schema.NonEmptyTrimmedString),
});

export type FinPair = Schema.Schema.Type<typeof FinPair>;

export const PAIRS_BY_CHAIN_ID: Record<ChainId, ReadonlyArray<FinPair>> = {};
