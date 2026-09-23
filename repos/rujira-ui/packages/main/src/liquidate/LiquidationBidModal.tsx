import { Buffer } from "buffer";
import clsx from "clsx";
import { FC, useMemo, useState } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import { Link } from "react-router-dom";
import { Asset, isThor, MsgExec, THOR } from "rujira.js";
import {
  Button,
  Decimal,
  DenomInput,
  IconDenom,
  Icons,
  Slider,
  useLocale,
  useTranslation,
} from "rujira.ui";
import connect from "rujira.ui/assets/images/connect.gif";
import {
  BalanceCompact,
  BalanceProvider,
  usePreloadedBalance,
} from "../common/components/Balance";
import { useNotificationModal } from "../common/components/Notifications";
import {
  MsgProvider,
  TxBalanceAccountButton,
} from "../common/components/TxButton";
import { useAccounts } from "../services/accounts";
import { normalizeTradeSegment } from "../services/assetUrl";
import { Side } from "../trade/types";
import { LiquidationBidModalQuery } from "./__generated__/LiquidationBidModalQuery.graphql";
import {
  DISCOUNT_BASIS_POINTS_PER_PERCENT,
  LIQUIDATION_BID_DISCOUNT_DEFAULT,
  LIQUIDATION_BID_DISCOUNT_MAX,
  LIQUIDATION_BID_DISCOUNT_MIN,
} from "./constants";
import { liquidationBidDeviationBps } from "./utils";

const query = graphql`
  query LiquidationBidModalQuery($id: ID!) {
    pair: node(id: $id) {
      __typename
      ... on FinPair {
        address
        assetBase {
          asset
          type
          chain
          price {
            current
          }
          metadata {
            symbol
            decimals
          }
        }
        assetQuote {
          asset
          type
          chain
          price {
            current
          }
          metadata {
            symbol
            decimals
          }
        }
        oracleBase {
          id
          price
        }
        oracleQuote {
          id
          price
        }
      }
    }
  }
`;

type BidAsset = Asset & {
  price?: {
    current?: bigint | null;
  } | null;
};

const ORACLE_PRICE_SCALE = 10n ** 12n;
const BASIS_POINTS_SCALE = 10_000;

const LiquidationBidHeader: FC<{
  bidSymbol: string;
  collateralSymbol: string;
}> = ({ bidSymbol, collateralSymbol }) => {
  const { t } = useTranslation("liquidate");

  return (
    <div className="liquidation-bid-modal__header flex ai-c gap-1">
      <h3 className="h3 flex ai-b mb-0">
        <IconDenom
          denom={collateralSymbol}
          className="as-c w-4 h-4 block mr-1 no-shrink"
        />
        <span>
          {t("liquidationBidTitle", {
            bidAsset: bidSymbol,
            collateralAsset: collateralSymbol,
          })}
        </span>
      </h3>
    </div>
  );
};

export const LiquidationBidModalFallback: FC<{
  bidSymbol: string;
  collateralSymbol: string;
  side: Side;
}> = ({ bidSymbol, collateralSymbol }) => {
  return (
    <>
      <LiquidationBidHeader
        bidSymbol={bidSymbol}
        collateralSymbol={collateralSymbol}
      />
      <div className="skeleton h-2 w-12 br-2 mt-2" />
      <div className="skeleton h-5 w-full br-1 mt-1" />
      <div className="skeleton h-5 w-full br-1 mt-2" />
      <div className="skeleton h-2 w-full br-2 mt-2" />
    </>
  );
};

export const LiquidationBidModal: FC<{
  bidSymbol: string;
  collateralSymbol: string;
  hideModal: () => void;
  pairKey: string;
  side: Side;
}> = ({ bidSymbol, collateralSymbol, hideModal, pairKey, side }) => {
  const { t } = useTranslation("liquidate");
  const pairId = useMemo(() => {
    const [base, quote] = pairKey.split("/");
    return Buffer.from(
      `FinPair:${normalizeTradeSegment(base || "")}/${normalizeTradeSegment(
        quote || ""
      )}`
    ).toString("base64");
  }, [pairKey]);
  const data = useLazyLoadQuery<LiquidationBidModalQuery>(query, {
    id: pairId,
  });
  const pair = data.pair?.__typename === "FinPair" ? data.pair : null;
  const spendAsset =
    pair && (side === Side.Base ? pair.assetBase : pair.assetQuote);
  const receiveAsset =
    pair && (side === Side.Base ? pair.assetQuote : pair.assetBase);

  if (!pair || !spendAsset || !receiveAsset) {
    return (
      <>
        <LiquidationBidHeader
          bidSymbol={bidSymbol}
          collateralSymbol={collateralSymbol}
        />
        <p className="color-orange fs-12 lh-16 mt-2 mb-0">
          {t("liquidationBidUnavailable")}
        </p>
      </>
    );
  }

  return (
    <BalanceProvider asset={spendAsset}>
      <LiquidationBidModalContent
        pair={pair}
        receiveAsset={receiveAsset}
        hideModal={hideModal}
        spendAsset={spendAsset}
        side={side}
      />
    </BalanceProvider>
  );
};

const LiquidationBidModalContent: FC<{
  pair: NonNullable<
    Extract<
      LiquidationBidModalQuery["response"]["pair"],
      { __typename: "FinPair" }
    >
  >;
  receiveAsset: BidAsset;
  hideModal: () => void;
  spendAsset: BidAsset;
  side: Side;
}> = ({ pair, receiveAsset, hideModal, spendAsset, side }) => {
  const { t } = useTranslation("liquidate");
  const { t: tCommon } = useTranslation("common");
  const { request } = useNotificationModal();
  const { accounts } = useAccounts();
  const { toRoot } = useLocale();
  const [amount, setAmount] = useState(0n);
  const [discountInput, setDiscountInput] = useState(
    LIQUIDATION_BID_DISCOUNT_DEFAULT.toString()
  );
  const [priceInverted, setPriceInverted] = useState(false);
  const { account, balance, additionalBalance } = usePreloadedBalance();

  const discount = Number(discountInput);
  const discountInvalid =
    discountInput.trim() === "" ||
    Number.isNaN(discount) ||
    discount < LIQUIDATION_BID_DISCOUNT_MIN ||
    discount > LIQUIDATION_BID_DISCOUNT_MAX;
  const discountValidation = t("liquidationBidDiscountValidation", {
    minDiscount: LIQUIDATION_BID_DISCOUNT_MIN,
    maxDiscount: LIQUIDATION_BID_DISCOUNT_MAX,
  });
  const clampedDiscount = clampDiscount(discount);
  const discountPositive = !discountInvalid && discount > 0;
  const discountBps = Math.round(
    clampedDiscount * DISCOUNT_BASIS_POINTS_PER_PERCENT
  );
  const deviationBps = liquidationBidDeviationBps(side, discountBps);
  const marketMissing =
    !pair.address || !pair.oracleBase?.price || !pair.oracleQuote?.price;
  const currentPrice = (() => {
    const oracleBasePrice = pair.oracleBase?.price;
    const oracleQuotePrice = pair.oracleQuote?.price;
    if (!oracleBasePrice || !oracleQuotePrice) return null;

    return side === Side.Quote
      ? (oracleBasePrice * ORACLE_PRICE_SCALE) / oracleQuotePrice
      : (oracleQuotePrice * ORACLE_PRICE_SCALE) / oracleBasePrice;
  })();
  const estimatedExecutionPrice = (() => {
    const oracleBasePrice = pair.oracleBase?.price;
    const oracleQuotePrice = pair.oracleQuote?.price;
    if (!oracleBasePrice || !oracleQuotePrice) return null;

    const adjustmentBps = BigInt(BASIS_POINTS_SCALE + deviationBps);
    return side === Side.Quote
      ? (oracleBasePrice * ORACLE_PRICE_SCALE * adjustmentBps) /
          (oracleQuotePrice * BigInt(BASIS_POINTS_SCALE))
      : (oracleQuotePrice * ORACLE_PRICE_SCALE * BigInt(BASIS_POINTS_SCALE)) /
          (oracleBasePrice * adjustmentBps);
  })();
  const displayedCurrentPrice =
    currentPrice === null
      ? null
      : priceInverted
        ? invertScaledPrice(currentPrice)
        : currentPrice;
  const displayedEstimatedExecutionPrice =
    estimatedExecutionPrice === null
      ? null
      : priceInverted
        ? invertScaledPrice(estimatedExecutionPrice)
        : estimatedExecutionPrice;
  const displayedBaseSymbol = priceInverted
    ? spendAsset.metadata.symbol
    : receiveAsset.metadata.symbol;
  const displayedQuoteSymbol = priceInverted
    ? receiveAsset.metadata.symbol
    : spendAsset.metadata.symbol;
  const max = (balance?.balance || 0n) + (additionalBalance || 0n);
  const amountInvalid = amount <= 0n;
  const amountExceedsBalance = amount > max;

  const msg = useMemo(() => {
    if (!account) return null;
    if (!pair.address) return null;
    if (marketMissing || amountInvalid || amountExceedsBalance) return null;
    if (discountInvalid) return null;

    return new MsgExec(
      { address: account.address, network: THOR },
      account.asset,
      amount,
      pair.address,
      {
        order: [[[side, { oracle: deviationBps }, amount.toString()]], null],
      }
    );
  }, [
    account,
    amount,
    amountExceedsBalance,
    amountInvalid,
    discountInvalid,
    deviationBps,
    marketMissing,
    pair.address,
    side,
  ]);

  const disabled = !msg;
  const connectRequired =
    !accounts ||
    accounts.length === 0 ||
    accounts.every((a) => !isThor(a.address));

  return (
    <MsgProvider msg={msg}>
      <LiquidationBidHeader
        bidSymbol={spendAsset.metadata.symbol}
        collateralSymbol={receiveAsset.metadata.symbol}
      />
      <BalanceCompact className="mt-2" onClick={(v) => setAmount(v.balance)} />
      <DenomInput
        symbol={spendAsset.metadata.symbol}
        className="mt-1"
        amount={amount}
        decimals={spendAsset.metadata.decimals}
        onChangeAmount={setAmount}
        fiat={{ price: spendAsset.price?.current, symbol: "$" }}
      />

      <div className="liquidation-bid-modal__discount-row row wrap pad-mini gap-y-1 mt-2">
        <div className="liquidation-bid-modal__discount-slider col-12 col-sm-6 flex ai-c">
          <div className="flex ai-c w-full">
            <span className="fs-12 condensed fw-500 color-grey mr-0.5">
              {t("liquidationBidDiscountPercent", {
                discount: LIQUIDATION_BID_DISCOUNT_MIN,
              })}
            </span>
            <Slider
              min={LIQUIDATION_BID_DISCOUNT_MIN}
              max={LIQUIDATION_BID_DISCOUNT_MAX}
              step={0.5}
              value={discountInvalid ? clampedDiscount : discount}
              onChange={(v) => setDiscountInput(v.toString())}
              marks={[
                LIQUIDATION_BID_DISCOUNT_MIN,
                10,
                20,
                LIQUIDATION_BID_DISCOUNT_MAX,
              ]}
              renderMark={(props) => {
                const { className, key, ...rest } = props;
                return (
                  <span
                    key={key}
                    className={clsx({
                      slider__mark: true,
                      [`slider__mark--${key}`]: true,
                      "slider__mark--completed": Number(key) <= clampedDiscount,
                      [`${className}`]: className,
                    })}
                    {...rest}
                  />
                );
              }}
            />
            <span className="fs-12 condensed fw-500 color-grey ml-0.5">
              {t("liquidationBidDiscountPercent", {
                discount: LIQUIDATION_BID_DISCOUNT_MAX,
              })}
            </span>
          </div>
        </div>
        <div className="liquidation-bid-modal__discount-field col-12 col-sm-6">
          <div
            data-tooltip-html={
              discountInvalid
                ? `<div class="w-25 text-left">${discountValidation}</div>`
                : undefined
            }
            data-tooltip-id={discountInvalid ? "modal-tip" : undefined}
            className={clsx({
              "numeric-input numeric-input--white condensed": true,
              "color-teal": discountPositive,
              "numeric-input--error": discountInvalid,
            })}>
            <label className="flex ai-c lh-16">
              {t("liquidationBidDiscount")}
              <span
                className="iflex ai-c ml-0.5 color-grey hover-white"
                data-tooltip-id="modal-tip"
                data-tooltip-html={`<div class="w-25 text-left">${t(
                  "liquidationBidDiscountTooltip"
                )}</div>`}
                style={{ transform: "translateY(3px)" }}
                tabIndex={0}>
                <Icons.Info className="w-2 h-2" />
              </span>
            </label>
            <div className="numeric-input__content py-2">
              <input
                type="text"
                inputMode="decimal"
                aria-label={t("liquidationBidDiscountAria")}
                aria-invalid={discountInvalid}
                value={discountInput}
                onChange={(e) => setDiscountInput(e.currentTarget.value)}
                onBlur={() =>
                  setDiscountInput(clampDiscount(discount).toString())
                }
              />
            </div>
            <span
              className={clsx({
                "fs-14 ml-0.5": true,
                "color-grey": !discountPositive,
                "color-teal": discountPositive,
              })}>
              %
            </span>
          </div>
        </div>
      </div>

      {displayedCurrentPrice !== null &&
        displayedEstimatedExecutionPrice !== null && (
          <div className="liquidation-bid-modal__prices mt-2 condensed fs-14 flex dir-c gap-y-0.5">
            <div className="liquidation-bid-modal__price-row ai-c">
              <span className="color-grey fw-500">
                {t("liquidationBidCurrentPrice")}:
              </span>
              <LiquidationPriceRate
                baseSymbol={displayedBaseSymbol}
                operator="="
                quoteSymbol={displayedQuoteSymbol}
                rate={displayedCurrentPrice}
              />
            </div>
            <div className="liquidation-bid-modal__price-row ai-c">
              <span className="color-grey fw-500 iflex ai-c">
                {t("liquidationBidEstimatedExecutionPrice")}:
                <span
                  className="iflex ai-c ml-0.5 color-grey hover-white"
                  data-tooltip-id="modal-tip"
                  data-tooltip-html={`<div class="w-25 text-left">${t(
                    "liquidationBidEstimatedExecutionPriceTooltip"
                  )}</div>`}
                  tabIndex={0}>
                  <Icons.Info className="w-2 h-2" />
                </span>
              </span>
              <LiquidationPriceRate
                baseSymbol={displayedBaseSymbol}
                quoteSymbol={displayedQuoteSymbol}
                rate={displayedEstimatedExecutionPrice}
              />
            </div>
            <button
              aria-label={t("liquidationBidReversePrice")}
              className="liquidation-bid-modal__price-reverse transparent flex ai-c jc-c color-grey hover-white pointer"
              onClick={() => setPriceInverted((v) => !v)}
              type="button">
              <Icons.ArrowRightLeft className="w-2 h-2 block" />
            </button>
          </div>
        )}

      {marketMissing && (
        <p className="color-orange fs-12 lh-16 mt-1 mb-0">
          {t("liquidationBidUnavailable")}
        </p>
      )}
      {amountExceedsBalance && (
        <p className="color-red fs-12 lh-16 mt-1 mb-0">
          {t("liquidationBidAmountExceedsBalance", {
            symbol: spendAsset.metadata.symbol,
          })}
        </p>
      )}

      <div className="modal__footer mt-5 px-3 py-2 flex dir-c dir-xs-r ai-s ai-xs-c jc-xs-sb gap-1">
        <p className="color-grey fs-12 text-left flex ai-c jc-start fw-500 mt-0 mb-0">
          <span
            data-tooltip-html={`<div class="w-32 text-left">${t(
              "liquidationBidHelpTooltip",
              {
                defaultDiscount: LIQUIDATION_BID_DISCOUNT_DEFAULT,
                examplePrice: 100 - LIQUIDATION_BID_DISCOUNT_DEFAULT,
              }
            )}</div>`}
            data-tooltip-id="modal-tip"
            className="iflex ai-c pointer"
            tabIndex={0}>
            {t("liquidationBidHowBidsWork")}
            <Icons.Info className="w-2 h-2 ml-0.5" />
          </span>
        </p>
        <div className="block ml-xs-a text-right">
          {connectRequired ? (
            <Button
              as={Link}
              className="button--primary button--outline button--icon-right"
              label={tCommon("connectWallet")}
              onClick={hideModal}
              to={toRoot("connect")}>
              <img
                src={connect}
                alt="Connect Animation"
                className="filter-primary hover-filter-white"
              />
            </Button>
          ) : (
            <TxBalanceAccountButton
              hideSimulation
              onSuccess={request}
              label={t("liquidationBidPlaceBid")}
              required={{
                asset: spendAsset,
                amount: amountExceedsBalance ? 0n : amount,
              }}
              disabled={disabled}
            />
          )}
        </div>
      </div>
    </MsgProvider>
  );
};

const clampDiscount = (value: number) => {
  if (Number.isNaN(value)) return LIQUIDATION_BID_DISCOUNT_MIN;
  return Math.min(
    LIQUIDATION_BID_DISCOUNT_MAX,
    Math.max(LIQUIDATION_BID_DISCOUNT_MIN, value)
  );
};

const LiquidationPriceRate: FC<{
  baseSymbol: string;
  className?: string;
  operator?: "=" | "≈";
  quoteSymbol: string;
  rate: bigint;
  symbolClassName?: string;
}> = ({
  baseSymbol,
  className = "color-grey",
  operator = "≈",
  quoteSymbol,
  rate,
  symbolClassName = "color-grey fs-14 condensed fw-500",
}) => {
  return (
    <span
      className={clsx(
        "liquidation-bid-modal__price-rate condensed text-right",
        className
      )}
      style={{
        whiteSpace: "nowrap",
      }}>
      <span className="liquidation-bid-modal__price-base color-grey">
        1{" "}
        <span className="color-grey fs-14 condensed fw-500">{baseSymbol}</span>
      </span>
      <span className="liquidation-bid-modal__price-operator color-grey iflex jc-c">
        {operator}
      </span>
      <Decimal
        amount={rate}
        as="span"
        className="liquidation-bid-modal__price-quote color-white"
        decimals={12}
        symbol={quoteSymbol}
        symbolClassName={symbolClassName}
        clip
      />
    </span>
  );
};

const invertScaledPrice = (price: bigint) =>
  price === 0n ? null : (ORACLE_PRICE_SCALE * ORACLE_PRICE_SCALE) / price;
