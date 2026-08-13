import { FC } from "react";
import { graphql, useFragment } from "react-relay";
import { useNavigate } from "react-router-dom";
import {
  Decimal,
  IconDenom,
  formatApr,
  useLocale,
  useTranslation,
} from "rujira.ui";
import { Subscription } from "../../services/useNodeSubscription";
import { stakeRoute } from "../../staking/routes";
import { StakingPoolPortfolioRowFragment$key } from "./__generated__/StakingPoolPortfolioRowFragment.graphql";

const row = graphql`
  fragment StakingPoolPortfolioRowFragment on StakingAccount {
    id
    pool {
      bondAsset {
        metadata {
          symbol
        }
      }
      summary {
        apr {
          value
          status
        }
      }
    }
    bonded {
      amount
    }
    liquidSize {
      amount
    }
    pendingRevenue {
      amount
      asset {
        metadata {
          symbol
        }
      }
    }
    valueUsd
  }
`;

const subscription = graphql`
  subscription StakingPoolPortfolioRowSubscription($id: ID!) {
    node(id: $id) {
      ... on StakingAccount {
        valueUsd
        pool {
          summary {
            apr {
              value
              status
            }
          }
        }
      }
    }
  }
`;

export const StakingPoolPortfolioRow: FC<{
  k: StakingPoolPortfolioRowFragment$key;
}> = ({ k }) => {
  const { t } = useTranslation("strategies");
  const { toRoot } = useLocale();
  const { pool, valueUsd, id, bonded, liquidSize, pendingRevenue } =
    useFragment(row, k);
  const url = toRoot(stakeRoute(pool.bondAsset));
  const navigate = useNavigate();
  return (
    <tr onClick={() => navigate(url)} className="pointer">
      <Subscription id={id} subscription={subscription} />
      <td>
        <IconDenom
          denom={pool.bondAsset.metadata.symbol || ""}
          className="w-3.5 mx-0.5"
        />
      </td>
      <td style={{ paddingLeft: "0" }}>
        <span>{pool.bondAsset.metadata.symbol || ""}</span>
      </td>
      <td>
        <div className="tag tag--primary ml-a mr-0">{t("staking")}</div>
      </td>
      <td>
        <Decimal
          symbol={pool.bondAsset.metadata.symbol}
          amount={BigInt(bonded.amount) + BigInt(liquidSize.amount)}
          round={4}
          symbolClassName="decimal__symbol--small color-grey condensed fw-500 mr-1"
        />
        {BigInt(pendingRevenue.amount) ? (
          <Decimal
            symbol={pendingRevenue.asset.metadata.symbol}
            amount={BigInt(pendingRevenue.amount)}
            round={4}
            symbolClassName="decimal__symbol--small color-grey condensed fw-500 mr-1"
          />
        ) : null}
      </td>
      <td className="text-right">{formatApr(pool.summary.apr)}</td>
      <td className="text-right">
        <Decimal
          amount={BigInt(valueUsd || 0)}
          symbol="$"
          symbolLeft
          round={2}
        />
      </td>
    </tr>
  );
};
