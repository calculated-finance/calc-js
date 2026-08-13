import { FC } from "react";
import { useFragment } from "react-relay";
import { Link } from "react-router-dom";
import { graphql } from "relay-runtime";
import { Decimal, Fiat, IconDenom, classApr, formatApr, useTranslation } from "rujira.ui";

import { Subscription } from "../../services/useNodeSubscription";
import { IndexVaultRowFragment$key } from "./__generated__/IndexVaultRowFragment.graphql";
import { Icons } from "rujira.ui";

const row = graphql`
  fragment IndexVaultRowFragment on IndexVault {
    id
    shareAsset {
      metadata {
        symbol
      }
    }
    status {
      allocations {
        asset {
          metadata {
            symbol
          }
        }
        balance
      }
      nav
      apr {
        value
        status
      }
    }
  }
`;

const subscription = graphql`
  subscription IndexVaultSubscription($id: ID!) {
    node(id: $id) {
      ... on IndexVault {
        status {
          allocations {
            balance
          }
          nav
          apr {
            value
            status
          }
        }
      }
    }
  }
`;

export const IndexVaultRow: FC<{ k: IndexVaultRowFragment$key }> = ({ k }) => {
  const { t } = useTranslation("strategies");
  const { id, shareAsset, status } = useFragment(row, k);
  const url = `../index/${shareAsset.metadata.symbol}`;
  return (
    <tr className="pointer">
      <Subscription id={id} subscription={subscription} />
      <td>
        <Link
          to={url}
          className="flex ai-c mt-0.5 no-underline color-white w-full">
          <IconDenom
            denom={shareAsset.metadata.symbol || ""}
            className="w-3.5 mx-0.5"
          />
          <h3 className="condensed fs-22 lh-22 fs-lg-28 lh-lg-28 fw-400 mb-0 ml-1 nowrap">
            {shareAsset.metadata.symbol || ""}
          </h3>
        </Link>
      </td>
      <td>
        <Link to={url} className="flex dir-c no-underline color-white w-full">
          <Fiat
            amount={BigInt(status.nav || 0)}
            symbol="$"
            decimals={8}
            className="fs-16 fs-md-18 color-white"
          />
          <div
            className="flex ai-c mt-0.5 gap-0.5"
            style={{ flexWrap: "wrap", maxWidth: "400px" }}>
            {status.allocations.map((a, index) => (
              <div key={a.asset.metadata.symbol}>
                <Decimal
                  key={a.asset.metadata.symbol}
                  round={2}
                  amount={BigInt(a.balance || 0)}
                  className="fs-12 fs-md-14 condensed color-grey"
                  symbol={a.asset.metadata.symbol}
                />
                {index < status.allocations.length - 1 && (
                  <span className="mx-1 color-grey opacity-8">/</span>
                )}
              </div>
            ))}
          </div>
        </Link>
      </td>
      <td className="text-right">
        <span className={classApr(status.apr)}>{formatApr(status.apr)}</span>
      </td>
      <td className="text-right">
        <Link to={url} className="block w-full text-right">
          <div className="tag tag--index">{t("index")}</div>
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
