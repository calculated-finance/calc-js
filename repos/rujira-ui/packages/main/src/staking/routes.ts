export type StakeRouteAsset = {
  readonly metadata: {
    readonly symbol: string;
  };
};

export const stakeRoute = (asset: string | StakeRouteAsset) => {
  const symbol = typeof asset === "string" ? asset : asset.metadata.symbol;

  return `/stake/${encodeURIComponent(symbol)}`;
};

export const matchesStakingPoolSegment = (
  bondAsset: StakeRouteAsset,
  segment: string
) => {
  const symbol = bondAsset.metadata.symbol;

  if (symbol === segment) return true;
  if (encodeURIComponent(symbol) === segment) return true;

  try {
    return symbol === decodeURIComponent(segment);
  } catch {
    return false;
  }
};
