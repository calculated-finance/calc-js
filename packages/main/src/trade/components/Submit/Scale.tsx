import clsx from "clsx";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useFragment } from "react-relay";
import { Msg, MsgExec, THOR, priceFormatter } from "rujira.js";
import {
  AssetLabel,
  assetLabel,
  Button,
  Decimal,
  Icons,
  Numeric,
  TranslationProvider,
  useGlobalModalContext,
  useTranslation,
} from "rujira.ui";
import exclamation from "rujira.ui/assets/images/exclamation.gif";
import { usePreloadedBalance } from "../../../common/components/Balance.tsx";
import { useNotificationModal } from "../../../common/components/Notifications.tsx";
import {
  MsgProvider,
  TxBalanceAccountButton,
  TxButton,
} from "../../../common/components/TxButton.tsx";
import { Side } from "../../types.ts";
import { adjust } from "../../utils.ts";
import { AutoClaimerToggle } from "../AutoClaimerToggle.tsx";
import { useAmount, usePrice } from "../Context.tsx";
import { InputQuantity, toDecimal } from "../InputQuantity.tsx";
import {
  LimitSubmitFragment$data,
  LimitSubmitFragment$key,
} from "./__generated__/LimitSubmitFragment.graphql.ts";
import { fragment } from "./Limit.tsx";

interface ScaleOrder {
  price: bigint;
  amount: bigint;
}

const MIN_TOTAL_ORDERS = 2n;
const MAX_TOTAL_ORDERS = 50n;
const MAX_SKEW_SIZE = 9900n;

const clamp = (value: bigint, min: bigint, max: bigint) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const clampTotalOrders = (value: bigint) =>
  clamp(value, MIN_TOTAL_ORDERS, MAX_TOTAL_ORDERS);

const clampSkewSize = (value: bigint) =>
  value < 0n ? 0n : value > MAX_SKEW_SIZE ? MAX_SKEW_SIZE : value;

const getDefaultStartPrice = (
  center: LimitSubmitFragment$data["book"]["center"],
  tick: LimitSubmitFragment$data["tick"]
) => adjust(BigInt(center || 0), Number(tick));

const getDefaultEndPrice = (
  startPrice: bigint,
  side: Side,
  tick: LimitSubmitFragment$data["tick"]
) => {
  if (startPrice <= 0n) return 0n;

  const numerator = side === Side.Quote ? 9n : 11n;
  return adjust((startPrice * numerator) / 10n, Number(tick));
};

interface Props {
  k: LimitSubmitFragment$key;
  side: Side;
}

export const Scale: FC<Props> = ({ k, side }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useAmount();

  const d = useFragment(fragment, k);

  const [selectedPrice] = usePrice();

  const [startPrice, setStartPrice] = useState(0n);
  const [endPrice, setEndPrice] = useState(0n);

  const [startPriceFocused, setStartPriceFocused] = useState(false);
  const [endPriceFocused, setEndPriceFocused] = useState(false);
  const [startPriceEdited, setStartPriceEdited] = useState(false);
  const [endPriceEdited, setEndPriceEdited] = useState(false);

  const [totalOrders, setTotalOrders] = useState(5n);
  const [skewSize, setSkewSize] = useState(100n);

  const [swapRotation, setSwapRotation] = useState(0);
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const initializedPair = useRef<string>();

  const totalOrdersOutOfBounds =
    totalOrders < MIN_TOTAL_ORDERS || totalOrders > MAX_TOTAL_ORDERS;

  useEffect(() => {
    const defaultStartPrice = getDefaultStartPrice(d.book.center, d.tick);

    if (initializedPair.current !== d.address) {
      initializedPair.current = d.address;
      setStartPrice(defaultStartPrice);
      setStartPriceEdited(false);
      setEndPriceEdited(false);
      return;
    }
    
    if (!startPriceEdited && startPrice === 0n && defaultStartPrice > 0n) {
      setStartPrice(defaultStartPrice);
    }
  }, [d.address, d.book.center, d.tick, startPrice, startPriceEdited]);

  useEffect(() => {
    if (endPriceEdited) return;

    setEndPrice(getDefaultEndPrice(startPrice, side, d.tick));
  }, [endPriceEdited, side, startPrice, d.tick]);

  const scaleOrders = useMemo(
    () =>
      generateScaleOrders(
        startPrice,
        endPrice,
        totalOrders,
        skewSize,
        amount,
        Number(d.tick)
      ),
    [startPrice, endPrice, totalOrders, skewSize, amount, d.tick]
  );

  const maxOrderAmount = useMemo(
    () => scaleOrders.reduce((max, o) => (o.amount > max ? o.amount : max), 0n),
    [scaleOrders]
  );

  useEffect(() => {
    if (startPriceFocused) {
      setStartPriceEdited(true);
      setStartPrice(selectedPrice);
      setTimeout(() => {
        setStartPriceFocused(true);
      }, 100);
    } else if (endPriceFocused) {
      setEndPriceEdited(true);
      setEndPrice(selectedPrice);
      setTimeout(() => {
        setEndPriceFocused(true);
      }, 100);
    }
  }, [selectedPrice]);

  const { request } = useNotificationModal();
  const { account } = usePreloadedBalance();
  const msg = useMemo(() => {
    if (!amount) return null;
    if (!account) return null;
    if (startPrice <= 0n || endPrice <= 0n) return null;
    if (
      totalOrders < MIN_TOTAL_ORDERS ||
      totalOrders > MAX_TOTAL_ORDERS ||
      skewSize === 0n ||
      skewSize > MAX_SKEW_SIZE
    )
      return null;
    if (scaleOrders.length === 0) return null;

    const orders = scaleOrders.map((order) => [
      side,
      { fixed: toDecimal(order.price) },
      order.amount.toString(),
    ]);
    return d
      ? new MsgExec(
          { address: account.address, network: THOR },
          account.asset,
          amount,
          d.address,
          { order: [orders, null] }
        )
      : null;
  }, [
    side,
    startPrice,
    endPrice,
    amount,
    account,
    d.address,
    totalOrders,
    skewSize,
    scaleOrders,
  ]);

  const ask = d.book.asks[0] && BigInt(d.book.asks[0].price);
  const bid = d.book.bids[0] && BigInt(d.book.bids[0].price);
  const mid = d.book.center && BigInt(d.book.center);
  const deviation = mid ? ((startPrice - mid) * 10000n) / mid : 0n;

  const startPriceAlert = !!(
    (side === Side.Quote && ask && startPrice > (ask * 10010n) / 10000n) ||
    (side === Side.Base && bid && startPrice < (bid * 9990n) / 10000n)
  );

  const endPriceAlert = !!(
    (side === Side.Quote && ask && endPrice > (ask * 10010n) / 10000n) ||
    (side === Side.Base && bid && endPrice < (bid * 9990n) / 10000n)
  );

  const buttonLabel =
    side === Side.Quote
      ? t("buyAsset", { asset: d.assetBase?.metadata.symbol || "" })
      : t("sellAsset", { asset: d.assetBase?.metadata.symbol || "" });

  const { showModal, hideModal } = useGlobalModalContext();

  const confirm = (msg: Msg, deviation: bigint) => {
    showModal({
      backgroundClose: true,
      children: (
        <TranslationProvider namespace="trade">
          <MsgProvider msg={msg}>
            <ConfirmModal
              deviation={deviation}
              side={side}
              label={buttonLabel}
              onSuccess={request}
              cancel={hideModal}
            />
          </MsgProvider>
        </TranslationProvider>
      ),
    });
  };

  const quoteSymbol = d.assetQuote.metadata.symbol;
  const offerSymbol =
    side === Side.Quote
      ? d.assetQuote.metadata.symbol
      : d.assetBase.metadata.symbol;
  const askSymbol =
    side === Side.Quote
      ? d.assetBase.metadata.symbol
      : d.assetQuote.metadata.symbol;
  const sideStr = side === Side.Quote ? "quote" : "base";

  return (
    <MsgProvider msg={msg}>
      <div className={"flex dir-c gap-1.5"}>
        <InputQuantity
          amount={amount}
          setAmount={setAmount}
          asset={side === Side.Quote ? d.assetQuote : d.assetBase}
          fiat={{
            price:
              side === Side.Quote
                ? d.assetQuote.price?.current
                : d.assetBase.price?.current,
            symbol: "$",
          }}
        />

        <div className="flex dir-c gap-1">
          <Numeric
            className={clsx({
              "numeric-input numeric-input--white condensed": true,
              "numeric-input--error": startPriceAlert,
            })}
            amount={startPrice}
            onChangeAmount={(value) => {
              setStartPriceEdited(true);
              setStartPrice(value);
            }}
            focused={startPriceFocused}
            onFocus={() => {
              setStartPriceFocused(true);
              setEndPriceFocused(false);
            }}
            onBlur={() => {
              setTimeout(() => setStartPriceFocused(false), 100);
            }}
            decimals={12}>
            <label className="numeric-input__label">
              {t("startPrice")}{" "}
              <small>
                (
                <AssetLabel
                  asset={d.assetQuote}
                  Container={({ children }) => <>{children}</>}
                />
                )
              </small>
            </label>
          </Numeric>

          <div className="flex jc-c my-1">
            <button
              type="button"
              tabIndex={-1}
              className="trade__submit-price-switch-btn"
              onClick={() => {
                const temp = startPrice;
                setStartPriceEdited(true);
                setStartPrice(endPrice);
                setEndPriceEdited(true);
                setEndPrice(temp);
                setSwapRotation((r) => r + 180);
              }}
              style={{ transform: `rotate(${swapRotation}deg)` }}>
              <Icons.AngleUpDown
                className="w-2 h-2 color-white"
                viewBox="0 0 480 448"
              />
            </button>
          </div>

          <Numeric
            className={clsx({
              "numeric-input numeric-input--white condensed": true,
              "numeric-input--error": endPriceAlert,
            })}
            amount={endPrice}
            onChangeAmount={(value) => {
              setEndPriceEdited(true);
              setEndPrice(value);
            }}
            focused={endPriceFocused}
            onFocus={() => {
              setEndPriceFocused(true);
              setStartPriceFocused(false);
            }}
            onBlur={() => {
              setTimeout(() => setEndPriceFocused(false), 100);
            }}
            decimals={12}>
            <label className="numeric-input__label">
              {t("endPrice")}{" "}
              <small>
                (
                <AssetLabel
                  asset={d.assetQuote}
                  Container={({ children }) => <>{children}</>}
                />
                )
              </small>
            </label>
          </Numeric>
        </div>

        <div className="flex mt-1.5">
          <div className="flex dir-c gap-0.5">
            <Numeric
              className={clsx({
                "numeric-input numeric-input--white condensed mr-1.5": true,
                "numeric-input--error": totalOrdersOutOfBounds,
              })}
              amount={totalOrders}
              onChangeAmount={setTotalOrders}
              onBlur={() => setTotalOrders((value) => clampTotalOrders(value))}
              onKeyDown={(event) => {
                if (event.key === "Enter") event.currentTarget.blur();
              }}
              decimals={0}>
              <label className="numeric-input__label">{t("totalOrders")}</label>
            </Numeric>
            <p className="lh-16 fs-12 flex jc-e fw-500 mr-1.5 color-grey">
              {t("totalOrdersAllowed")}
            </p>
          </div>
          <div className="flex dir-c gap-0.5">
            <Numeric
              className={clsx({
                "numeric-input numeric-input--white condensed": true,
                "numeric-input--error":
                  skewSize === 0n || skewSize > MAX_SKEW_SIZE,
              })}
              amount={skewSize}
              onChangeAmount={setSkewSize}
              onBlur={() => setSkewSize((value) => clampSkewSize(value))}
              onKeyDown={(event) => {
                if (event.key === "Enter") event.currentTarget.blur();
              }}
              decimals={2}>
              <label className="numeric-input__label">{t("skewSize")}</label>
            </Numeric>
            <p className="color-grey fs-12 text-center flex ai-c jc-e fw-500">
              <span
                className="iflex ai-c"
                data-tooltip-html={`
                <div class="w-25">
                  <p>${t("skewSizeTooltipIntro")}</p>
                  <ul class="mt-0.5" style="padding-left: 1rem;">
                    <li>${t("skewSizeTooltip1")}</li>
                    <li>${t("skewSizeTooltip2")}</li>
                    <li>${t("skewSizeTooltip3")}</li>
                  </ul>
                </div>`}
                data-tooltip-id="global-tip">
                {t("whatIsSkewSize")}
                <Icons.Info className="w-2 h-2 ml-0.5" />
              </span>
            </p>
          </div>
        </div>

        <div className="mt-1.5">
          <div
            className="flex ai-c w-full pointer fs-12 color-grey py-1"
            onClick={() => setPreviewExpanded(!previewExpanded)}>
            <span className="fw-500">
              {t("previewOrders")} {`(${scaleOrders.length ?? 0})`}
            </span>
            {previewExpanded ? (
              <Icons.AngleUp className="ml-a w-2 h-2" />
            ) : (
              <Icons.AngleDown className="ml-a w-2 h-2" />
            )}
          </div>

          {previewExpanded && (
            <div className="trade__submit-scale-preview br-0 card overflow-y-auto mt-0.5">
              {scaleOrders.length > 0 ? (
                <>
                  <div className="flex fs-10 color-grey my-0.5 fw-600">
                    <span className="col-1 text-center">#</span>
                    <span className="col-3">
                      {t("price")} ({quoteSymbol})
                    </span>
                    <span className="col-4 text-right">
                      {t("amount")} ({offerSymbol})
                    </span>
                    <span className="col-4 text-right pr-1">
                      {t("return")} ({askSymbol})
                    </span>
                  </div>
                  {[...scaleOrders]
                    .sort((a, b) => Number(b.price - a.price))
                    .map((order, index) => (
                      <PreviewOrderRow
                        key={index}
                        order={order}
                        index={index}
                        side={sideStr}
                        maxAmount={maxOrderAmount}
                      />
                    ))}
                </>
              ) : (
                <p className="fs-12 color-grey text-center fw-500 py-1">
                  {t("completeFieldsForPreview")}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <AutoClaimerToggle>
        <Quote
          amount={amount}
          side={side}
          data={d || undefined}
          scaleOrders={scaleOrders}
        />
        <p className="color-grey fs-12 text-center flex ai-c jc-c fw-500">
          <span
            className="iflex ai-c"
            data-tooltip-html={`
            <div class="w-25">
              ${t("scaleOrderTooltip", {
                asset: d.assetBase.metadata.symbol,
              })}
            </div>`}
            data-tooltip-id="global-tip">
            {t("whatAreScaleOrders")}
            <Icons.Info className="w-2 h-2 ml-0.5" />
          </span>
        </p>

        <div>
          <TxBalanceAccountButton
            required={{
              asset: side === Side.Base ? d.assetBase : d.assetQuote,
              amount,
            }}
            Component={(props) =>
              (startPriceAlert || endPriceAlert) && msg ? (
                <Button
                  className="button--red w-full"
                  label={buttonLabel}
                  onClick={() => msg && confirm(msg, deviation)}>
                  <img src={exclamation} alt="" className="filter-white big" />
                </Button>
              ) : (
                <TxButton {...props} />
              )
            }
            hideSimulation
            onSuccess={request}
            label={buttonLabel}
            className={clsx({
              "w-full": true,
              "button--blue": side == Side.Quote,
              "button--red": side == Side.Base,
            })}
          />
        </div>
      </AutoClaimerToggle>
    </MsgProvider>
  );
};

const PreviewOrderRow: FC<{
  order: ScaleOrder;
  index: number;
  side: "base" | "quote";
  maxAmount: bigint;
}> = ({ order, index, side, maxAmount }) => {
  const returnAmount =
    side === "quote"
      ? (order.amount * 10n ** 12n) / order.price
      : (order.amount * order.price) / 10n ** 12n;
  const barWidth =
    maxAmount > 0n ? Number((order.amount * 100n) / maxAmount) : 0;
  const isBuy = side === "quote";

  return (
    <div
      className="flex fs-12 color-white py-0.5 pr-1 border-b border-grey-darker"
      style={{ position: "relative" }}>
      <span
        className="col-1 text-center color-grey"
        style={{ position: "relative", zIndex: 2 }}>
        {index + 1}
      </span>
      <span
        className={clsx({
          "col-3": true,
          "color-teal": isBuy,
          "color-red": !isBuy,
        })}
        style={{ position: "relative", zIndex: 2 }}>
        <Decimal amount={order.price} decimals={12} />
      </span>
      <span
        className="col-4 text-right"
        style={{ position: "relative", zIndex: 2 }}>
        <Decimal amount={order.amount} decimals={8} />
      </span>
      <span
        className="col-4 text-right"
        style={{ position: "relative", zIndex: 2 }}>
        <Decimal amount={returnAmount} decimals={8} />
      </span>
      <i
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: `${barWidth}%`,
          background: isBuy ? "#60FBD0" : "#E53935",
          opacity: 0.2,
          zIndex: 1,
        }}
      />
    </div>
  );
};

const calculateTotalReturn = (
  orders: ScaleOrder[],
  side: "base" | "quote"
): bigint => {
  return orders.reduce((acc, order) => {
    const orderReturn =
      side === "quote"
        ? (order.amount * 10n ** 12n) / order.price
        : (order.amount * order.price) / 10n ** 12n;
    return acc + orderReturn;
  }, 0n);
};

const calculateAveragePrice = (
  side: "base" | "quote",
  totalOffer: bigint,
  totalReturn: bigint
): bigint => {
  if (side === "base") {
    return totalOffer > 0n ? (totalReturn * 10n ** 12n) / totalOffer : 0n;
  } else {
    return totalReturn > 0n ? (totalOffer * 10n ** 12n) / totalReturn : 0n;
  }
};

const generateScaleOrders = (
  startPrice: bigint,
  endPrice: bigint,
  totalOrders: bigint,
  skewSize: bigint,
  totalAmount: bigint,
  tick?: number
): ScaleOrder[] => {
  if (totalOrders < MIN_TOTAL_ORDERS) return [];

  const safeTotalOrders =
    totalOrders > MAX_TOTAL_ORDERS ? MAX_TOTAL_ORDERS : totalOrders;
  const safeSkewSize = clampSkewSize(skewSize);
  const orderCount = Number(safeTotalOrders);

  if (totalAmount <= 0n) return [];
  if (startPrice <= 0n || endPrice <= 0n) return [];
  if (safeSkewSize <= 0n) return [];

  const orders: ScaleOrder[] = [];
  const skewNumerator = safeSkewSize;
  const skewDenominator = 100n;

  const priceRange = endPrice - startPrice;
  const precision = 10n ** 18n;

  const sumCoefficient = safeTotalOrders * (skewDenominator + skewNumerator);
  const baseAmountScaled =
    (2n * totalAmount * skewDenominator * precision) / sumCoefficient;

  let runningTotal = 0n;

  for (let i = 0; i < orderCount; i++) {
    const rawPrice =
      startPrice + (priceRange * BigInt(i)) / (safeTotalOrders - 1n);
    const price = tick ? adjust(rawPrice, tick) : rawPrice;
    const skewMultiplier =
      skewDenominator +
      ((skewNumerator - skewDenominator) * BigInt(i)) / (safeTotalOrders - 1n);

    let amount: bigint;
    if (i === orderCount - 1) {
      amount = totalAmount - runningTotal;
    } else {
      amount =
        (baseAmountScaled * skewMultiplier) / (skewDenominator * precision);
      runningTotal += amount;
    }

    orders.push({ price, amount });
  }

  return orders;
};

const ConfirmModal: FC<{
  side: Side;
  label: string;
  deviation: bigint;
  onSuccess: () => void;
  cancel: () => void;
}> = ({ side, label, onSuccess, cancel, deviation }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex ai-c jc-c">
        <img
          src={exclamation}
          alt=""
          className="filter-orange block w-6 h-a no-shrink"
        />
        <span className="color-orange fs-14 fw-600 mx-1">
          {t("priceDeviationWarningStart")}{" "}
          <span className="color-white">
            {(Math.abs(Number(deviation)) / 100).toLocaleDecimal(2)}%
          </span>{" "}
          {deviation > 0
            ? t("priceDeviationWarningAbove")
            : t("priceDeviationWarningBelow")}
        </span>
      </div>

      <div className="modal__footer mt-4 px-3 py-2 flex ai-s wrap">
        <Button
          className="button--grey button--outline mr-1"
          onClick={cancel}
          label={t("cancel")}
        />
        <div className="block ml-a text-right">
          <TxButton
            onSuccess={onSuccess}
            label={label}
            className={clsx({
              "button ml-1": true,
              "button--blue": side == Side.Quote,
              "button--red": side == Side.Base,
            })}
          />
        </div>
      </div>
    </>
  );
};

const Quote: FC<{
  data?: LimitSubmitFragment$data;
  amount: bigint;
  side: Side;
  scaleOrders: ScaleOrder[];
}> = ({ data, amount, side, scaleOrders }) => {
  const { t } = useTranslation();
  const sideStr = side === Side.Quote ? "quote" : "base";
  const totalReturn = calculateTotalReturn(scaleOrders, sideStr);
  const averagePrice = calculateAveragePrice(sideStr, amount, totalReturn);

  const fee = (BigInt(data?.feeMaker || "0") * totalReturn) / 10n ** 12n;
  const returned = totalReturn - fee;

  const assetOut = side === Side.Quote ? data?.assetBase : data?.assetQuote;

  return (
    <div className="flex dir-c mt-1 mb-2 gap-y-1 fs-12 color-grey condensed">
      <div className="flex ai-c grow trade__quote trade__quote--return">
        <div className="condensed color-primary1 grow fs-14">{t("return")}</div>
        <Decimal
          amount={BigInt(returned || "")}
          className="ml-a color-white fs-14"
          symbol={assetLabel(assetOut)}
          symbolClassName="color-grey condensed symbol inline-block text-left"
        />
      </div>

      <div className="flex">
        <div className="col">{t("avgPrice")}</div>
        <div className="col text-right color-white">
          <Decimal amount={averagePrice} decimals={12} />
          <span className="color-grey condensed symbol inline-block text-left ml-0.5">
            {assetLabel(data?.assetQuote)}
          </span>
        </div>
      </div>

      <div
        className="flex"
        data-tooltip-id="global-tip"
        data-tooltip-float={true}
        data-tooltip-content={t("makerFeeTooltip")}>
        <div className="col">
          <span className="iflex ai-c">
            {t("fee")}
            <Icons.Info className="w-2 h-2 ml-0.5 color-grey" />
          </span>
        </div>
        <div className="col text-right color-white">
          {priceFormatter(fee * 10000n)}
          <span className="color-grey condensed symbol inline-block text-left ml-0.5">
            {assetLabel(assetOut)}
          </span>
        </div>
      </div>
    </div>
  );
};
