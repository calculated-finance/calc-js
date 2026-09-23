import clsx from "clsx";
import { FC, useEffect, useId, useState } from "react";
import { Tooltip } from "react-tooltip";
import { Fiat, IconDenom, Icons, useTranslation } from "rujira.ui";
import { Cdp } from "./utils";
import { Graph } from "../../merge/components/Graph";

const CRITICAL = 10n ** 12n;
const HIGH = 8n * 10n ** 11n;
const MEDIUM = 4n * 10n ** 11n;

type LtvLevel = "low" | "medium" | "high" | "critical";

export const ltvLevel = (ltv: bigint): LtvLevel => {
  if (ltv > CRITICAL) return "critical";
  if (ltv > HIGH) return "high";
  if (ltv > MEDIUM) return "medium";
  return "low";
};

export const LtvLabel: FC<{ ltv: bigint }> = ({ ltv }) => {
  if (ltv > CRITICAL)
    return (
      <div className="tag tag--borderless tag--red">
        Liquidatable:
        <span className="color-white ml-0.5">
          {(Number(ltv) / 1e10).toLocaleDecimal(2)}%
        </span>
      </div>
    );

  if (ltv > HIGH)
    return (
      <div className="tag tag--borderless tag--red">
        <span className="opacity-12 mr-0.5">High:</span>
        {(Number(ltv) / 1e10).toLocaleDecimal(2)}%
      </div>
    );

  if (ltv > MEDIUM)
    return (
      <div className="tag tag--borderless tag--orange">
        <span className="opacity-12 mr-0.5">Medium:</span>
        {(Number(ltv) / 1e10).toLocaleDecimal(2)}%
      </div>
    );

  return (
    <div className="tag tag--borderless tag--teal">
      <span className="opacity-12 mr-0.5">Low:</span>
      {(Number(ltv) / 1e10).toLocaleDecimal(2)}%
    </div>
  );
};

export const LtvGraph: FC<{
  ltv: bigint;
  size?: number;
  labelTop?: string;
  labelBottom?: string;
}> = ({ ltv, size, labelTop, labelBottom }) => {
  const level = ltvLevel(ltv);
  return (
    <div
      className={clsx("health__graph-container", {
        "health__graph-container--critical": ltv > CRITICAL,
        "health__graph-container--high": ltv > HIGH && ltv <= CRITICAL,
        "health__graph-container--medium": ltv > MEDIUM && ltv <= HIGH,
      })}
      style={size ? { width: `${size}rem`, height: `${size}rem` } : undefined}>
      <Graph percentage={Number(ltv) / 10_000_000_000} width={50} />
      <span className="health__graph-container-pct">
        {labelTop && (
          <small className="health__graph-container-title">{labelTop}</small>
        )}
        {(Number(ltv) / 1e10).toLocaleDecimal(2)}%
        {labelBottom && (
          <small
            className={`health__graph-container-footer health__graph-container-footer--${level}`}>
            {labelBottom}
          </small>
        )}
      </span>
    </div>
  );
};

type LiquidationAccountData = {
  collaterals: ReadonlyArray<{
    collateral:
      | {
          __typename: "Balance";
          asset: { metadata: { symbol: string } };
          amount: bigint;
        }
      | { __typename: "%other" };
    valueFull: bigint;
  }>;
  debts: ReadonlyArray<unknown>;
  collateralLiquidationValueUsd: bigint;
  debtLiquidationValueUsd: bigint;
};

export const LiquidationPrice: FC<{
  p: Cdp<{ metadata: { symbol: string } }>;
  account?: LiquidationAccountData;
  expand?: boolean;
  onOrientationSet?: (
    orientation: "collateral" | "debt",
    labelValue: string
  ) => void;
}> = ({ p, account, expand = false, onOrientationSet }) => {
  const { t } = useTranslation();
  const { collateralLiquidationDelta, debtLiquidationDelta, ltv } = p;
  // Per-asset liquidation prices now live on the position entries; the
  // single-asset path uses the first (and only) entry.
  const collateralLiquidationPrice = p.collaterals[0].liquidationPrice;
  const debtLiquidationPrice = p.debts[0].liquidationPrice;

  const collateralCount = account?.collaterals.length ?? 1;
  const debtCount = account?.debts.length ?? 1;
  const collateralLiquidationValueUsd = account?.collateralLiquidationValueUsd;
  const debtLiquidationValueUsd = account?.debtLiquidationValueUsd;

  // todo: we need to consider a weighted evaluation of isShort, in future iterations of this,
  // for mixed multi collateral positions.
  const isShort = p.collaterals.every((c) =>
    ["USDC", "USDT"].includes(c.asset.metadata.symbol)
  );
  const [invert, setInvert] = useState(false);
  const liquidationTipId = useId();

  const getLabel = (showingDebt: boolean): string => {
    if (showingDebt) {
      return debtCount > 1
        ? t("debtLiquidationValue")
        : t("debtLiquidationPrice");
    }
    return collateralCount > 1
      ? t("collateralLiquidationValue")
      : t("collateralLiquidationPrice");
  };

  useEffect(() => {
    const showingDebt = isShort !== invert;
    onOrientationSet?.(
      showingDebt ? "debt" : "collateral",
      getLabel(showingDebt)
    );
  }, []);

  const SwitchArrow = () => (
    <button
      className="transparent iflex color-grey hover-white ml-1 pointer"
      onClick={(e) => {
        e.stopPropagation();
        const showDebt = isShort === invert;
        onOrientationSet?.(
          showDebt ? "debt" : "collateral",
          getLabel(showDebt)
        );
        setInvert(!invert);
      }}>
      <Icons.ArrowRightLeft className="w-2 h-2 block" />
    </button>
  );

  const showingDebt = isShort !== invert;

  const ltvTag = clsx({
    "tag tag--md ar no-shrink nowrap": true,
    "tag--teal": ltv < MEDIUM,
    "tag--orange": MEDIUM <= ltv && ltv < HIGH,
    "tag--red": ltv >= HIGH,
  });

  return (
    <div
      className={clsx("h-4", {
        "flex ai-c": expand,
        "iflex ai-c": !expand,
      })}
      style={expand ? { minWidth: "max-content" } : undefined}>
      {showingDebt ? (
        debtCount > 1 && debtLiquidationValueUsd !== undefined ? (
          <>
            <Fiat
              amount={debtLiquidationValueUsd}
              symbol="$"
              decimals={8}
              className="mr-1"
            />
            <div className={ltvTag}>
              <span>
                +{(Number(debtLiquidationDelta) / 1e10).toLocaleDecimal(2)}%
              </span>
              <Icons.TrendUp />
            </div>
          </>
        ) : (
          <>
            <IconDenom
              denom={p.debts[0].asset.metadata.symbol}
              className="w-3 mr-1"
            />
            <Fiat
              amount={debtLiquidationPrice}
              symbol="$"
              decimals={12}
              className="mr-1"
            />
            <div className={ltvTag}>
              <span>
                +{(Number(debtLiquidationDelta) / 1e10).toLocaleDecimal(2)}%
              </span>
              <Icons.TrendUp />
            </div>
          </>
        )
      ) : collateralCount > 1 && collateralLiquidationValueUsd !== undefined ? (
        <>
          <span data-tooltip-id={liquidationTipId} className="iflex ai-c">
            <Fiat
              amount={collateralLiquidationValueUsd}
              symbol="$"
              decimals={8}
              className="mr-1 fs-18"
            />
          </span>
          <div className={ltvTag}>
            <span>
              -{(Number(collateralLiquidationDelta) / 1e10).toLocaleDecimal(2)}%
            </span>
            <Icons.TrendDown />
          </div>
          <Tooltip
            id={liquidationTipId}
            className="tooltip"
            style={{ whiteSpace: "normal", maxWidth: "16rem" }}>
            <div className="condensed fs-15 text-left">
              <div className="fw-500 color-grey mb-1">
                {t("perTokenLiquidationPrice")}
              </div>
              {account?.collaterals.map((c, i) => {
                if (c.collateral.__typename !== "Balance") return null;
                const { asset, amount } = c.collateral;
                const share =
                  p.collateralValueUsd > 0n
                    ? (collateralLiquidationValueUsd * c.valueFull) /
                      p.collateralValueUsd
                    : 0n;
                const price = amount > 0n ? (share * 10n ** 12n) / amount : 0n;
                return (
                  <div key={i} className="flex ai-c jc-sb gap-2 py-0.5">
                    <div className="flex ai-c gap-1">
                      <IconDenom
                        denom={asset.metadata.symbol}
                        className="w-3 block"
                      />
                      <span>{asset.metadata.symbol}</span>
                    </div>
                    <Fiat amount={price} symbol="$" decimals={12} />
                  </div>
                );
              })}
              <div className="color-grey fs-12 mt-1.5">
                {t("perTokenLiquidationPriceNote")}
              </div>
            </div>
          </Tooltip>
        </>
      ) : (
        <>
          <IconDenom
            denom={p.collaterals[0].asset.metadata.symbol}
            className="w-3 mr-1"
          />
          <Fiat
            amount={collateralLiquidationPrice}
            symbol="$"
            decimals={12}
            className="mr-1"
          />
          <div className={ltvTag}>
            <span>
              -{(Number(collateralLiquidationDelta) / 1e10).toLocaleDecimal(2)}%
            </span>
            <Icons.TrendDown />
          </div>
        </>
      )}
      <SwitchArrow />
    </div>
  );
};
