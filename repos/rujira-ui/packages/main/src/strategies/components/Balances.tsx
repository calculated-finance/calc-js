import clsx from "clsx";
import { FC } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { Loader, useIsTouchDevice, useTranslation } from "rujira.ui";
import { usePreloadedAccountData } from "../../services/accountData";
import {
  BalancesPoolFragment$data,
  BalancesPoolFragment$key,
} from "./__generated__/BalancesPoolFragment.graphql";
import { BowPoolXykRow, BowPoolXykThumb } from "./BowPoolXykThumb";
import { GhostVaultRow, GhostVaultThumb } from "./GhostVaultThumb";
import { IndexVaultPortfolioRow } from "./IndexVaultPortfolioRow";
import { IndexVaultThumb } from "./IndexVaultThumb";
import { StakingPoolPortfolioRow } from "./StakingPoolPortfolioRow";
import { StakingPoolThumb } from "./StakingPoolThumb";
import { ThorchainPoolRow, ThorchainPoolThumb } from "./ThorchainPoolThumb";

const fragment = graphql`
  fragment BalancesPoolFragment on Account {
    bow {
      id
      ...BalanceThumbDualFragment
    }
    strategies {
      __typename
      ... on ThorchainLiquidityProvider {
        id
        ...ThorchainPoolThumbFragment
      }
      ... on BowAccount {
        id
        ...BowPoolXykThumbFragment
      }
      ... on IndexAccount {
        id
        ...IndexVaultThumbFragment
        ...IndexVaultPortfolioRowFragment
      }
      ... on StakingAccount {
        id
        ...StakingPoolThumbFragment
        ...StakingPoolPortfolioRowFragment
      }
      ... on GhostVaultAccount {
        id
        ...GhostVaultThumbFragment
      }
    }
  }
`;

export const Balances: FC<{ a?: BalancesPoolFragment$key }> = () => {
  const { accountData } = usePreloadedAccountData();
  const { t } = useTranslation("strategies");

  const account = useFragment<BalancesPoolFragment$key>(fragment, accountData);

  return (
    <div className="pools__positions">
      <h3 className="h3 mt-5 mt-lg-12">{t("myPositions")}</h3>
      <div className="pools__grid">
        {account?.strategies.map((x) => {
          return "id" in x ? <Thumb key={x.id} item={x} /> : null;
        })}
        {(!account?.strategies || account?.strategies.length === 0) && (
          <div className="relative card p-3">
            <h4 className="h4 fs-16 lh-19 fw-500 color-grey text-center mb-0">
              {t("noPositionsFound")}
            </h4>
          </div>
        )}
      </div>
    </div>
  );
};

export const BalancesFallback = () => {
  const { t } = useTranslation("strategies");
  return (
    <div className="pools__positions">
      <h3 className="h3 mt-5 mt-lg-12 flex">
        {t("myPositions")} <Loader className=" ml-2 mt-1 w-4 h-4" />
      </h3>
    </div>
  );
};

const Thumb: FC<{
  item: NonNullable<BalancesPoolFragment$data>["strategies"][number];
}> = ({ item }) => {
  switch (item.__typename) {
    case "ThorchainLiquidityProvider":
      return <ThorchainPoolThumb k={item} />;
    case "BowAccount":
      return <BowPoolXykThumb k={item} />;
    case "IndexAccount":
      return <IndexVaultThumb k={item} />;
    case "StakingAccount":
      return <StakingPoolThumb k={item} />;
    case "GhostVaultAccount":
      return <GhostVaultThumb k={item} />;
  }
};

export const StrategiesPortfolio: FC<{ a?: BalancesPoolFragment$key }> = () => {
  const { accountData } = usePreloadedAccountData();
  const account = useFragment<BalancesPoolFragment$key>(fragment, accountData);
  const isTouchDevice = useIsTouchDevice();
  const { t } = useTranslation("strategies");

  return (
    <div className="table-sticky table-sticky--left">
      {account?.strategies.length ? (
        <table
          className={clsx({
            "table table--big condensed portfolio__balances": true,
            "table--no-hover": isTouchDevice,
          })}>
          <thead>
            <tr>
              <th className="w-1">{t("strategy")}</th>
              <th></th>
              <th>{t("type")}</th>
              <th>{t("assets")}</th>
              <th className="text-right">APR</th>
              <th className="text-right">{t("value")}</th>
            </tr>
          </thead>
          <tbody>
            {account?.strategies.map((x) => {
              return "id" in x ? <PortfolioRow key={x.id} item={x} /> : null;
            })}
          </tbody>
        </table>
      ) : (
        <div className="fs-16 lh-19 fw-500 color-grey text-center">
          {t("noStrategyBalancesFound")}
        </div>
      )}
    </div>
  );
};

const PortfolioRow: FC<{
  item: NonNullable<BalancesPoolFragment$data>["strategies"][number];
}> = ({ item }) => {
  switch (item.__typename) {
    case "ThorchainLiquidityProvider":
      return <ThorchainPoolRow k={item} />;
    case "BowAccount":
      return <BowPoolXykRow k={item} />;
    case "IndexAccount":
      return <IndexVaultPortfolioRow k={item} />;
    case "StakingAccount":
      return <StakingPoolPortfolioRow k={item} />;
    case "GhostVaultAccount":
      return <GhostVaultRow k={item} />;
  }
};
