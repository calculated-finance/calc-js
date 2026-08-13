import { Buffer } from "buffer";
import clsx from "clsx";
import {
  FC,
  Suspense,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import {
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useSubscription,
} from "react-relay";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { graphql } from "relay-runtime";
import {
  TranslationProvider,
  useLocale,
  useLocalStorage,
  useTranslation,
  useWindowSize,
  Warning,
} from "rujira.ui";
import exclamation from "rujira.ui/assets/images/exclamation.gif";

import { subDays } from "date-fns";
import { Drawer } from "vaul";
import { NotFound } from "../common/NotFound";
import { getTradePairSeo, ProductSeoHelmet } from "../seo";
import {
  assetToTradeUrlSegment,
  normalizeTradeSegment,
} from "../services/assetUrl";
import {
  TradeQuery,
  TradeQuery$data,
} from "./__generated__/TradeQuery.graphql";
import { OrderBookFragment$key } from "./components/__generated__/OrderBookFragment.graphql";
import { TradeContext } from "./components/Context";
import {
  Header,
  MarketSelect,
  MarketSummaryFallback,
} from "./components/Header";
import { History, HistoryFallback } from "./components/History";
import { Markets } from "./components/Markets";
import {
  BookFilter,
  BookFilterOption,
  OrderBook,
  OrderBookFallback,
} from "./components/OrderBook";
import { Orders, OrdersFallback } from "./components/Orders";
import {
  Context as OrdersTabContext,
  Tab as OrdersTab,
  useOrdersContext,
} from "./components/Orders/Context";
import { RangeContext, RangeInputs, useRangeContext } from "./components/Range";
import { Submit } from "./components/Submit";
import { TradingView, TradingViewLoader } from "./components/TradingView";
import { TRUNCATIONS } from "./static";
import { pairSwitchTradeUrlParams, searchFromParams } from "./tradeUrlState";

export const TradeBreakpoint = 1170; // px, used in scss/_trade.scss

export const query = graphql`
  query TradeQuery(
    $id: ID!
    $rangeAfter: String
    $rangeBefore: String
    $truncate: Int
  ) {
    pair: node(id: $id) @catch {
      ... on FinPair {
        address
        tick
        assetBase {
          chain
          type
          metadata {
            symbol
          }
          ...msgAssetFragment
        }
        assetQuote {
          chain
          type
          metadata {
            symbol
          }
          ...msgAssetFragment
        }
        oracleBase {
          id
        }
        oracleQuote {
          id
        }
        bookV2 {
          ...OrderBookFragment @arguments(truncate: $truncate)
        }
        ...HeaderTradeFragment
        ...SubmitFragment
        trades(first: 100) @connection(key: "HistoryFragment_trades") {
          __id
          edges {
            ...HistoryFragment
            node {
              type
            }
          }
        }
        ...RangeFragment
        ...RangeInputsFragment
      }
    }
  }
`;

const subscription = graphql`
  subscription TradeHistorySubscription($connection: ID!, $prefix: String!) {
    edge(prefix: $prefix) @prependEdge(connections: [$connection]) {
      cursor
      node {
        ... on FinTrade {
          ...HistoryItemFragment
        }
      }
    }
  }
`;

const Meta = () => {
  const { base, quote } = useParams();
  const location = useLocation();
  const { locale } = useLocale();
  const tradeType = new URLSearchParams(location.search).get("type");

  return (
    <ProductSeoHelmet seo={getTradePairSeo(base, quote, locale, tradeType)} />
  );
};

export const Trade: FC = () => {
  return (
    <TranslationProvider namespace="trade">
      <Meta />
      <div className="rujira__main rujira__main--gradient trade">
        <Suspense fallback={<Fallback />}>
          <QueryProvider />
        </Suspense>
      </div>
    </TranslationProvider>
  );
};

const Selector: FC<{ pair?: SuccessPair }> = ({ pair }) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const { t } = useTranslation();
  const openDrawer = () => setShowDrawer(true);
  const { state } = useLocation();
  const initialPairId = state?.pairId;

  return (
    <Drawer.Root
      direction="left"
      open={showDrawer}
      onOpenChange={(open) => setShowDrawer(open)}>
      <MarketSelect
        k={pair}
        openDrawer={openDrawer}
        initialPairId={initialPairId}
      />
      <Drawer.Portal>
        <Drawer.Overlay className="drawer__overlay" />
        <Drawer.Content className="drawer__content drawer__content--left">
          <Drawer.Description className="visually-hidden">
            Markets
          </Drawer.Description>
          <Drawer.Title className="visually-hidden">
            {t("markets")}
          </Drawer.Title>
          <div className="drawer__card trade__markets">
            <Markets closeDrawer={() => setShowDrawer(false)} />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

const QueryProvider: FC = () => {
  const { base, quote } = useParams();
  const [q, loadQuery] = useQueryLoader<TradeQuery>(query);
  const [isPending, startTransition] = useTransition();
  const def = (quote && base && TRUNCATIONS[quote]?.[base]?.at(-1)) ?? 6;

  const [truncates, setTruncates] = useLocalStorage<
    Record<string, Record<string, number>>
  >("trade-truncate", {});
  const truncate = truncates[quote || ""]?.[base || ""] ?? def;
  const setTruncate = (v: number) =>
    setTruncates({
      ...truncates,
      [quote || ""]: { ...(truncates[quote || ""] || {}), [base || ""]: v },
    });

  // The base/quote URL segments the currently-loaded (or in-flight) query was
  // requested for. Updated alongside `loadQuery` so the canonical-redirect
  // check below compares against the pair currently being rendered rather
  // than the (possibly newer) URL params — avoiding a bounce back to the old
  // market while the new query is still in flight.
  const [requested, setRequested] = useState({ base, quote });

  useEffect(() => {
    const load = () => {
      loadQuery(
        {
          id: Buffer.from(
            `FinPair:${normalizeTradeSegment(base || "")}/${normalizeTradeSegment(quote || "")}`
          ).toString("base64"),
          rangeBefore: new Date().toISOString(),
          rangeAfter: subDays(new Date(), 91).toISOString(),
          truncate,
        },
        { fetchPolicy: "store-and-network" }
      );
      setRequested({ base, quote });
    };

    if (!q) {
      load();
    } else {
      startTransition(load);
    }
  }, [base, quote]);

  return q ? (
    <Loader
      preloaded={q}
      truncate={truncate}
      setTruncate={setTruncate}
      isPending={isPending}
      requestedBase={requested.base}
      requestedQuote={requested.quote}
    />
  ) : (
    <Fallback />
  );
};

const Loader: FC<{
  q?: TradeQuery$data;
  preloaded: PreloadedQuery<TradeQuery>;
  truncate: number;
  setTruncate: (v: number) => void;
  isPending: boolean;
  requestedBase?: string;
  requestedQuote?: string;
}> = ({
  preloaded,
  truncate,
  setTruncate,
  isPending,
  requestedBase,
  requestedQuote,
}) => {
  const d = usePreloadedQuery(query, preloaded);

  return (
    <Content
      q={d}
      truncate={truncate}
      setTruncate={setTruncate}
      isPending={isPending}
      requestedBase={requestedBase}
      requestedQuote={requestedQuote}
    />
  );
};
const Content: FC<{
  q: TradeQuery$data;
  truncate: number;
  setTruncate: (v: number) => void;
  isPending: boolean;
  requestedBase?: string;
  requestedQuote?: string;
}> = ({
  q,
  truncate,
  setTruncate,
  isPending,
  requestedBase,
  requestedQuote,
}) =>
  q.pair.ok ? (
    q.pair.value ? (
      <Success
        pair={q.pair.value}
        truncate={truncate}
        setTruncate={setTruncate}
        isPending={isPending}
        requestedBase={requestedBase}
        requestedQuote={requestedQuote}
      />
    ) : (
      <>
        <div className="trade__selector">
          <Selector />
        </div>
        <NotFound />
      </>
    )
  ) : (
    <Error
      errors={
        q.pair.errors as readonly { status: string; path: readonly string[] }[]
      }
    />
  );

type SuccessPair = NonNullable<
  Extract<TradeQuery$data["pair"], { ok: true }>["value"]
>;

const Success: FC<{
  pair: SuccessPair;
  truncate: number;
  setTruncate: (v: number) => void;
  isPending: boolean;
  requestedBase?: string;
  requestedQuote?: string;
}> = ({
  pair,
  truncate,
  setTruncate,
  isPending,
  requestedBase,
  requestedQuote,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefix = Buffer.from(`FinTrade:${pair.address}`).toString("base64");
  const config = useMemo(
    () => ({
      subscription,
      variables: { connection: pair.trades?.__id, prefix },
    }),
    [pair.trades, prefix]
  );
  useSubscription(config);

  useEffect(() => {
    if (!pair.assetBase || !pair.assetQuote) return;
    const canonicalBase = assetToTradeUrlSegment(pair.assetBase);
    const canonicalQuote = assetToTradeUrlSegment(pair.assetQuote);
    if (canonicalBase !== requestedBase || canonicalQuote !== requestedQuote) {
      const nextParams = pairSwitchTradeUrlParams(
        new URLSearchParams(location.search)
      );
      navigate(
        `../../${canonicalBase}/${canonicalQuote}${nextParams ? searchFromParams(nextParams) : ""}`,
        {
          relative: "path",
          replace: true,
        }
      );
    }
  }, [
    pair.assetBase,
    pair.assetQuote,
    requestedBase,
    requestedQuote,
    navigate,
    location.search,
  ]);

  return (
    <TradeContext
      address={pair.address}
      base={pair.assetBase?.metadata.symbol || ""}
      quote={pair.assetQuote?.metadata.symbol || ""}>
      <OrdersTabContext>
        <TradeLayout
          pair={pair}
          truncate={truncate}
          setTruncate={setTruncate}
          isPending={isPending}
        />
      </OrdersTabContext>
    </TradeContext>
  );
};

const TradeLayout: FC<{
  pair: SuccessPair;
  truncate: number;
  setTruncate: (v: number) => void;
  isPending: boolean;
}> = ({ pair, truncate, setTruncate, isPending }) => {
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const [tab, setTab] = useState<"graph" | "book" | "history">("graph");
  const { tab: ordersTab } = useOrdersContext();

  return (
    <RangeContext
      k={pair}
      key={pair.address}
      enabled={ordersTab === OrdersTab.Automated}>
      <div className="trade__selector">
        <Selector pair={isPending ? undefined : pair} />
      </div>
      <div className="trade__header">
        <Header k={pair} lastTradeType={pair.trades?.edges?.[0]?.node?.type} />
      </div>
      {width < TradeBreakpoint && (
        <nav className="tabs tabs--sm trade__tabs jc-c">
          <a
            className={clsx({ tabs__item: true, selected: tab === "graph" })}
            onClick={() => setTab("graph")}>
            <label>{t("chart")}</label>
          </a>
          <a
            className={clsx({ tabs__item: true, selected: tab === "book" })}
            onClick={() => setTab("book")}>
            <label>{t("orderBook")}</label>
          </a>
          <a
            className={clsx({ tabs__item: true, selected: tab === "history" })}
            onClick={() => setTab("history")}>
            <label>{t("history")}</label>
          </a>
        </nav>
      )}
      {(width >= TradeBreakpoint ||
        (width < TradeBreakpoint && tab === "graph")) && (
        <div className="trade__graph">
          {isPending ? (
            <div className="h-full w-full p-0.5 flex ai-c jc-c">
              <TradingViewLoader />
            </div>
          ) : (
            <TradingView
              key={pair.address}
              address={pair.address}
              base={pair.assetBase?.metadata.symbol || ""}
              quote={pair.assetQuote?.metadata.symbol || ""}
              tick={Number(pair.tick)}
              k={pair}
            />
          )}
        </div>
      )}
      <div className="trade__orders">
        <Orders />
      </div>
      <Right
        pair={pair}
        tab={tab}
        truncate={truncate}
        setTruncate={setTruncate}
        isPending={isPending}
      />
    </RangeContext>
  );
};

const Right: FC<{
  pair: NonNullable<Extract<TradeQuery$data["pair"], { ok: true }>["value"]>;
  tab: string;
  truncate: number;
  setTruncate: (v: number) => void;
  isPending: boolean;
}> = ({ pair, tab, truncate, setTruncate, isPending }) => {
  const { enabled } = useRangeContext();
  const { width } = useWindowSize();

  return enabled ? (
    <div className="trade__range">
      <RangeInputs k={pair} />
    </div>
  ) : (
    <>
      {(width >= TradeBreakpoint ||
        (width < TradeBreakpoint && tab == "book")) && (
        <div className="trade__book">
          {isPending ? (
            <DataViewFallback />
          ) : (
            <DataView
              o={pair.bookV2 || undefined}
              truncate={truncate}
              setTruncate={setTruncate}
            />
          )}
        </div>
      )}
      {(width >= TradeBreakpoint ||
        (width < TradeBreakpoint && tab == "history")) && (
        <div className="trade__history">
          {isPending ? (
            <HistoryFallback />
          ) : (
            pair.trades?.edges?.filter((x) => !!x) && (
              <History
                k={pair.trades?.edges?.filter((x) => !!x) || undefined}
                base={pair.assetBase?.metadata.symbol || ""}
                quote={pair.assetQuote?.metadata.symbol || ""}
                tick={Number(pair.tick)}
              />
            )
          )}
        </div>
      )}
      <div className="trade__submit">
        <Drawer.Root>
          <Submit k={pair} />
        </Drawer.Root>
      </div>
    </>
  );
};

const Error: FC<{
  errors: readonly { status: string; path: readonly string[] }[];
}> = ({ errors }) => {
  const { width } = useWindowSize();

  return (
    <TradeContext>
      <div className="trade__selector">
        <Selector />
      </div>
      <div className="trade__submit"></div>
      <div className="trade__header"></div>
      {width < TradeBreakpoint && (
        <nav className="tabs tabs--sm trade__tabs jc-c">
          <a className="tabs__item skeleton w-12" />
          <a className="tabs__item skeleton w-12" />
          <a className="tabs__item skeleton w-12" />
        </nav>
      )}

      <div className="trade__graph">
        <div className="h-full w-full p-0.5 flex ai-c jc-c px-1.5">
          <Warning
            className="warning--sm mt-2 condensed flex ai-c"
            color="orange">
            <img
              src={exclamation}
              alt=""
              className="filter-orange block no-shrink"
              style={{ width: "2.5rem", height: "2.5rem" }}
            />
            <div className="text-left fs-14">
              {errors.map((err) => (
                <div key={err.status}>
                  {err.path?.join(":")}; {err.status}
                </div>
              ))}
            </div>
          </Warning>
        </div>
      </div>

      <div className="trade__orders">
        <OrdersFallback />
      </div>
      {width >= TradeBreakpoint && (
        <div className="trade__book">
          <DataViewFallback />
        </div>
      )}
      {width >= TradeBreakpoint && (
        <div className="trade__history">
          <HistoryFallback />
        </div>
      )}
    </TradeContext>
  );
};

const Fallback: FC = () => {
  const { width } = useWindowSize();

  return (
    <TradeContext>
      <div className="trade__selector">
        <Selector />
      </div>
      <div className="trade__submit"></div>
      <div className="trade__header">
        <MarketSummaryFallback />
      </div>
      {width < TradeBreakpoint && (
        <nav className="tabs tabs--sm trade__tabs jc-c">
          <a className="tabs__item skeleton w-12" />
          <a className="tabs__item skeleton w-12" />
          <a className="tabs__item skeleton w-12" />
        </nav>
      )}

      <div className="trade__graph">
        <div className="h-full w-full p-0.5 flex ai-c jc-c">
          <TradingViewLoader />
        </div>
      </div>

      <div className="trade__orders">
        <OrdersFallback />
      </div>
      {width >= TradeBreakpoint && (
        <div className="trade__book">
          <DataViewFallback />
        </div>
      )}
      {width >= TradeBreakpoint && (
        <div className="trade__history">
          <HistoryFallback />
        </div>
      )}
    </TradeContext>
  );
};

enum Tab {
  Book = "book",
  Trades = "trades",
  Both = "both",
}

export const DataView: FC<{
  o?: OrderBookFragment$key;
  truncate: number;
  setTruncate: (v: number) => void;
}> = ({ o, truncate, setTruncate }) => {
  const [tab, setTab] = useLocalStorage<Tab>("trade-dataview-trades", Tab.Book);
  const [filter, setFilter] = useLocalStorage<BookFilterOption>(
    "trade-dataview-book",
    BookFilterOption.All
  );
  const { width } = useWindowSize();

  useEffect(() => {
    if (width < TradeBreakpoint && tab === Tab.Both) {
      setTab(Tab.Book);
    }
  }, [width, tab]);

  return (
    <>
      <BookFilter
        setFilter={setFilter}
        truncate={truncate}
        setTruncate={setTruncate}
      />
      <OrderBook filter={filter} truncate={truncate} k={o} />
      <Tooltip
        id="book-tip"
        className="tooltip"
        place="left"
        style={{ zIndex: 1 }}
      />
    </>
  );
};

export const DataViewFallback: FC = () => {
  return (
    <>
      <BookFilter setFilter={() => {}} truncate={0} setTruncate={() => {}} />
      <OrderBookFallback />
    </>
  );
};
