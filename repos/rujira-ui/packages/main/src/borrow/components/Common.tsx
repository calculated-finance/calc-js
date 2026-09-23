import { FC, useState } from "react";
import { Asset } from "rujira.js";
import {
  Decimal,
  LoaderWithContent,
  SimulationState,
  useTranslation,
  Warning,
} from "rujira.ui";
import exclamation from "rujira.ui/assets/images/exclamation.gif";

import { LiquidationPrice, LtvLabel } from "./Health";
import { Cdp } from "./utils";
import { Icons } from "rujira.ui";
import clsx from "clsx";

export const AdjustmentSummary: FC<{
  p: Cdp<Asset>;
  projectedRate?: bigint;
  simulationState?: SimulationState;
  originalDebtAmount?: bigint;
  hideInterestRate?: boolean;
}> = ({
  p,
  projectedRate,
  simulationState,
  originalDebtAmount,
  hideInterestRate,
}) => {
  const { t } = useTranslation();
  const [liquidationView, setLiquidationView] = useState<
    "collateral" | "debt" | null
  >(null);

  const liquidationAccount = {
    collaterals: p.collaterals.map((c) => ({
      collateral: {
        __typename: "Balance" as const,
        asset: { metadata: { symbol: c.asset.metadata.symbol } },
        amount: c.amount,
      },
      valueFull: c.value,
    })),
    debts: p.debts,
    collateralLiquidationValueUsd: p.collateralLiquidationValueUsd,
    debtLiquidationValueUsd: p.debtLiquidationValueUsd,
  };

  const allCollateralWithdrawn = p.collaterals.every((c) => c.amount === 0n);
  const allDebtRepaid = p.debts.every((d) => d.amount === 0n);

  if (allDebtRepaid && allCollateralWithdrawn)
    return (
      <Warning
        className="warning--sm mt-2 condensed flex ai-c mx-a"
        color="orange">
        <img
          src={exclamation}
          alt=""
          className="filter-orange block no-shrink"
          style={{ width: "2rem", height: "2rem" }}
        />
        <div className="text-left fs-14 mr-1">{t("positionClosed")}</div>
      </Warning>
    );
  if (allCollateralWithdrawn)
    return (
      <Warning
        className="warning--sm mt-2 condensed flex ai-c mx-a"
        color="orange">
        <img
          src={exclamation}
          alt=""
          className="filter-orange block no-shrink"
          style={{ width: "2rem", height: "2rem" }}
        />
        <div className="text-left fs-14 mr-1">{t("invalidDebtRemaining")}</div>
      </Warning>
    );

  return (
    <div className="col-12 col-md-8 offset-md-2">
      <div className="row wrap pad-mini mt-1.5 condensed fs-14">
        <div className="col-12 col-xs-4 text-center text-xs-left color-grey fw-500 py-1">
          <div
            data-tooltip-id="modal-tip"
            data-tooltip-html={t("ltvTooltip")}
            className="iflex ai-c no-select">
            {t("newLtv")}
            <Icons.Info className="ml-0.5 block w-2" />
          </div>
        </div>
        <div className="col-12 col-xs-8 text-center text-xs-right">
          <LtvLabel ltv={p.ltv} />
        </div>
        <div className="col-12 col-xs-4 text-center text-xs-left color-grey fw-500 pt-2 pb-0.5 pb-xs-0 py-xs-1 nowrap">
          {liquidationView === "debt"
            ? p.debts.length > 1
              ? t("newDebtLiquidationValue")
              : t("newDebtLiquidationPrice")
            : liquidationView === "collateral"
              ? p.collaterals.length > 1
                ? t("newCollateralLiquidationValue")
                : t("newCollateralLiquidationPrice")
              : t("newLiquidationPrice")}
        </div>
        <div
          className={clsx("col-12 col-xs-8 text-center text-xs-right", {
            "pt-0.5": !hideInterestRate,
          })}>
          {p.debts[0].amount > 0n ? (
            <LiquidationPrice
              p={p}
              account={liquidationAccount}
              onOrientationSet={(orientation) =>
                setLiquidationView(orientation)
              }
            />
          ) : originalDebtAmount === 0n ? (
            <span className="col-12 col-xs-8 text-right color-grey mt-2">
              {t("common:na")}
            </span>
          ) : (
            <div className="tag tag--borderless tag--teal">
              {t("liquidationPriceNotApplicable")}
            </div>
          )}
        </div>
        {!hideInterestRate && (
          <>
            <div className="col-12 col-xs-4 text-center text-xs-left color-grey fw-500 py-1">
              {t("newInterestRate")}
            </div>
            <div className="col-12 col-xs-8 text-center text-xs-right pt-0 pt-xs-1">
              {(
                Number(projectedRate ?? p.debts[0].rate) / 1e10
              ).toLocaleDecimal(2)}
              %
            </div>
          </>
        )}
        <div className="col-12 col-xs-4 text-center text-xs-left color-grey fw-500 pt-1">
          {t("common:networkFee")}
        </div>
        <div className="col-12 col-xs-8 text-center text-xs-right pt-1">
          <LoaderWithContent
            loading={simulationState?.status === "running"}
            content={
              <Decimal
                subscript
                amount={simulationState?.simulation?.amount ?? 0n}
                decimals={simulationState?.simulation?.decimals}
                symbol={simulationState?.simulation?.symbol ?? "RUNE"}
              />
            }
          />
        </div>
      </div>
    </div>
  );
};
