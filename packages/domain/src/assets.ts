export const ASSETS = {
  rune: {
    displayName: "RUNE",
    significantFigures: 8,
    coinGeckoId: "thorchain",
    color: "#2CBE8C",
  },
  "btc-btc": {
    displayName: "BTC",
    significantFigures: 8,
    coinGeckoId: "bitcoin",
    color: "#F89626",
  },
  "eth-eth": {
    displayName: "ETH",
    significantFigures: 8,
    coinGeckoId: "ethereum",
    color: "#9fa5c9",
  },
  "x/ruji": {
    displayName: "RUJI",
    significantFigures: 8,
    coinGeckoId: "rujira",
    color: "#ab3ddb",
  },
  "thor.lqdy": {
    displayName: "LQDY",
    significantFigures: 8,
    coinGeckoId: "liquidy",
    color: "#24776B",
  },
  "thor.auto": {
    displayName: "AUTO",
    significantFigures: 8,
    coinGeckoId: "auto-2",
    color: "#161C24",
  },
  "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": {
    displayName: "USDC",
    significantFigures: 8,
    coinGeckoId: "usd-coin",
    color: "#2775CA",
  },
  tcy: {
    displayName: "TCY",
    significantFigures: 8,
    coinGeckoId: "tcy",
    color: "#102A22",
  },
};

export const ASSETS_BY_COINGECKO_ID: Record<string, { rawName: string }> =
  Object.entries(ASSETS).reduce((acc, [rawName, asset]) => {
    const { coinGeckoId } = asset;
    acc[coinGeckoId] = { rawName };
    return acc;
  }, {} as Record<string, { rawName: string }>);

export const ASSETS_BY_DENOM = Object.entries(ASSETS).reduce(
  (acc, [rawName, asset]) => {
    acc[rawName] = asset;
    return acc;
  },
  {} as Record<string, (typeof ASSETS)[keyof typeof ASSETS]>
);
