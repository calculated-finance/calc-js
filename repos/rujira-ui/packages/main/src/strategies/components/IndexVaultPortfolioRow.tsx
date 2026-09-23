import { FC } from "react";
import { graphql, useFragment } from "react-relay";
import { useNavigate } from "react-router-dom";
import { Decimal, IconDenom, classApr, formatApr, useTranslation } from "rujira.ui";
import { Subscription } from "../../services/useNodeSubscription";
import { IndexVaultPortfolioRowFragment$key } from "./__generated__/IndexVaultPortfolioRowFragment.graphql";

const row = graphql`
  fragment IndexVaultPortfolioRowFragment on IndexAccount {
    id
    index {
      id
      type
      shareAsset {
        metadata {
          symbol
        }
      }
      status {
        apr {
          value
          status
        }
      }
    }
    sharesValue
    allocations {
      asset {
        metadata {
          symbol
        }
      }
      balance
    }
  }
`;

const subscription = graphql`
  subscription IndexVaultPortfolioRowSubscription($id: ID!) {
    node(id: $id) {
      ... on IndexAccount {
        sharesValue
        shares
        index {
          status {
            apr {
              value
              status
            }
            allocations {
              currentWeight
            }
          }
        }
      }
    }
  }
`;

export const IndexVaultPortfolioRow: FC<{
  k: IndexVaultPortfolioRowFragment$key;
}> = ({ k }) => {
  const { t } = useTranslation("strategies");
  const { index, sharesValue, id, allocations } = useFragment(row, k);
  const url = `../../index/${index.shareAsset.metadata.symbol}`;

  const navigate = useNavigate();
  return (
    <tr onClick={() => navigate(url, { relative: "path" })} className="pointer">
      <Subscription id={id} subscription={subscription} />
      <td>
        <IconDenom
          denom={index.shareAsset.metadata.symbol || ""}
          className="w-3.5 mx-0.5"
        />
      </td>
      <td style={{ paddingLeft: "0" }}>
        <span>{index.shareAsset.metadata.symbol || ""}</span>
      </td>
      <td>
        <div className="tag tag--index ml-a mr-0">{t("index")}</div>
      </td>
      <td>
        {allocations.map((a) => (
          <Decimal
            key={a.asset.metadata.symbol}
            symbol={a.asset.metadata.symbol}
            amount={BigInt(a.balance)}
            round={4}
            symbolClassName="decimal__symbol--small color-grey condensed fw-500 mr-1"
          />
        ))}
      </td>
      <td className="text-right">
        <span className={classApr(index.status.apr)}>
          {formatApr(index.status.apr)}
        </span>
      </td>
      <td className="text-right">
        <Decimal
          amount={BigInt(sharesValue || 0)}
          symbol="$"
          symbolLeft
          round={2}
        />
      </td>
    </tr>
  );
};
