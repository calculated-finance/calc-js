import { FC } from "react";
import { useFragment } from "react-relay";
import { Link, useNavigate } from "react-router-dom";
import { graphql } from "relay-runtime";
import { Button, Decimal, IconDenom, useTranslation } from "rujira.ui";
import { BowPoolXykThumbFragment$key } from "./__generated__/BowPoolXykThumbFragment.graphql";

const fragment = graphql`
  fragment BowPoolXykThumbFragment on BowAccount {
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
    valueUsd
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
  }
`;

export const BowPoolXykThumb: FC<{ k: BowPoolXykThumbFragment$key }> = ({
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

export const BowPoolXykRow: FC<{ k: BowPoolXykThumbFragment$key }> = ({
  k,
}) => {
  const { t } = useTranslation("strategies");
  const data = useFragment(fragment, k);
  const url = `../../strategies/amm/xyk/${data.pool.config.x?.metadata.symbol}-${data.pool.config.y?.metadata.symbol}`;
  const navigate = useNavigate();

  return (
    <tr onClick={() => navigate(url, { relative: "path" })} className="pointer">
      <td className="flex ai-c mt-0.5 pointer">
        <div className="lp">
          <IconDenom denom={data.pool.config.x?.metadata.symbol || ""} />
          <IconDenom denom={data.pool.config.y?.metadata.symbol || ""} />
        </div>
      </td>
      <td style={{ paddingLeft: "0" }}>
        {data.pool.config.x?.metadata.symbol || ""}{" "}
        <span className="color-grey">/</span>{" "}
        {data.pool.config.y?.metadata.symbol || ""}
      </td>
      <td>
        <div className="tag tag--orange ml-a mr-0">{t("ammXyk")}</div>
      </td>
      <td>
        {data?.value.map((x) => (
          <Decimal
            key={x.asset.metadata.symbol}
            symbol={x.asset.metadata.symbol}
            amount={BigInt(x.amount)}
            round={4}
            symbolClassName="decimal__symbol--small color-grey condensed fw-500 mr-1"
          />
        ))}
      </td>
      <td className="text-right">Soon&trade;</td>
      <td className="text-right">
        <Decimal
          symbol="$"
          symbolLeft
          amount={BigInt(data.valueUsd)}
          decimals={8}
          round={2}
        />
      </td>
    </tr>
  );
};
