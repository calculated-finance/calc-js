import { FC, PropsWithChildren } from "react";
import { ETH } from "rujira.js";

export type LabelAsset = {
  metadata: { symbol: string };
  type: string;
  chain: string;
};

// True when an asset uses an ambiguous symbol that needs its network appended
// to disambiguate it from the canonical token (e.g. a secured USDT that lives
// on a chain other than Ethereum).
const needsNetworkSuffix = (asset: LabelAsset): boolean =>
  ((asset.metadata.symbol === "USDT" && asset.chain !== ETH) ||
    (asset.metadata.symbol === "ETH" && asset.chain !== ETH) ||
    (asset.metadata.symbol === "USDC" && asset.chain !== ETH)) &&
  asset.type === "SECURED";

// String form of <AssetLabel> for contexts that require a plain string rather
// than JSX (e.g. the `symbol` prop of <Decimal>).
export const assetLabel = (asset?: LabelAsset | null): string =>
  asset
    ? asset.metadata.symbol +
      (needsNetworkSuffix(asset) ? `.${asset.chain}` : "")
    : "";

export const AssetLabel: FC<
  PropsWithChildren<{
    asset?: LabelAsset | null | undefined;
    Container: FC<PropsWithChildren>;
  }>
> = ({ asset, Container }) =>
  asset ? (
    <>
      {asset.metadata.symbol}
      {needsNetworkSuffix(asset) && <Container>.{asset.chain}</Container>}
    </>
  ) : null;
