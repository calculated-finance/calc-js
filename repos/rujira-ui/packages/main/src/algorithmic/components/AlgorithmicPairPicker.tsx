import { FC, Suspense, useLayoutEffect, useMemo, useState } from "react";
import { useLazyLoadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import { AssetLike } from "../../services/assetUrl";
import { AlgorithmicPairPickerQuery } from "./__generated__/AlgorithmicPairPickerQuery.graphql";
import { ALL_PAIRS, PairOption, PairSelect } from "./PairSelect";

// Exported so AlgorithmicLeaderboard's filter panel can reuse this same query.
export const query = graphql`
  query AlgorithmicPairPickerQuery {
    finV3 {
      pairs(first: 200, sortBy: NAME, sortDir: ASC) {
        edges {
          node {
            assetBase {
              asset
              type
              chain
              metadata {
                symbol
                decimals
              }
            }
            assetQuote {
              asset
              type
              chain
              metadata {
                symbol
                decimals
              }
            }
          }
        }
      }
    }
  }
`;

export type PairNode = NonNullable<
  NonNullable<
    NonNullable<
      AlgorithmicPairPickerQuery["response"]["finV3"]["pairs"]
    >["edges"]
  >[number]
>["node"];

export type PairAsset = NonNullable<PairNode>["assetBase"];

// This page always wants a pair selected (it drives the "Create strategy"
// link below it), so we pre-select this pair once the list loads instead of
// starting on "All pairs".
const DEFAULT_BASE_SYMBOL = "ETH";
const DEFAULT_QUOTE_SYMBOL = "BTC";

// Deliberately not DenomPair<AssetLike> — AssetLike.type is optional (shared
// by several URL-building helpers with looser data), which doesn't satisfy
// DenomPair's LabelAsset constraint (type: required).
export interface SelectedPairAssets {
  baseAsset: AssetLike;
  quoteAsset: AssetLike;
}

interface PairPickerProps {
  className?: string;
  onSelect?: (asset: SelectedPairAssets | undefined) => void;
}

// A standalone pair picker independent of the leaderboard below it — its own
// query against finV3.pairs (the full tradeable universe, not just pairs with
// open/closed range positions) and its own selection state.
const PairPickerContent: FC<PairPickerProps> = ({ className, onSelect }) => {
  const data = useLazyLoadQuery<AlgorithmicPairPickerQuery>(query, {});

  const options = useMemo<PairOption<PairAsset>[]>(() => {
    const edges = data.finV3.pairs?.edges ?? [];
    return edges
      .map((e) => e?.node)
      .filter((n): n is NonNullable<PairNode> => !!n)
      .map((n) => ({
        key: `${n.assetBase.asset}/${n.assetQuote.asset}`,
        asset: { baseAsset: n.assetBase, quoteAsset: n.assetQuote },
      }));
  }, [data]);

  // useLazyLoadQuery + Suspense means `options` is already available on
  // first render, so the default can be computed directly in the initializer
  // — no flash of "All pairs" before it flips to the real default.
  const [pair, setPair] = useState<string>(
    () =>
      options.find(
        (o) =>
          o.asset.baseAsset.metadata.symbol === DEFAULT_BASE_SYMBOL &&
          o.asset.quoteAsset.metadata.symbol === DEFAULT_QUOTE_SYMBOL
      )?.key ?? ALL_PAIRS
  );

  useLayoutEffect(() => {
    onSelect?.(options.find((o) => o.key === pair)?.asset);
  }, [pair, options, onSelect]);

  return (
    <PairSelect
      options={options}
      pair={pair}
      setPair={setPair}
      clearable={false}
      className={className}
    />
  );
};

export const AlgorithmicPairPicker: FC<PairPickerProps> = ({
  className,
  onSelect,
}) => (
  <Suspense fallback={<div className="skeleton h-3 w-12 br-2" />}>
    <PairPickerContent className={className} onSelect={onSelect} />
  </Suspense>
);
