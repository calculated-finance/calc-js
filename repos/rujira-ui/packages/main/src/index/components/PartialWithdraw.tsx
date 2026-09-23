import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { Decimal, IconDenom, useTranslation } from "rujira.ui";

import { PartialWithdrawFragment$key } from "./__generated__/PartialWithdrawFragment.graphql";
import { Icons } from "rujira.ui";

const fragment = graphql`
  fragment PartialWithdrawFragment on IndexStatus {
    allocations {
      asset {
        metadata {
          symbol
          decimals
        }
      }
      targetWeight
    }
  }
`;

export const PartialWithdraw = ({
  k,
  rcptAmount,
}: {
  k?: PartialWithdrawFragment$key;
  rcptAmount: bigint;
}) => {
  const { t } = useTranslation();
  if (!k) return null;
  const { allocations } = useFragment(fragment, k);
  return (
    <div className="index__partial-grid">
      <div
        className="index__partial-tooltip"
        data-tooltip-content={t("partialWithdrawTooltip")}
        data-tooltip-id="global-tip">
        <Icons.Info className="w-3" />
      </div>
      {allocations.map((allocation) => (
        <div
          key={allocation.asset.metadata.symbol}
          className="index__partial-item">
          <IconDenom denom={allocation.asset.metadata.symbol} className="w-4" />
          <span className="index__partial-amount">
            <Decimal
              amount={rcptAmount * BigInt(allocation.targetWeight)}
              decimals={allocation.asset.metadata.decimals}
              className="fs-12"
              round={rcptAmount >= 10000000000n ? 3 : 8}
            />
          </span>
        </div>
      ))}
    </div>
  );
};
