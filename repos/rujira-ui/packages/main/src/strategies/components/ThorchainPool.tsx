import { FC, startTransition, useEffect } from "react";
import { useFragment, useRefetchableFragment } from "react-relay";
import { Link } from "react-router-dom";
import { graphql } from "relay-runtime";
import { AssetLabel, Decimal, Fiat, IconDenom, useTranslation } from "rujira.ui";

import { Subscription } from "../../services/useNodeSubscription";
import { ThorchainPoolAccountFragment$key } from "./__generated__/ThorchainPoolAccountFragment.graphql";
import { ThorchainPoolFragment$key } from "./__generated__/ThorchainPoolFragment.graphql";
import { ThorchainPoolQuery } from "./__generated__/ThorchainPoolQuery.graphql";
import { ThorchainPoolRowFragment$key } from "./__generated__/ThorchainPoolRowFragment.graphql";
import { Meta, StrategyContainer } from "./Common";
import { ThorchainPoolBalance } from "./ThorchainPoolBalance";
import { DepositThorchain } from "./ThorchainPoolDeposit";
import { Icons } from "rujira.ui";

const row = graphql`
  fragment ThorchainPoolRowFragment on ThorchainPool {
    id
    asset {
      id
      asset
      type
      chain
      metadata {
        symbol
      }
      price {
        current
      }
    }
    balanceAsset
    balanceRune
  }
`;

const accountFragment = graphql`
  fragment ThorchainPoolAccountFragment on Account {
    liquidityAccounts {
      id
      asset {
        id
      }
      ...ThorchainPoolBalanceFragment
      ...ThorchainPoolDepositAccountFragment
    }
  }
`;

const fragment = graphql`
  fragment ThorchainPoolFragment on ThorchainPool
  @refetchable(queryName: "ThorchainPoolQuery") {
    id
    balanceAsset
    balanceRune
    asset {
      id
      type
      chain
      metadata {
        symbol
      }
      price {
        current
      }
      ...msgAssetFragment
    }
  }
`;

const subscription = graphql`
  subscription ThorchainPoolSubscription($id: ID!) {
    node(id: $id) {
      ... on ThorchainPool {
        asset {
          price {
            current
          }
        }
        balanceAsset
        balanceRune
      }
    }
  }
`;

const accountSubscription = graphql`
  subscription ThorchainPoolAccountSubscription($id: ID!) {
    node(id: $id) {
      ... on ThorchainLiquidityProvider {
        id
        ...ThorchainPoolBalanceFragment
        ...ThorchainPoolDepositAccountFragment
      }
    }
  }
`;

export const ThorchainPoolTag: FC<{ short?: boolean }> = ({
  short = false,
}) => {
  const { t } = useTranslation("strategies");
  return short ? (
    <div className="tag tag--grey ml-a">{t("ammThorchainClp")}</div>
  ) : (
    <div className="tag tag--lg tag--grey my-1.5">
      {t("ammThorchainClpFull")}
    </div>
  );
};

export const ThorchainPoolRow: FC<{
  k: ThorchainPoolRowFragment$key;
}> = ({ k }) => {
  const { id, asset, balanceAsset, balanceRune } = useFragment(row, k);
  const url = `amm/thorchain/${asset.asset}`;
  const value =
    (BigInt(asset.price?.current || 0) * BigInt(balanceAsset || 0)) /
    10n ** 12n;

  return (
    <tr className="pointer">
      <Subscription id={id} subscription={subscription} />
      <td>
        <Link
          to={url}
          className="flex ai-c mt-0.5 no-underline color-white w-full">
          <div className="lp">
            <IconDenom denom={asset.metadata.symbol} />
            <IconDenom denom="RUNE" />
          </div>
          <h3 className="condensed fs-22 lh-22 fs-lg-28 lh-lg-28 fw-400 mb-0 ml-1 nowrap">
            {/* {asset.metadata.symbol} */}
            <AssetLabel
              asset={asset}
              Container={({ children }) => (
                <small className="color-grey fs-14 fs-lg-16">{children}</small>
              )}
            />{" "}
            <span className="color-grey">/</span> RUNE
          </h3>
        </Link>
      </td>
      <td>
        <Link to={url} className="flex dir-c no-underline color-white w-full">
          <Fiat
            amount={value * 2n}
            symbol="$"
            decimals={8}
            className="fs-16 fs-md-18 color-white"
          />
          <div className="flex ai-c mt-0.5">
            <Decimal
              amount={BigInt(balanceAsset || 0)}
              className="fs-12 fs-md-14 condensed color-grey"
              symbol={asset.metadata.symbol || ""}
            />

            <span className="block mx-1 color-grey opacity-8">/</span>
            <Decimal
              amount={BigInt(balanceRune || 0)}
              className="fs-12 fs-md-14 condensed color-grey"
              symbol="RUNE"
            />
          </div>
        </Link>
      </td>
      <td className="text-right">Soon&trade;</td>
      <td className="text-right">
        <Link to={url} className="block w-full text-right">
          <ThorchainPoolTag short />
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

export const ThorchainPool: FC<{
  k: ThorchainPoolFragment$key;
  a?: ThorchainPoolAccountFragment$key;
}> = ({ a, k }) => {
  const { t } = useTranslation("strategies");
  const [data, refetch] = useRefetchableFragment<
    ThorchainPoolQuery,
    ThorchainPoolFragment$key
  >(fragment, k);

  useEffect(() => {
    startTransition(() => {
      refetch({}, { fetchPolicy: "store-and-network" });
    });
  }, []);
  const account = useFragment(accountFragment, a);

  const halfValue =
    data.asset.price?.current &&
    BigInt(data.asset.price.current) * BigInt(data.balanceAsset);
  const value = halfValue ? halfValue * 2n : 0n;
  const accountKey = account?.liquidityAccounts.find(
    (a) => a.asset.id === data.asset.id
  );

  return (
    <StrategyContainer>
      <Meta
        title={`Rujira ${data.asset.metadata.symbol}/RUNE Automated Market Maker - XYK`}
        description={`Provides liquidity to THORChain ${data.asset.metadata.symbol}/RUNE Continuous Liquidity Pools on the Base Layer, using a constant product (XYX) bonding curve. `}
      />
      {accountKey && (
        <Subscription id={accountKey?.id} subscription={accountSubscription} />
      )}
      <Subscription id={data.id} subscription={subscription} />
      <div className="flex ai-c wrap">
        <h1 className="h1 mb-0 mr-2">
          <AssetLabel
            asset={data.asset}
            Container={({ children }) => (
              <small className="color-grey fs-20 fs-lg-28">{children}</small>
            )}
          />{" "}
          <small className="color-grey">/</small> RUNE
        </h1>
        <div className="lp big mr-3">
          <IconDenom denom={data.asset.metadata.symbol} />
          <IconDenom denom="RUNE" />
        </div>
        <ThorchainPoolTag />
      </div>
      <div className="row pad wrap mt-1">
        <div className="col-12 col-md-8 mt-2">
          <div className="row pad wrap">
            <div className="col-12 col-sm-6">
              <div className="card h-full p-3 flex dir-c">
                <h3 className="fs-16 lh-22 fw-400 color-grey">
                  {t("strategyTvl")}
                </h3>
                <Fiat
                  symbol="$"
                  amount={value}
                  decimals={20}
                  className="fs-22 fs-md-32 condensed fw-500 mt-1"
                />
                <div className="flex ai-c mt-1">
                  <IconDenom
                    denom={data.asset.metadata.symbol}
                    className="h-2 w-2 mr-1"
                  />
                  <Decimal
                    amount={BigInt(data.balanceAsset)}
                    round={4}
                    className="fs-16 fs-md-18 lh-16 lh-md-18 condensed color-grey"
                  />
                </div>
                <div className="flex ai-c mt-0.5">
                  <IconDenom denom="RUNE" className="h-2 w-2 mr-1" />
                  <Decimal
                    amount={BigInt(data.balanceRune)}
                    round={4}
                    className="fs-16 fs-md-18 lh-16 lh-md-18 condensed color-grey"
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 mt-2 mt-sm-0 show-sm">
              <div className="card h-full p-3 flex dir-c">
                <h3 className="fs-16 lh-22 fw-400 color-grey">{t("apr")}</h3>
                <p className="fs-22 fs-md-32 condensed fw-500 mt-1">
                  Soon&trade;
                </p>
              </div>
            </div>
            <div className="col-12 mt-4">
              <DepositThorchain
                a={data.asset || undefined}
                acc={accountKey}
                ratio={
                  (BigInt(data.balanceRune || 0) * 10n ** 12n) /
                  BigInt(data.balanceAsset || 0)
                }
              />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 mt-2 gradient-card-container">
          <ThorchainPoolBalance
            k={accountKey}
            asset={data.asset.metadata.symbol}
          />
        </div>
      </div>
      <hr className="hr mt-8 mb-8 opacity-4" />

      <PoolSummary pair={data.asset.metadata.symbol + "/RUNE"} />
    </StrategyContainer>
  );
};

const PoolSummary: FC<{ pair: string }> = ({ pair }) => {
  const { t } = useTranslation("strategies");
  return (
    <>
      <h3 className="h3">{t("strategyDetails")}</h3>
      <h4 className="h4">
        {t("strategyLabel")}: {t("ammThorchainClpFull")}
      </h4>
      <p
        className="p"
        dangerouslySetInnerHTML={{
          __html: t("thorchainClpDescription", {
            pair,
            incentivePendulum: t("incentivePendulum"),
          }),
        }}
      />
      <p className="p">
        {t("moreInfo")}{" "}
        <a
          target="_blank"
          href="https://docs.thorchain.org/thorchain-finance/continuous-liquidity-pools"
          className="color-white hover-primary1 iflex ai-c">
          https://docs.thorchain.org/thorchain-finance/continuous-liquidity-pools
          <Icons.External className="w-2 h-2 ml-1" />
        </a>
      </p>
      <h4 className="h4 mt-5">{t("liquidityDeposits")}</h4>
      <p className="p">{t("thorchainDepositInfo")}</p>
      <h4 className="h4 mt-5">{t("liquidityWithdrawals")}</h4>
      <p className="p">{t("xykWithdrawalInfo")}</p>
    </>
  );
};
