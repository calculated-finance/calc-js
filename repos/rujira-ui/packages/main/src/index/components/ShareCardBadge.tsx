import { FC, useMemo } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { ShareCardBadgeAccountFragment$key } from "./__generated__/ShareCardBadgeAccountFragment.graphql";

import FishTierImage from "../assets/share-card-tier-fish.png";
import ShrimpTierImage from "../assets/share-card-tier-shrimp.png";
import WhaleTierImage from "../assets/share-card-tier-whale.png";

const balanceFragment = graphql`
  fragment ShareCardBadgeAccountFragment on Account {
    index {
      sharesValue
      index {
        id
      }
    }
  }
`;

// Tier thresholds (in USD)
const TIER_THRESHOLDS = {
  shrimp: BigInt(1 * 10 ** 8),
  fish: BigInt(501 * 10 ** 8),
  whale: BigInt(10001 * 10 ** 8),
} as const;

interface ShareCardBadgeProps {
  // Either Full account data with indexId
  account?: ShareCardBadgeAccountFragment$key;
  indexId?: string;
  // Or direct share value
  sharesValue?: bigint;
}

const getTierFromValue = (value: bigint) => {
  if (value >= TIER_THRESHOLDS.whale) return WhaleTierImage;
  if (value >= TIER_THRESHOLDS.fish) return FishTierImage;
  if (value >= TIER_THRESHOLDS.shrimp) return ShrimpTierImage;
  return null;
};

export const ShareCardBadge: FC<ShareCardBadgeProps> = ({
  account,
  indexId,
  sharesValue,
}) => {
  const balanceData = useFragment(balanceFragment, account);
  const tierLevelImage = useMemo(() => {
    if (sharesValue !== undefined) {
      const value = BigInt(sharesValue);
      return getTierFromValue(value);
    }

    if (!balanceData?.index) return null;

    const specificIndex = balanceData.index.find(
      (indexData) => indexData.index.id === indexId
    );

    if (!specificIndex) return null;

    // Get the shares value for this specific index (in USD)
    const indexValue = BigInt(specificIndex.sharesValue || 0);
    return getTierFromValue(indexValue);
  }, [balanceData, indexId]);

  // Don't render if no tier qualification
  if (!tierLevelImage) return null;

  return (
    <img
      src={tierLevelImage}
      alt={`Tier badge`}
      className="share-card-tier-badge"
    />
  );
};
