import { FC } from "react";
import { useFragment } from "react-relay";
import { Link } from "react-router-dom";
import { graphql } from "relay-runtime";
import {
  Decimal,
  Fiat,
  IconDenom,
  formatApr,
  useLocale,
  useTranslation,
} from "rujira.ui";

import { Icons } from "rujira.ui";
import { Subscription } from "../../services/useNodeSubscription";
import { stakeRoute } from "../../staking/routes";
import { StakingPoolRowFragment$key } from "./__generated__/StakingPoolRowFragment.graphql";

const row = graphql`
  fragment StakingPoolRowFragment on StakingPool {
    id
    bondAsset {
      metadata {
        symbol
      }
    }
    stakingStatus: status {
      accountBond
      liquidBondSize
      valueUsd
    }
    stakingSummary: summary {
      apr {
        value
        status
      }
    }
  }
`;

const subscription = graphql`
  subscription StakingPoolSubscription($id: ID!) {
    node(id: $id) {
      ... on StakingPool {
        status {
          accountBond
          liquidBondSize
          valueUsd
        }
        stakingSummary: summary {
          apr {
            value
            status
          }
        }
      }
    }
  }
`;

export const StakingPoolRow: FC<{ k: StakingPoolRowFragment$key }> = ({
  k,
}) => {
  const { t } = useTranslation("strategies");
  const { toRoot } = useLocale();
  const { id, bondAsset, stakingStatus, stakingSummary } = useFragment(row, k);
  const url = toRoot(stakeRoute(bondAsset));

  const label =
    bondAsset.metadata.symbol == "LP-X/RUJI-RUNE"
      ? "RUJI / RUNE CLP"
      : bondAsset.metadata.symbol;
  return (
    <tr className="pointer">
      <Subscription id={id} subscription={subscription} />
      <td>
        <Link
          to={url}
          className="flex ai-c mt-0.5 no-underline color-white w-full">
          <IconDenom denom={label || ""} className="w-3.5 mx-0.5" />
          <h3 className="condensed fs-22 lh-22 fs-lg-28 lh-lg-28 fw-400 mb-0 ml-1 nowrap">
            {label || ""}
          </h3>
        </Link>
      </td>
      <td>
        <Link to={url} className="flex dir-c no-underline color-white w-full">
          <Fiat
            amount={BigInt(stakingStatus?.valueUsd || 0)}
            symbol="$"
            decimals={8}
            className="fs-16 fs-md-18 color-white"
          />
          <div className="flex ai-c mt-0.5">
            <Decimal
              amount={
                BigInt(stakingStatus?.accountBond || 0) +
                BigInt(stakingStatus?.liquidBondSize || 0)
              }
              className="fs-12 fs-md-14 condensed color-grey"
              symbol={label}
            />
          </div>
        </Link>
      </td>

      <td className="text-right">{formatApr(stakingSummary.apr)}</td>
      <td className="text-right">
        <Link to={url} className="block w-full text-right">
          <div className="tag tag--primary">{t("staking")}</div>
        </Link>
      </td>
      <td className="w-3">
        <Link to={url} className="block w-full text-right">
          <Icons.AngleRight className="w-3 h-3 color-grey" />
        </Link>
      </td>
    </tr>
  );
};
