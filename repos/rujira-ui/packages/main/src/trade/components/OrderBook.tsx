import clsx from "clsx";
import {
  FC,
  startTransition,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Decimal,
  Fiat,
  floatToSubscript,
  Icons,
  useClickOutside,
  useTranslation,
  useWindowSize,
} from "rujira.ui";

import { useFragment, useRefetchableFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { usePreloadedAccountData } from "../../services/accountData";

import { priceFormatter } from "rujira.js";
import { TradeBreakpoint } from "../Trade";
import { useTradeBookSubscription } from "../TradeSubscriptions";
import { TRUNCATIONS } from "../static";
import { adjust } from "../utils";
import { usePrice, useTradeContext } from "./Context";
import { OrderBookAccountFragment$key } from "./__generated__/OrderBookAccountFragment.graphql";
import { OrderBookEntryFragment$key } from "./__generated__/OrderBookEntryFragment.graphql";
import {
  OrderBookFragment$data,
  OrderBookFragment$key,
} from "./__generated__/OrderBookFragment.graphql";
import {
  OrderBookSubFragment$data,
  OrderBookSubFragment$key,
} from "./__generated__/OrderBookSubFragment.graphql";
import { OrderBookSubRefetchQuery } from "./__generated__/OrderBookSubRefetchQuery.graphql";

export enum BookFilterOption {
  All = "all",
  Buy = "buy",
  Sell = "sell",
}

const fragment = graphql`
  fragment OrderBookFragment on FinBookV2
  @argumentDefinitions(truncate: { type: "Int" }) {
    id
    pair {
      address
      assetBase {
        asset
        metadata {
          symbol
          decimals
        }
      }
      assetQuote {
        asset
        metadata {
          symbol
          decimals
        }
        price {
          current
        }
      }
      tick
    }
    ...OrderBookSubFragment @arguments(truncate: $truncate)
  }
`;

const subFrag = graphql`
  fragment OrderBookSubFragment on FinBookV2
  @refetchable(queryName: "OrderBookSubRefetchQuery")
  @argumentDefinitions(truncate: { type: "Int" }) {
    id
    center
    spread
    bids(first: 100, truncate: $truncate) {
      edges {
        node {
          value
          price
          total
          total
          virtualTotal
          virtualValue
          ...OrderBookEntryFragment
        }
      }
    }
    asks(first: 100, truncate: $truncate) {
      edges {
        node {
          value
          price
          total
          total
          virtualTotal
          virtualValue
          ...OrderBookEntryFragment
        }
      }
    }
  }
`;

const accountFragment = graphql`
  fragment OrderBookAccountFragment on Account {
    fin {
      orders(first: 100) {
        edges {
          node {
            pair {
              address
            }
            rate
            remaining
          }
        }
      }
    }
  }
`;

export const BookFilter: FC<{
  setFilter: (f: BookFilterOption) => void;
  truncate: number;
  setTruncate: (v: number) => void;
}> = ({ setFilter, truncate, setTruncate }) => {
  const { t } = useTranslation();
  return (
    <div className="trade__book-switch mb-2">
      {/* <nav className="tabs tabs--sm">
        <a className="selected">{t("orderBook")}</a>
      </nav> */}
      <h3 className="fs-12 fw-500 ml-1 mr-1 color-white">{t("orderBook")}</h3>

      <div className="trade__book-filter ml-1">
        <svg
          data-tooltip-id="book-tip"
          data-tooltip-html={t("splitDepth")}
          onClick={() => setFilter(BookFilterOption.All)}
          className="pointer"
          width="16px"
          height="16px"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2,0 L14,0 C15.1045695,-2.02906125e-16 16,0.8954305 16,2 L16,8 L16,8 L0,8 L0,2 C-1.3527075e-16,0.8954305 0.8954305,2.02906125e-16 2,0 Z"
            fill="#E53935"></path>
          <path
            d="M0,8 L16,8 L16,14 C16,15.1045695 15.1045695,16 14,16 L2,16 C0.8954305,16 1.3527075e-16,15.1045695 0,14 L0,8 L0,8 Z"
            fill="#60FBD0"></path>
        </svg>
        <svg
          data-tooltip-id="book-tip"
          data-tooltip-html={t("sellDepth")}
          onClick={() => setFilter(BookFilterOption.Sell)}
          className="pointer"
          width="16px"
          height="16px"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2,0 L14,0 C15.1045695,-2.02906125e-16 16,0.8954305 16,2 L16,8 L16,8 L0,8 L0,2 C-1.3527075e-16,0.8954305 0.8954305,2.02906125e-16 2,0 Z"
            fill="#E53935"></path>
          <path
            d="M0,9 L16,9 L16,14 C16,15.1045695 15.1045695,16 14,16 L2,16 C0.8954305,16 1.3527075e-16,15.1045695 0,14 L0,9 L0,9 Z"
            fillOpacity="0.5"
            fill="#607D8B"></path>
        </svg>
        <svg
          data-tooltip-id="book-tip"
          data-tooltip-html={t("buyDepth")}
          onClick={() => setFilter(BookFilterOption.Buy)}
          className="pointer"
          width="16px"
          height="16px"
          viewBox="0 0 16 16"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2,0 L14,0 C15.1045695,-2.02906125e-16 16,0.8954305 16,2 L16,7 L16,7 L0,7 L0,2 C-1.3527075e-16,0.8954305 0.8954305,2.02906125e-16 2,0 Z"
            fillOpacity="0.5"
            fill="#607D8B"></path>
          <path
            d="M0,8 L16,8 L16,14 C16,15.1045695 15.1045695,16 14,16 L2,16 C0.8954305,16 1.3527075e-16,15.1045695 0,14 L0,8 L0,8 Z"
            fill="#60FBD0"></path>
        </svg>
      </div>
      {/* !isSkeleton && (
        <div className="ml-a flex ai-c">
          <div className="trade__book-stat">
            <h4>APR</h4>
            <div>{nFormatter(BigInt(0), 2)}%</div>
          </div>
          <div className="trade__book-stat">
            <h4>Liquidity</h4>
            <div>{nFormatter(BigInt(0), 2)}</div>
          </div>
          <Button
            className="button--xs button--outline ml-2 mr-1"
            label="Provide"
          />
        </div>
      ) */}
      <Precision value={truncate} onChange={setTruncate} />
    </div>
  );
};

const Precision: FC<{ value: number; onChange: (value: number) => void }> = ({
  value,
  onChange,
}) => {
  const [show, setShow] = useState(false);

  const node = useClickOutside(() => {
    setShow(false);
  });

  const params = useTradeContext();
  const base = params.base?.split(".")[0];
  const quote = params.quote?.split(".")[0];

  const options = (quote && base && TRUNCATIONS[quote][base]) || [];

  return (
    <div className="relative ml-a" ref={node}>
      <button
        className="transparent mono fs-12 color-grey hover-white flex ai-c gap-1 pointer"
        onClick={() => setShow(true)}>
        <span>{formatPrecision(value)}</span>
        {!show ? (
          <Icons.AngleDown className="w-2 h-2" />
        ) : (
          <Icons.AngleUp className="w-2 h-2" />
        )}
      </button>
      {show && (
        <nav
          className="card card--shadow px-2 py-1.5 bg-darkGrey flex dir-c gap-y-0.5 fs-12 fw-500 color-white condensed"
          style={{
            position: "absolute",
            right: 0,
            top: "100%",
            fontVariantNumeric: "tabular-nums",
            zIndex: 10,
          }}>
          {options.map((v) => (
            <PrecisionItem
              key={v}
              v={v}
              selected={value}
              onSelect={() => {
                onChange(v);
                setShow(false);
              }}
            />
          ))}
        </nav>
      )}
    </div>
  );
};

const PrecisionItem: FC<{
  v: number;
  selected: number;
  onSelect: () => void;
}> = ({ v, selected, onSelect }) => {
  return (
    <a
      key={v}
      className={`${v === selected ? "color-white" : "color-grey hover-white"} pointer flex ai-c gap-2`}
      onClick={onSelect}>
      {formatPrecision(v)}
      {v === selected && <Icons.Check className="w-2 h-2 color-white" />}
    </a>
  );
};

const formatPrecision = (v: number) =>
  priceFormatter(
    BigInt(
      Math.floor(
        parseFloat(
          v > 0 ? `0.${"0".repeat(v - 1)}1` : `1${"0".repeat(v * -1)}`
        ) * 1e12
      )
    )
  );

export const OrderBook: FC<{
  filter: BookFilterOption;
  k?: OrderBookFragment$key;
  truncate: number;
}> = ({ filter, truncate, k }) => {
  const { t } = useTranslation();
  const d = useFragment(fragment, k);
  const { width } = useWindowSize();
  if (!k) return null;
  return (
    <>
      <div className="trade__book-header">
        <div>
          {width >= TradeBreakpoint ? t("price") : t("total")} (
          {d?.pair.assetQuote.metadata.symbol})
        </div>
        <div
          className={clsx({
            "text-right": width >= TradeBreakpoint,
            "text-center": width < TradeBreakpoint,
          })}>
          {t("amount")} ({d?.pair.assetBase.metadata.symbol})
        </div>
        <div className="text-right">
          {t("value")} ({d?.pair.assetQuote.metadata.symbol})
        </div>
      </div>
      <div className="trade__book-overflow">
        <Suspense fallback={<OrderBookRowsFallback />}>
          <OrderBookContent
            d={d || undefined}
            filter={filter}
            truncate={truncate}
            k={d || undefined}
            width={width}
          />
        </Suspense>
      </div>
    </>
  );
};

const OrderBookContent: FC<{
  d?: OrderBookFragment$data;
  filter: BookFilterOption;
  truncate: number;
  k?: OrderBookSubFragment$key;
  width: number;
}> = ({ d, filter, truncate, k, width }) => {
  const [book, refetch] = useRefetchableFragment<
    OrderBookSubRefetchQuery,
    OrderBookSubFragment$key
  >(subFrag, k);

  useEffect(() => {
    startTransition(() => {
      refetch({ truncate }, { fetchPolicy: "store-or-network" });
    });
  }, [truncate, refetch]);

  useTradeBookSubscription(book?.id, truncate);

  return (
    <>
      {width < TradeBreakpoint ? (
        <OrdersAll book={book || undefined} d={d} />
      ) : (
        <>
          {filter === BookFilterOption.All && (
            <OrdersAll book={book || undefined} d={d} />
          )}
          {filter === BookFilterOption.Sell && (
            <Asks book={book || undefined} d={d} />
          )}
          {filter === BookFilterOption.Buy && (
            <Bids book={book || undefined} d={d} />
          )}
        </>
      )}
    </>
  );
};

const center = () => {
  const mid = document.querySelector<HTMLElement>(".trade__book-mid");
  const list = document.querySelector<HTMLElement>(".trade__book-overflow");
  const sell = document.querySelector<HTMLElement>(".trade__book-sells");
  if (mid && list && sell) {
    list.scrollTop =
      sell.offsetHeight + mid.offsetHeight * 0.5 - list.offsetHeight * 0.5;
  }
};

const selectMax = (a: bigint, v: { total: bigint; virtualTotal: bigint }) => {
  const x = BigInt(v.total) + BigInt(v.virtualTotal);
  return a > x ? a : x;
};

type BookEntry = NonNullable<
  NonNullable<
    NonNullable<NonNullable<OrderBookSubFragment$data["asks"]>["edges"]>[number]
  >["node"]
>;

const bookEntries = (
  side?:
    | {
        edges:
          | ReadonlyArray<
              | {
                  node: BookEntry | null | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined
): BookEntry[] =>
  side?.edges?.reduce<BookEntry[]>((acc, edge) => {
    if (edge?.node) acc.push(edge.node);
    return acc;
  }, []) || [];

const OrdersAll: FC<{
  d?: OrderBookFragment$data;
  book?: OrderBookSubFragment$data;
}> = ({ d, book }) => {
  const { t } = useTranslation();
  const { width } = useWindowSize();

  useEffect(() => {
    center();
    setTimeout(center, 100);
  }, [book]);

  const mid = book?.center ? book.center : null;
  const spread = book?.spread ? book.spread : null;
  const midPrice = mid ? mid * (d?.pair.assetQuote.price?.current || 0n) : null;

  const [, setPrice] = usePrice();
  const asks = useMemo(() => bookEntries(book?.asks), [book?.asks]);
  const bids = useMemo(() => bookEntries(book?.bids), [book?.bids]);

  const [maxAsk, maxBid] = useMemo(
    () =>
      asks.length || bids.length
        ? [asks.reduce(selectMax, 0n), bids.reduce(selectMax, 0n)]
        : [0n, 0n],
    [asks, bids]
  );

  return (
    <>
      <div className="trade__book-sells">
        {d
          ? asks
              .slice(0, width > TradeBreakpoint ? 40 : 12)
              .map((e, i, all) => (
                <ItemAsk
                  address={d.pair.address}
                  tick={Number(d.pair.tick)}
                  max={maxAsk}
                  key={e.price}
                  k={e}
                  cumulative={all.slice(0, i + 1)}
                  mid={mid}
                  symbols={[
                    d.pair.assetBase.metadata.symbol,
                    d.pair.assetQuote.metadata.symbol,
                  ]}
                />
              ))
          : null}
      </div>
      {width > TradeBreakpoint && (
        <div
          className="trade__book-mid"
          onClick={() => {
            mid && setPrice(adjust(mid, Number(d?.pair.tick)));
          }}>
          <div className="flex wrap ai-c">
            <h3>
              {priceFormatter(mid || 0n, {
                precision: Number(d?.pair.tick),
                trim: false,
              })}
            </h3>
            <Fiat
              amount={midPrice || 0n}
              as="h4"
              symbol="$"
              decimals={24}
              className="color-grey"
              padSymbol={false}
            />
          </div>
          <div className="color-grey ml-a">
            {t("spread")}{" "}
            <Decimal
              amount={spread ? (spread < 0 ? 0n : spread) : 0n}
              decimals={10}
              round={2}
              symbol="%"
            />
          </div>
        </div>
      )}
      <div className="trade__book-buys">
        {d
          ? bids
              .slice(0, width > TradeBreakpoint ? 40 : 12)
              .map((e, i, all) => (
                <ItemBid
                  address={d.pair.address}
                  tick={Number(d.pair.tick)}
                  max={maxBid}
                  key={e.price}
                  k={e}
                  cumulative={all.slice(0, i + 1)}
                  mid={mid}
                  symbols={[
                    d.pair.assetBase.metadata.symbol,
                    d.pair.assetQuote.metadata.symbol,
                  ]}
                />
              ))
          : null}
      </div>
    </>
  );
};

const Asks: FC<{
  d?: OrderBookFragment$data;
  book?: OrderBookSubFragment$data;
}> = ({ d, book }) => {
  const mid = book?.center ? book.center : null;
  const asks = useMemo(() => bookEntries(book?.asks), [book?.asks]);

  useEffect(() => {
    requestAnimationFrame(() => {
      const list = document.querySelector<HTMLElement>(".trade__book-overflow");
      if (list) {
        list.scrollTop = list.scrollHeight;
      }
    });
  }, []);

  return (
    <div className="trade__book-sells">
      {d
        ? asks.map((e, i, all) => (
            <ItemAsk
              address={d.pair.address}
              tick={Number(d.pair.tick)}
              max={all.reduce(
                (a, v) =>
                  a > BigInt(v.total) + BigInt(v.virtualTotal)
                    ? a
                    : BigInt(v.total) + BigInt(v.virtualTotal),
                0n
              )}
              key={e.price}
              k={e}
              cumulative={all.slice(0, i + 1)}
              mid={mid}
              symbols={[
                d.pair.assetBase.metadata.symbol,
                d.pair.assetQuote.metadata.symbol,
              ]}
            />
          ))
        : null}
    </div>
  );
};

const Bids: FC<{
  d?: OrderBookFragment$data;
  book?: OrderBookSubFragment$data;
}> = ({ d, book }) => {
  const mid = book?.center ? book.center : null;
  const bids = useMemo(() => bookEntries(book?.bids), [book?.bids]);
  useEffect(() => {
    const list = document.querySelector<HTMLElement>(".trade__book-overflow");
    if (list) list.scrollTop = 0;
  }, []);

  return (
    <div className="trade__book-buys">
      {d
        ? bids.map((e, i, all) => (
            <ItemBid
              address={d.pair.address}
              tick={Number(d.pair.tick)}
              max={all.reduce(
                (a, v) =>
                  a > BigInt(v.total) + BigInt(v.virtualTotal)
                    ? a
                    : BigInt(v.total) + BigInt(v.virtualTotal),
                0n
              )}
              key={e.price}
              k={e}
              cumulative={all.slice(0, i + 1)}
              mid={mid}
              symbols={[
                d.pair.assetBase.metadata.symbol,
                d.pair.assetQuote.metadata.symbol,
              ]}
            />
          ))
        : null}
    </div>
  );
};

const itemFragment = graphql`
  fragment OrderBookEntryFragment on FinBookEntry {
    price
    side
    total
    value
    value
    total
    virtualTotal
    virtualValue
  }
`;

interface ItemProps {
  address: string;
  k: OrderBookEntryFragment$key;
  symbols: [string, string];
  cumulative: BookEntry[];
  max: bigint;
  mid?: bigint | null;
  tick: number;
}

const ItemAsk: FC<ItemProps> = (props) => (
  <ItemContainer side="ask" {...props} />
);
const ItemBid: FC<ItemProps> = (props) => (
  <ItemContainer side="bid" {...props} />
);

const ItemContainer: FC<ItemProps & { side: "bid" | "ask" }> = (props) => {
  return (
    <Suspense fallback={<ItemContent {...props} />}>
      <Item {...props} />
    </Suspense>
  );
};

const Item: FC<ItemProps & { side: "bid" | "ask" }> = (props) => {
  const { accountData } = usePreloadedAccountData();
  const account = useFragment<OrderBookAccountFragment$key>(
    accountFragment,
    accountData
  );
  const data = useFragment(itemFragment, props.k);

  return (
    <ItemContent
      {...props}
      owned={
        !!account?.fin?.orders?.edges?.find(
          (o) =>
            o?.node?.pair?.address === props.address &&
            o?.node?.rate.toString().slice(0, 8) ===
              data.price.toString().slice(0, 8)
        )
      }
    />
  );
};

const ItemContent: FC<ItemProps & { side: "bid" | "ask"; owned?: boolean }> = ({
  k,
  cumulative,
  symbols,
  max,
  mid,
  side,
  tick: tick_,
  owned,
}) => {
  const tick = tick_ + 2;
  const data = useFragment(itemFragment, k);
  const { t } = useTranslation();
  const bar = max
    ? ((BigInt(data.total) + BigInt(data.virtualTotal)) * 100n) / max
    : 0n;
  const [, setPrice] = usePrice();
  const tipHtml = useMemo(
    () =>
      tip(side, symbols, cumulative, tick, mid, {
        above: t("aboveMidPrice"),
        below: t("belowMidPrice"),
        vs: t("vsMidPrice"),
      }),
    [side, symbols, cumulative, tick, mid, t]
  );

  const total =
    side === "ask"
      ? BigInt(data.total) + BigInt(data.virtualTotal)
      : BigInt(data.value) + BigInt(data.virtualValue);

  const value =
    side === "bid"
      ? BigInt(data.total) + BigInt(data.virtualTotal)
      : BigInt(data.value) + BigInt(data.virtualValue);

  return (
    <div
      className={clsx({
        "trade__book-row": true,
        "trade__book-row--sell": side === "ask",
        "trade__book-row--buy": side === "bid",
        "trade__book-row--mine": owned,
      })}
      onClick={() => {
        setPrice(adjust(BigInt(data.price), Number(tick_)));
      }}
      data-tooltip-id="book-tip"
      data-tooltip-html={tipHtml}>
      <span className="trade__book-row-price">
        {priceFormatter(BigInt(data.price), { precision: tick, trim: false })}
      </span>
      <span>
        <Decimal amount={total} round={4} subscript />
      </span>
      <span>
        <Decimal amount={value} round={4} subscript />
      </span>
      <i style={{ width: bar + "%" }} />
    </div>
  );
};

const tip = (
  side: "ask" | "bid",
  symbols: [string, string],
  cumulative: BookEntry[],
  tick: number,
  mid: bigint | null | undefined,
  midPriceLabels: {
    above: string;
    below: string;
    vs: string;
  }
): string => {
  const [base, quote] = cumulative.reduce(
    ([b, q], v) =>
      side === "ask"
        ? [
            b + BigInt(v.total) + BigInt(v.virtualTotal),
            q + BigInt(v.value) + BigInt(v.virtualValue),
          ]
        : [
            b + BigInt(v.value) + BigInt(v.virtualValue),
            q + BigInt(v.total) + BigInt(v.virtualTotal),
          ],
    [0n, 0n]
  );

  const avgPrice = base === 0n ? 0 : Number(quote) / Number(base);
  const avgPriceBigInt = BigInt(Math.round(avgPrice * 10 ** 12));
  const distanceFromMid = formatDistanceFromMid(
    avgPriceBigInt,
    mid,
    midPriceLabels
  );

  return `<strong>Cumulative Depth</strong>
          <div class="mt-0.5 mono fs-13">
            <div class="flex dir-r gap-0.5">
              <p>${floatToSubscript(Number(base) / 10 ** 8, 8, 4)}</p><p class="color-lightGrey">${symbols[0]}</p>
            </div>
            <div class="flex dir-r gap-0.5">
              <p>${floatToSubscript(Number(quote) / 10 ** 8, 8, 4)}</p><p class="color-lightGrey">${symbols[1]}</p>
            </div>
            <div class="mt-1">
              <strong>Avg. Price</strong>
              <div class="flex dir-r gap-0.5 mt-0.5">
                <p>${priceFormatter(avgPriceBigInt, { precision: tick, trim: false })}</p><p class="color-lightGrey">${symbols[1]}</p>
              </div>
              ${distanceFromMid ? `<p>${distanceFromMid}</p>` : ""}
            </div>
          </div>`;
};

const formatDistanceFromMid = (
  avgPrice: bigint,
  mid: bigint | null | undefined,
  labels: {
    above: string;
    below: string;
    vs: string;
  }
) => {
  if (!avgPrice || !mid) return null;

  const distance = ((avgPrice - mid) * 10_000n) / mid;
  if (distance === 0n) {
    return `<span class="color-white">${(0).toLocaleDecimal(
      2
    )}%</span> <span class="color-lightGrey">${labels.vs}</span>`;
  }

  const absoluteDistance = distance < 0n ? -distance : distance;
  const value = (Number(absoluteDistance) / 100).toLocaleDecimal(2);
  const label = distance > 0n ? labels.above : labels.below;

  return `<span class="color-white">${value}%</span> <span class="color-lightGrey">${label}</span>`;
};

export const OrderBookFallback: FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="trade__book-header">
        <div>{t("price")} (...)</div>
        <div className="text-right">{t("amount")} (...)</div>
        <div className="text-right">{t("total")} (...)</div>
      </div>
      <div className="trade__book-overflow">
        <OrderBookRowsFallback />
      </div>
    </>
  );
};

const OrderBookRowsFallback: FC = () => (
  <>
    {[...Array(12)].map((_, i) => (
      <div className="trade__book-row" key={`skeleton-${i}`}>
        <span>
          <span className="inline-block skeleton w-12 h-1 br-2" />
        </span>
        <span>
          <span className="inline-block skeleton w-12 h-1 br-2" />
        </span>
        <span>
          <span className="inline-block skeleton w-12 h-1 br-2" />
        </span>
      </div>
    ))}
  </>
);
