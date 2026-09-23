import { Asset } from "rujira.js";

const runeBase: Asset = {
  type: "NATIVE",
  chain: "THOR",
  asset: "THOR.RUNE",
  metadata: {
    decimals: 8,
    symbol: "RUNE",
  },
  variants: null,
};

export const RUNE: Asset = {
  ...runeBase,
  variants: {
    layer1: runeBase,
    native: { denom: "rune" },
  },
};

const SUNSET_SYMBOLS = new Set([
  "KUJI",
  "FUZN",
  "NSTK",
  "LVN",
  "rKUJI",
  "RKUJI",
  "WINK",
  "NAMI",
]);

export const isSunsetSymbol = (symbol: string): boolean =>
  SUNSET_SYMBOLS.has(symbol);
