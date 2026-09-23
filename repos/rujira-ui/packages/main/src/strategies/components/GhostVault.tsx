import { Buffer } from "buffer";
import { FC, startTransition, useEffect } from "react";
import { useFragment, useRefetchableFragment } from "react-relay";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { graphql } from "relay-runtime";
import {
  AssetLabel,
  Decimal,
  Fiat,
  formatApr,
  IconDenom,
  useLocale,
  useTranslation,
} from "rujira.ui";

import { Icons } from "rujira.ui";
import { BalanceProvider } from "../../common/components/Balance";
import { lendRoute } from "../../lending/routes";
import { usePreloadedAccountData } from "../../services/accountData";
import { useAccounts } from "../../services/accounts";
import { Subscription } from "../../services/useNodeSubscription";
import { GhostVaultAccountFragment$key } from "./__generated__/GhostVaultAccountFragment.graphql";
import { GhostVaultFragment$key } from "./__generated__/GhostVaultFragment.graphql";
import { GhostVaultQuery } from "./__generated__/GhostVaultQuery.graphql";
import { GhostVaultRowFragment$key } from "./__generated__/GhostVaultRowFragment.graphql";
import { GhostVaultSummaryFragment$key } from "./__generated__/GhostVaultSummaryFragment.graphql";
import { AddressLink, StrategyContainer } from "./Common";
import { GhostVaultBalance } from "./GhostVaultBalance";
import { GhostVaultDeposit } from "./GhostVaultDeposit";

const row = graphql`
  fragment GhostVaultRowFragment on GhostVault {
    id
    asset {
      asset
      type
      chain
      metadata {
        symbol
      }
    }
    status {
      depositPool {
        size
      }
      valueUsd
      apr {
        status
        value
      }
    }
  }
`;

const fragment = graphql`
  fragment GhostVaultFragment on GhostVault
  @refetchable(queryName: "GhostVaultQuery") {
    id
    address
    vaultStatus: status {
      apr {
        status
        value
      }
      depositPool {
        size
      }
      valueUsd
    }

    asset {
      asset
      chain
      type
      metadata {
        symbol
        decimals
      }
      price {
        current
      }
      variants {
        native {
          denom
        }
      }
      ...msgAssetFragment
    }
    ...GhostVaultSummaryFragment
  }
`;

const subscription = graphql`
  subscription GhostVaultSubscription($id: ID!) {
    node(id: $id) {
      ... on GhostVault {
        id
        vaultStatus: status {
          apr {
            status
            value
          }
          depositPool {
            size
          }
          valueUsd
        }
      }
    }
  }
`;

const accountFragment = graphql`
  fragment GhostVaultAccountFragment on Account {
    address
    strategies {
      ... on GhostVaultAccount {
        id
        ...GhostVaultBalanceFragment
      }
    }
  }
`;

export const GhostVaultRow: FC<{ k: GhostVaultRowFragment$key }> = ({ k }) => {
  const { t } = useTranslation("strategies");
  const { toRoot } = useLocale();
  const { id, asset, status } = useFragment(row, k);
  const url = toRoot(lendRoute(asset));

  return (
    <tr className="pointer">
      <Subscription subscription={subscription} id={id} />
      <td>
        <Link
          to={url}
          className="flex ai-c mt-0.5 no-underline color-white w-full">
          <IconDenom denom={asset.metadata.symbol || ""} className="w-4" />
          <h3 className="condensed fs-22 lh-22 fs-lg-28 lh-lg-28 fw-400 mb-0 ml-1 nowrap">
            <AssetLabel
              asset={asset}
              Container={({ children }) => (
                <small className="color-grey fs-14 fs-lg-16">{children}</small>
              )}
            />
          </h3>
        </Link>
      </td>
      <td>
        <Link to={url} className="flex dir-c no-underline color-white w-full">
          <Fiat
            amount={BigInt(status.valueUsd)}
            symbol="$"
            decimals={8}
            className="fs-16 fs-md-18 color-white"
          />
          <div className="flex ai-c mt-0.5">
            <Decimal
              amount={BigInt(status.depositPool.size)}
              className="fs-12 fs-md-14 condensed color-grey"
              symbol={asset.metadata.symbol || ""}
            />
          </div>
        </Link>
      </td>

      <td className="text-right">{formatApr(status.apr)}</td>
      <td className="text-right">
        <Link to={url} className="block w-full text-right">
          <div className="tag tag--teal">{t("lending")}</div>
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

export const GhostVault: FC<{
  k: GhostVaultFragment$key;
}> = ({ k }) => {
  const { t } = useTranslation("strategies");
  const { accountData } = usePreloadedAccountData();
  const account = useFragment<GhostVaultAccountFragment$key>(
    accountFragment,
    accountData
  );
  const { selected } = useAccounts();

  const [data, refetch] = useRefetchableFragment<
    GhostVaultQuery,
    GhostVaultFragment$key
  >(fragment, k);

  useEffect(() => {
    startTransition(() => {
      refetch({}, { fetchPolicy: "store-and-network" });
    });
  }, []);

  return (
    <StrategyContainer>
      <div className="flex ai-c wrap">
        <h1 className="h1 mb-0 mr-2">
          <AssetLabel
            asset={data.asset}
            Container={({ children }) => (
              <small className="color-grey fs-20 fs-lg-28">{children}</small>
            )}
          />
        </h1>
        <div className="lp big mr-3">
          <IconDenom denom={data.asset.metadata.symbol} />
        </div>
        <div className="tag tag--teal">{t("lending")}</div>
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
                  amount={BigInt(data.vaultStatus.valueUsd)}
                  decimals={8}
                  className="fs-22 fs-md-32 condensed fw-500 mt-1"
                />
                <div className="flex ai-c mt-1">
                  <IconDenom
                    denom={data.asset.metadata.symbol}
                    className="h-2 w-2 mr-1"
                  />
                  <Decimal
                    amount={BigInt(data.vaultStatus.depositPool.size)}
                    round={4}
                    className="fs-16 fs-md-18 lh-16 lh-md-18 condensed color-grey"
                    clip
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 mt-2 mt-sm-0 show-sm">
              <div className="card h-full p-3 flex dir-c">
                <h3 className="fs-16 lh-22 fw-400 color-grey">
                  {t("lendingApr")}
                </h3>
                <p className="fs-22 fs-md-32 condensed fw-500 mt-1">
                  {formatApr(data.vaultStatus.apr)}
                </p>
              </div>
            </div>
            <div className="col-12 mt-4">
              <BalanceProvider asset={data.asset}>
                <div className="card p-3">
                  <GhostVaultDeposit
                    address={data.address}
                    asset={data.asset}
                  />
                </div>
              </BalanceProvider>
            </div>
          </div>
          <hr className="hr mt-8 mb-8 opacity-4" />

          <Summary k={data} />
        </div>
        <div className="col-12 col-md-4 mt-2 gradient-card-container">
          <GhostVaultBalance
            k={account?.strategies.find(
              (a) =>
                selected &&
                a.id ===
                  Buffer.from(
                    `GhostVaultAccount:${data.address}/${selected.address.address}`
                  ).toString("base64")
            )}
            symbol={data.asset.metadata.symbol}
          />
        </div>
      </div>
    </StrategyContainer>
  );
};

const summary = graphql`
  fragment GhostVaultSummaryFragment on GhostVault {
    address
    asset {
      metadata {
        symbol
      }
    }
    interest {
      baseRate
      step1
      step2
      targetUtilization
    }
  }
`;

const Summary: FC<{ k: GhostVaultSummaryFragment$key }> = ({ k }) => {
  const { t } = useTranslation("strategies");
  const { asset, interest, address } = useFragment(summary, k);
  const baseRate = Number(interest.baseRate);
  const step1 = Number(interest.step1);
  const step2 = Number(interest.step2);
  const targetUtilization = Number(interest.targetUtilization);

  const PRECISION = 1e12;
  const SCALE = 1e10;

  const data = Array.from({ length: 101 }, (_, idx) => {
    const util = idx * SCALE;

    const borrow =
      util <= targetUtilization
        ? baseRate + (util / targetUtilization) * step1
        : baseRate +
          step1 +
          ((util - targetUtilization) / (PRECISION - targetUtilization)) *
            step2;

    const borrowRate = borrow / PRECISION;
    const utilRate = util / PRECISION;
    const fee = utilRate * borrowRate * 0.1;
    const lend = 0.9 * utilRate * borrowRate;

    return {
      util: utilRate,
      lend,
      borrow: borrowRate,
      fee,
    };
  });

  return (
    <>
      <h3 className="h3">{t("strategyDetails")}</h3>
      <h4 className="h4">
        {t("strategyLabel")}: {t("lending")}
      </h4>
      <p className="p">
        Generate passive returns by lending {asset.metadata.symbol}, with a
        relatively low risk profile (all loans are overcollateralized) and no
        exposure to Impermanent Loss. The yield comes from borrowers which are
        charged an interest rate every block based on the utilization rate of
        the borrowed asset compared to the total supplied available for lending.
      </p>

      <h4 className="h4 mt-5">{t("interestRateCurve")}</h4>
      <ResponsiveContainer
        width="100%"
        height={285}
        className="my-a mono fs-12">
        <AreaChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 5,
            left: 0,
            bottom: 0,
          }}>
          <XAxis
            stroke="#607d8b"
            tick={{ fill: "#ffffff" }}
            fontSize={10}
            dataKey="util"
            tickFormatter={(e) => {
              return (e * 100).toLocaleDecimal(2) + "%";
            }}
            interval={30}
          />
          <YAxis
            stroke="#607d8b"
            tick={{ fill: "#ffffff" }}
            fontSize={10}
            tickFormatter={(e) => {
              return (e * 100).toLocaleDecimal(2) + "%";
            }}
          />
          <Tooltip
            content={
              <CustomTooltip
                active={undefined}
                payload={undefined}
                label={undefined}
                t={t}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="lend"
            stroke="#01CDFE"
            fill="#01CDFE"
            fillOpacity={0.15}
            strokeWidth={2}
          />

          <Area
            type="monotone"
            dataKey="fee"
            stroke="#FFD700"
            fill="#FFD700"
            fillOpacity={0.1}
            strokeWidth={1}
            strokeDasharray="3 3"
          />

          <Area
            type="monotone"
            dataKey="borrow"
            stroke="#01CDFE"
            fill="#01CDFE"
            fillOpacity={0.15}
            strokeWidth={2}
          />

          <ReferenceLine
            x={Number(targetUtilization) / 1e12}
            stroke="#ffffff"
            strokeDasharray="3 4"
          />
        </AreaChart>
      </ResponsiveContainer>
      <h4 className="h4 mt-5">{t("liquidityWithdrawals")}</h4>
      <p className="p">
        Lenders may withdraw their liquidity at any time, as long as asset
        utilization remains under 100%. If utilization reaches 100%, lenders'
        funds will be unavailable until debts are repaid or further deposits
        made to the pool.
      </p>
      <h4 className="h4 mt-5">{t("contract")}</h4>
      <p className="p">
        {t("lendingVault")}: <AddressLink address={address} />
      </p>
    </>
  );
};

const CustomTooltip = ({ active, payload, label, t }: any) => {
  if (active && payload && payload.length) {
    const lend = payload.find((p: any) => p.dataKey === "lend")?.value ?? 0;
    const fee = payload.find((p: any) => p.dataKey === "fee")?.value ?? 0;
    const borrow = payload.find((p: any) => p.dataKey === "borrow")?.value ?? 0;
    return (
      <div>
        <p className="label">
          {t("utilizationRateLabel")} {(label * 100).toLocaleDecimal(2)}%
          <br />
          {t("lendRateLabel")} {(lend * 100).toLocaleDecimal(2)}%
          <br />
          Protocol fee: {(fee * 100).toLocaleDecimal(2)}%
          <br />
          {t("borrowRateLabel")} {(borrow * 100).toLocaleDecimal(2)}%
        </p>
      </div>
    );
  }
  return null;
};
