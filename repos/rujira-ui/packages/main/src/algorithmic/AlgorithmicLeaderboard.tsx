import clsx from "clsx";
import { FC, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import {
  PreloadedQuery,
  useLazyLoadQuery,
  usePaginationFragment,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { Link } from "react-router-dom";
import {
  AssetLabel,
  assetLabel,
  Button,
  clipFloat,
  Decimal,
  Fiat,
  IconDenom,
  Icons,
  Slider,
  Toggle,
  useLocale,
  useTranslation,
} from "rujira.ui";
import { AnalyticsBoundary } from "../analytics/AnalyticsBoundary";
import { formatBigintPercent } from "../common/bigint";
import { assetToTradeUrlSegment } from "../services/assetUrl";
import { retryAnalyticsConnection } from "../services/relayAnalytics";
import { siteOrigin } from "../services/siteOrigin";
import { RangePositionShareButton } from "../sharing/RangePositionCard";
import {
  InRange,
  OutOfRange,
  SimpleRange,
} from "../trade/components/Orders/Range";
import { cclCopyParams } from "../trade/tradeUrlState";
import {
  pairsQuery,
  query,
  rangesFragment,
} from "./analytics/AlgorithmicLeaderboard";
import { AlgorithmicLeaderboardPaginationQuery } from "./analytics/__generated__/AlgorithmicLeaderboardPaginationQuery.graphql";
import { AlgorithmicLeaderboardPairsQuery } from "./analytics/__generated__/AlgorithmicLeaderboardPairsQuery.graphql";
import {
  AlgorithmicLeaderboard_query$data,
  AlgorithmicLeaderboard_query$key,
} from "./analytics/__generated__/AlgorithmicLeaderboard_query.graphql";
import {
  AlgorithmicLeaderboardQuery,
  FinRangeStatus,
} from "./analytics/__generated__/AlgorithmicLeaderboardQuery.graphql";
import { ALL_PAIRS, PairOption, PairSelect } from "./components/PairSelect";
import { AnalyticsWarning } from "../analytics/AnalyticsWarning";

const DISPLAY_LIMIT = 50;
// Larger pages exceed the analytics API's rate limit.
const PAGE_SIZE = 50;
// Bound automatic backfill to five sequential requests.
const MAX_POOL = PAGE_SIZE * 5;
const BACKFILL_DEBOUNCE_MS = 400;
const MIN_AGE_DAYS = 7;
const MIN_VALUE_USD = 100;
// Ignore bad upstream ages rather than stretching the slider domain.
const MAX_PLAUSIBLE_AGE_DAYS = 3650;
// Young or tiny positions can produce extreme annualized returns.
const MIN_PLAUSIBLE_APR = -100;
const MAX_PLAUSIBLE_APR = 1000;

type RangeNode = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<AlgorithmicLeaderboard_query$data["finV3"]["ranges"]>["edges"]
    >[number]
  >["node"]
>;

type PairsNode = NonNullable<
  NonNullable<
    NonNullable<
      AlgorithmicLeaderboardPairsQuery["response"]["finV3"]["pairs"]
    >["edges"]
  >[number]
>["node"];

type LeaderboardPairAsset = NonNullable<PairsNode>["assetBase"];

type LeaderboardPairOption = PairOption<LeaderboardPairAsset> & {
  contract: string;
};

const PRICE = 1e12; // high / low / price + quote USD price
const FRACTION = 1e10; // apr / spread / fee carried as 1e12 fractions -> %
const MULTIPLE = 1e12; // moic / dpi
const USD = 1e8; // valueUsd

interface Row {
  node: RangeNode;
  baseSymbol: string;
  quoteSymbol: string;
  ownerShort: string;
  valueQuote: bigint;
  ageValid: boolean;
  nums: Record<Exclude<NumDim, "fee" | "tightness">, number> &
    Record<"fee" | "tightness", number | null>;
}

type NumDim =
  | "age"
  | "value"
  | "apr"
  | "moic"
  | "dpi"
  | "high"
  | "low"
  | "spread"
  | "fee"
  | "tightness";

type FilterDim = Exclude<NumDim, "high" | "low">;

type SortKey = NumDim | "pair" | "owner" | "range";
type SortDir = "asc" | "desc";

const formatAge = (days: number): string =>
  days > 365 ? `${(days / 365).toFixed(1)}yr` : `${Math.round(days)}d`;

const formatMultiple = (v: number): string => `${v.toFixed(2)}x`;

const truncateAddress = (a: string): string =>
  a.length > 11 ? `${a.slice(0, 5)}..${a.slice(-4)}` : a;

// valueUsd(1e8) / quotePrice(1e12) * 10^quoteDecimals
const valueInQuote = (
  valueUsd: bigint,
  quotePriceUsd: bigint,
  quoteDecimals: number
): bigint =>
  quotePriceUsd > 0n
    ? (valueUsd * 10n ** BigInt(quoteDecimals + 4)) / quotePriceUsd
    : 0n;

const toRow = (node: RangeNode): Row => {
  const a = node.analytics;
  const quote = node.pair.assetQuote;
  const quotePrice = BigInt(quote.price?.current ?? "0");
  const quoteDecimals = quote.metadata.decimals;
  const rawAge = a?.weightedAverageInvestmentAgeDays ?? 0;
  const ageValid = rawAge <= MAX_PLAUSIBLE_AGE_DAYS;
  return {
    node,
    baseSymbol: node.pair.assetBase.metadata.symbol,
    quoteSymbol: quote.metadata.symbol,
    ownerShort: truncateAddress(node.owner),
    valueQuote: valueInQuote(BigInt(node.valueUsd), quotePrice, quoteDecimals),
    ageValid,
    nums: {
      age: ageValid ? rawAge : 0,
      value: Number(node.valueUsd) / USD,
      apr: Math.min(
        MAX_PLAUSIBLE_APR,
        Math.max(MIN_PLAUSIBLE_APR, Number(a?.apr ?? 0n) / FRACTION)
      ),
      moic: Number(a?.moic ?? 0n) / MULTIPLE,
      dpi: Number(a?.dpi ?? 0n) / MULTIPLE,
      high: Number(node.high) / PRICE,
      low: Number(node.low) / PRICE,
      spread: Number(node.spread) / FRACTION,
      fee:
        node.rewardStrategy == null
          ? null
          : Number(node.rewardStrategy) / FRACTION,
      tightness:
        node.tightnessFactor == null
          ? null
          : Number(node.tightnessFactor) / FRACTION,
    },
  };
};

interface ColumnDef {
  key: SortKey;
  label: string;
  align?: "right" | "center";
  param?: boolean;
  tooltip?: string;
  group?: "start" | "end";
}

const COLUMNS: ColumnDef[] = [
  { key: "pair", label: "Pair" },
  {
    key: "age",
    label: "Age",
    tooltip:
      '<div class="w-30">Weighted average age of your position based on the size and timing of deposits and withdrawals. Used to calculate annualized returns like APR.<br/><br/>Example: a larger deposit made 30 days ago will have more impact on the calculation than a smaller deposit made yesterday.</div>',
  },
  {
    key: "apr",
    label: "APR",
    align: "right",
    group: "start",
    tooltip:
      '<div class="w-30">Estimated yearly return based on the claimable yield earned relative to the weighted average value and duration of your position. To measure APR, part of your yield must be set as claimable instead of fully auto-compounded.<br/><br/>Example: if your position earned $100 in claimable yield on an average invested value of $1,000 over one year, the APR would be 10%.</div>',
  },
  {
    key: "moic",
    label: "MOIC",
    align: "right",
    param: true,
    tooltip:
      '<div class="w-30">Multiple of Invested Capital (MOIC) measures the total value of your position compared to the amount invested, including both realized and unrealized value.<br/><br/>Example: if you invested $1,000, already received $500 back from the position, and still have $1,500 remaining in the position, your total value is $2,000 and your MOIC is 2.0x.<br/><br/>Calculated as: (Realized Value + Unrealized Value) / Total Invested.</div>',
  },
  {
    key: "dpi",
    label: "DPI",
    align: "right",
    group: "end",
    tooltip:
      '<div class="w-30">Distribution-to-Paid-In (DPI) ratio measures how much value has been returned compared to the total amount invested.<br/><br/>Example: if you invested $1,000 and received $1,500 back from the position, your DPI is 1.5x and your realized profit is $500.</div>',
  },
  { key: "value", label: "Current Value", align: "right" },
  {
    key: "range",
    label: "Range",
    align: "center",
    param: true,
    group: "start",
  },
  {
    key: "tightness",
    label: "Tightness",
    align: "right",
    param: true,
    tooltip:
      '<div class="w-30">Range tightness measures how concentrated your liquidity is within your selected price range.<br/><br/>Lower values create a wider range that stays active across larger price movements, while higher values create a tighter range focused closer to the current market price. Tighter ranges can generate higher fees while the market stays within the range, but are also more likely to move out of range where no fees are earned.<br/><br/>Calculated as: Tightness = Low Price / High Price.</div>',
  },
  { key: "spread", label: "Spread", align: "right", param: true },
  {
    key: "fee",
    label: "Reward Strategy",
    align: "right",
    param: true,
    group: "end",
    tooltip:
      '<div class="w-30">Determines how trading fee profits are distributed. Lower values reinvest more rewards back into your position, while higher values increase the amount of claimable yield.<br/><br/>Example: a 0% setting fully auto-compounds rewards into the position, while a 100% setting makes all rewards claimable instead of reinvested.<br/><br/>Choosing 0% fully auto-compounds rewards, which means APR tracking will not be available.</div>',
  },
  { key: "owner", label: "Owner" },
];

interface FilterDef {
  key: FilterDim;
  label: string;
  format: (v: number) => string;
  skewLow?: boolean;
}

// Biases slider precision toward smaller values and still works when min is 0.
const SKEW_EXPONENT = 2;
const toSkewedPos = (value: number, min: number, max: number): number => {
  const t = max > min ? (value - min) / (max - min) : 0;
  return Math.max(0, Math.min(1, t)) ** (1 / SKEW_EXPONENT);
};
const fromSkewedPos = (pos: number, min: number, max: number): number =>
  min + (max - min) * pos ** SKEW_EXPONENT;

// react-slider may return reversed or out-of-bounds thumbs when they overlap.
const clampRange = (
  val: number | readonly number[],
  min: number,
  max: number
): Ranges => {
  const [a, b] = val as number[];
  const lo = Math.min(Math.max(a, min), max);
  const hi = Math.min(Math.max(b, min), max);
  return lo <= hi ? [lo, hi] : [hi, lo];
};

const pct = (v: number) => `${v.toFixed(2)}%`;

const FILTER_GROUPS: { label: string; filters: FilterDef[] }[] = [
  {
    label: "General",
    filters: [
      { key: "age", label: "Age", format: formatAge, skewLow: true },
      {
        key: "value",
        label: "Current Value",
        format: (v) => `$${clipFloat(v)}`,
        skewLow: true,
      },
    ],
  },
  {
    label: "Performance",
    filters: [
      { key: "apr", label: "APR", format: pct },
      { key: "moic", label: "MOIC", format: formatMultiple },
      { key: "dpi", label: "DPI", format: formatMultiple },
    ],
  },
  {
    label: "Parameters",
    filters: [
      { key: "spread", label: "Spread", format: pct },
      { key: "fee", label: "Reward Strategy", format: pct },
      { key: "tightness", label: "Tightness", format: pct },
    ],
  },
];

const FILTERS: FilterDef[] = FILTER_GROUPS.flatMap((g) => g.filters);

// Closed positions have no current value, so minimums apply only to open ones.
const defaultFilters = (
  domains: Record<FilterDim, Ranges>,
  status: FinRangeStatus
): Record<FilterDim, Ranges> => {
  const f = {} as Record<FilterDim, Ranges>;
  const applyFloors = status === "OPEN";
  FILTERS.forEach(({ key }) => {
    const [min, max] = domains[key];
    const floor =
      applyFloors && key === "age"
        ? Math.min(Math.max(min, MIN_AGE_DAYS), max)
        : applyFloors && key === "value"
          ? Math.min(Math.max(min, MIN_VALUE_USD), max)
          : min;
    f[key] = [floor, max];
  });
  return f;
};

const SortIcon: FC<{ col: SortKey; active: SortKey; dir: SortDir }> = ({
  col,
  active,
  dir,
}) =>
  active === col ? (
    dir === "asc" ? (
      <Icons.SortUp className="color-white ml-0.5 w-2 h-a" />
    ) : (
      <Icons.SortDown className="color-white ml-0.5 w-2 h-a" />
    )
  ) : null;

export const LeaderboardFallback: FC = () => (
  <div className="card p-3">
    <div className="table-sticky">
      <table className="table table--big condensed">
        <thead>
          <tr>
            <th>#</th>
            {COLUMNS.map((c) => (
              <th key={c.key} className={clsx({ "bg-grey-1": c.param })}>
                {c.label}
              </th>
            ))}
            <th />
          </tr>
        </thead>
        <tbody>
          {[...Array(8)].map((_, i) => (
            <tr key={`algo-skeleton-${i}`}>
              {[...Array(COLUMNS.length + 2)].map((__, j) => (
                <td key={j}>
                  <div className="skeleton h-1.5 w-6 br-2" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const LeaderboardAnalyticsFallback: FC<{ onRetry: () => void }> = ({
  onRetry,
}) => (
  <div className="card p-3 flex ai-c jc-c gap-2">
    <AnalyticsWarning onRetry={onRetry} />
  </div>
);

const LeaderboardInner: FC = () => {
  const [status, setStatus] = useState<FinRangeStatus>("OPEN");
  const [showFilters, setShowFilters] = useState(false);
  // Resolve pair contracts before loading the more expensive ranges query.
  const allPairsData = useLazyLoadQuery<AlgorithmicLeaderboardPairsQuery>(
    pairsQuery,
    {}
  );
  const pairOptions = useMemo<LeaderboardPairOption[]>(() => {
    const edges = allPairsData.finV3.pairs?.edges ?? [];
    const options = edges
      .map((e) => e?.node)
      .filter((n): n is NonNullable<typeof n> => !!n)
      .map((n) => ({
        key: `${n.assetBase.asset}/${n.assetQuote.asset}`,
        asset: { baseAsset: n.assetBase, quoteAsset: n.assetQuote },
        contract: n.address,
      }));
    const label = (o: LeaderboardPairOption) =>
      `${o.asset.baseAsset.metadata.symbol}/${o.asset.quoteAsset.metadata.symbol}`;
    return options.sort((a, b) => label(a).localeCompare(label(b)));
  }, [allPairsData]);
  const [pair, setPair] = useState<string>(ALL_PAIRS);
  const contracts = useMemo(
    () =>
      pair === ALL_PAIRS
        ? null
        : [pairOptions.find((option) => option.key === pair)?.contract].filter(
            (contract): contract is string => !!contract
          ),
    [pair, pairOptions]
  );
  const [q, load] = useQueryLoader<AlgorithmicLeaderboardQuery>(query);

  useEffect(() => {
    load({ status, count: PAGE_SIZE, contracts });
  }, [status, contracts, load]);

  if (!q) return <LeaderboardFallback />;
  return (
    <Suspense fallback={<LeaderboardFallback />}>
      <Content
        key={`${status}:${pair}`}
        q={q}
        status={status}
        setStatus={setStatus}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        pairOptions={pairOptions}
        pair={pair}
        setPair={setPair}
      />
    </Suspense>
  );
};

export const Leaderboard: FC = () => {
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => {
    retryAnalyticsConnection();
    setAttempt((a) => a + 1);
  }, []);

  return (
    <AnalyticsBoundary
      key={attempt}
      fallback={<LeaderboardAnalyticsFallback onRetry={retry} />}
      loading={<LeaderboardFallback />}>
      <LeaderboardInner />
    </AnalyticsBoundary>
  );
};

type Ranges = [number, number];

const Content: FC<{
  q: PreloadedQuery<AlgorithmicLeaderboardQuery>;
  status: FinRangeStatus;
  setStatus: (s: FinRangeStatus) => void;
  showFilters: boolean;
  setShowFilters: (fn: (s: boolean) => boolean) => void;
  pairOptions: LeaderboardPairOption[];
  pair: string;
  setPair: (p: string) => void;
}> = ({
  q,
  status,
  setStatus,
  showFilters,
  setShowFilters,
  pairOptions,
  pair,
  setPair,
}) => {
  const queryData = usePreloadedQuery<AlgorithmicLeaderboardQuery>(query, q);
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    AlgorithmicLeaderboardPaginationQuery,
    AlgorithmicLeaderboard_query$key
  >(rangesFragment, queryData);

  const rows = useMemo(
    () =>
      (data.finV3.ranges?.edges ?? [])
        .map((e) => e?.node)
        .filter((n): n is RangeNode => !!n)
        .map(toRow),
    [data]
  );

  const domains = useMemo(() => {
    const d = {} as Record<FilterDim, Ranges>;
    FILTERS.forEach(({ key }) => {
      const vals = rows
        .map((r) => r.nums[key])
        .filter((value): value is number => value !== null);
      const min = vals.length ? Math.min(...vals) : 0;
      const max = vals.length ? Math.max(...vals) : 0;
      d[key] = [min, max === min ? min + 1 : max];
    });
    return d;
  }, [rows]);

  // Untouched filters follow the domain as more pages arrive.
  const [touched, setTouched] = useState<Partial<Record<FilterDim, Ranges>>>(
    {}
  );
  const filters = useMemo<Record<FilterDim, Ranges>>(
    () => ({ ...defaultFilters(domains, status), ...touched }),
    [domains, status, touched]
  );
  const [sortKey, setSortKey] = useState<SortKey>("apr");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sortValue = (r: Row): number | string | null => {
    if (sortKey === "pair") return r.baseSymbol;
    if (sortKey === "owner") return r.node.owner;
    if (sortKey === "range") return r.nums.low;
    return r.nums[sortKey];
  };

  const visible = useMemo(() => {
    const filtered = rows.filter((r) =>
      FILTERS.every(({ key }) => {
        const [lo, hi] = filters[key];
        const value = r.nums[key];
        return value !== null && value >= lo && value <= hi;
      })
    );
    filtered.sort((a, b) => {
      const av = sortValue(a);
      const bv = sortValue(b);
      if (av === null) return bv === null ? 0 : 1;
      if (bv === null) return -1;
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      const an = typeof av === "number" ? av : -Infinity;
      const bn = typeof bv === "number" ? bv : -Infinity;
      return sortDir === "asc" ? an - bn : bn - an;
    });
    return filtered.slice(0, DISPLAY_LIMIT);
  }, [rows, filters, sortKey, sortDir]);

  const backfilling =
    visible.length < DISPLAY_LIMIT && hasNext && rows.length < MAX_POOL;

  useEffect(() => {
    if (!backfilling || isLoadingNext) return;
    const t = setTimeout(() => loadNext(PAGE_SIZE), BACKFILL_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [backfilling, isLoadingNext, loadNext, visible.length, rows.length]);

  return (
    <>
      <div className="card px-3 py-2 flex ai-c wrap gap-2">
        <Button
          className="button--sm button--outline button--grey"
          label={showFilters ? "Hide filters" : "Filters"}
          onClick={() => setShowFilters((s) => !s)}>
          <Icons.Sliders className="w-2 h-2 ml-0.5" />
        </Button>
        <button
          className="transparent flex ai-c gap-0.5 color-grey hover-white fs-12 fw-500 pointer"
          onClick={() => {
            setTouched({});
            setPair(ALL_PAIRS);
          }}>
          <Icons.Undo className="w-2 h-2" />
          <span>Reset filters</span>
        </button>
        <Toggle
          className="toggle--sm ml-a"
          labelOff="Closed"
          label="Open"
          checked={status === "OPEN"}
          onChange={(e) => setStatus(e.target.checked ? "OPEN" : "CLOSED")}
        />
        {showFilters && (
          <FilterPanel
            domains={domains}
            filters={filters}
            setFilters={setTouched}
            pairOptions={pairOptions}
            pair={pair}
            setPair={setPair}
          />
        )}
      </div>

      <div className="card px-3 pt-2 pb-3 algorithmic-leaderboard">
        <div className="table-overflow">
          <table className="table nowrap table--spaced group-column-table condensed">
            <thead>
              <tr>
                <th colSpan={3} />
                <th colSpan={3} className="text-center nopad">
                  <div className="group-column-table__group-header bg-grey-1 text-center fs-12 color-grey fw-400">
                    Performance
                  </div>
                </th>
                <th />
                <th colSpan={4} className="text-center nopad">
                  <div className="group-column-table__group-header bg-grey-1 text-center fs-12 color-grey fw-400">
                    Parameters
                  </div>
                </th>
                <th colSpan={2} style={{ boxShadow: "none" }} />
              </tr>
              <tr>
                <th>#</th>
                {COLUMNS.map((c) => (
                  <th
                    key={c.key}
                    className={clsx("pointer", {
                      "text-right": c.align === "right",
                      "text-center": c.align === "center",
                      "bg-grey-1": c.param || !!c.group,
                      "group-column-table__group-start": c.group === "start",
                      "group-column-table__group-end": c.group === "end",
                      "algorithmic-leaderboard__pair-col": c.key === "pair",
                    })}
                    onClick={() => toggleSort(c.key)}>
                    <div
                      className={clsx("flex ai-c gap-0.5 pointer", {
                        "jc-e": c.align === "right",
                        "jc-c": c.align === "center",
                        "color-white": sortKey === c.key,
                      })}>
                      {c.tooltip ? (
                        <span
                          style={{ textDecoration: "underline dotted " }}
                          className="iflex ai-c gap-0.5"
                          data-tooltip-id="global-tip"
                          data-tooltip-html={c.tooltip}>
                          {c.label}
                        </span>
                      ) : (
                        c.label
                      )}
                      <SortIcon col={c.key} active={sortKey} dir={sortDir} />
                    </div>
                  </th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {visible.map((row, i) => (
                <RangeRow
                  key={row.node.id}
                  row={row}
                  rank={i + 1}
                  status={status}
                />
              ))}
              {isLoadingNext && (
                <tr>
                  <td
                    colSpan={COLUMNS.length + 2}
                    className="text-center color-grey p-3">
                    Searching more positions…
                  </td>
                </tr>
              )}
              {visible.length === 0 && !backfilling && (
                <tr>
                  <td
                    colSpan={COLUMNS.length + 2}
                    className="text-center color-grey p-3">
                    No positions match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const FilterPanel: FC<{
  domains: Record<FilterDim, Ranges>;
  filters: Record<FilterDim, Ranges>;
  setFilters: (
    fn: (
      f: Partial<Record<FilterDim, Ranges>>
    ) => Partial<Record<FilterDim, Ranges>>
  ) => void;
  pairOptions: LeaderboardPairOption[];
  pair: string;
  setPair: (p: string) => void;
}> = ({ domains, filters, setFilters, pairOptions, pair, setPair }) => (
  <div className="w-full flex dir-c gap-2 mb-1">
    {FILTER_GROUPS.map(({ label: groupLabel, filters: groupFilters }) => (
      <div key={groupLabel}>
        <h4 className="fs-14 condensed fw-400 mb-1">{groupLabel}</h4>
        <div className="row wrap gap-y-2 pad">
          {groupLabel === "General" && (
            <div className="col-12 col-md-6 col-lg-4">
              <PairSelect options={pairOptions} pair={pair} setPair={setPair} />
            </div>
          )}
          {groupFilters.map(({ key, label, format, skewLow }) => {
            const [min, max] = domains[key];
            const [lo, hi] = filters[key];
            const slider = skewLow
              ? {
                  min: 0,
                  max: 1,
                  step: 0.001,
                  value: [
                    toSkewedPos(lo, min, max),
                    toSkewedPos(hi, min, max),
                  ] as Ranges,
                  onChange: (val: number | readonly number[]) => {
                    const [p0, p1] = clampRange(val, 0, 1);
                    setFilters((f) => ({
                      ...f,
                      [key]: [
                        fromSkewedPos(p0, min, max),
                        fromSkewedPos(p1, min, max),
                      ] as Ranges,
                    }));
                  },
                }
              : {
                  min,
                  max,
                  step: (max - min) / 100 || 1,
                  value: [lo, hi] as Ranges,
                  onChange: (val: number | readonly number[]) =>
                    setFilters((f) => ({
                      ...f,
                      [key]: clampRange(val, min, max),
                    })),
                };
            return (
              <div key={key} className="col-12 col-md-6 col-lg-4">
                <div className="flex ai-c jc-sb mb-1">
                  <label className="fs-14 condensed color-grey fw-500">
                    {label}
                  </label>
                  <span className="fs-14 condensed color-white mono">
                    {format(lo)} – {format(hi)}
                  </span>
                </div>
                <Slider {...slider} minDistance={0} />
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </div>
);

const RangeCell: FC<{ node: RangeNode; status: FinRangeStatus }> = ({
  node,
  status,
}) => {
  const low = BigInt(node.low);
  const high = BigInt(node.high);
  if (status === "CLOSED") return <SimpleRange low={low} high={high} />;
  const current = BigInt(node.price);
  return current >= low && current <= high ? (
    <InRange current={current} low={low} high={high} />
  ) : (
    <OutOfRange current={current} low={low} high={high} />
  );
};

const RangeRow: FC<{ row: Row; rank: number; status: FinRangeStatus }> = ({
  row,
  rank,
  status,
}) => {
  const { t } = useTranslation("common");
  const { toRoot } = useLocale();
  const { node, baseSymbol, quoteSymbol, valueQuote } = row;
  const { assetBase, assetQuote } = node.pair;
  const a = node.analytics;
  const noYield = BigInt(node.fee) === 0n;

  const copyTo = toRoot(
    `/trade/${assetToTradeUrlSegment(assetBase)}/${assetToTradeUrlSegment(
      assetQuote
    )}${cclCopyParams({
      low: BigInt(node.low),
      high: BigInt(node.high),
      spread: BigInt(node.spread),
      fee: BigInt(node.fee),
    })}`
  );

  return (
    <tr>
      <td className="color-grey">#{rank}</td>

      <td className="algorithmic-leaderboard__pair-col">
        <div className="flex ai-c">
          <div className="lp">
            <IconDenom denom={baseSymbol} />
            <IconDenom denom={quoteSymbol} />
          </div>
          <div className="condensed fw-500 ml-1 nowrap flex fs-18 ai-b">
            <AssetLabel
              asset={assetBase}
              Container={({ children }) => (
                <small className="color-grey">{children}</small>
              )}
            />
            <div className="color-grey ml-0.5">
              <AssetLabel
                asset={assetQuote}
                Container={({ children }) => (
                  <small className="color-grey">{children}</small>
                )}
              />
            </div>
          </div>
        </div>
      </td>

      <td className="nowrap">
        {a && row.ageValid ? formatAge(row.nums.age) : "—"}
      </td>

      <td className="text-right mono group-column-table__group-start bg-grey-1">
        {noYield ? (
          <span className="color-grey">{t("compounding")}</span>
        ) : (
          formatBigintPercent(BigInt(a?.apr ?? 0n))
        )}
      </td>
      <td className="text-right mono bg-grey-1">
        {formatMultiple(row.nums.moic)}
      </td>
      <td className="text-right mono group-column-table__group-end bg-grey-1">
        {formatMultiple(row.nums.dpi)}
      </td>

      <td className="text-right">
        <div className="flex dir-c ai-e w-full">
          <Decimal
            amount={valueQuote}
            symbol={quoteSymbol}
            decimals={assetQuote.metadata.decimals}
            className="fs-16 condensed fw-500"
            clip
          />
          <Fiat
            amount={BigInt(node.valueUsd)}
            symbol="$"
            decimals={8}
            className="color-grey fs-12 condensed"
          />
        </div>
      </td>

      <td className="mono group-column-table__group-start bg-grey-1">
        <RangeCell node={node} status={status} />
      </td>
      <td className="text-right mono bg-grey-1">
        {row.nums.tightness === null ? "—" : pct(row.nums.tightness)}
      </td>
      <td className="text-right mono bg-grey-1">
        {formatBigintPercent(BigInt(node.spread))}
      </td>
      <td className="text-right mono group-column-table__group-end bg-grey-1">
        {noYield || row.nums.fee === null ? (
          <span className="color-grey">&mdash;</span>
        ) : (
          pct(row.nums.fee)
        )}
      </td>

      <td className="mono color-grey nowrap">{row.ownerShort}</td>

      <td>
        <div className="flex ai-c gap-1">
          <Link
            to={copyTo}
            className="button button--xs button--outline button--blue w-full button--icon-right nowrap">
            Copy
            <Icons.AngleRight />
          </Link>
          <RangePositionShareButton
            copyUrl={siteOrigin() + copyTo}
            baseLabel={assetLabel(assetBase)}
            quoteLabel={assetLabel(assetQuote)}
            low={node.low}
            high={node.high}
            current={node.price}
            spread={node.spread}
            fee={node.fee}
            apr={a?.apr}
            ageDays={a && row.ageValid ? row.nums.age : null}
            shareMsg={t("shareMsgOtherPosition", {
              base: assetLabel(assetBase),
              quote: assetLabel(assetQuote),
            })}
          />
        </div>
      </td>
    </tr>
  );
};
