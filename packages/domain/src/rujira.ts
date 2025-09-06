import { Schema } from "effect";
import { ChainId } from "./chains.js";
import type { Addr } from "./cosmwasm.js";

export const FinPair = Schema.Struct({
  address: Schema.NonEmptyTrimmedString,
  denoms: Schema.Array(Schema.NonEmptyTrimmedString),
});

export type FinPair = Schema.Schema.Type<typeof FinPair>;

export const STAGENET_FIN_PAIRS: ReadonlyArray<FinPair> = [
  {
    address:
      "sthor1knzcsjqu3wpgm0ausx6w0th48kvl2wvtqzmvud4hgst4ggutehlseele4r" as Addr,
    denoms: ["rune", "x/ruji"],
  },
];

export const PAIRS_BY_CHAIN_ID: Record<ChainId, ReadonlyArray<FinPair>> = {
  "thorchain-stagenet-2": STAGENET_FIN_PAIRS,
};
