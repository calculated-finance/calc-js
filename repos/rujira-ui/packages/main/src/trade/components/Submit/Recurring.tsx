import clsx from "clsx";
import { intervalToDuration } from "date-fns";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { NumericFormat } from "react-number-format";
import { graphql, useFragment } from "react-relay";
import { Account, MsgExec, priceFormatter } from "rujira.js";
import {
  AssetLabel,
  assetLabel,
  Button,
  Decimal,
  Icons,
  Input,
  Numeric,
  Toggle,
  useTranslation,
} from "rujira.ui";
import { usePreloadedBalance } from "../../../common/components/Balance";
import { useNotificationModal } from "../../../common/components/Notifications";
import {
  MsgProvider,
  TxBalanceAccountButton,
} from "../../../common/components/TxButton";
import {} from "../../../portfolio/utils";
import { useAccounts } from "../../../services/accounts";
import { Side } from "../../types";
import { adjust, formatExecutionDuration } from "../../utils";
import { useCalcMetadata } from "../Calc";
import { useAmount } from "../Context";
import { InputQuantity } from "../InputQuantity";
import type { Unit } from "../Orders/Recurring";
import {
  RecurringSubmitFragment$data,
  RecurringSubmitFragment$key,
} from "./__generated__/RecurringSubmitFragment.graphql";

const fragment = graphql`
  fragment RecurringSubmitFragment on FinPair {
    address
    tick
    assetBase {
      asset
      metadata {
        symbol
        decimals
      }
      type
      chain
      price {
        current
      }
      variants {
        native {
          denom
        }
        secured {
          asset
          type
          chain
          metadata {
            decimals
            symbol
          }
          variants {
            native {
              denom
            }
          }
        }
      }
    }
    assetQuote {
      asset
      metadata {
        symbol
        decimals
      }
      type
      chain
      price {
        current
      }
      variants {
        native {
          denom
        }
        secured {
          asset
          type
          chain
          metadata {
            decimals
            symbol
          }
          variants {
            native {
              denom
            }
          }
        }
      }
    }
    book {
      bids {
        total
        price
        value
      }
      center
      asks {
        total
        price
        value
      }
    }
    feeTaker
  }
`;

export const poolsFragment = graphql`
  fragment RecurringSubmitThorchainFragment on ThorchainV2 {
    pools {
      asset {
        asset
        metadata {
          decimals
          symbol
        }
        type
        chain
        variants {
          native {
            denom
          }
          secured {
            asset
            type
            chain
            metadata {
              decimals
              symbol
            }
            variants {
              layer1 {
                asset
              }
              native {
                denom
              }
            }
          }
        }
      }
    }
  }
`;

interface Props {
  k: RecurringSubmitFragment$key;
  side: Side;
}

export const Recurring: FC<Props> = ({ k, side }) => {
  const { t } = useTranslation();
  const { request } = useNotificationModal();

  const [{ showAdvanced, showSwapMultiplier }, setToggles] = useState(() => ({
    showAdvanced: false,
    showSwapMultiplier: false,
  }));

  const [amount, setAmount] = useAmount();
  const [swaps, setSwaps] = useState(10n);
  const [unit, setUnit] = useState<Unit>("blocks");
  const [cadence, setCadence] = useState<bigint | undefined>(100n);
  const [maxPriceImpact, setMaxPriceImpact] = useState<bigint | undefined>(
    200n
  );
  const [priceThreshold, setPriceThreshold] = useState<bigint | undefined>();
  const [basePrice, setBasePrice] = useState<bigint | undefined>();
  const [swapMultiplier, setSwapMultiplier] = useState<bigint | undefined>(2n);

  const metadata = useCalcMetadata();
  // TODO: update metadata to be non-nullable in the API types and remove this assertion
  const { manager, scheduler, baseFeeBps: calcFeeBps } = metadata!;

  const d = useFragment(fragment, k);

  const depositAsset = side === Side.Base ? d.assetBase : d.assetQuote;
  const returnAsset = side === Side.Base ? d.assetQuote : d.assetBase;
  const book = side === Side.Quote ? d.book.asks : d.book.bids;

  const totalReturn = swaps
    ? calculateReturnAmount(book, amount / swaps, side) * swaps
    : 0n;

  const every =
    cadence &&
    (unit === "blocks"
      ? cadence
      : cadence /
        (unit === "minutes" ? 60n : unit === "hours" ? 3600n : 86400n));

  const buttonLabel =
    side === Side.Quote
      ? t("dcaIntoAsset", { asset: d.assetBase?.metadata.symbol })
      : t("dcaOutOfAsset", { asset: d.assetBase?.metadata.symbol });
  const { selected } = useAccounts();

  const ask = d?.book.asks[0] && BigInt(d.book.asks[0].price);
  const bid = d?.book.bids[0] && BigInt(d.book.bids[0].price);
  const mid = d?.book.center && BigInt(d.book.center);
  const { account } = usePreloadedBalance();
  const msg = useMemo(() => {
    if (
      amount == 0n ||
      !swaps ||
      !depositAsset?.variants?.native?.denom ||
      !returnAsset?.variants?.native?.denom ||
      !cadence ||
      !account ||
      !selected
    ) {
      return null;
    }

    const crankSchedule = {
      schedule: {
        manager_address: manager,
        scheduler_address: scheduler,
        executors: [],
        execution_rebate: [],
        cadence:
          unit === "blocks"
            ? { blocks: { interval: Number(cadence) } }
            : { time: { duration: { secs: Number(cadence), nanos: 0 } } },
      },
    };

    const hasSwapBalance = {
      balance_available: {
        amount: {
          amount: "1000",
          denom: depositAsset.variants.native.denom,
        },
      },
    };

    const minimumReturn = priceThreshold
      ? side === Side.Base
        ? ((amount / swaps) * priceThreshold) / 10n ** 12n
        : ((amount / swaps) * 10n ** 12n) / priceThreshold
      : 0n;

    const baseReturn =
      swapMultiplier && basePrice
        ? swapMultiplier > 1n
          ? side === Side.Base
            ? ((amount / swaps) * basePrice) / 10n ** 12n
            : ((amount / swaps) * 10n ** 12n) / basePrice
          : 0n
        : null;

    const swapDetails = {
      swap_amount: {
        amount: (amount / swaps).toString(),
        denom: depositAsset.variants.native.denom,
      },
      minimum_receive_amount: {
        amount: showAdvanced ? minimumReturn.toString() : "0",
        denom: returnAsset.variants.native.denom,
      },
      maximum_slippage_bps:
        showAdvanced && maxPriceImpact
          ? Math.floor(Number(maxPriceImpact))
          : 200,
      routes: [{ fin: { pair_address: d.address } }],
      adjustment:
        showSwapMultiplier &&
        swapMultiplier &&
        swapMultiplier > 1n &&
        baseReturn
          ? {
              linear_scalar: {
                base_receive_amount: {
                  amount: baseReturn.toString(),
                  denom: returnAsset.variants.native.denom,
                },
                scalar: swapMultiplier.toString(),
              },
            }
          : ("fixed" as const),
    };

    const canSwap = { can_swap: swapDetails };
    const swap = { swap: swapDetails };

    const distributeAllFunds = {
      distribute: {
        denoms: [
          depositAsset.variants.native.denom,
          returnAsset.variants.native.denom,
        ],
        destinations: [
          {
            recipient: {
              bank: { address: selected.address.address },
            },
            shares: "10000",
          },
        ],
      },
    };

    const nodes = [
      {
        condition: {
          index: 0,
          condition: hasSwapBalance,
          on_success: 1,
          on_failure: 6,
        },
      },
      {
        condition: {
          index: 1,
          condition: canSwap,
          on_success: 3,
          on_failure: 2,
        },
      },
      {
        condition: {
          index: 2,
          condition: crankSchedule,
        },
      },
      {
        condition: {
          index: 3,
          condition: crankSchedule,
          on_success: 4,
        },
      },
      {
        action: {
          index: 4,
          action: swap,
          next: 5,
        },
      },
      {
        condition: {
          index: 5,
          condition: hasSwapBalance,
          on_failure: 6,
        },
      },
      {
        action: {
          index: 6,
          action: distributeAllFunds,
        },
      },
    ];

    return new MsgExec(
      Account.fromAddress(selected.address),
      account.asset,
      amount,
      manager,
      {
        instantiate: {
          label: `DCA ${side === Side.Quote ? "into" : "out of"} ${d.assetBase ? d.assetBase.metadata.symbol : ""}`,
          source: "rj",
          affiliates: [],
          nodes,
        },
      }
    );
  }, [
    side,
    showAdvanced,
    depositAsset,
    returnAsset,
    amount,
    account,
    d.address,
    cadence,
    unit,
    manager,
    scheduler,
    maxPriceImpact,
    priceThreshold,
    selected,
    swaps,
    basePrice,
    swapMultiplier,
    showSwapMultiplier,
  ]);

  return (
    <div className="flex dir-c gap-y-2">
      <InputQuantity
        amount={amount}
        setAmount={setAmount}
        asset={depositAsset}
        fiat={{ price: depositAsset.price?.current, symbol: "$" }}
      />
      <div className="numeric-input numeric-input--white condensed">
        <label>{t("numberOfSwaps")}</label>
        <NumericFormat
          allowNegative={false}
          decimalScale={0}
          placeholder="0"
          value={swaps.toString()}
          onValueChange={(s) => setSwaps(s.value ? BigInt(s.value) : 0n)}
        />
      </div>
      <div className="flex jc-sb">
        <div className="col-12">
          <Input
            label={t("every")}
            className="numeric-input numeric-input--white condensed"
            type="number"
            min="1"
            max="10000"
            value={every ? Number(every) : ""}
            onChange={(e) => {
              if (e.target.value === "") return setCadence(0n);
              if (unit === "blocks") {
                setCadence(BigInt(e.target.valueAsNumber));
              } else {
                setCadence(
                  BigInt(
                    e.target.valueAsNumber *
                      (unit === "minutes"
                        ? 60
                        : unit === "hours"
                          ? 3600
                          : 86400)
                  )
                );
              }
            }}
          />
        </div>
        <div className="col-12 flex ai-c ml-1 jc-sa gap-0.5">
          <Button
            className={clsx({
              "button button--xsmall": true,
              "button--outline button--grey": unit !== "blocks",
            })}
            onClick={() => {
              setUnit("blocks");
              setCadence(every || 100n);
            }}>
            <span>{t("blocks")}</span>
          </Button>
          <Button
            className={clsx({
              "button button--xsmall": true,
              "button--outline button--grey": unit !== "minutes",
            })}
            onClick={() => {
              setUnit("minutes");
              setCadence(every ? 60n * every : 5n);
            }}>
            <span>{t("mins")}</span>
          </Button>
          <Button
            className={clsx({
              "button button--xsmall": true,
              "button--outline button--grey": unit !== "hours",
            })}
            onClick={() => {
              setUnit("hours");
              setCadence(every ? 3600n * every : 12n);
            }}>
            <span>{t("hours")}</span>
          </Button>
          <Button
            className={clsx({
              "button button--xsmall": true,
              "button--outline button--grey": unit !== "days",
            })}
            onClick={() => {
              setUnit("days");
              setCadence(every ? 86400n * every : 1n);
            }}>
            <span>{t("days")}</span>
          </Button>
        </div>
      </div>
      <div className="flex ai-c jc-e">
        <Toggle
          className={clsx("toggle--xs transition", {
            "color-lightGrey": !showAdvanced,
          })}
          id="sr-advanced-options-toggle"
          checked={showAdvanced}
          onChange={(e) => {
            setToggles((v) => ({
              showAdvanced: !v.showAdvanced,
              showSwapMultiplier: v.showAdvanced ? false : v.showSwapMultiplier,
            }));
            e.target.blur();
          }}>
          <label className="ml-1" htmlFor="sr-advanced-options-toggle">
            {t("advancedOptions")}
          </label>
        </Toggle>
      </div>
      {showAdvanced && (
        <>
          <div className="flex dir-c">
            {!!priceThreshold ? (
              <Numeric
                decimals={12}
                amount={priceThreshold}
                onChangeAmount={(amount) => {
                  setPriceThreshold(amount);
                }}
                className="numeric-input--white">
                <label>
                  {side === Side.Base ? t("priceFloor") : t("priceCeiling")}{" "}
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
            ) : (
              <Numeric
                decimals={12}
                amount={0n}
                onChangeAmount={setPriceThreshold}
                className="numeric-input--white">
                <label>
                  {side === Side.Base ? t("noPriceFloor") : t("noPriceCeiling")}
                </label>
              </Numeric>
            )}
            <div className="flex ai-c jc-c mx-a mt-0.5 mb-1.5">
              <button
                className="trade__submit-sm-btn ml-0.5"
                onClick={() =>
                  priceThreshold &&
                  setPriceThreshold(
                    adjust((priceThreshold * 98n) / 100n, Number(d.tick))
                  )
                }>
                -2%
              </button>
              <button
                className="trade__submit-sm-btn ml-0.5"
                onClick={() =>
                  bid && setPriceThreshold(adjust(bid, Number(d.tick)))
                }>
                {t("bid")}
              </button>
              <button
                className="trade__submit-sm-btn ml-0.5"
                onClick={() =>
                  mid && setPriceThreshold(adjust(mid, Number(d.tick)))
                }>
                {t("mid")}
              </button>
              <button
                className="trade__submit-sm-btn ml-0.5"
                onClick={() =>
                  ask && setPriceThreshold(adjust(ask, Number(d.tick)))
                }>
                {t("ask")}
              </button>
              <button
                className="trade__submit-sm-btn ml-0.5"
                onClick={() =>
                  priceThreshold &&
                  setPriceThreshold(
                    adjust((priceThreshold * 102n) / 100n, Number(d.tick))
                  )
                }>
                +2%
              </button>
            </div>
            <div className="flex">
              <div className="col-12">
                <Input
                  label={t("maxPriceImpact")}
                  className="numeric-input numeric-input--white"
                  type="number"
                  min="1"
                  max="100"
                  value={maxPriceImpact ? Number(maxPriceImpact) / 100 : ""}
                  onChange={(e) => {
                    if (e.target.value === "")
                      return setMaxPriceImpact(undefined);
                    setMaxPriceImpact(
                      BigInt(Math.round(e.target.valueAsNumber * 100))
                    );
                  }}
                />
              </div>
              <div className="col-12 text-center flex ai-c ml-1 jc-sa gap-0.5">
                <Button
                  className={clsx({
                    "button button--xsmall": true,
                    "button--outline button--grey": maxPriceImpact !== 50n,
                  })}
                  onClick={() => {
                    setMaxPriceImpact(50n);
                  }}>
                  <span>0.5%</span>
                </Button>
                <Button
                  className={clsx({
                    "button button--xsmall": true,
                    "button--outline button--grey": maxPriceImpact !== 100n,
                  })}
                  onClick={() => {
                    setMaxPriceImpact(100n);
                  }}>
                  <span>1%</span>
                </Button>
                <Button
                  className={clsx({
                    "button button--xsmall": true,
                    "button--outline button--grey": maxPriceImpact !== 200n,
                  })}
                  onClick={() => {
                    setMaxPriceImpact(200n);
                  }}>
                  <span>2%</span>
                </Button>
                <Button
                  className={clsx({
                    "button button--xsmall": true,
                    "button--outline button--grey": maxPriceImpact !== 500n,
                  })}
                  onClick={() => {
                    setMaxPriceImpact(500n);
                  }}>
                  <span>5%</span>
                </Button>
                <Button
                  className={clsx({
                    "button button--xsmall": true,
                    "button--outline button--grey": maxPriceImpact !== 1000n,
                  })}
                  onClick={() => {
                    setMaxPriceImpact(1000n);
                  }}>
                  <span>10%</span>
                </Button>
              </div>
            </div>
          </div>
          <div className="flex ai-c mt-0.5 jc-e">
            <div className="flex ai-c gap-0.5">
              <Toggle
                className={clsx("toggle--xs transition", {
                  "color-lightGrey": !showSwapMultiplier,
                })}
                id="sr-weighted-scale-toggle"
                checked={showSwapMultiplier}
                onChange={(e) => {
                  if (!basePrice && !showSwapMultiplier) {
                    setBasePrice(adjust(mid || 0n, Number(d.tick)));
                  }

                  if (!swapMultiplier && !showSwapMultiplier) {
                    setSwapMultiplier(2n);
                  }

                  setToggles((v) => ({
                    ...v,
                    showSwapMultiplier: !v.showSwapMultiplier,
                  }));
                  e.target.blur();
                }}>
                <label className="ml-1" htmlFor="sr-weighted-scale-toggle">
                  {t("swapMultiplier")}
                </label>
              </Toggle>
              <Icons.Info
                className="w-2 h-2 color-grey"
                data-tooltip-id="global-tip"
                data-tooltip-html={`
                      <div class="w-32 flex dir-c text-center gap-1">
                        <span>
                          ${t(side === Side.Base ? "swapMultiplierTooltipSell1" : "swapMultiplierTooltipBuy1")}
                        </span>
                        <span>
                          ${t(side === Side.Base ? "swapMultiplierTooltipSell2" : "swapMultiplierTooltipBuy2")}
                        </span>
                        <span>
                          ${t("swapMultiplierTooltip3")}
                        </span>
                      </div>
                    `}
              />
            </div>
          </div>
          {showSwapMultiplier && (
            <div className="flex dir-c gap-2">
              <div className="flex dir-c">
                <div className="flex gap-1">
                  <div className="col-3">
                    <Input
                      label={t("multiplier")}
                      className="numeric-input numeric-input--white"
                      type="number"
                      min="2"
                      max="10000"
                      value={swapMultiplier ? Number(swapMultiplier) : ""}
                      onChange={(e) => {
                        if (e.target.value === "") {
                          setSwapMultiplier(undefined);
                        } else {
                          setSwapMultiplier(
                            BigInt(Math.round(e.target.valueAsNumber))
                          );
                        }
                      }}
                    />
                  </div>
                  <Numeric
                    decimals={12}
                    amount={basePrice || 0n}
                    onChangeAmount={setBasePrice}
                    className="numeric-input--white h-lg w-full col-9">
                    <label>
                      {t("referencePrice")}{" "}
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
                <div className="flex ai-c jc-c mx-a mt-0.5">
                  <button
                    className="trade__submit-sm-btn ml-0.5"
                    onClick={() =>
                      basePrice &&
                      setBasePrice(
                        adjust((basePrice * 98n) / 100n, Number(d.tick))
                      )
                    }>
                    -2%
                  </button>
                  <button
                    className="trade__submit-sm-btn ml-0.5"
                    onClick={() =>
                      bid && setBasePrice(adjust(bid, Number(d.tick)))
                    }>
                    {t("bid")}
                  </button>
                  <button
                    className="trade__submit-sm-btn ml-0.5"
                    onClick={() =>
                      mid && setBasePrice(adjust(mid, Number(d.tick)))
                    }>
                    {t("mid")}
                  </button>
                  <button
                    className="trade__submit-sm-btn ml-0.5"
                    onClick={() =>
                      ask && setBasePrice(adjust(ask, Number(d.tick)))
                    }>
                    {t("ask")}
                  </button>
                  <button
                    className="trade__submit-sm-btn ml-0.5"
                    onClick={() =>
                      basePrice &&
                      setBasePrice(
                        adjust((basePrice * 102n) / 100n, Number(d.tick))
                      )
                    }>
                    +2%
                  </button>
                </div>
              </div>
              <SwapMultiplierCarousel
                swapAmount={swaps ? amount / swaps : 0n}
                basePrice={basePrice}
                swapMultiplier={swapMultiplier}
                side={side}
              />
            </div>
          )}
        </>
      )}
      <Quote
        d={d}
        amount={amount}
        side={side}
        swaps={swaps}
        unit={unit}
        cadence={cadence}
        totalReturn={totalReturn}
        calcFeeBps={BigInt(calcFeeBps) * 10n ** 8n}
      />
      <p className="color-grey fs-12 text-center flex ai-c jc-c mt-a fw-500">
        <span
          className="iflex ai-c"
          data-tooltip-html={`
            <div class="w-32 flex dir-c text-center gap-1">
              <span>
                ${t("recurringOrderTooltip", {
                  asset: d.assetBase.metadata.symbol,
                })}
              </span>
            </div>
          `}
          data-tooltip-float
          data-tooltip-id="global-tip">
          {t("whatAreRecurringOrders")}
          <Icons.Info className="w-2 h-2 ml-0.5" />
        </span>
      </p>
      <div className="trade__submit-footer">
        <MsgProvider msg={msg}>
          <TxBalanceAccountButton
            hideSimulation
            onSuccess={request}
            label={buttonLabel}
            required={{ asset: depositAsset, amount }}
            disabled={!msg}
            className={clsx({
              "w-full": true,
              "button--blue": side == Side.Quote,
              "button--red": side == Side.Base,
            })}
          />
        </MsgProvider>
      </div>
    </div>
  );
};

export const SwapMultiplierCarousel: FC<{
  swapAmount: bigint;
  basePrice: bigint | undefined;
  swapMultiplier: bigint | undefined;
  side: Side;
}> = ({ swapAmount, basePrice, swapMultiplier, side }) => {
  const { t } = useTranslation();
  const adjustmentsScrollRef = useRef<HTMLDivElement | null>(null);

  const swapAdjustments = useMemo(() => {
    if (!swapAmount || !basePrice || !swapMultiplier || swapMultiplier < 2n) {
      return null;
    }

    const scale = Array.from({ length: 39 }, (_, i) => 0.05 + i * 0.05);

    const pricePoints = scale.map((x) =>
      BigInt(Math.round(x * Number(basePrice)))
    );

    const swapAmounts = scale.map((x) => {
      const priceDelta = (x - 1) * Number(swapMultiplier - 1n);

      return BigInt(
        Math.max(
          0,
          Math.round(
            side === Side.Base
              ? Number(swapAmount) + Number(swapAmount) * priceDelta
              : Number(swapAmount) - Number(swapAmount) * priceDelta
          )
        )
      );
    });

    return { pricePoints, swapAmounts };
  }, [swapAmount, swapMultiplier, basePrice, side]);

  useEffect(() => {
    if (!swapAdjustments || !adjustmentsScrollRef.current) return;
    const container = adjustmentsScrollRef.current;

    const track = container.firstElementChild as HTMLElement | null;
    if (!track) return;

    const children = Array.from(track.children) as HTMLElement[];
    const middle = children[Math.floor(children.length / 2)];
    if (!middle) return;

    const childRect = middle.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const childCenter =
      childRect.left -
      containerRect.left +
      container.scrollLeft +
      middle.offsetWidth / 2;

    const target = childCenter - container.clientWidth / 2;
    const max = container.scrollWidth - container.clientWidth;
    const clamped = Math.min(Math.max(0, target), max);

    container.scrollTo({ left: clamped, behavior: "smooth" });
  }, [swapAdjustments]);

  return basePrice && swapAdjustments ? (
    <div className="flex gap-1">
      <div
        className="overflow-x-auto px-2.5"
        ref={adjustmentsScrollRef}
        onMouseDown={(e) => {
          const el = adjustmentsScrollRef.current;
          if (!el) return;
          el.dataset.dragging = "true";
          el.dataset.startX = e.pageX.toString();
          el.dataset.scrollLeft = el.scrollLeft.toString();
          el.style.cursor = "grabbing";
        }}
        onMouseMove={(e) => {
          const el = adjustmentsScrollRef.current;
          if (!el || el.dataset.dragging !== "true") return;
          e.preventDefault();
          const startX = Number(el.dataset.startX || "0");
          const scrollLeft = Number(el.dataset.scrollLeft || "0");
          const x = e.pageX;
          const walk = x - startX;
          el.scrollLeft = scrollLeft - walk;
        }}
        onMouseUp={() => {
          const el = adjustmentsScrollRef.current;
          if (!el) return;
          el.dataset.dragging = "false";
          el.style.cursor = "grab";
        }}
        onMouseLeave={() => {
          const el = adjustmentsScrollRef.current;
          if (!el) return;
          el.dataset.dragging = "false";
          el.style.cursor = "grab";
        }}
        style={{
          WebkitOverflowScrolling: "touch",
          overflowY: "hidden",
          cursor: "grab",
          scrollPaddingInline: "0",
          scrollbarWidth: "none",
          userSelect: "none",
          scrollSnapAlign: "center",
          maskImage:
            "linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
        }}>
        <div className="flex gap-1.5 h-full">
          {swapAdjustments.pricePoints.map((price, idx) => (
            <div key={idx} className="flex dir-c ai-c jc-sa gap-1">
              <span
                className={clsx("mono fs-13", {
                  "color-white fw-500": price === basePrice,
                  "color-teal": price < basePrice,
                  "color-red": price > basePrice,
                })}>
                {priceFormatter(price)}
              </span>
              <Decimal
                amount={swapAdjustments.swapAmounts[idx]}
                className="mono color-grey fs-13"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <span className="col-12 flex ai-c h-full jc-c fs-13 text-center pl-3 pr-4 color-lightGrey condensed">
      {swapMultiplier === 1n
        ? t("swapMultiplierNoEffect")
        : !basePrice
          ? t("referencePriceRequired")
          : !swapAmount
            ? t("swapAmountRequired")
            : null}
    </span>
  );
};

const Quote: FC<{
  d: RecurringSubmitFragment$data;
  amount: bigint;
  side: Side;
  swaps: bigint;
  unit: Unit;
  cadence?: bigint;
  totalReturn: bigint;
  calcFeeBps: bigint;
}> = ({ d, amount, side, swaps, unit, cadence, totalReturn, calcFeeBps }) => {
  const { t } = useTranslation();
  if (swaps < 1n) return null;

  const calcFee = (calcFeeBps * totalReturn) / 10n ** 12n;

  const swapFee =
    (BigInt(d.feeTaker || "0") * totalReturn) / swaps / 10n ** 12n;

  const executionSeconds =
    (cadence && (unit === "blocks" ? cadence * 6n : cadence) * (swaps - 1n)) ||
    0n;

  const assetIn = side === Side.Base ? d?.assetBase : d?.assetQuote;
  const assetOut = side === Side.Base ? d?.assetQuote : d?.assetBase;

  return (
    <div className="flex dir-c gap-y-1 mt-1 mb-2 fs-12 condensed">
      <div className="trade__quote flex dir-c gap-y-1">
        <div className="flex ai-c grow ">
          <p className="color-white condensed grow fs-14">
            {t("totalDeposit")}
          </p>
          <Decimal
            amount={BigInt(amount || "")}
            className="ml-a color-white fs-14"
            symbol={assetLabel(assetIn)}
            symbolClassName="color-grey condensed symbol inline-block text-left"
          />
        </div>
        <div className="flex ai-c grow ">
          <p className="color-white condensed grow fs-14">{t("swapSize")}</p>
          <Decimal
            amount={BigInt(amount / swaps || "")}
            className="ml-a color-white fs-14"
            symbol={assetLabel(assetIn)}
            symbolClassName="color-grey condensed symbol inline-block text-left"
          />
        </div>
        <div className="flex ai-c grow trade__quote trade__quote--return">
          <p className="color-white condensed grow fs-14">
            {t("estimatedDuration")}
          </p>
          <div className="ml-a color-white fs-14">
            {formatExecutionDuration(
              intervalToDuration({
                start: 0,
                end: Number(executionSeconds * 1000n),
              })
            )}
          </div>
        </div>
        <div className="flex ai-c grow trade__quote trade__quote--return">
          <div
            className="condensed color-primary1 grow fs-14"
            data-tooltip-id="global-tip"
            data-tooltip-float={true}
            data-tooltip-content={t("estimatedReturnTooltip")}>
            <span className="iflex ai-c">
              {t("estimatedReturn")}
              <Icons.Info className="w-2 h-2 ml-0.5 color-grey" />
            </span>
          </div>
          <Decimal
            amount={totalReturn}
            className="ml-a color-white fs-14"
            symbol={assetLabel(assetOut)}
            symbolClassName="color-grey condensed symbol inline-block text-left"
          />
        </div>
      </div>
      <div className="color-grey flex dir-c gap-y-1">
        <div
          className="flex"
          data-tooltip-id="global-tip"
          data-tooltip-float={true}
          data-tooltip-content={`${(Number(d?.feeTaker) / 1e10).toLocaleDecimal(2)}% ${t("takerFeeTooltip")}`}>
          <div className="col">
            <span className="iflex ai-c">
              {t("estimatedFeePerSwap")}
              <Icons.Info className="w-2 h-2 ml-0.5 color-grey" />
            </span>
          </div>
          <div className="col text-right color-white">
            {priceFormatter(swapFee * 10000n, { precision: 8 })}
            <span className="color-grey condensed symbol inline-block text-left ml-0.5">
              {assetLabel(assetOut)}
            </span>
          </div>
        </div>
        <div
          className="flex"
          data-tooltip-id="global-tip"
          data-tooltip-float={true}
          data-tooltip-content={`${(Number(calcFeeBps) / 1e10).toLocaleDecimal(2)}% ${t("automationFeeTooltip")}`}>
          <div className="col">
            <span className="iflex ai-c">
              {t("estimatedAutomationFee")}
              <Icons.Info className="w-2 h-2 ml-0.5 color-grey" />
            </span>
          </div>
          <div className="col text-right color-white">
            {priceFormatter(calcFee * 10000n, { precision: 8 })}
            <span className="color-grey condensed symbol inline-block text-left ml-0.5">
              {assetLabel(assetOut)}
            </span>
          </div>
        </div>
        <div className="flex">
          <div className="col">{t("estimatedTotalFee")}</div>
          <div className="col text-right color-white">
            {priceFormatter((swapFee * swaps + calcFee) * 10000n, {
              precision: 8,
            })}
            <span className="color-grey condensed symbol inline-block text-left ml-0.5">
              {assetLabel(assetOut)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

function calculateReturnAmount(
  book: RecurringSubmitFragment$data["book"]["asks"],
  remaining: bigint,
  side: Side
): bigint {
  if (book.length === 0 || remaining <= 0n) return 0n;
  const [next, ...rest] = book;
  const total = BigInt(next.total);
  const value = BigInt(next.value);
  if (!value) return total + calculateReturnAmount(rest, remaining, side);
  const returned = (total * remaining) / value;

  if (remaining >= value)
    return total + calculateReturnAmount(rest, remaining - value, side);
  return returned;
}
