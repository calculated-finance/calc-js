import { FC } from "react";
import { graphql, useFragment } from "react-relay";
import { Link } from "react-router-dom";
import {
  Apr,
  Decimal,
  Fiat,
  formatApr,
  useTranslation,
  IconDenom,
} from "rujira.ui";
import { usePreloadedAccountData } from "../../services/accountData";
import { isUnclaimedMerge } from "../utils";
import { MergingFragment$key } from "./__generated__/MergingFragment.graphql";

export const MergingFragment = graphql`
  fragment MergingFragment on Account {
    merge {
      accounts {
        merged {
          amount
          asset {
            asset
            metadata {
              symbol
              decimals
            }
          }
        }
        rate
        shares
        size {
          amount
          asset {
            asset
            metadata {
              decimals
            }
            price {
              current
            }
          }
        }
        valueUsd
        pool {
          status {
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

export const Merging: FC = () => {
  const { t } = useTranslation("portfolio");
  const { accountData } = usePreloadedAccountData();
  const data = useFragment<MergingFragment$key>(MergingFragment, accountData);

  return (
    <div className="relative card p-3 mt-2">
      <div className="table-sticky table-sticky--first">
        <table className="table table--big condensed portfolio__balances">
          <thead>
            <tr>
              <th className="w-1 bg-black"></th>
              <th style={{ paddingLeft: 0 }}>{t("token")}</th>
              <th className="text-right">{t("mergedAmount")}</th>
              <th className="text-right">{t("rujiBalance")}</th>
              <th className="text-right">{t("totalValue")}</th>
              <th className="text-right">{t("currentApr")}</th>
            </tr>
          </thead>
          <tbody>
            {data?.merge?.accounts?.filter(isUnclaimedMerge).map((x) => (
              <Item
                key={x.merged.asset.asset}
                amount={x.merged.amount}
                denom={{
                  denom: x.merged.asset.asset,
                  metadata: x.merged.asset.metadata,
                }}
                rate={x.rate}
                size={{
                  amount: x.size.amount,
                  price:
                    (x.size.asset.price?.current && {
                      current: x.size.asset.price.current,
                    }) ||
                    undefined,
                  metadata: x.size.asset.metadata,
                }}
                value={x.valueUsd}
                apr={x.pool.status?.apr}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Item: FC<{
  amount: bigint;
  denom: {
    denom: string;
    metadata: {
      symbol: string;
      decimals: number;
    };
  };
  rate: bigint;
  size: {
    amount: bigint;
    price?: {
      current: bigint;
    };
    metadata: {
      decimals: number;
    };
  };
  value: bigint;
  apr: Apr | null | undefined;
}> = ({ amount, denom, size, value, apr }) => {
  return (
    <tr>
      <th className="bg-black">
        <Link to={`../../merge/${denom.metadata.symbol}`} className="no-underline">
          <IconDenom denom={denom.metadata.symbol} />
        </Link>
      </th>
      <td style={{ paddingLeft: 0 }}>
        <Link to={`../../merge/${denom.metadata.symbol}`} className="no-underline">
          <h3>{denom.metadata.symbol}</h3>
        </Link>
      </td>
      <td className="text-right">
        <Link
          to={`../../merge/${denom.metadata.symbol}`}
          className="no-underline color-white">
          <Decimal
            amount={amount}
            decimals={denom.metadata.decimals}
            round={6}
          />
        </Link>
      </td>
      <td className="text-right">
        <Link
          to={`../../merge/${denom.metadata.symbol}`}
          className="no-underline color-white">
          <Decimal
            amount={size.amount}
            decimals={size.metadata.decimals}
            round={6}
          />
        </Link>
      </td>
      <td className="text-right">
        {size.price?.current ? (
          <Fiat amount={value} decimals={8} symbol="$" padSymbol={false} />
        ) : (
          <span className="color-grey">&mdash;</span>
        )}
      </td>
      <td className="text-right color-teal">{formatApr(apr)}</td>
    </tr>
  );
};
