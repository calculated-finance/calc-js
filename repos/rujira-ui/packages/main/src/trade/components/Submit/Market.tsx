import clsx from "clsx";
import { FC, Suspense, useMemo } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { MsgExec, priceFormatter, THOR } from "rujira.js";
import {
  assetLabel,
  Button,
  Decimal,
  Icons,
  TranslationProvider,
  useGlobalModalContext,
  useTranslation,
  Warning,
} from "rujira.ui";
import exclamation from "rujira.ui/assets/images/exclamation.gif";

import { usePreloadedBalance } from "../../../common/components/Balance";
import { useNotificationModal } from "../../../common/components/Notifications";
import {
  MsgProvider,
  TxBalanceAccountButton,
  TxButton,
} from "../../../common/components/TxButton";
import {} from "../../../portfolio/utils";
import { useSimulation } from "../../hooks/useSimulation";
import { Side } from "../../types";
import { useAmount } from "../Context";
import { InputQuantity } from "../InputQuantity";
import {
  MarketSubmitFragment$data,
  MarketSubmitFragment$key,
} from "./__generated__/MarketSubmitFragment.graphql";

const fragment = graphql`
  fragment MarketSubmitFragment on FinPair {
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
      variants {
        native {
          denom
        }
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
      variants {
        native {
          denom
        }
      }
    }
    book {
      bids {
        total
        price
        virtualValue
        value
      }
      center
      asks {
        total
        price
        virtualValue
        value
      }
    }
    feeMaker
    feeTaker
  }
`;

interface Props {
  k: MarketSubmitFragment$key;
  side: Side;
}

export const Market: FC<Props> = ({ k, side }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useAmount();
  const d = useFragment(fragment, k);

  const buttonLabel =
    side === Side.Quote
      ? t("buyAsset", { asset: d.assetBase?.metadata.symbol })
      : t("sellAsset", { asset: d.assetBase?.metadata.symbol });
  const denom =
    (side === Side.Base ? d.assetBase : d.assetQuote)?.variants.native?.denom ||
    "";
  const suspenseKey = `${d.address}:${denom}:${side}:${amount.toString()}`;

  return (
    <>
      <InputQuantity
        amount={amount}
        setAmount={setAmount}
        asset={side === Side.Base ? d.assetBase : d.assetQuote}
        fiat={{
          price:
            side === Side.Quote
              ? d.assetQuote.price?.current
              : d.assetBase.price?.current,
          symbol: "$",
        }}
      />

      <Suspense
        key={suspenseKey}
        fallback={<SimulationFallback label={buttonLabel} side={side} />}>
        <Simulation
          amount={amount}
          buttonLabel={buttonLabel}
          data={d}
          denom={denom}
          side={side}
        />
      </Suspense>
    </>
  );
};

const Simulation: FC<{
  amount: bigint;
  buttonLabel: string;
  data: MarketSubmitFragment$data;
  denom: string;
  side: Side;
}> = ({ amount, buttonLabel, data, denom, side }) => {
  if (!amount || !denom) {
    return (
      <SimulationContent
        amount={amount}
        buttonLabel={buttonLabel}
        data={data}
        fee={0n}
        returned={0n}
        side={side}
      />
    );
  }

  return (
    <SimulationLoaded
      amount={amount}
      buttonLabel={buttonLabel}
      data={data}
      denom={denom}
      side={side}
    />
  );
};

const SimulationLoaded: FC<{
  amount: bigint;
  buttonLabel: string;
  data: MarketSubmitFragment$data;
  denom: string;
  side: Side;
}> = ({ amount, buttonLabel, data, denom, side }) => {
  const simulation = useSimulation(data.address, denom, amount);
  return (
    <SimulationContent
      amount={amount}
      buttonLabel={buttonLabel}
      data={data}
      fee={simulation?.fee || 0n}
      returned={simulation?.returned || 0n}
      side={side}
    />
  );
};

const SimulationContent: FC<{
  amount: bigint;
  buttonLabel: string;
  data: MarketSubmitFragment$data;
  fee: bigint;
  returned: bigint;
  side: Side;
}> = ({ amount, buttonLabel, data, fee, returned, side }) => {
  const { t } = useTranslation();
  const assetOut = side === Side.Base ? data.assetQuote : data.assetBase;
  const totalReturn = fee + returned;
  const mid = data.book?.center ? BigInt(data.book.center) : null;

  const rate =
    side === Side.Base
      ? amount > 0n
        ? (totalReturn * 10n ** 12n) / amount
        : 0n
      : totalReturn > 0n
        ? (amount * 10n ** 12n) / totalReturn
        : 0n;

  const impact = mid && rate ? ((rate - mid) * 10n ** 12n) / mid : 0n;
  const marketWarning = amount > 0n && returned === 0n;
  const marketDanger = impact > 50000000000n || impact < -50000000000n;
  const { request } = useNotificationModal();
  const { showModal, hideModal } = useGlobalModalContext();
  const { account } = usePreloadedBalance();
  const msg = useMemo(() => {
    if (!account) return null;
    if (!amount) return null;

    return new MsgExec(
      { address: account.address, network: THOR },
      account.asset,
      amount,
      data.address,
      {
        swap: { min_return: ((returned * 99n) / 100n).toString() },
      }
    );
  }, [account, amount, data.address, returned]);

  const confirm = (currentImpact: bigint) => {
    if (!msg) return;
    showModal({
      backgroundClose: true,
      children: (
        <TranslationProvider namespace="trade">
          <MsgProvider msg={msg}>
            <ConfirmModal
              impact={currentImpact}
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
      <div className="flex dir-c gap-y-1 mt-2 mb-4 fs-12 color-grey condensed">
        <div className="flex ai-c grow trade__quote">
          <div className="flex dir-c grow gap-y-1">
            <div className="flex">
              <div className="condensed color-white grow fs-14">
                {t("estimatedPrice")}
              </div>
              <Decimal
                amount={rate}
                decimals={12}
                className="ml-a color-white fs-14"
                symbol={assetLabel(data.assetQuote)}
                symbolClassName="color-grey condensed symbol inline-block text-left"
                clip
              />
            </div>
            <div className="flex">
              <div className="condensed color-primary1 grow fs-14">
                {t("estimatedReturn")}
              </div>
              <Decimal
                amount={returned}
                className="ml-a color-white fs-14"
                symbol={assetLabel(assetOut)}
                symbolClassName="color-grey condensed symbol inline-block text-left"
                clip
              />
            </div>
          </div>
        </div>

        {marketWarning ? (
          <Warning
            className="mt-1 warning--sm warning--orange"
            msg={t("marketOrderWarning")}>
            <img
              src={exclamation}
              alt=""
              className="filter-orange block no-shrink"
              style={{ width: "2rem", height: "2rem" }}
            />
          </Warning>
        ) : (
          <>
            <div
              className="flex"
              data-tooltip-id="global-tip"
              data-tooltip-float={true}
              data-tooltip-content={t("takerFeeWithPercent", {
                fee: (Number(data.feeTaker) / 1e10).toLocaleDecimal(2),
              })}>
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
            <div className="flex">
              <div className="col">{t("estimatedPriceImpact")}</div>
              <div
                className={clsx({
                  "col flex ai-c jc-e": true,
                  "color-white": !marketDanger,
                  "color-red": marketDanger,
                })}>
                {marketDanger &&
                  (side === Side.Base ? (
                    <Icons.TrendDown className="inline-block w-2 h-2 mr-0.5" />
                  ) : (
                    <Icons.TrendUp className="inline-block w-2 h-2 mr-0.5" />
                  ))}
                {(Math.abs(Number(impact)) / 1e10).toLocaleDecimal(2)}%
              </div>
            </div>
          </>
        )}
      </div>

      <p className="color-grey fs-12 text-center flex ai-c jc-c fw-500">
        <span
          className="iflex ai-c"
          data-tooltip-html={`
            <div class="w-25">
              ${t("marketOrderTooltip", {
                asset: data.assetBase.metadata.symbol,
              })}
            </div>`}
          data-tooltip-id="global-tip">
          {t("whatAreMarketOrders")}
          <Icons.Info className="w-2 h-2 ml-0.5" />
        </span>
      </p>
      <div>
        <TxBalanceAccountButton
          hideSimulation
          Component={(props) =>
            marketDanger ? (
              <Button
                className="button--red w-full"
                label={buttonLabel}
                onClick={() => confirm(impact)}>
                <img src={exclamation} alt="" className="filter-white big" />
              </Button>
            ) : (
              <TxButton {...props} />
            )
          }
          onSuccess={request}
          disabled={marketWarning}
          required={{
            asset: side === Side.Base ? data.assetBase : data.assetQuote,
            amount,
          }}
          label={buttonLabel}
          className={clsx({
            "w-full": true,
            "button--blue": side == Side.Quote,
            "button--red": side == Side.Base,
          })}
        />
      </div>
    </MsgProvider>
  );
};

const SimulationFallback: FC<{ label: string; side: Side }> = ({
  label,
  side,
}) => (
  <>
    <div className="flex dir-c gap-y-1 mt-2 mb-4 fs-12 color-grey condensed">
      <div className="flex ai-c grow trade__quote">
        <div className="flex dir-c grow gap-y-1">
          {["estimatedPrice", "estimatedReturn"].map((key) => (
            <div className="flex ai-c" key={key}>
              <div className="condensed color-white grow fs-14">
                <span className="skeleton inline-block h-1.5 w-10 br-2" />
              </div>
              <span className="skeleton inline-block h-1.5 w-12 br-2 ml-a" />
            </div>
          ))}
        </div>
      </div>
      {[0, 1].map((index) => (
        <div className="flex ai-c" key={index}>
          <div className="col">
            <span className="skeleton inline-block h-1.5 w-8 br-2" />
          </div>
          <div className="col text-right">
            <span className="skeleton inline-block h-1.5 w-10 br-2" />
          </div>
        </div>
      ))}
    </div>

    <p className="color-grey fs-12 text-center flex ai-c jc-c fw-500">
      <span className="skeleton inline-block h-1.5 w-16 br-2" />
    </p>
    <div>
      <Button
        className={clsx({
          "w-full": true,
          "button--blue": side == Side.Quote,
          "button--red": side == Side.Base,
        })}
        label={label}
        disabled
      />
    </div>
  </>
);

const ConfirmModal: FC<{
  side: Side;
  label: string;
  impact: bigint;
  onSuccess: () => void;
  cancel: () => void;
}> = ({ side, label, onSuccess, cancel, impact }) => {
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
          {t("priceImpactWarningStart")}{" "}
          <span className="color-white">
            {(Math.abs(Number(impact)) / 1e10).toLocaleDecimal(2)}%
          </span>{" "}
          {t("priceImpactWarningEnd")}
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

/**
 * Predicts the number of blocks that arbitrage will take, considering only atomic
 * and base layer liquidity
 */
export const calculateDuration = (
  offer: bigint,
  book?: MarketSubmitFragment$data["book"]["asks"]
): bigint | null => {
  if (!book) return null;
  const atomic = book.reduce((a, v) => a + BigInt(v.value), 0n);
  const remaining = atomic >= offer ? 0n : offer - atomic;
  if (!remaining) return 0n;
  const virtualValue = book.reduce((a, v) => a + BigInt(v.virtualValue), 0n);
  if (!virtualValue) return -1n;
  return 1n + remaining / virtualValue;
};
