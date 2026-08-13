import clsx from "clsx";
import { formatDuration, intervalToDuration } from "date-fns";
import { FC, PropsWithChildren, useState } from "react";
import {
  Button,
  Decimal,
  Loader,
  useLocalStorage,
  useTranslation,
  Warning,
} from "rujira.ui";

import { Link } from "react-router-dom";
import { MsgSwap, THOR, signers, translateError } from "rujira.js";
import connect from "rujira.ui/assets/images/connect.gif";
import exclamation from "rujira.ui/assets/images/exclamation.gif";
import settingsAni from "rujira.ui/assets/images/settings.gif";
import settings from "rujira.ui/assets/images/settings.png";

import { MsgProvider, TxButton } from "../../common/components/TxButton";
import { useAccounts } from "../../services/accounts";
import { useSwapContext } from "./Context";
import { Icons } from "rujira.ui";

export const Quote: FC<PropsWithChildren> = () => {
  const { quote } = useSwapContext();

  switch (typeof quote) {
    case "object":
      return "memo" in quote ? (
        <Success quote={quote} />
      ) : (
        <ErrorC error={quote} />
      );
    case "undefined":
      return <Fallback />;
    case "string":
      return <Loading />;
  }
};

export const Success: FC<{
  quote: signers.cosmos.QuoteSwap;
}> = ({ quote }) => {
  const { t } = useTranslation();
  const instant = quote.totalSwapSeconds === 0n;
  const [advanced, setAdvanced] = useLocalStorage("swap-advanced", "1");
  const { feeWarning, amount, from, to, source, destination } =
    useSwapContext();
  const isDangerous = quote.fees && quote.fees.totalBps > feeWarning;
  const rate = amount ? (quote.expectedAmountOut * 10n ** 12n) / amount : 0n;
  const rateInverted = rate ? 10n ** 24n / rate : 0n;
  const [invert, setInvert] = useState(false);

  // const value = tokenValue(
  //   rate || 0n,
  //   12,
  //   BigInt(data?.expectedAssetOut.asset.price?.current || 0)
  // );
  // const valueInverted = tokenValue(
  //   rateInverted || 0n,
  //   12,
  //   BigInt(data?.assetIn.asset.price?.current || 0)
  // );

  const msg =
    from && amount > 0n && source
      ? new MsgSwap(
          {
            address: source.address,
            network:
              source.asset.type === "SECURED" ? THOR : source.asset.chain,
          },
          source.asset,
          amount,
          quote.memo
        )
      : null;

  const [ani, setAni] = useState(false);

  return (
    <div className="w-full mt-2 flex dir-c gap-y-2 ai-c">
      <button
        className="transparent flex ai-c color-grey hover-white condensed fs-14 pointer mx-a"
        onMouseOver={() => setAni(true)}
        onMouseOut={() => setAni(false)}
        onClick={() => setAdvanced(advanced ? "" : "1")}>
        <img
          src={ani ? settingsAni : settings}
          alt="Settings Icon"
          className={`w-2 h-2 mr-0.5 ${ani ? "filter-white" : "filter-grey"}`}
        />
        <span>{advanced ? t("hideAdvanced") : t("showAdvanced")}</span>
      </button>

      <div className="swap__details card p-2">
        <div className="row wrap pad-mini condensed fs-14 ai-c">
          <div className="col-12 flex ai-s jc-c">
            1 <span className="mx-0.5 block">{!invert ? from : to}</span>
            <span className="color-grey mx-1">≈</span>
            <Decimal
              amount={invert ? rateInverted || 0n : rate || 0n}
              decimals={12}
              symbol={invert ? from : to}
            />
            <button className="transparent ml-1 block color-grey hover-white pointer">
              <Icons.ArrowRightLeft
                onClick={() => setInvert(!invert)}
                className="w-2 h-2 block"
              />
            </button>
          </div>
          {advanced && (
            <>
              <Slippage />
              <Duration
                instant={instant || false}
                totalSwapSeconds={quote.totalSwapSeconds}
              />
              {quote.fees && destination && (
                <>
                  <FeeItem
                    label={t("liquidityFee")}
                    amount={quote.fees.liquidity || 0n}
                    asset={destination.asset}
                    tip="Paid to THORChain Liquidity Providers and Node Operators"
                  />
                  <FeeItem
                    label={t("outboundFee")}
                    amount={quote.fees.outbound || 0n}
                    asset={destination.asset}
                    isDangerous={
                      (quote.fees.outbound || 0n) * 20n >
                      (quote.expectedAmountOut || 0n)
                    }
                    tip="Set by THORChain to pay for the outbound gas cost"
                  />

                  <FeeItem
                    label={t("affiliateFee")}
                    amount={quote.fees.affiliate || 0n}
                    asset={destination.asset}
                    tip="Exchange fee, 100% paid to RUJI stakers"
                  />
                </>
              )}
            </>
          )}
          {quote.fees && destination ? (
            <>
              <div className="col-12 mt-2 flex">
                <FeeItem
                  label={t("totalFees")}
                  amount={quote.fees?.total || 0n}
                  asset={destination.asset}
                />
              </div>
              <div className="col-12 col-xs-4 text-center text-xs-left color-grey fw-500 py-0.5">
                <div
                  className="iflex ai-c no-select"
                  data-tooltip-id="swap-tip"
                  data-tooltip-html={t("totalFeesTooltip")}>
                  {t("totalFeesPercent")}
                  <Icons.Info className="ml-0.5 block w-2.5" />
                </div>
              </div>

              <div className="col-12 col-xs-8 text-center text-xs-right py-0.5">
                <Decimal
                  amount={quote.fees.totalBps * 100n}
                  decimals={4}
                  round={2}
                  symbol="%"
                  className={clsx({
                    "color-red": isDangerous,
                  })}
                />
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div className="flex dir-c ai-c">
        <MsgProvider msg={msg}>
          <TxButton
            className={clsx({
              "button--icon-right button--big": true,
              //"button--big": !isDangerous,
              "button--red": isDangerous,
            })}
            hideSimulation={!advanced}
            label={instant ? t("instantSwap") : t("initiateSwap")}></TxButton>
        </MsgProvider>
      </div>
      {isDangerous && (
        <Warning color="red" className="condensed iflex">
          <Icons.ExclamationTriangle className="color-red" />
          <span className="warning__msg">
            {t("feeWarningMessage", {
              percent: (Number(feeWarning) / 100).toLocaleDecimal(2),
            })}
          </span>
        </Warning>
      )}
    </div>
  );
};

const ErrorC: FC<{ error: Error }> = ({ error }) => (
  <div className="w-full mt-4 condensed fs-14 text-center flex ai-c">
    <Warning
      className="warning--sm mt-2 condensed flex ai-c mx-a"
      color="orange">
      <img
        src={exclamation}
        alt=""
        className="filter-orange block no-shrink"
        style={{ width: "2rem", height: "2rem" }}
      />
      <div className="text-left fs-14">{translateError(error.message)}</div>
    </Warning>
  </div>
);
const Fallback: FC = () => {
  const { t } = useTranslation();
  const { selected } = useAccounts();
  return (
    <>
      {selected ? (
        <div className="w-full mt-4 text-center">
          <Button
            disabled
            className={clsx({
              "button--icon-right button--big button--grey": true,
            })}
            label={t("selectSwapAmount")}></Button>
        </div>
      ) : (
        <div className="w-full mt-4 text-center">
          <Button
            className="button--outline button--big button--icon-right"
            label={t("connectWalletToContinue")}
            to="/connect"
            as={Link}>
            <img
              src={connect}
              alt="Connect Animation"
              className="filter-primary hover-filter-white"
            />
          </Button>
        </div>
      )}
    </>
  );
};

const Loading: FC = () => (
  <div className="w-full mt-2">
    <Loader className="w-4 h-4 mx-a" />
  </div>
);

const Slippage = () => {
  const { t } = useTranslation();
  const { slippageLimit, setSlippageLimit } = useSwapContext();

  return (
    <>
      <div className="col-12 col-xs-4 text-center text-xs-left color-grey fw-500 py-0.5">
        <div
          className="iflex ai-c no-select"
          data-tooltip-id="swap-tip"
          data-tooltip-html={t("slippageToleranceTooltip")}>
          {t("slippageTolerance")}
          <Icons.Info className="ml-0.5 block w-2.5" />
        </div>
      </div>
      <div className="col-12 col-xs-8 text-center text-xs-right py-0.5">
        <Button
          className={clsx({
            "button--outline button--xsmall ml-0.5 w-4": true,
            "button--grey": slippageLimit !== 100n,
          })}
          onClick={() => setSlippageLimit(100n)}>
          1%
        </Button>
        <Button
          className={clsx({
            "button--outline button--xsmall ml-0.5 w-4": true,
            "button--grey": slippageLimit !== 200n,
          })}
          onClick={() => setSlippageLimit(200n)}>
          2%
        </Button>
        <Button
          className={clsx({
            "button--outline button--xsmall ml-0.5 w-4": true,
            "button--grey": slippageLimit !== 500n,
          })}
          onClick={() => setSlippageLimit(500n)}>
          5%
        </Button>
        <Button
          className={clsx({
            "button--outline button--xsmall ml-0.5 w-4": true,
            "button--grey": slippageLimit !== 750n,
          })}
          onClick={() => setSlippageLimit(750n)}>
          7.5%
        </Button>
      </div>
    </>
  );
};

const Duration: FC<{ totalSwapSeconds?: bigint; instant: boolean }> = ({
  totalSwapSeconds,
  instant,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="col-12 col-xs-4 text-center text-xs-left color-grey fw-500 py-0.5">
        <div
          className="iflex ai-c no-select"
          data-tooltip-id="swap-tip"
          data-tooltip-html={t("durationTooltip")}>
          {t("duration")}
          <Icons.Info className="ml-0.5 block w-2.5" />
        </div>
      </div>
      <div className="col-12 col-xs-8 text-center text-xs-right py-0.5">
        {instant
          ? t("instant")
          : formatDuration(
              intervalToDuration({
                start: 0,
                end: Number((totalSwapSeconds || 0n) * 1000n),
              }),
              { format: ["hours", "minutes", "seconds"], zero: false }
            )}
      </div>
    </>
  );
};

const FeeItem: FC<{
  label: string;
  amount: bigint;
  asset: {
    price?: { current?: bigint | null } | null;
    metadata: { symbol: string };
  };

  tip?: string;
  isDangerous?: boolean;
}> = ({ label, amount, asset, tip, isDangerous }) => {
  const value = ((asset?.price?.current || 0n) * amount) / 10n ** 12n;
  return (
    <>
      <div className="col-12 col-xs-4 text-center text-xs-left color-grey fw-500 py-0.5">
        <div
          data-tooltip-id="swap-tip"
          data-tooltip-html={tip}
          className="iflex ai-c no-select">
          {label}
          {tip && <Icons.Info className="ml-0.5 block w-2.5" />}
        </div>
      </div>
      <div className="col-12 col-xs-8 text-center text-xs-right py-0.5">
        <Decimal
          amount={amount}
          round={6}
          symbol={asset?.metadata.symbol}
          className={clsx({
            "color-red": isDangerous,
          })}
        />
        {value !== undefined ? (
          <div
            className={clsx({
              "iflex ml-1 fs-13": true,
              "color-grey": !isDangerous,
              "color-red": isDangerous,
            })}>
            (
            <Decimal
              amount={value}
              decimals={8}
              round={2}
              symbol="$"
              symbolLeft
            />
            )
          </div>
        ) : null}
      </div>
    </>
  );
};
