const THOR_CHAIN = "THOR";

/**
 * Explicit canonical chain for symbols whose "home" chain differs from the
 * symbol itself. Used to determine whether a chain needs to be surfaced via
 * URL path segments or query params.
 * Maintained manually - add new entries here as needed.
 */
export const CANONICAL_ASSETS: Record<string, string> = {
  "AAVE.ETH": "AAVE",
  "DAI.ETH": "DAI",
  "FOX.ETH": "FOX",
  "GUSD.ETH": "GUSD",
  "LINK.ETH": "LINK",
  "LUSD.ETH": "LUSD",
  "TGT.ETH": "TGT",
  "THOR.ETH": "THOR",
  "USDC.ETH": "USDC",
  "USDT.ETH": "USDT",
  "USDP.ETH": "USDP",
  "VTHOR.ETH": "VTHOR",
  "WBTC.ETH": "WBTC",
  "YFI.ETH": "YFI",
  "cbBTC.BASE": "cbBTC",
  "BNB.BSC": "BNB",
  "ATOM.GAIA": "ATOM",
};

export interface AssetLike {
  chain: string;
  metadata: { symbol: string };
  type?: string;
}

/**
 * Symbols that exist on multiple chains with no canonical "home" chain, and
 * would therefore be ambiguous as a bare symbol. These always keep their chain
 * suffix, `${symbol}.${chain}`. Symbols with a defined home chain belong in
 * `CANONICAL_ASSETS` instead (e.g. WBTC -> Ethereum). Maintained manually - add
 * new entries here as needed.
 */
export const TRADE_AMBIGUOUS_SYMBOLS = new Set<string>([]);

/** Reverse-lookup of `CANONICAL_ASSETS`: symbol -> its canonical chain. */
export const canonicalChainFor = (symbol: string): string => {
  for (const [key, sym] of Object.entries(CANONICAL_ASSETS)) {
    if (sym === symbol) return key.split(".")[1];
  }
  return symbol;
};

/**
 * Asset -> canonical URL segment, e.g. "BTC", "USDC", "WBTC.ETH".
 * Bare symbol for everything except `TRADE_AMBIGUOUS_SYMBOLS`, which keep
 * their chain suffix to disambiguate. The underlying chain (e.g. for SECURED
 * assets or non-canonical chains) is instead surfaced via `assetToNetworkParam`.
 */
export const assetToUrlSegment = (asset: AssetLike): string => {
  const {
    chain,
    metadata: { symbol },
  } = asset;
  if (TRADE_AMBIGUOUS_SYMBOLS.has(symbol)) return `${symbol}.${chain}`;
  return symbol;
};

/**
 * Internal: the asset's chain, but only when it is NOT the chain implied by a
 * bare segment (THOR, an ambiguous symbol, or the symbol's canonical chain).
 * `findAssetByUrlSegment` uses the `=== undefined` case to pick the canonical
 * default among same-segment matches.
 */
const assetToChainParam = (asset: AssetLike): string | undefined => {
  const {
    chain,
    metadata: { symbol },
  } = asset;
  if (chain === THOR_CHAIN) return undefined;
  if (TRADE_AMBIGUOUS_SYMBOLS.has(symbol)) return undefined;
  if (chain === canonicalChainFor(symbol)) return undefined;
  return chain;
};

/**
 * Asset -> optional `fromChain`/`toChain` query param value, network-aware.
 * Unlike `assetToChainParam` (which also omits the param whenever the chain is
 * the symbol's canonical chain), this omits it *only* for assets that live on
 * Rujira/THORChain - SECURED variants and native THOR assets. Every external
 * chain (e.g. USDC on Ethereum) is surfaced so it stays distinguishable from
 * the Rujira variant of the same symbol. Ambiguous symbols already encode the
 * chain in their path segment, so no param is needed for them either.
 * Used for Borrow's debt asset and Swap's from/to assets.
 */
export const assetToNetworkParam = (asset: AssetLike): string | undefined => {
  const {
    chain,
    type,
    metadata: { symbol },
  } = asset;
  if (type === "SECURED") return undefined;
  if (chain === THOR_CHAIN) return undefined;
  if (TRADE_AMBIGUOUS_SYMBOLS.has(symbol)) return undefined;
  return chain;
};

/**
 * Asset -> chain-suffixed URL segment, e.g. "BTC", "USDC", "ETH.BASE",
 * "USDC.AVAX". Unlike `assetToUrlSegment`, every non-canonical chain is
 * suffixed (not just `TRADE_AMBIGUOUS_SYMBOLS`), so that distinct assets for
 * the same symbol on different chains (e.g. ETH on Ethereum vs Base, USDC on
 * Ethereum vs Avalanche/Base/BSC) never collide on the same URL. THOR-chain
 * and canonical-chain assets get the bare symbol, implying the
 * THORChain/Rujira network.
 * Used for Trade pair links, Swap asset segments, and Borrow asset segments.
 */
export const assetToTradeUrlSegment = (asset: AssetLike): string => {
  const {
    chain,
    metadata: { symbol },
  } = asset;
  if (chain === THOR_CHAIN || chain === canonicalChainFor(symbol)) return symbol;
  return `${symbol}.${chain}`;
};

/**
 * Asset -> lending vault URL segment, e.g. "USDC", "USDC.BASE".
 * Lending uses the same canonical-chain rule as Trade/Borrow route segments:
 * the canonical chain stays bare, and non-canonical chains are suffixed.
 */
export const assetToLendUrlSegment = (asset: AssetLike): string =>
  assetToTradeUrlSegment(asset);

/**
 * Normalizes a `fromChain`/`toChain` query param. THORChain/Rujira is the
 * implied home network of a bare/canonical segment, so an explicit `THOR`
 * (or the user-facing `RUJIRA`) is treated the same as an omitted param -
 * resolving to the Rujira (SECURED) variant. Any other chain is returned
 * unchanged.
 */
export const normalizeChainParam = (
  chainParam?: string | null
): string | undefined => {
  if (!chainParam) return undefined;
  const upper = chainParam.toUpperCase();
  if (upper === THOR_CHAIN || upper === "RUJIRA") return undefined;
  return chainParam;
};

/**
 * URL segment (+ optional chain param) -> matching asset from a known list
 * (e.g. balances, collaterals, pools).
 */
export const findAssetByUrlSegment = <T extends AssetLike>(
  segment: string,
  assets: readonly T[],
  chainParam?: string
): T | undefined => {
  const matches = assets.filter((a) => assetToUrlSegment(a) === segment);
  if (chainParam) {
    const onChain = matches.filter((a) => a.chain === chainParam);
    // A chain param signals an external (L1) asset, so prefer the non-SECURED
    // variant over the Rujira (SECURED) one when both share that chain.
    if (onChain.length)
      return onChain.find((a) => a.type !== "SECURED") ?? onChain[0];
  }
  if (matches.length > 0) {
    // No chain param implies the Rujira (SECURED) variant, falling back to the
    // canonical-chain asset and finally any match.
    return (
      matches.find((a) => a.type === "SECURED") ??
      matches.find((a) => assetToChainParam(a) === undefined) ??
      matches[0]
    );
  }
  // Chain-suffixed segments (e.g. "USDC.AVAX" from `assetToTradeUrlSegment`),
  // also covering legacy bookmarked `${symbol}.${chain}` URLs. The suffix is
  // the asset's underlying chain, shared by its SECURED and LAYER_1 variants,
  // so `chainParam` disambiguates: present => external (L1) variant, absent =>
  // the Rujira (SECURED) variant.
  const [symbol, chain] = segment.split(".");
  if (chain) {
    const onChain = assets.filter(
      (a) => a.metadata.symbol === symbol && a.chain === chain
    );
    if (onChain.length)
      return chainParam
        ? (onChain.find((a) => a.type !== "SECURED") ?? onChain[0])
        : (onChain.find((a) => a.type === "SECURED") ?? onChain[0]);
  }
  // Bare-symbol fallback, e.g. "WBTC" resolving to a WBTC.ETH-only asset list.
  return assets.find((a) => a.metadata.symbol === segment);
};

/**
 * Default chain to assume for a bare ambiguous-symbol Trade segment when
 * constructing a FinPair lookup id. Symbols with a canonical home chain are
 * handled via `CANONICAL_ASSETS` instead; this is only for symbols with no
 * canonical home. Maintained manually - add new entries here as needed.
 */
const DEFAULT_CHAIN_FOR_AMBIGUOUS: Record<string, string> = {};

/**
 * Normalizes a Trade base/quote URL segment for FinPair id construction.
 * Bare ambiguous symbols get their default chain appended. Bare symbols whose
 * canonical chain differs from the symbol itself (e.g. "USDT" -> chain ETH,
 * "LINK" -> chain ETH, "ATOM" -> chain GAIA, "BNB" -> chain BSC, "cbBTC" ->
 * chain BASE) get that chain appended too, since the FinPair id requires
 * `${symbol}.${chain}` unless `chain === symbol` or `chain === THOR`.
 * USDC is the one exception: `USDC.ETH` is the canonical FinPair market and
 * is addressed by the bare "USDC" id. Everything else is returned unchanged.
 */
export const normalizeTradeSegment = (segment: string): string => {
  if (segment.includes(".")) return segment;
  const defaultChain = DEFAULT_CHAIN_FOR_AMBIGUOUS[segment];
  if (defaultChain) return `${segment}.${defaultChain}`;
  if (segment === "USDC") return segment;
  const chain = canonicalChainFor(segment);
  return chain !== segment ? `${segment}.${chain}` : segment;
};

/**
 * Best-effort fallback shape for a URL segment (+ optional chain param)
 * before real asset data has loaded, e.g. for placeholder selections.
 */
export const parseUrlSegment = (
  segment: string,
  chainParam?: string
): AssetLike => {
  const [symbol, chain] = segment.split(".");
  return { chain: chain ?? chainParam ?? symbol, metadata: { symbol } };
};
