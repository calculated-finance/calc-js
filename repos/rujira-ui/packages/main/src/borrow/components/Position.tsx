import clsx from "clsx";
import { FC, Suspense, useState } from "react";
import { useFragment, useLazyLoadQuery, useSubscription } from "react-relay";
import { graphql } from "relay-runtime";
import { Asset } from "rujira.js";
import {
  Button,
  Decimal,
  Fiat,
  IconDenom,
  Icons,
  TranslationProvider,
  useGlobalModalContext,
  useTranslation,
} from "rujira.ui";
import { BalanceProvider } from "../../common/components/Balance";
import { useOraclePrice } from "../../common/OraclePrice";
import { PositionBorrowFragment$key } from "./__generated__/PositionBorrowFragment.graphql";
import { PositionBorrowQuery } from "./__generated__/PositionBorrowQuery.graphql";
import {
  PositionBorrowRowFragment$data,
  PositionBorrowRowFragment$key,
} from "./__generated__/PositionBorrowRowFragment.graphql";
import { PositionPositionFragment$key } from "./__generated__/PositionPositionFragment.graphql";
import { MultiAsset } from "./MultiAsset";
import { LiquidationPrice, LtvGraph, ltvLevel } from "./Health";
import { Increase } from "./PositionIncrease";
import { Repay } from "./PositionRepay";
import { Swap } from "./PositionSwap";
import { Cdp, VaultInterest } from "./utils";
import { SingleAsset } from "./SingleAsset";

const query = graphql`
  query PositionBorrowQuery {
    ghostCredit {
      address
      adjustmentThreshold
      vaults {
        price {
          ...OraclePriceFragment
        }
        borrower {
          asset {
            asset
            type
            chain
            metadata {
              symbol
              decimals
            }
            variants {
              native {
                denom
              }
            }
          }
          vault {
            interest {
              baseRate
              step1
              step2
              targetUtilization
            }
            status {
              depositPool {
                size
              }
              debtPool {
                size
              }
            }
          }
        }
      }
      collaterals {
        asset {
          asset
          type
          chain
          metadata {
            symbol
            decimals
          }
          variants {
            native {
              denom
            }
          }
        }
        price {
          ...OraclePriceFragment
        }
        ratio
      }
    }
  }
`;

const position = graphql`
  fragment PositionBorrowFragment on GhostCreditAccount {
    id
    account {
      address
      label
    }
    ...PositionPositionFragment
  }
`;

const positionFragment = graphql`
  fragment PositionPositionFragment on GhostCreditAccount {
    collaterals {
      collateral {
        __typename
        ... on Balance {
          asset {
            asset
            type
            chain
            metadata {
              symbol
              decimals
            }
            variants {
              native {
                denom
              }
            }
          }
          amount
        }
      }
      valueFull
      valueAdjusted
    }
    debts {
      value
      debt {
        current
        borrower {
          vault {
            status {
              debtRate
            }
          }
          asset {
            asset
            type
            chain
            metadata {
              symbol
              decimals
            }
            variants {
              native {
                denom
              }
            }
          }
        }
      }
    }
    ltv
    collateralValueUsd
    debtValueUsd
    collateralLiquidationValueUsd
    debtLiquidationValueUsd
  }
`;

const subscription = graphql`
  subscription PositionSubscription($contract: Address!) {
    ghostCreditAccountUpdated(address: $contract) {
      node {
        ... on GhostCreditAccount {
          ...PositionPositionFragment
        }
      }
    }
  }
`;

enum Tab {
  Repay,
  Increase,
  Swap,
}

export const Position: FC<{
  hideModal: () => void;
  k: PositionBorrowFragment$key;
}> = ({ hideModal, k }) => {
  const { t } = useTranslation();
  const { ghostCredit } = useLazyLoadQuery<PositionBorrowQuery>(query, {});
  const data_ = useFragment(position, k);
  const data = useFragment<PositionPositionFragment$key>(
    positionFragment,
    data_
  );

  const [tab, setTab] = useState<Tab>(Tab.Repay);
  const [liquidationLabel, setLiquidationLabel] = useState(
    t("liquidationPrice")
  );

  const p = Cdp.fromGraph(
    { ...data_, ...data },
    ghostCredit || { adjustmentThreshold: 0n }
  ) as Cdp<Asset>;

  //toLowerCase is used here to handle the current debt asset reconstruction for paid off positions.
  const vault = ghostCredit?.vaults.find(
    (v) =>
      v.borrower.asset.asset.toLowerCase() ===
      p.debts[0]?.asset.asset.toLowerCase()
  );

  const collateral = ghostCredit?.collaterals.find(
    (c) => c.asset.asset === p.collaterals[0]?.asset.asset
  );

  const debtOraclePrice = useOraclePrice(vault?.price);
  const collateralOraclePrice = useOraclePrice(collateral?.price);
  const vaultInterest: VaultInterest | undefined = vault
    ? {
        baseRate: vault.borrower.vault.interest.baseRate,
        step1: vault.borrower.vault.interest.step1,
        step2: vault.borrower.vault.interest.step2,
        targetRatio: vault.borrower.vault.interest.targetUtilization,
        vaultTotalDeposits: vault.borrower.vault.status.depositPool.size,
        vaultTotalDebts: vault.borrower.vault.status.debtPool.size,
      }
    : undefined;

  // todo: imrpove price tracking for multi collateral positions
  // useOraclePrice is a hook, so we can only call it a fixed number of times
  // per render (collateralOraclePrice/debtOraclePrice above) — we can't loop
  // it over p.collaterals/p.debts since their length varies per position/edits,
  // which would violate the Rules of Hooks. So only the single-collateral /
  // single-debt case can currently be live-repriced this way. Multi positions fall back
  // to the API snapshot (kept fresh by the account subscription) rather than
  // re-pricing just one asset and leaving the rest stale, which would mix
  // live and stale values in the same LTV/liquidation calc.
  const pLive =
    p.collaterals.length === 1 && p.debts.length === 1
      ? Cdp.withOraclePricing(
          p,
          collateralOraclePrice,
          debtOraclePrice,
          collateral?.ratio
        )
      : p;
  useSubscription({
    subscription,
    variables: { contract: data_.account.address },
  });

  if (p.collaterals.length === 0) return null;

  return (
    <>
      <h2 className="h4 mb-2">{t("common:managePosition")}</h2>
      <div
        className="card p-2"
        style={{ marginLeft: "-0.5rem", marginRight: "-0.5rem" }}>
        <div className="row wrap pad gap-y-3">
          <div className={"flex dir-c ai-c ai-sm-s dir-sm-r gap-2 grow ml-2"}>
            <div
              className={"flex dir-c grow gap-2 pt-2 pt-sm-0"}
              style={{ flexBasis: 0 }}>
              <div className="flex">
                {data.collaterals.length > 1 ? (
                  <div>
                    <h3 className="fs-14 fw-500 color-grey mb-1">
                      {t("collateral")}
                    </h3>
                    <div className="flex ai-c">
                      <MultiAsset collaterals={data.collaterals} />
                    </div>
                  </div>
                ) : (
                  <SingleAsset
                    assetSymbol={
                      pLive.collaterals[0].asset.metadata.symbol || ""
                    }
                    assetAmount={pLive.collaterals[0].amount}
                    assetValue={pLive.collaterals[0].value}
                    label={t("collateral")}
                  />
                )}
              </div>

              <div className="flex">
                {pLive.debts[0].amount === 0n ? (
                  <div>
                    <h3 className="fs-14 fw-500 color-grey mb-1">
                      {t("borrowed")}
                    </h3>
                    <span className="tag tag--borderless tag--teal">
                      {t("paidOff")}
                    </span>
                  </div>
                ) : (
                  <SingleAsset
                    assetSymbol={pLive.debts[0].asset.metadata.symbol || ""}
                    assetAmount={pLive.debts[0].amount}
                    assetValue={pLive.debts[0].value}
                    label={t("borrowed")}
                  />
                )}
              </div>
            </div>

            <div className={"flex dir-c gap-2 ai-s w-25 ml-2"}>
              <div className="flex grow dir-c ai-s pt-2 pt-sm-0">
                <h3 className="fs-14 fw-500 color-grey mb-1">
                  {liquidationLabel}
                </h3>
                <div className="flex">
                  <LiquidationPrice
                    p={pLive}
                    account={data}
                    onOrientationSet={(_, labelValue) =>
                      setLiquidationLabel(labelValue)
                    }
                  />
                </div>
              </div>

              <div className="flex dir-r grow ai-c mt-1 mt-sm-2">
                <h3 className="fs-14 fw-500 color-grey mr-1">
                  {t("interestRate")}
                </h3>
                <div className="tag tag--borderless tag--index i-fs-16">
                  {(Number(pLive.debts[0].rate) / 1e10).toLocaleDecimal(2)}%
                </div>
              </div>
            </div>

            <div
              className={"flex dir-c grow mr-2 ai-e"}
              style={{ flexBasis: 0 }}>
              <LtvGraph
                ltv={data.collaterals.length > 1 ? data.ltv : pLive.ltv}
                size={7}
                labelTop={t("ltv")}
                labelBottom={t(
                  ltvLevel(data.collaterals.length > 1 ? data.ltv : pLive.ltv)
                )}
              />
            </div>
          </div>
        </div>
      </div>

      <nav className="tabs tabs--sm tabs--dark mt-3 flex jc-c wrap">
        <a
          onClick={() => setTab(Tab.Repay)}
          className={clsx({ selected: tab === Tab.Repay })}>
          {t("repayLoanTab")}
        </a>
        <a
          onClick={() => setTab(Tab.Increase)}
          className={clsx({ selected: tab === Tab.Increase })}>
          {t("increaseLoanTab")}
        </a>
        <a
          onClick={() => setTab(Tab.Swap)}
          className={clsx({ selected: tab === Tab.Swap })}>
          {t("swapCollateralTab")}
        </a>
      </nav>

      {tab === Tab.Repay && (
        <BalanceProvider asset={pLive.debts[0].asset}>
          <Repay
            hideModal={hideModal}
            p={pLive}
            registry={ghostCredit?.address || ""}
            vaultInterest={vaultInterest}
          />
        </BalanceProvider>
      )}
      {tab === Tab.Increase && (
        <Increase
          hideModal={hideModal}
          p={pLive}
          registry={ghostCredit?.address || ""}
          vault={vault}
          vaultInterest={vaultInterest}
          collateralConfig={ghostCredit?.collaterals || []}
        />
      )}
      {tab === Tab.Swap && (
        <Suspense>
          <Swap
            hideModal={hideModal}
            p={pLive}
            registry={ghostCredit?.address || ""}
          />
        </Suspense>
      )}
    </>
  );
};

const rowFragment = graphql`
  fragment PositionBorrowRowFragment on GhostCreditAccount {
    account {
      address
      label
    }
    collaterals {
      collateral {
        __typename
        ... on Balance {
          asset {
            asset
            metadata {
              symbol
            }
          }
          amount
        }
      }
      valueFull
      valueAdjusted
    }
    debts {
      value
      debt {
        current
        borrower {
          vault {
            status {
              debtRate
            }
          }
          asset {
            metadata {
              symbol
            }
          }
        }
      }
    }
    ltv
    collateralValueUsd
    debtValueUsd
    collateralLiquidationValueUsd
    debtLiquidationValueUsd
    ...PositionBorrowFragment
  }
`;

export const PositionRow: FC<{
  k: PositionBorrowRowFragment$key;
  adjustmentThreshold: bigint;
}> = ({ k, adjustmentThreshold }) => {
  const data = useFragment(rowFragment, k);
  const { showModal, hideModal } = useGlobalModalContext();
  const { t } = useTranslation();
  useSubscription({
    subscription,
    variables: { contract: data.account.address },
  });

  const openModal = () => {
    showModal({
      title: ``,
      className: "modal--xl",
      backgroundClose: false,
      children: (
        <TranslationProvider namespace="borrow">
          <Suspense>
            <Position k={data} hideModal={hideModal} />
          </Suspense>
        </TranslationProvider>
      ),
    });
  };
  // position closed:
  if (data.collaterals.length === 0) return null;

  const p = Cdp.fromGraph(data, {
    adjustmentThreshold,
  }) as Cdp<Asset>;
  return (
    <tr className="pointer" onClick={() => openModal()}>
      <td>
        <MultiAsset collaterals={data.collaterals} />
      </td>
      <td>
        {p.debts[0].amount > 0n && (
          <>
            {data.debts.map((x, idx) => (
              <PostitionRowDebt key={idx} {...x} />
            ))}
          </>
        )}
      </td>
      <td>
        {p.debts[0].amount === 0n ? (
          <span className="tag tag--borderless tag--sm tag--teal">
            {t("paidOff")}
          </span>
        ) : (
          <div className="tag tag--borderless tag--index">
            {(Number(p.debts[0].rate) / 1e10).toLocaleDecimal(2)}%
          </div>
        )}
      </td>
      <td>
        <div className="flex jc-c">
          <LtvGraph ltv={BigInt(data.ltv)} />
        </div>
      </td>
      <td className="auto">
        {p.debts[0].amount > 0n && (
          <LiquidationPrice p={p} account={data} expand />
        )}
      </td>
      <td>
        <Button
          className="button--xs button--outline button--icon-right button--grey ml-5"
          label={t("manage")}>
          <Icons.ArrowUpRight />
        </Button>
      </td>
    </tr>
  );
};

export const PostitionRowCollateral: FC<
  PositionBorrowRowFragment$data["collaterals"][0]
> = (val) => {
  switch (val.collateral.__typename) {
    case "Balance":
      return (
        <div className="flex ai-c">
          <IconDenom
            denom={val.collateral.asset.metadata.symbol}
            className="w-4 mr-1"
          />
          <div className="flex dir-c">
            <Decimal
              amount={BigInt(val.collateral.amount)}
              symbol={val.collateral.asset.metadata.symbol}
              className="fs-16 condensed fw-500"
              clip
            />
            <Fiat
              amount={val.valueFull}
              symbol="$"
              className="color-grey fs-14 condensed"
              decimals={8}
            />
          </div>
        </div>
      );

    default:
      return null;
  }
};

export const PostitionRowDebt: FC<
  PositionBorrowRowFragment$data["debts"][0]
> = (val) => {
  return (
    <div className="flex ai-c">
      <IconDenom
        denom={val.debt.borrower.asset.metadata.symbol}
        className="w-4 mr-1"
      />
      <div className="flex dir-c">
        <Fiat amount={val.value} symbol="$" className="fs-16" decimals={8} />
        <Decimal
          amount={BigInt(val.debt.current)}
          symbol={val.debt.borrower.asset.metadata.symbol}
          className="color-grey condensed fw-500"
          clip
        />
      </div>
    </div>
  );
};
