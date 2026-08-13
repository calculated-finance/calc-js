import { Network } from "./network";

// Relay-compatible Asset types

type Type = "LAYER_1" | "SECURED" | "NATIVE" | "SYNTH" | "%future added value";

export interface Asset {
  type: Type;
  chain: Network;
  asset: string;
  price?: {
    current: bigint | null | undefined;
    changeDay?: number | null | undefined;
  } | null;
  metadata: {
    decimals: number;
    symbol: string;
  };
  variants?: {
    layer1?: Asset | null;
    secured?: Asset | null;
    native?: { denom: string } | null;
  } | null;
}

type AssetSearchable = {
  asset?: string;
  chain?: string;
  metadata: { symbol: string };
};

type AssetPairSearchable = {
  assetBase: AssetSearchable;
  assetQuote: AssetSearchable;
};

export const assetPairFilter =
  (query?: string) =>
  (a: AssetPairSearchable): boolean => {
    if (!query) return true;

    const parts = query.trim().split(/[\s/-]/);

    if (parts.length === 1)
      return (
        checkAssetMatch(parts[0], a.assetBase) ||
        checkAssetMatch(parts[0], a.assetQuote)
      );
    return (
      checkAssetMatch(parts[0], a.assetBase) &&
      checkAssetMatch(parts[1], a.assetQuote)
    );
  };

export const assetPairSearchRank =
  (query?: string) =>
  (a: AssetPairSearchable): number => {
    if (normalize(query) !== "eth") return 0;
    return [a.assetBase, a.assetQuote].some(isEthAsset) ? 0 : 1;
  };

const assetSearchTargets = (asset: AssetSearchable): string[] => [
  asset.metadata.symbol,
  asset.asset || "",
  asset.chain ? `${asset.metadata.symbol}.${asset.chain}` : "",
];

const checkAssetMatch = (
  query: string,
  asset: AssetSearchable
): boolean =>
  !isExcludedEthSearchAsset(query, asset) &&
  assetSearchTargets(asset).some((target) => checkMatch(query, target));

const checkMatch = (query: string, target: string): boolean => {
  if (!query) return true;
  if (query === "*") return true;
  return target.toLowerCase().includes(query.toLowerCase());
};

const isExcludedEthSearchAsset = (
  query: string,
  asset: AssetSearchable
): boolean =>
  normalize(query) === "eth" &&
  asset.chain?.toUpperCase() === "ETH" &&
  ["USDC", "USDT"].includes(asset.metadata.symbol.toUpperCase());

const isEthAsset = (asset: AssetSearchable): boolean =>
  asset.metadata.symbol.toUpperCase() === "ETH";

const normalize = (value?: string): string => value?.trim().toLowerCase() || "";
