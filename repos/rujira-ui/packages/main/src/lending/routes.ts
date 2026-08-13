import {
  AssetLike,
  assetToLendUrlSegment,
} from "../services/assetUrl";

export type LendRouteAsset = AssetLike & {
  asset: string;
};

export const lendRoute = (asset: AssetLike) =>
  `/lend/${assetToLendUrlSegment(asset)}`;

export const matchesLendVaultSegment = (
  asset: LendRouteAsset,
  segment: string
) => {
  const routeSegment = assetToLendUrlSegment(asset);

  if (routeSegment === segment) return true;

  try {
    return routeSegment === decodeURIComponent(segment);
  } catch {
    return false;
  }
};
