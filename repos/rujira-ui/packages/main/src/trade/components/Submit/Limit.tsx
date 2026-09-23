import clsx from "clsx";
import { FC, useEffect, useMemo } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { Msg, MsgExec, priceFormatter, THOR } from "rujira.js";
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
import { usePreloadedBalance } from "../../../common/components/Balance";
import { useNotificationModal } from "../../../common/components/Notifications";
import {
  MsgProvider,
  TxBalanceAccountButton,
  TxButton,
} from "../../../common/components/TxButton";
import { Side } from "../../types";
import { adjust } from "../../utils";
import { AutoClaimerToggle } from "../AutoClaimerToggle";
import { useAmount, usePrice } from "../Context";
import { InputQuantity, toDecimal } from "../InputQuantity";
import {
  LimitSubmitFragment$data,
  LimitSubmitFragment$key,
} from "./__generated__/LimitSubmitFragment.graphql";

export const fragment = graphql`
  fragment LimitSubmitFragment on FinPair {
    address
    tick
    assetBase {
      asset
      type
      chain
      metadata {
        decimals
        symbol
      }
      price {
        current
      }
    }
    assetQuote {
      asset
      type
      chain
      metadata {
        decimals
        symbol
      }
      price {
        current
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
    book {
      bids {
        price
      }
      center
      asks {
        price
      }
    }
    feeMaker
    feeTaker
  }
`;

interface Props {
  k: LimitSubmitFragment$key;
  side: Side;
}

export const Limit: FC<Props> = ({ k, side }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useAmount();

  const d = useFragment(fragment, k);

  const [price, setPrice] = usePrice();
  useEffect(() => {
    setPrice(adjust(BigInt(d.book.center || 0), Number(d.tick)));
  }, []);

  const { request } = useNotificationModal();
  const { account } = usePreloadedBalance();
  const tickPrice = useMemo(() => {
    return adjust(price, Number(d.tick));
  }, [price, d.tick, amount]);

  const msg = useMemo(() => {
    if (!amount) return null;
    if (!account) return null;
    const orders = [[side, { fixed: toDecimal(tickPrice) }, amount.toString()]];
    return d
      ? new MsgExec(
          { address: account.address, network: THOR },
          account.asset,
          amount,
          d.address,
          { order: [orders, null] }
        )
      : null;
  }, [side, tickPrice, amount, d.address]);

  const ask = d.book.asks[0] && BigInt(d.book.asks[0].price);
  const bid = d.book.bids[0] && BigInt(d.book.bids[0].price);
  const mid = d.book.center && BigInt(d.book.center);
  const deviation = mid ? ((price - mid) * 10000n) / mid : 0n;
  const tick = Number(d.tick);
  const priceMinusTwo = price ? adjust((price * 98n) / 100n, tick) : 0n;
  const pricePlusTwo = price ? adjust((price * 102n) / 100n, tick) : 0n;
  const canBuyNudgeUp = !!ask && !!pricePlusTwo && pricePlusTwo <= ask;
  const canSellNudgeDown = !!bid && !!priceMinusTwo && priceMinusTwo >= bid;

  const priceAlert =
    (side === Side.Quote && ask && price > (ask * 10010n) / 10000n) ||
    (side === Side.Base && bid && price < (bid * 9990n) / 10000n);

  const buttonLabel =
    side === Side.Quote
      ? t("buyAsset", { asset: d.assetBase?.metadata.symbol })
      : t("sellAsset", { asset: d.assetBase?.metadata.symbol });

  const { showModal, hideModal } = useGlobalModalContext();

  const confirm = (msg: Msg, deviation: bigint) => {
    showModal({
      //title: "Confirm",
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

  return (
    <MsgProvider msg={msg}>
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
      <div>
        <Numeric
          className={clsx({
            "numeric-input numeric-input--white condensed": true,
            "numeric-input--error": priceAlert,
          })}
          amount={price}
          onChangeAmount={setPrice}
          decimals={12}
          // onValueChange={(x) => setPrice(x.value)}
        >
          <label>
            {t("price")}{" "}
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

        <div className="flex ai-c jc-c mx-a mt-0.5">
          {side === Side.Base ? (
            <>
              <button
                className="trade__submit-sm-btn"
                onClick={() => bid && setPrice(adjust(bid, tick))}>
                {t("bid")}
              </button>

              <button
                className="trade__submit-sm-btn ml-0.5"
                onClick={() => mid && setPrice(adjust(mid, tick))}>
                {t("mid")}
              </button>
              <button
                className="trade__submit-sm-btn ml-0.5"
                onClick={() => ask && setPrice(adjust(ask, tick))}>
                {t("ask")}
              </button>

              <button
                className="trade__submit-sm-btn ml-0.5"
                onClick={() => pricePlusTwo && setPrice(pricePlusTwo)}>
                +2%
              </button>
              <button
                className={clsx("trade__submit-sm-btn ml-0.5", {
                  invisible: !canSellNudgeDown,
                })}
                disabled={!canSellNudgeDown}
                onClick={() => canSellNudgeDown && setPrice(priceMinusTwo)}>
                -2%
              </button>
            </>
          ) : (
            <>
              <button
                className="trade__submit-sm-btn"
                onClick={() => ask && setPrice(adjust(ask, tick))}>
                {t("ask")}
              </button>

              <button
                className="trade__submit-sm-btn ml-0.5"
                onClick={() => mid && setPrice(adjust(mid, tick))}>
                {t("mid")}
              </button>
              <button
                className="trade__submit-sm-btn ml-0.5"
                onClick={() => bid && setPrice(adjust(bid, tick))}>
                {t("bid")}
              </button>
              <button
                className="trade__submit-sm-btn ml-0.5"
                onClick={() => priceMinusTwo && setPrice(priceMinusTwo)}>
                -2%
              </button>
              <button
                className={clsx("trade__submit-sm-btn ml-0.5", {
                  invisible: !canBuyNudgeUp,
                })}
                disabled={!canBuyNudgeUp}
                onClick={() => canBuyNudgeUp && setPrice(pricePlusTwo)}>
                +2%
              </button>
            </>
          )}
        </div>
      </div>
      <AutoClaimerToggle>
        <Quote amount={amount} side={side} data={d || undefined} />
        <p className="color-grey fs-12 text-center flex ai-c jc-c mt-a fw-500">
          <span
            className="iflex ai-c"
            data-tooltip-html={`<div class="w-25">${t("limitOrderTooltip", {
              asset: d.assetBase.metadata.symbol,
            })}</div>`}
            data-tooltip-id="global-tip">
            {t("whatAreLimitOrders")}
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
              priceAlert ? (
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
            onSimulation={({ status }) => {
              if (status === "running") {
                const adjusted = adjust(price, Number(d.tick));
                if (adjusted !== price) setPrice(adjusted);
              }
            }}
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
}> = ({ data, amount, side }) => {
  const { t } = useTranslation();
  const [price] = usePrice();
  const totalReturn = price
    ? side === Side.Base
      ? (amount * price) / 10n ** 12n
      : (amount * 10n ** 12n) / price
    : 0n;

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

      <div
        className="flex"
        data-tooltip-id="global-tip"
        data-tooltip-float={true}
        data-tooltip-content={`${(Number(data?.feeMaker) / 1e10).toLocaleDecimal(3)}% ${t("makerFee")}`}>
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
