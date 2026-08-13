import clsx from "clsx";
import { FC, useMemo, useState } from "react";
import { Account, MsgExecute, signers } from "rujira.js";
import {
  Button,
  Decimal,
  DenomInput,
  Fiat,
  nFormatter,
  Slider,
  Toggle,
  useLocale,
  useTranslation,
  Warning,
} from "rujira.ui";
import exclamation from "rujira.ui/assets/images/exclamation.gif";

import { Icons } from "rujira.ui";
import { createBalanceProvider } from "../../common/components/Balance";
import { MsgProvider, TxButton } from "../../common/components/TxButton";
import { useAccounts } from "../../services/accounts";

export const [BalanceProvider, useBalances] = createBalanceProvider<
  "x" | "y"
>();

export const BowXykDeposit: FC<{
  address: string;
  config: { fee: bigint };
  state: { x: bigint; y: bigint; shares: bigint };
  priceX?: bigint;
  priceY?: bigint;
}> = ({ address, state, config, priceX, priceY }) => {
  const { t } = useTranslation("strategies");
  const { x, y } = useBalances();
  const xBalance = x.account?.balance || 0n;
  const yBalance = y.account?.balance || 0n;
  const [xAmount, setXAmount] = useState(0n);
  const [yAmount, setYAmount] = useState(0n);
  const [lastEdited, setLastEdited] = useState<"x" | "y" | undefined>();
  const [slider, setSlider_] = useState(100);
  const ratio = state.y ? (state.x * 10n ** 12n) / state.y : undefined;

  const setSlider = (v: number) => {
    if (!ratio) return;
    const maxX = (yBalance * ratio) / 10n ** 12n;

    setSlider_(v);
    if (maxX < xBalance) {
      const amountY = (yBalance * BigInt(v)) / 100n;
      const amountX = (amountY * ratio) / 10n ** 12n;
      setXAmount(amountX);
      setYAmount(amountY);
    } else {
      const amountX = (xBalance * BigInt(v)) / 100n;
      const amountY = (amountX * 10n ** 12n) / ratio;
      setXAmount(amountX);
      setYAmount(amountY);
    }
  };

  const inputRatio =
    xAmount == 0n && yAmount == 0n
      ? undefined
      : yAmount > 0n
        ? (xAmount * 10n ** 12n) / yAmount
        : 0n;

  const badRatio =
    inputRatio !== undefined && ratio
      ? Math.abs(Number(inputRatio - ratio)) > 1000000
      : false;

  return (
    <div className="card h-full p-3">
      <h3 className="fs-16 lh-22 fw-400 color-grey">{t("provide")}</h3>
      <DenomInput
        symbol={x.asset.metadata.symbol}
        className="mt-2"
        amount={xAmount}
        decimals={8}
        onChangeAmount={(x) => {
          setXAmount(x);
          setLastEdited("x");
        }}
        max={xBalance}
        maxLabel={`${t("balance")}:`}
      />
      <Icons.Plus className="w-3 h-a my-1.5 mx-a color-grey block" />
      <DenomInput
        symbol={y.asset.metadata.symbol}
        amount={yAmount}
        decimals={8}
        onChangeAmount={(x) => {
          setYAmount(x);
          setLastEdited("y");
        }}
        max={yBalance}
        maxLabel={`${t("balance")}:`}
      />
      <div className="mt-2">
        <Slider
          min={0}
          max={yAmount && xAmount ? 100 : 0}
          step={5}
          value={slider}
          onChange={(v) => {
            setSlider(v);
          }}
        />
        <p className="fs-14 lh-22 fw-400 color-grey mb-3 text-center">
          {t("selectAtPoolRatio")}
        </p>
      </div>
      {badRatio && (
        <div className="mt-2 flex ai-c jc-c" color="orange">
          <img
            src={exclamation}
            alt=""
            className="filter-orange block w-3 h-a no-shrink"
          />
          <span className="color-orange fs-14 fw-600 mx-1">
            {t("depositRatioPriceImpact")}
          </span>
          <Button
            label={t("autoBalance")}
            className="button--xs button--orange button--outline no-shrink"
            onClick={() => {
              if (!ratio) return;
              switch (lastEdited) {
                case "x": {
                  const amountY = (xAmount * 10n ** 12n) / ratio;
                  setYAmount(amountY);
                  setSlider_(
                    Math.round((Number(amountY) * 100) / Number(yBalance))
                  );
                  break;
                }
                case "y": {
                  const amountX = (yAmount * ratio) / 10n ** 12n;
                  setXAmount(amountX);
                  setSlider_(
                    Math.round((Number(amountX) * 100) / Number(xBalance))
                  );
                  break;
                }
              }
            }}
          />
        </div>
      )}

      <Estimate
        address={address}
        state={state}
        deposit={{ x: xAmount, y: yAmount }}
        config={config}
        warning={badRatio}
        priceX={priceX}
        priceY={priceY}
      />
    </div>
  );
};

const Estimate: FC<{
  address: string;
  config: { fee: bigint };
  state: { x: bigint; y: bigint; shares: bigint };
  deposit: { x: bigint; y: bigint };
  warning?: boolean;
  priceX?: bigint;
  priceY?: bigint;
}> = ({ address, state, deposit, config, warning, priceX, priceY }) => {
  const { toRoot } = useLocale();
  const { selected } = useAccounts();
  const { x, y } = useBalances();
  const xAsset = x.asset;
  const yAsset = y.asset;
  const [accept, setAccept] = useState(false);
  const [slippageBps, setSlippageBps] = useState<bigint | undefined>(100n);
  const touHref = toRoot("tou");

  const balanced_shares = BigInt(
    Math.floor(
      state.shares === 0n
        ? Math.sqrt(Number(deposit.x + deposit.y))
        : Math.min(
            Number((deposit.x * state.shares) / state.x),
            Number((deposit.y * state.shares) / state.y)
          )
    )
  );

  const sqrt_k = Math.sqrt(Number(state.x * state.y));
  const delta_sqrt_k =
    Math.sqrt(Number((deposit.x + state.x) * (deposit.y + state.y))) - sqrt_k;
  const shares = Number(state.shares)
    ? BigInt(Math.floor((delta_sqrt_k * Number(state.shares)) / sqrt_k))
    : BigInt(Math.floor(Math.sqrt(Number(deposit.x * deposit.y))));
  const fee = (shares - balanced_shares * config.fee) / 10n ** 12n;
  const netShares = shares - fee;
  const ownership = state.shares
    ? (netShares * 10n ** 12n) / (state.shares + netShares)
    : 10n ** 12n;
  const xReturn = ((deposit.x + state.x) * ownership) / 10n ** 12n;
  const yReturn = ((deposit.y + state.y) * ownership) / 10n ** 12n;
  const priceOld = state.shares ? (state.y * 10n ** 12n) / state.x : undefined;
  const priceNew =
    state.x + deposit.x
      ? ((state.y + deposit.y) * 10n ** 12n) / (state.x + deposit.x)
      : undefined;
  const priceImpact =
    priceOld && priceNew
      ? ((priceNew - priceOld) * 10000n) / priceOld
      : undefined;

  const xReturnValue = BigInt(
    Math.floor(
      (Number(xReturn) * (Number(priceX) || 0)) / 10 ** xAsset.metadata.decimals
    )
  );
  const yReturnValue = BigInt(
    Math.floor(
      (Number(yReturn) * (Number(priceY) || 0)) / 10 ** yAsset.metadata.decimals
    )
  );
  const totalReturnValue = xReturnValue + yReturnValue;

  const msg = useMemo(() => {
    if (!accept) return null;
    return (
      ((deposit.x || deposit.y) &&
        x.account?.asset.variants?.native &&
        y.account?.asset.variants?.native &&
        selected &&
        new MsgExecute(
          Account.fromAddress(selected.address),
          [
            signers.cosmos.coin(
              deposit.x.toString(),
              x.account?.asset.variants.native.denom
            ),
            signers.cosmos.coin(
              deposit.y.toString(),
              y.account?.asset.variants.native.denom
            ),
          ],
          address,
          {
            deposit: slippageBps
              ? {
                  min_return: (
                    ((10000n - slippageBps) * netShares) /
                    10000n
                  ).toString(),
                }
              : {},
          }
        )) ||
      null
    );
  }, [accept, deposit, slippageBps]);
  return (
    <MsgProvider msg={msg}>
      <div className="row wrap dir-c pad-mini condensed fs-14 ai-c mt-1.5">
        <div className="row wrap pad-mini w-full mt-1">
          <div
            className={clsx({
              "col-6": true,
              "col-md-3": priceImpact !== undefined,
              "col-md-4": priceImpact === undefined,
            })}>
            <div className="pools__return">
              Current Pool Shares
              <div>{nFormatter(state.shares, 4)}</div>
            </div>
          </div>
          <div
            className={clsx({
              "col-6": true,
              "col-md-3": priceImpact !== undefined,
              "col-md-4": priceImpact === undefined,
            })}>
            <div className="pools__return">
              Pool Shares Issued<div>{nFormatter(netShares, 4)}</div>
            </div>
          </div>
          <div
            className={clsx({
              "col-6": true,
              "col-md-3": priceImpact !== undefined,
              "col-md-4": priceImpact === undefined,
            })}>
            <div className="pools__return">
              Issued Share Value
              <div className="flex dir-c">
                <Decimal
                  className="fs-16"
                  amount={xReturn}
                  decimals={xAsset.metadata.decimals}
                  symbol={xAsset.metadata.symbol}
                  symbolClassName="fs-14 color-grey condensed fw-500"
                />
                <Decimal
                  className="fs-16"
                  amount={yReturn}
                  decimals={yAsset.metadata.decimals}
                  symbol={yAsset.metadata.symbol}
                  symbolClassName="fs-14 color-grey condensed fw-500"
                />
                {totalReturnValue > 0n && (
                  <>
                    <hr className="hr opacity-10" />
                    <Fiat
                      className="fs-16"
                      amount={totalReturnValue}
                      symbol="≈ $"
                      decimals={12}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          {priceImpact !== undefined && (
            <div className="col-6 col-md-3">
              <div className="pools__return">
                Price Impact
                <div
                  style={
                    Math.abs(Number(priceImpact) / 100) > 2
                      ? { color: "#e53935" }
                      : {}
                  }>
                  {Math.abs(Number(priceImpact) / 100).toLocaleDecimal(2)}%
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="row wrap dir-r pad-mini condensed fs-14 ai-c mt-1.5">
        <Slippage slippageBps={slippageBps} setSlippageBps={setSlippageBps} />
      </div>
      {Math.abs(Number(priceImpact) / 100) > 2 && (
        <Warning
          className="mt-2 condensed"
          color="red"
          msg="Price impact is more than 2.00%, proceed with caution."
        />
      )}
      <div className="flex wrap ai-s mt-1">
        <Toggle
          checked={accept}
          onChange={(e) => {
            setAccept(e.currentTarget.checked);
          }}
          className="mt-2 toggle--small ai-c">
          <span className="toggle__label">
            I accept the{" "}
            <a
              href={touHref}
              target="_blank"
              className="color-white hover-primary1">
              terms of use
            </a>
          </span>
        </Toggle>
        <div className="mt-1 block ml-a text-right">
          <TxButton
            className={clsx({ "button--red": warning })}
            label="Deposit to Pool"
          />
        </div>
      </div>
    </MsgProvider>
  );
};

const Slippage: FC<{
  slippageBps?: bigint;
  setSlippageBps: (v: bigint) => void;
}> = ({ slippageBps, setSlippageBps }) => {
  const { t } = useTranslation("strategies");
  return (
    <>
      <div className="col-12 col-xs-4 text-center text-xs-left color-grey fw-500 py-0.5">
        <div
          className="iflex ai-c no-select"
          data-tooltip-id="global-tip"
          data-tooltip-html={t("depositSlippageTooltip")}>
          {t("slippageTolerance")}
          <Icons.Info className="ml-0.5 block w-2.5" />
        </div>
      </div>
      <div className="col-12 col-xs-8 text-center text-xs-right py-0.5">
        <Button
          className={clsx({
            "button--outline button--xsmall ml-0.5 w-4": true,
            "button--grey": slippageBps !== 100n,
          })}
          onClick={() => setSlippageBps(100n)}>
          1%
        </Button>
        <Button
          className={clsx({
            "button--outline button--xsmall ml-0.5 w-4": true,
            "button--grey": slippageBps !== 200n,
          })}
          onClick={() => setSlippageBps(200n)}>
          2%
        </Button>
        <Button
          className={clsx({
            "button--outline button--xsmall ml-0.5 w-4": true,
            "button--grey": slippageBps !== 500n,
          })}
          onClick={() => setSlippageBps(500n)}>
          5%
        </Button>
        <Button
          className={clsx({
            "button--outline button--xsmall ml-0.5 w-4": true,
            "button--grey": slippageBps !== 750n,
          })}
          onClick={() => setSlippageBps(750n)}>
          7.5%
        </Button>
      </div>
    </>
  );
};
