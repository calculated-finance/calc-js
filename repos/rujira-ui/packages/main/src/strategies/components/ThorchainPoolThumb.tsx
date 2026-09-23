import { FC } from "react";
import { useFragment } from "react-relay";
import { Link, useNavigate } from "react-router-dom";
import { graphql } from "relay-runtime";
import { Button, Decimal, IconDenom, useTranslation } from "rujira.ui";
import { ThorchainPoolThumbFragment$key } from "./__generated__/ThorchainPoolThumbFragment.graphql";
import { ThorchainPoolTag } from "./ThorchainPool";

const fragment = graphql`
  fragment ThorchainPoolThumbFragment on ThorchainLiquidityProvider {
    asset {
      asset
      metadata {
        symbol
      }
      price {
        current
      }
    }
    valueUsd
    assetRedeemValue
    runeRedeemValue
  }
`;

export const ThorchainPoolThumb: FC<{ k: ThorchainPoolThumbFragment$key }> = ({
  k,
}) => {
  const { t } = useTranslation("strategies");
  const data = useFragment(fragment, k);
  const url = `amm/thorchain/${data.asset.asset}`;

  return (
    <div className="relative card p-3">
      <div className="flex ai-c mt-0.5">
        <div className="lp">
          <IconDenom denom={data.asset.metadata.symbol} />
          <IconDenom denom={"RUNE"} />
        </div>
        <h3 className="condensed fs-24 fw-400 mb-0 ml-1">
          {data.asset.metadata.symbol} <span className="color-grey">/</span>{" "}
          RUNE
        </h3>
        <ThorchainPoolTag short />
      </div>
      <div className="row wrap pad--mini mt-2">
        <div className="col-4">
          <h4 className="fs-16 lh-22 fw-400 color-grey mb-0">
            {t("value")}
          </h4>

          <Decimal
            symbol="$"
            symbolLeft
            amount={BigInt(data?.valueUsd || 0)}
            round={2}
            decimals={8}
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

export const ThorchainPoolRow: FC<{ k: ThorchainPoolThumbFragment$key }> = ({
  k,
}) => {
  const data = useFragment(fragment, k);
  const url = `../../strategies/amm/thorchain/${data.asset.asset}`;
  const navigate = useNavigate();

  return (
    <tr onClick={() => navigate(url, { relative: "path" })} className="pointer">
      <td className="flex ai-c mt-0.5 pointer">
        <div className="lp">
          <IconDenom denom={data.asset.metadata.symbol} />
          <IconDenom denom={"RUNE"} />
        </div>
      </td>
      <td style={{ paddingLeft: "0" }}>
        {data.asset.metadata.symbol} <span className="color-grey">/</span> RUNE
      </td>
      <td>
        <ThorchainPoolTag short />
      </td>
      <td>
        <Decimal
          symbol={data?.asset.metadata.symbol || ""}
          amount={BigInt(data?.assetRedeemValue || 0)}
          round={4}
          symbolClassName="decimal__symbol--small color-grey condensed fw-500 mr-1"
        />
        <Decimal
          symbol="RUNE"
          amount={BigInt(data?.runeRedeemValue || 0)}
          round={4}
          symbolClassName="decimal__symbol--small color-grey condensed fw-500 mr-1"
        />
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
