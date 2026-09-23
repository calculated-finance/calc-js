import clsx from "clsx";
import { format } from "date-fns";
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { graphql, useFragment } from "react-relay";
import { Account, MsgExecute } from "rujira.js";
import {
  assetLabel,
  clipAmountString,
  Decimal,
  getDenomIconSrc,
  Icons,
  LoaderWithContent,
  Progress,
  toFiatDisplay,
  Toggle,
  TranslationProvider,
  useGlobalModalContext,
  useIsTouchDevice,
  useLocale,
  useLocalStorage,
  useTranslation,
} from "rujira.ui";
import { MsgProvider, TxButton } from "../../../common/components/TxButton";
import { RangePositionShareButton } from "../../../sharing/RangePositionCard";
import { usePreloadedAccountData } from "../../../services/accountData";
import { useAccounts } from "../../../services/accounts";
import { assetToTradeUrlSegment } from "../../../services/assetUrl";
import { siteOrigin } from "../../../services/siteOrigin";
import { cclCopyParams } from "../../tradeUrlState";
import { useTradeSubscriptionsFinRangeFragment } from "../../TradeSubscriptions";
import { useTradeContext } from "../Context";
import {
  RangeOrdersAccountFragment$data,
  RangeOrdersAccountFragment$key,
} from "./__generated__/RangeOrdersAccountFragment.graphql";
import { Apr, CurrentValue, Dpi, Moic, OrderLink } from "./Common";
import { useOrdersContext } from "./Context";
import { RangeManage } from "./RangeManage";

// Prices carry 12 decimals throughout the app.
const PRICE_DECIMALS = 12;

enum RangeDetail {
  Hidden = "hidden",
  Visible = "visible",
}

type FinRangeNode = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<
        NonNullable<RangeOrdersAccountFragment$data["fin"]>["ranges"]
      >["edges"]
    >[number]
  >["node"]
>;

type RangeOrdersData = {
  open: FinRangeNode[];
  closed: FinRangeNode[];
  total: number;
};

const accountFragment = graphql`
  fragment RangeOrdersAccountFragment on Account {
    fin {
      ranges(first: 100) @connection(key: "TradeSubscriptionsFragment_ranges") {
        edges {
          node {
            id
            idx
            base
            quote
            feesBase
            feesQuote
            ...RangeManageFragment
            ...TradeSubscriptionsFinRangeFragment
            pair {
              address
            }
          }
        }
      }
    }
  }
`;

const context = createContext<{
  showDetails: boolean;
  setShowDetails: (v: boolean) => void;
}>({
  showDetails: false,
  setShowDetails: () => {},
});

const formatPct = (v?: bigint | null) => {
  if (v === null || v === undefined) return "Not Available";
  return `${(Number(v) / 1e10).toLocaleDecimal(2)}%`;
};

const formatSkew = (v?: bigint | null) => {
  if (v === null || v === undefined) return "Not Available";
  if (v === 0n) return "Balanced";
  return `${(Number(v) / 1e12).toLocaleDecimal(2)}x`;
};

const formatRatio = (v?: bigint | null) => {
  if (v === null || v === undefined) return "Not Available";
  return `${(Number(v) / 1e12).toLocaleDecimal(2)}x`;
};

const formatApr = (v?: bigint | null) => {
  if (v === null || v === undefined) return "Not Available";
  return `${(Number(v) / 1e10).toLocaleDecimal(1)}%`;
};

const assetTooltipRow = (
  v: bigint,
  decimals: number,
  symbol: string,
  className?: string
): string => {
  return `<div class="flex ai-c${className ? ` ${className}` : ""}"><img src="${getDenomIconSrc(symbol)}" class="icon-denom w-2 mr-1" />${clipAmountString(v, decimals)} ${symbol}</div>`;
};

const assetPairTooltip = (
  base: { amount: bigint; decimals: number; symbol: string },
  quote: { amount: bigint; decimals: number; symbol: string },
  usd: bigint,
  title: string
): string => {
  return `<div>${title} (≈ $${toFiatDisplay(usd)})<div class="my-1">${assetTooltipRow(base.amount, base.decimals, base.symbol, "mb-1")}${assetTooltipRow(quote.amount, quote.decimals, quote.symbol)}</div></div>`;
};

const formatAge = (days?: number | null) => {
  if (days === null || days === undefined) return "Not Available";
  return `${days.toLocaleString()} day${days === 1 ? "" : "s"}`;
};

export const Context: FC<PropsWithChildren> = ({ children }) => {
  const [detail, setDetail] = useLocalStorage<RangeDetail>(
    "orders-sub-range",
    RangeDetail.Hidden
  );
  const showDetails = detail === RangeDetail.Visible;

  return (
    <context.Provider
      value={{
        showDetails,
        setShowDetails: (v) =>
          setDetail(v ? RangeDetail.Visible : RangeDetail.Hidden),
      }}>
      {children}
    </context.Provider>
  );
};

export const useRangeOrdersData = (): RangeOrdersData => {
  const { accountData } = usePreloadedAccountData();
  const { only } = useOrdersContext();
  const { address } = useTradeContext();
  const d = useFragment<RangeOrdersAccountFragment$key>(
    accountFragment,
    accountData
  );

  return useMemo(() => {
    const rows =
      d?.fin?.ranges?.edges
        ?.map((x) => x?.node)
        .filter((node): node is FinRangeNode => !!node)
        .filter((node) =>
          address ? (only ? node.pair.address === address : true) : true
        ) || [];

    const all = rows.sort((a, b) => Number(b.idx) - Number(a.idx));
    const [open, closed] = all.reduce(
      ([o, c]: [Node[], Node[]], v) =>
        v.base + v.quote + v.feesBase + v.feesQuote
          ? [[v, ...o], c]
          : [o, [v, ...c]],
      [[], []]
    );
    return { open, closed, total: all.length };
  }, [d, address, only]);
};

export const Tabs: FC = () => {
  const { showDetails, setShowDetails } = useContext(context);

  return (
    <span className="flex ai-c as-c ml-2">
      <button
        type="button"
        className={`transparent fs-14 condensed fw-500 ${!showDetails ? "color-white" : "color-grey hover-white"} block mr-1 pointer`}
        onClick={() => setShowDetails(false)}>
        Simple View
      </button>
      <Toggle
        className={`toggle--xs ${showDetails ? "color-white" : "color-grey"}`}
        label="Detailed View"
        checked={showDetails}
        onChange={(e) => setShowDetails(e.target.checked)}
      />
    </span>
  );
};

export const Content: FC = () => {
  const { open } = useRangeOrdersData();
  return <Table orders={open} />;
};

export const Table: FC<{ orders: Node[] }> = ({ orders }) => {
  const { t } = useTranslation();
  const isTouchDevice = useIsTouchDevice();

  if (orders.length === 0) {
    return (
      <p className="condensed fs-14 color-grey text-center mt-4">
        {t("noOrdersMessage", { label: t("automated") })}
      </p>
    );
  }

  return (
    <div className="trade__orders-table table-sticky table-sticky--left table-sticky--right mt-2">
      <table
        className={clsx({
          "table nowrap table--spaced group-column-table": true,
          "table--no-hover": isTouchDevice,
        })}>
        <thead>
          <GroupHeaderRow />
          <HeaderRow />
        </thead>
        <tbody>
          {orders.map((p) => (
            <Item key={p.id} item={p} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const GroupHeaderRow: FC = () => {
  const { showDetails } = useContext(context);
  return (
    <tr className="group-column-table__header-row">
      <th colSpan={1} />
      <th colSpan={6} />
      {showDetails && (
        <>
          <th colSpan={2} className="nopad">
            <div className="group-column-table__group-header bg-grey-1 text-center fs-12 color-grey fw-400">
              Realized Value
            </div>
          </th>
          <th colSpan={2} className="nopad">
            <div className="group-column-table__group-label text-center fs-14 color-grey fw-500">
              Unrealized Value
            </div>
          </th>
        </>
      )}
      <th colSpan={3} className="nopad">
        <div className="group-column-table__group-header bg-grey-1 text-center fs-12 color-grey fw-400">
          Performance
        </div>
      </th>
      <th />
    </tr>
  );
};

const HeaderRow: FC = () => {
  const { showDetails } = useContext(context);
  return (
    <tr className="group-column-table__header-row">
      <th colSpan={2}>Pair</th>
      <th className="w-a" />
      <th>Range</th>
      <th>Created on</th>
      <th className="text-right">
        <span
          className="iflex ai-c"
          data-tooltip-id="global-tip"
          data-tooltip-html='<div class="w-30">Weighted average age of your position based on the size and timing of deposits and withdrawals. Used to calculate annualized returns like APR.<br/><br/>Example: a larger deposit made 30 days ago will have more impact on the calculation than a smaller deposit made yesterday.</div>'>
          Age <Icons.Info className="w-2 h-2 color-grey block ml-0.5" />
        </span>
      </th>
      <th className="text-right">
        {showDetails ? (
          <span
            className="iflex ai-c"
            data-tooltip-id="global-tip"
            data-tooltip-html='<div class="w-30">Total invested value measured in quote asset (e.g. USDC for BTC/USDC)</div>'>
            Total Invested
            <Icons.Info className="w-2 h-2 color-grey block ml-0.5 mr-0.5" />
          </span>
        ) : (
          <CurrentValue />
        )}
      </th>
      {showDetails && (
        <>
          <th className="group-column-table__group-start text-left bg-grey-1">
            <span style={{ marginLeft: "0.35rem" }}>Withdrawn</span>
          </th>
          <th
            className="group-column-table__group-end text-right bg-grey-1"
            style={{ paddingRight: "15px" }}>
            Claimed Yield
          </th>
          <th className="text-left">
            <span style={{ marginLeft: "0.4rem" }}>
              <CurrentValue />
            </span>
          </th>
          <th className="text-right" style={{ paddingRight: "15px" }}>
            Unclaimed Yield
          </th>
        </>
      )}
      <th className="group-column-table__group-start text-left auto bg-grey-1">
        <span style={{ marginLeft: "0.4rem" }}>
          <Moic />
        </span>
      </th>
      <th className="text-right bg-grey-1">
        <Dpi />
      </th>
      <th
        className="group-column-table__group-end text-right bg-grey-1"
        style={{ paddingRight: "13px" }}>
        <Apr />
      </th>
      <th className={"auto"} />
    </tr>
  );
};

type Node = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<
        NonNullable<RangeOrdersAccountFragment$data["fin"]>["ranges"]
      >["edges"]
    >[number]
  >["node"]
>;

export const InRange: FC<{
  current: bigint;
  low: bigint;
  high: bigint;
}> = ({ current, low, high }) => {
  if (!current && !low && !high) {
    return (
      <div className={"flex jc-c"}>
        <LoaderWithContent loading={true} content={""} />
      </div>
    );
  }

  const pct =
    current && high > low
      ? Math.max(
          0,
          Math.min(100, Number(((current - low) * 100n) / (high - low)))
        )
      : null;

  return (
    <div className="in-range">
      <div className="in-range__track">
        {pct !== null && (
          <>
            <span
              className="in-range__price color-teal fs-12"
              style={{ left: `${pct}%` }}>
              <Decimal
                as="span"
                amount={current}
                decimals={PRICE_DECIMALS}
                clip
              />
            </span>
            <div className="in-range-triangle" style={{ left: `${pct}%` }} />
          </>
        )}
        <Progress percentage={100} fillClassName="bg-teal" />
      </div>
      <div className="in-range__limits">
        <span className="in-range__limit-low color-teal fs-12">
          <Decimal as="span" amount={low} decimals={PRICE_DECIMALS} clip />
        </span>
        <span className="in-range__limit-high color-teal fs-12">
          <Decimal as="span" amount={high} decimals={PRICE_DECIMALS} clip />
        </span>
      </div>
    </div>
  );
};

export const OutOfRange: FC<{
  current: bigint;
  low: bigint;
  high: bigint;
}> = ({ current, low, high }) => {
  if (!current && !low && !high) {
    return (
      <div className={"flex jc-c"}>
        <LoaderWithContent loading={true} content={""} />
      </div>
    );
  }

  if (!current && low && high) {
    return <SimpleRange low={low} high={high} />;
  }

  if (!current) {
    return (
      <div className={"flex jc-c"}>
        <LoaderWithContent loading={true} content={""} />
      </div>
    );
  }

  const isBelow = current < low;
  const rangeToCurrent = isBelow ? high - current : current - low;
  const offset = isBelow
    ? Math.max(15, (Number(low - current) / Number(rangeToCurrent)) * 100)
    : 0;
  const pointerPos = isBelow ? 10 : 85;

  const pct = isBelow
    ? 100 - offset
    : Math.max(
        15,
        Math.min(
          85,
          ((Number(high) - Number(low)) / Number(rangeToCurrent)) * 100
        )
      );

  const pctToReenter = Number(
    ((isBelow ? low - current : current - high) * 100n) / current
  );

  const tooltipHtml = `Price needs to ${isBelow ? "rise" : "fall"} <span class="${isBelow ? "color-teal" : "color-red"}">${isBelow ? "+" : "-"}${pctToReenter.toFixed(2)}%</span> to re-enter the range`;

  return (
    <div
      className="out-of-range"
      data-tooltip-id="global-tip"
      data-tooltip-html={tooltipHtml}>
      <div className="out-of-range__track">
        <span
          className="out-of-range__price color-orange fs-12"
          style={{ left: `${pointerPos}%` }}>
          <Decimal as="span" amount={current} decimals={PRICE_DECIMALS} clip />
        </span>
        <div
          className="out-of-range-triangle"
          style={{ left: `${pointerPos}%` }}
        />
        <Progress
          percentage={pct}
          fillStart={offset}
          fillClassName="bg-orange"
        />
      </div>
      <div
        className="out-of-range__limits"
        style={{ justifyContent: isBelow ? "flex-end" : "flex-start" }}>
        <span className="color-orange fs-12 flex ai-c gap-0.5">
          <Decimal as="span" amount={low} decimals={PRICE_DECIMALS} clip />
          <span>—</span>
          <Decimal as="span" amount={high} decimals={PRICE_DECIMALS} clip />
        </span>
      </div>
    </div>
  );
};

export const SimpleRange: FC<{
  low: bigint;
  high: bigint;
}> = ({ low, high }) => {
  return (
    <div className="closed-range">
      <span className="color-white fs-12 nowrap">
        <Decimal as="span" amount={low} decimals={PRICE_DECIMALS} clip />
      </span>
      <span>-</span>
      <span className="color-white fs-12 nowrap text-right">
        <Decimal as="span" amount={high} decimals={PRICE_DECIMALS} clip />
      </span>
    </div>
  );
};

const Item: FC<{
  item: Node;
}> = ({ item }) => {
  const { t } = useTranslation();
  const { selected } = useAccounts();
  const { showDetails } = useContext(context);
  const { toRoot } = useLocale();
  const { hideModal, showModal } = useGlobalModalContext();
  const manage = useCallback(
    () =>
      showModal({
        children: (
          <TranslationProvider namespace="trade">
            <RangeManage k={item} hideModal={hideModal} />
          </TranslationProvider>
        ),
      }),
    []
  );

  const p = useTradeSubscriptionsFinRangeFragment(item);
  const base = p.pair.assetBase.metadata;
  const quote = p.pair.assetQuote.metadata;
  const baseLabel = assetLabel(p.pair.assetBase);
  const quoteLabel = assetLabel(p.pair.assetQuote);

  //this should come from analytics.status once it is working
  const closed = p.base + p.quote + p.feesBase + p.feesQuote === 0n;
  const centerPrice = p.pair.book?.center ?? 0n;

  const analytics = p.analytics;

  const copyUrl =
    siteOrigin() +
    toRoot(
      `/trade/${assetToTradeUrlSegment(p.pair.assetBase)}/${assetToTradeUrlSegment(
        p.pair.assetQuote
      )}${cclCopyParams(p)}`
    );

  const msg = useMemo(
    () =>
      selected && (p.feesBase || p.feesQuote)
        ? new MsgExecute(
            Account.fromAddress(selected.address),
            [],
            p.pair.address,
            { range: { claim: { idx: p.idx.toString() } } }
          )
        : null,
    [selected, p.feesBase, p.feesQuote, p.pair.address, p.idx]
  );

  return (
    <tr key={p.id}>
      <OrderLink
        assetBase={p.pair.assetBase}
        assetQuote={p.pair.assetQuote}
        tooltip={`ID: #${p.idx}`}
      />
      <td className="w-a">
        <span
          className={"flex jc-c"}
          data-tooltip-id="global-tip"
          data-tooltip-html={`<div>Spread: ${formatPct(p.spread)}<br/>Fee: ${formatPct(p.fee)}<br/>Skew: ${formatSkew(p.skew)}</div>`}>
          <Icons.Info className="w-2 h-2 color-grey block" />
        </span>
      </td>
      <td>
        <div className={"mr-3"}>
          {closed ? (
            <SimpleRange low={p.low} high={p.high} />
          ) : p.inRange ? (
            <InRange current={centerPrice} low={p.low} high={p.high} />
          ) : (
            <OutOfRange current={centerPrice} low={p.low} high={p.high} />
          )}
        </div>
      </td>
      <td>
        {analytics?.firstDepositDate
          ? format(analytics.firstDepositDate, "dd-MMM-yy")
          : "Not Available"}
      </td>
      <td className="text-right">
        {formatAge(analytics?.weightedAverageInvestmentAgeDays)}
      </td>
      <td className="text-right">
        {showDetails ? (
          analytics?.totalInvested ? (
            <Decimal
              amount={analytics.totalInvested}
              decimals={quote.decimals}
              round={4}
              symbol={quote.symbol}
              symbolClassName="decimal__symbol--small color-grey condensed fw-500 mr-1"
              clip={true}
            />
          ) : (
            "Not Available"
          )
        ) : (
          <span
            data-tooltip-id="global-tip"
            data-tooltip-html={assetPairTooltip(
              {
                amount: p.base,
                decimals: base.decimals,
                symbol: baseLabel,
              },
              {
                amount: p.quote,
                decimals: quote.decimals,
                symbol: quoteLabel,
              },
              p.principalUsd,
              "Current Value"
            )}>
            <Decimal
              amount={analytics?.unrealizedInvestment || 0n}
              decimals={quote.decimals}
              round={4}
              symbol={quote.symbol}
              symbolClassName="decimal__symbol--small color-grey condensed fw-500 mr-1"
              clip={true}
            />
          </span>
        )}
      </td>
      {showDetails && (
        <>
          <td className="group-column-table__group-start text-left bg-grey-1">
            <Decimal
              className={"ml-1"}
              amount={analytics?.totalWithdrawn || 0n}
              decimals={quote.decimals}
              round={4}
              symbol={quote.symbol}
              symbolClassName="decimal__symbol--small color-grey condensed fw-500"
              clip={true}
            />
          </td>
          <td className="group-column-table__group-end text-right bg-grey-1">
            <Decimal
              amount={analytics?.realizedYield || 0n}
              decimals={quote.decimals}
              round={4}
              symbol={quote.symbol}
              symbolClassName="decimal__symbol--small color-grey condensed fw-500 mr-1"
              clip={true}
            />
          </td>
          <td className="text-left">
            <span
              data-tooltip-id="global-tip"
              data-tooltip-html={assetPairTooltip(
                {
                  amount: p.base,
                  decimals: base.decimals,
                  symbol: baseLabel,
                },
                {
                  amount: p.quote,
                  decimals: quote.decimals,
                  symbol: quoteLabel,
                },
                p.principalUsd,
                "Current Value"
              )}>
              <Decimal
                className={"ml-1"}
                amount={analytics?.unrealizedInvestment || 0n}
                decimals={quote.decimals}
                round={4}
                symbol={quote.symbol}
                symbolClassName="decimal__symbol--small color-grey condensed fw-500 mr-1"
                clip={true}
              />
            </span>
          </td>
          <td className="ok I text-right">
            <span
              data-tooltip-id="global-tip"
              data-tooltip-html={assetPairTooltip(
                {
                  amount: p.feesBase,
                  decimals: base.decimals,
                  symbol: baseLabel,
                },
                {
                  amount: p.feesQuote,
                  decimals: quote.decimals,
                  symbol: quoteLabel,
                },
                p.yieldUsd,
                "Unclaimed Yield"
              )}>
              <Decimal
                amount={analytics?.unrealizedYield || 0n}
                decimals={quote.decimals}
                round={4}
                symbol={quote.symbol}
                symbolClassName="decimal__symbol--small color-grey condensed fw-500 mr-1"
                clip={true}
              />
            </span>
          </td>
        </>
      )}
      <td className="group-column-table__group-start text-left auto bg-grey-1">
        <span className={"ml-1"}>{formatRatio(analytics?.moic)}</span>
      </td>
      <td className="text-right bg-grey-1">{formatRatio(analytics?.dpi)}</td>
      <td
        className="group-column-table__group-end text-right color-teal bg-grey-1"
        style={{ paddingRight: "15px" }}>
        {p.fee === 0n ? t("common:compounding") : formatApr(analytics?.apr)}
      </td>
      <td className="text-right">
        {!closed && (
          <div className="flex jc-e">
            <button
              className="block transparent w-3 h-3 color-grey hover-white"
              onClick={manage}
              data-tooltip-content={t("manage")}
              data-tooltip-id="global-tip">
              <Icons.CirclePen className="block w-3 h-3" />
            </button>
            <RangePositionShareButton
              copyUrl={copyUrl}
              baseLabel={baseLabel}
              quoteLabel={quoteLabel}
              low={p.low}
              high={p.high}
              current={centerPrice}
              spread={p.spread}
              fee={p.fee}
              apr={analytics?.apr}
              ageDays={analytics?.weightedAverageInvestmentAgeDays}
              shareMsg={t("common:shareMsgOwnPosition", {
                base: baseLabel,
                quote: quoteLabel,
              })}
            />
            {msg ? (
              <span
                className="block ml-0.5"
                data-tooltip-html={assetPairTooltip(
                  {
                    amount: p.feesBase,
                    decimals: base.decimals,
                    symbol: baseLabel,
                  },
                  {
                    amount: p.feesQuote,
                    decimals: quote.decimals,
                    symbol: quoteLabel,
                  },
                  p.yieldUsd,
                  t("claimYield")
                )}
                data-tooltip-id="global-tip"
                data-tooltip-float={false}>
                <MsgProvider msg={msg}>
                  <TxButton
                    className="block transparent w-3 h-3"
                    hideSimulation>
                    <Icons.ClaimSolid className="block w-3 h-3 color-primary1 hover-primary2" />
                  </TxButton>
                </MsgProvider>
              </span>
            ) : (
              <button
                className="block transparent w-3 h-3 color-grey opacity-10 ml-0.5"
                data-tooltip-content={t("claimYield")}
                data-tooltip-id="global-tip"
                data-tooltip-float={false}>
                <Icons.Claim className="block w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </td>
    </tr>
  );
};
