import { FC } from "react";
import { useFragment } from "react-relay";
import { Link } from "react-router-dom";
import { graphql } from "relay-runtime";
import { Button, Fiat, IconDenom, useLocale, useTranslation } from "rujira.ui";
import { stakeRoute } from "../../staking/routes";
import { StakingPoolThumbFragment$key } from "./__generated__/StakingPoolThumbFragment.graphql";

const fragment = graphql`
  fragment StakingPoolThumbFragment on StakingAccount {
    id
    pool {
      bondAsset {
        metadata {
          symbol
        }
      }
    }
    valueUsd
  }
`;

export const StakingPoolThumb: FC<{ k: StakingPoolThumbFragment$key }> = ({
  k,
}) => {
  const { t } = useTranslation("strategies");
  const { toRoot } = useLocale();
  const data = useFragment(fragment, k);
  const url = toRoot(stakeRoute(data.pool.bondAsset));

  return (
    <div className="relative card p-3">
      <div className="flex ai-c mt-0.5">
        <IconDenom
          denom={data.pool.bondAsset.metadata.symbol || ""}
          className="w-5"
        />
        <h3 className="condensed fs-24 fw-400 mb-0 ml-1">
          {data.pool.bondAsset.metadata.symbol || ""}
        </h3>
        <div className="tag tag--primary ml-a mr-0">{t("staking")}</div>
      </div>
      <div className="row wrap pad--mini mt-2">
        <div className="col-4">
          <h4 className="fs-16 lh-22 fw-400 color-grey mb-0">
            {t("value")}
          </h4>

          <Fiat
            symbol="$"
            amount={BigInt(data.valueUsd)}
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
