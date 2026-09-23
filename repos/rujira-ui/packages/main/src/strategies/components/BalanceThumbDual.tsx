import { FC } from "react";
import { useFragment } from "react-relay";
import { Link } from "react-router-dom";
import { graphql } from "relay-runtime";
import { Button, Decimal, IconDenom, useTranslation } from "rujira.ui";
import { BalanceThumbDualFragment$key } from "./__generated__/BalanceThumbDualFragment.graphql";

const fragment = graphql`
  fragment BalanceThumbDualFragment on BowAccount {
    id
    account
    pool {
      config {
        ... on BowConfigXyk {
          x {
            metadata {
              symbol
            }
          }
          y {
            metadata {
              symbol
            }
          }
        }
      }
    }
    value {
      amount
      asset {
        price {
          current
        }
        metadata {
          symbol
        }
      }
    }
    valueUsd
    ...BowPoolXykBalanceWithdrawFragment
  }
`;

export const BalanceThumbDual: FC<{ k: BalanceThumbDualFragment$key }> = ({
  k,
}) => {
  const { t } = useTranslation("strategies");
  const data = useFragment(fragment, k);

  const url = `amm/xyk/${data.pool.config.x?.metadata.symbol}-${data.pool.config.y?.metadata.symbol}`;

  return (
    <div className="relative card p-3">
      <div className="flex ai-c mt-0.5">
        <div className="lp">
          <IconDenom denom={data.pool.config.x?.metadata.symbol || ""} />
          <IconDenom denom={data.pool.config.y?.metadata.symbol || ""} />
        </div>
        <h3 className="condensed fs-24 fw-400 mb-0 ml-1">
          {data.pool.config.x?.metadata.symbol || ""}{" "}
          <span className="color-grey">/</span>{" "}
          {data.pool.config.y?.metadata.symbol || ""}
        </h3>
        <div className="tag tag--orange ml-a mr-0">{t("ammXyk")}</div>
      </div>
      <div className="row wrap pad--mini mt-2">
        <div className="col-4">
          <h4 className="fs-16 lh-22 fw-400 color-grey mb-0">
            {t("value")}
          </h4>

          <Decimal
            symbol="$"
            symbolLeft
            amount={BigInt(data.valueUsd)}
            decimals={8}
            round={2}
            className="fs-24 condensed"
          />
        </div>
      </div>
      <Button
        as={Link}
        to={url}
        className="button--small button--outline mt-2 w-full"
        label="Manage Position"
      />
    </div>
  );
};
