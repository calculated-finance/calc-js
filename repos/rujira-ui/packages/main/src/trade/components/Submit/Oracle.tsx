import clsx from "clsx";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFragment } from "react-relay";
import { useLocation, useNavigate } from "react-router-dom";
import { graphql } from "relay-runtime";
import { MsgExec, THOR, priceFormatter } from "rujira.js";
import {
  assetLabel,
  Decimal,
  Input,
  Slider,
  useTranslation,
} from "rujira.ui";

import { Icons } from "rujira.ui";
import { usePreloadedBalance } from "../../../common/components/Balance";
import { useNotificationModal } from "../../../common/components/Notifications";
import {
  MsgProvider,
  TxBalanceAccountButton,
} from "../../../common/components/TxButton";
import {} from "../../../portfolio/utils";
import {
  parseTrackingDeviationParam,
  searchFromParams,
} from "../../tradeUrlState";
import { Side } from "../../types";
import { AutoClaimerToggle } from "../AutoClaimerToggle";
import { useAmount } from "../Context";
import { InputQuantity } from "../InputQuantity";
import {
  OracleSubmitFragment$data,
  OracleSubmitFragment$key,
} from "./__generated__/OracleSubmitFragment.graphql";

const fragment = graphql`
  fragment OracleSubmitFragment on FinPair {
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
  k: OracleSubmitFragment$key;
  side: Side;
}

export const Oracle: FC<
  Props & { oracleBase: bigint; oracleQuote: bigint }
> = ({ k, side, oracleBase, oracleQuote }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useAmount();
  const d = useFragment(fragment, k);
  const location = useLocation();
  const navigate = useNavigate();
  const [initialDeviation] = useState(() => {
    const params = new URLSearchParams(location.search);

    return {
      isPresent: params.has("deviation"),
      value: parseTrackingDeviationParam(params.get("deviation")),
    };
  });
  const defaultDeviation = side === Side.Quote ? 30 : -30;
  const [value_, setValue] = useState(() =>
    String(initialDeviation.value ?? defaultDeviation)
  );
  const value = parseTrackingDeviationParam(value_) ?? 0;
  const previousSide = useRef(side);

  useEffect(() => {
    if (!initialDeviation.isPresent) return;

    const nextParams = new URLSearchParams(location.search);
    if (!nextParams.has("deviation")) return;

    nextParams.delete("deviation");
    navigate(
      `${location.pathname}${searchFromParams(nextParams)}${location.hash}`,
      { replace: true }
    );
  }, [
    initialDeviation.isPresent,
    location.hash,
    location.pathname,
    location.search,
    navigate,
  ]);

  const commitCurrentValue = useCallback(() => {
    const deviation = parseTrackingDeviationParam(value_);
    const nextDeviation = deviation ?? defaultDeviation;

    setValue(String(nextDeviation));
  }, [defaultDeviation, value_]);

  useEffect(() => {
    if (previousSide.current === side) return;

    previousSide.current = side;
    setValue(String(defaultDeviation));
  }, [defaultDeviation, side]);

  const { request } = useNotificationModal();
  const { account } = usePreloadedBalance();

  const msg = useMemo(() => {
    if (!account) return null;
    return new MsgExec(
      { address: account.address, network: THOR },
      account.asset,
      amount,
      d.address,
      {
        order: [[[side, { oracle: value }, amount.toString()]], null],
      }
    );
  }, [side, amount, d.address, value]);

  const price = (oracleBase * 1000000000000n) / oracleQuote;
  const rate = adjust(price, value);

  const returned =
    side === Side.Base
      ? (amount * rate) / 10n ** 12n
      : (10n ** 12n * amount) / rate;

  const fee = (returned * (d.feeMaker || 0n)) / 10n ** 12n;

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
      <div className="row wrap pad-mini">
        <div className="col w-14">
          <Input
            label={t("deviationBps")}
            className="numeric-input numeric-input--white condensed"
            type="number"
            min="-10000"
            max="10000"
            value={value_}
            onChange={(e) => {
              setValue(e.currentTarget.value);
            }}
            onBlur={commitCurrentValue}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
            }}
          />
        </div>

        <div className="col grow">
          <table className="table table--xs condensed fs-12 color-grey">
            <tbody>
              <tr>
                <td
                  data-tooltip-id="global-tip"
                  data-tooltip-html={`<div class="w-25">${t("oraclePriceTooltip")}</div>`}>
                  <div className="flex ai-c">
                    {t("oracle")}{" "}
                    <span className="color-white mx-0.5">
                      {d.assetBase.metadata.symbol}
                    </span>{" "}
                    {t("price").toLowerCase()}:
                    <Icons.Info
                      className="h-a ml-0.5 block"
                      style={{ width: "0.875rem" }}
                    />
                  </div>
                </td>
                <td className="text-right">
                  <span className="color-white mono fs-11">
                    {priceFormatter(price)}
                  </span>{" "}
                  {d.assetQuote.metadata.symbol}
                </td>
              </tr>
              <tr
                className={clsx({
                  "color-red":
                    (value > 100 && side === Side.Quote) ||
                    (value < -100 && side === Side.Base),
                  "color-teal":
                    (value > 0 && side === Side.Base) ||
                    (value < 0 && side === Side.Quote),
                })}>
                <td>
                  <span>{value > 0 ? t("premium") : t("discount")}:</span>
                </td>
                <td
                  className={clsx({
                    "text-right mono fs-11": true,
                    "color-white":
                      (value > 0 && value <= 100 && side === Side.Quote) ||
                      (value < 0 && value >= -100 && side === Side.Base),
                  })}>
                  {value >= 0 ? (
                    <span>{(value / 100).toLocaleDecimal(2)}%</span>
                  ) : (
                    <span>{(-value / 100).toLocaleDecimal(2)}%</span>
                  )}
                </td>
              </tr>
              <tr>
                <td>{t("currentExecutionPrice")}:</td>
                <td className="text-right">
                  <span className="color-white fs-11 mono">
                    {priceFormatter(rate)}
                  </span>{" "}
                  {d.assetQuote.metadata.symbol}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Slider
        min={-250}
        max={250}
        step={1}
        value={value}
        onChange={(v) => {
          setValue(v.toString());
        }}
      />

      <AutoClaimerToggle>
        <Quote
          amount={amount}
          returned={returned}
          side={side}
          data={d || undefined}
          fee={fee}
        />
        <p className="color-grey fs-12 text-center flex ai-c jc-c mt-a fw-500">
          <span
            className="iflex ai-c"
            data-tooltip-html={`
            <div class="w-25">
              ${t("trackingOrderTooltip", {
                asset: d.assetBase.metadata.symbol,
              })}
            </div>
          `}
            data-tooltip-id="global-tip">
            {t("whatAreTrackingOrders")}
            <Icons.Info className="w-2 h-2 ml-0.5" />
          </span>
        </p>

        <TxBalanceAccountButton
          hideSimulation
          onSuccess={request}
          required={{
            asset: side === Side.Base ? d.assetBase : d.assetQuote,
            amount,
          }}
          label={
            side === Side.Quote
              ? t("buyAsset", { asset: d.assetBase?.metadata.symbol })
              : t("sellAsset", { asset: d.assetBase?.metadata.symbol })
          }
          className={clsx({
            "w-full": true,
            "button--blue": side == Side.Quote,
            "button--red": side == Side.Base,
          })}
        />
      </AutoClaimerToggle>
    </MsgProvider>
  );
};

const Quote: FC<{
  data?: OracleSubmitFragment$data;
  amount: bigint;
  side: Side;
  fee: bigint;
  returned: bigint;
}> = ({ data, side, fee, returned }) => {
  const { t } = useTranslation();
  const assetOut = side === Side.Quote ? data?.assetBase : data?.assetQuote;
  return (
    <div className="flex dir-c gap-y-1 mt-1 mb-2 fs-12 color-grey condensed">
      <div className="flex ai-c grow trade__quote trade__quote--return">
        <div className="condensed color-primary1 grow fs-14">
          {t("estimatedReturn")}
        </div>
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
        data-tooltip-content={t("makerFeeTooltip")}>
        <div className="col">
          <span className="iflex ai-c">
            {t("estimatedFee")}
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

const adjust = (price: bigint, bps: number): bigint => {
  if (!price) return 0n;
  return (price * (10000n + BigInt(bps))) / 10000n;
};
