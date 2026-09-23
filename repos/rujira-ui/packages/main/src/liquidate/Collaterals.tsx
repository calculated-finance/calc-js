import clsx from "clsx";
import { FC, useEffect } from "react";
import { PreloadedQuery, usePreloadedQuery, useQueryLoader } from "react-relay";
import { graphql } from "relay-runtime";
import { priceFormatter } from "rujira.js";
import { formatBigintPercent } from "../common/bigint";
import { Icons, IconDenom, nFormatter } from "rujira.ui";
import { CollateralsQuery } from "./__generated__/CollateralsQuery.graphql";
import { Link } from "react-router-dom";

const query = graphql`
  query CollateralsQuery {
    ghostCredit {
      collaterals {
        asset {
          asset
          metadata {
            symbol
          }
          price {
            current
            changeDay
          }
        }
        ratio
        total
      }
    }
  }
`;

export const Collaterals: FC = () => {
  const [q, load] = useQueryLoader<CollateralsQuery>(query);
  useEffect(() => {
    load({});
  }, []);
  return q ? <Content q={q} /> : null;
};

const Content: FC<{ q: PreloadedQuery<CollateralsQuery> }> = ({ q }) => {
  const data = usePreloadedQuery<CollateralsQuery>(query, q);
  return (
    <div className="table-sticky">
      <table className="table table--big condensed">
        <thead>
          <tr>
            <th>Token</th>
            <th className="text-right">Collateral Ratio</th>
            <th className="text-right">Price</th>
            <th className="text-right">Change</th>
            <th className="text-right">Total Deposits</th>
          </tr>
        </thead>
        <tbody>
          {data.ghostCredit?.collaterals.map((a) => (
            <tr key={a.asset.asset}>
              <td>
                {/* {a.asset.metadata.symbol} */}
                <Link
                  to="/borrow/BTC/USDC"
                  className="flex ai-c mt-0.5 no-underline color-white w-full">
                  <IconDenom
                    denom={a.asset.metadata.symbol}
                    className="w-2.5"
                  />
                  <h3 className="condensed fs-16 lh-16 fs-lg-20 lh-lg-20 fw-400 mb-0 ml-1 nowrap">
                    {a.asset.metadata.symbol}
                  </h3>
                </Link>
              </td>
              <td className="text-right">{formatBigintPercent(a.ratio)}</td>
              <td className="text-right">
                {a.asset.price?.current ? (
                  <>${priceFormatter(a.asset.price.current)}</>
                ) : null}
              </td>
              <td className="text-right w-1">
                <div
                  className={clsx({
                    "flex ai-c jc-e fs-12": true,
                    "color-teal":
                      a.asset.price?.changeDay && a.asset.price.changeDay > 0,
                    "color-red":
                      a.asset.price?.changeDay && a.asset.price.changeDay < 0,
                  })}>
                  {a.asset.price?.changeDay ? (
                    <>
                      {a.asset.price.changeDay.toLocaleDecimal(2)}%
                      {a.asset.price.changeDay > 0 ? (
                        <Icons.TrendUp className="h-2 w-a ml-0.5" />
                      ) : (
                        <Icons.TrendDown className="h-2 w-a ml-0.5" />
                      )}
                    </>
                  ) : null}
                </div>
              </td>
              <td className="text-right">{nFormatter(a.total, 2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
