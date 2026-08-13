import { FC, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { graphql, usePreloadedQuery, useQueryLoader } from "react-relay";
import { Fiat, IconDenom, nFormatter, useTranslation } from "rujira.ui";
import {
  ChartQuery,
  ChartQuery$data,
} from "./__generated__/ChartQuery.graphql";
import { ChartFallback } from "./ChartFallback";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { priceFormatter } from "rujira.js";
import { DailyChange } from "./Common";

const query = graphql`
  query ChartQuery(
    $first: Int!
    $from: Timestamp!
    $to: Timestamp!
    $resolution: Resolution!
    $id: ID!
  ) {
    node(id: $id) {
      ... on IndexVault {
        id
        navBins(first: $first, from: $from, to: $to, resolution: $resolution) {
          edges {
            node {
              bin
              open
              tvl
            }
          }
        }
        shareAsset {
          metadata {
            symbol
          }
        }
        status {
          nav
          navPerShare
          navPerShareChange
          navChange
          redemptionRate
        }
        config {
          quoteAsset {
            metadata {
              symbol
            }
          }
        }
      }
    }
  }
`;

type NavBin = {
  day: string;
  nav: number;
};

type Resolution = "1D" | "1M" | "12M";

export const Chart: FC<{
  id: string;
}> = ({ id }) => {
  const [first, setFirst] = useState<number>(30);
  const [from, setFrom] = useState<string>(
    new Date(Date.now() - first * 24 * 60 * 60 * 1000).toISOString()
  );
  const [to, setTo] = useState<string>(new Date().toISOString());
  const [resolution, setResolution] = useState<Resolution>("1D");

  return (
    <div className="index__chartContainer card card--shadow">
      <Suspense fallback={<ChartFallback />}>
        <QueryProvider
          id={id}
          first={first}
          from={from}
          to={to}
          resolution={resolution}
          setFirst={setFirst}
          setFrom={setFrom}
          setTo={setTo}
          setResolution={setResolution}
        />
      </Suspense>
    </div>
  );
};

type QueryProviderProps = {
  id: string;
  first: number;
  from: string;
  to: string;
  resolution: Resolution;
  setFirst: (n: number) => void;
  setFrom: (s: string) => void;
  setTo: (s: string) => void;
  setResolution: (r: Resolution) => void;
};

const QueryProvider: FC<QueryProviderProps> = ({
  id,
  first,
  from,
  to,
  resolution,
  // setFirst,
  // setFrom,
  // setTo,
  // setResolution,
}) => {
  const [q, loadQuery] = useQueryLoader<ChartQuery>(query);

  useEffect(() => {
    if (!id) return;
    loadQuery(
      { id, first, from, to, resolution },
      { fetchPolicy: "store-and-network" }
    );
  }, [id, first, from, to, resolution, loadQuery]);

  return q ? (
    <Content
      q={q}
      // first={first}
      // from={from}
      // to={to}
      resolution={resolution}
      // setFirst={setFirst}
      // setFrom={setFrom}
      // setTo={setTo}
      // setResolution={setResolution}
    />
  ) : null;
};

type ContentProps = {
  q: Parameters<typeof usePreloadedQuery<ChartQuery>>[1];
  // first: number;
  // from: string;
  // to: string;
  resolution: Resolution;
  // setFirst: (n: number) => void;
  // setFrom: (s: string) => void;
  // setTo: (s: string) => void;
  // setResolution: (r: Resolution) => void;
};

function edges(data: ChartQuery$data, type: "nav" | "tvl" = "nav"): NavBin[] {
  const bins = data.node?.navBins?.edges ?? [];
  const rawKey = type === "nav" ? "open" : "tvl";
  const divisor = type === "nav" ? 1_000_000_000_000 : 100_000_000;

  const historicalData = bins
    .map((bin) => {
      const raw = (bin?.node || {})[rawKey] ?? 0;
      const formatted = (Number(BigInt(raw)) / divisor).toFixed(2);

      return {
        day: new Date(bin?.node?.bin || "").toISOString(),
        nav: Number(formatted),
      };
    })
    .filter((b): b is NavBin => typeof b.day === "string");

  return historicalData;
}

function getNiceStep(rawStep: number): number {
  // Find 10^exponent so that rawStep / exponent is in [1, 10)
  const exponent = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const fraction = rawStep / exponent; // in [1, 10)
  let niceMultiplier: number;

  if (fraction <= 1) {
    niceMultiplier = 1;
  } else if (fraction <= 2) {
    niceMultiplier = 2;
  } else if (fraction <= 5) {
    niceMultiplier = 5;
  } else {
    niceMultiplier = 10;
  }

  return niceMultiplier * exponent;
}

function computeYAxis(navValues: number[], targetTickCount = 5) {
  const rawMin = Math.min(...navValues);
  const rawMax = Math.max(...navValues);

  // buffer 5% below min, 5% above max
  const bufferedMin = rawMin * 0.95;
  const bufferedMax = rawMax * 1.05;

  // step between min & max given count
  const rawStep = (bufferedMax - bufferedMin) / (targetTickCount - 1);
  const step = getNiceStep(rawStep);

  // snap the buffered limits to multiples of that step
  const yMin = Math.floor(bufferedMin / step) * step;
  const yMax = Math.ceil(bufferedMax / step) * step;

  // build ticks immutably—no pushes
  const count = Math.floor((yMax - yMin) / step) + 1;
  const ticks = Array.from({ length: count }, (_, i) => yMin + step * i);

  return { yMin, yMax, ticks };
}

const Content: FC<ContentProps> = ({
  q,
  resolution,
  // setFirst,
  // setFrom,
  // setResolution,
}) => {
  const data = usePreloadedQuery(query, q);
  const { t } = useTranslation();
  const percentageChangePrice = BigInt(
    data?.node?.status?.navPerShareChange || 0
  );
  const percentageChangeTvl = BigInt(data?.node?.status?.navChange || 0);

  const [navOrTvl, setNavOrTvl] = useState<"nav" | "tvl">("nav");
  // Responsive chart container
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>(285);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateHeight = () => {
      setContainerHeight(el.offsetHeight);
    };
    updateHeight();

    // if the browser supports it, use ResizeObserver
    if (typeof window.ResizeObserver === "function") {
      const ro = new window.ResizeObserver(updateHeight);
      ro.observe(el);
      return () => {
        ro.disconnect();
      };
    }
    // otherwise, fall back to listening for window.resize
    window.addEventListener("resize", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  const points = useMemo(() => {
    const pts = edges(data, navOrTvl);
    if (pts.length === 0) {
      // Use two default points with day as now and now-1d
      const now = new Date();
      const prev = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return [
        { day: prev.toISOString(), nav: 0 },
        { day: now.toISOString(), nav: 0 },
      ];
    }

    return pts;
  }, [data, navOrTvl]);

  const navValues = useMemo(() => points.map((d) => d.nav), [points]);
  const { yMin, yMax, ticks } = useMemo(
    () => computeYAxis(navValues),
    [navValues]
  );

  return (
    <div className="col-12 mt-lg-0 pr-md-2 pr-lg-5">
      <div className="col-12 flex jc-sb ai-c index__chart-header">
        <div className="index__trade__header h-full px-md-3 pt-md-2 pb-md-3 flex dir-r jc-sb">
          <div className="index__trade__header-pair">
            <IconDenom
              denom={data.node?.shareAsset?.metadata.symbol || ""}
              className="denom"
            />
            <h1 className="pr-2">{data.node?.shareAsset?.metadata.symbol}</h1>
          </div>
          <div className="index__trade__header-stat">
            <h4>{t("price")}</h4>
            <h3 className="color-white">
              $ {priceFormatter(BigInt(data.node?.status?.navPerShare || "0"))}
            </h3>
          </div>
          <div className="break break--tabs"></div>
          <div className="index__trade__header-stat">
            <h4>{t("dailyChange")}</h4>
            <DailyChange percentageChange={percentageChangePrice} />
          </div>
          <div className="index__trade__header-stat">
            <h4>{t("tvl")}</h4>
            <Fiat
              amount={BigInt(data.node?.status?.nav || 0)}
              symbol="$"
              decimals={8}
            />
          </div>
          <div className="index__trade__header-stat">
            <h4>{t("dailyChange")}</h4>
            <DailyChange percentageChange={percentageChangeTvl} />
          </div>
          <div className="index__tabs">
            <ChartToggle navOrTvl={navOrTvl} setNavOrTvl={setNavOrTvl} />
            {/* <a
            className={resolution === "1D" ? "selected ml-xs-3" : "ml-xs-3"}
            onClick={() => {
              setResolution("1D");
              setFirst(30);
              setFrom(
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
              );
            }}>
            {i18n.t("1D")}
          </a>
          <a
            className={resolution === "1M" ? "selected" : ""}
            onClick={() => {
              setResolution("1M");
              setFirst(12);
              setFrom(
                new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
              );
            }}>
            {i18n.t("1M")}
          </a>
          <a
            className={resolution === "12M" ? "selected" : ""}
            onClick={() => {
              setResolution("12M");
              setFirst(5);
              setFrom(
                new Date(
                  Date.now() - 5 * 365 * 24 * 60 * 60 * 1000
                ).toISOString()
              );
            }}>
            {i18n.t("12M")}
          </a> */}
          </div>
        </div>
      </div>
      <ResponsiveContainer
        width="100%"
        height={containerHeight}
        className="my-a mono fs-12 mt-1 pr-1">
        <AreaChart
          width={500}
          height={containerHeight}
          data={points}
          margin={{
            top: 10,
            right: 5,
            left: 0,
            bottom: 0,
          }}>
          <XAxis
            stroke="#607d8b"
            tick={{ fill: "#ffffff", dy: 8 }}
            fontSize={10}
            dataKey="day"
            tickFormatter={(e) => {
              const date = new Date(e);
              if (resolution === "12M") {
                return date.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                });
              }
              return date.toLocaleDateString(undefined, {
                month: "short",
                day: "2-digit",
              });
            }}
            interval={"preserveStartEnd"}
          />
          <YAxis
            stroke="#607d8b"
            tick={
              points.length === 2 && points.every((p) => p.nav === 0)
                ? false
                : { fill: "#ffffff", dx: -4 }
            }
            fontSize={10}
            tickFormatter={(e) => {
              if (e === 0) return "$\u00A00.00";
              return "$\u00A0" + nFormatter(e as unknown as bigint, 2, 0);
            }}
            domain={[yMin, yMax]}
            ticks={ticks}
          />
          <Tooltip content={<CustomTooltip mode={navOrTvl} />} />
          <Area
            type="monotone"
            dataKey="nav"
            stroke="#8436F5"
            fill="#8436F5"
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  mode: "nav" | "tvl";
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  mode,
}) => {
  const { t } = useTranslation("index");

  if (!active || !payload?.length) {
    return null;
  }

  // Parse and format the label as a date if possible
  const rawLabel = String(label ?? "");
  const parsedDate = new Date(rawLabel);
  const isValidDate = !isNaN(parsedDate.getTime());
  const displayDate = isValidDate ? parsedDate.toLocaleDateString() : rawLabel;

  // Extract the first data point
  const { value } = payload[0];
  const formattedValue =
    typeof value === "number"
      ? value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "—";

  return (
    <div className="custom-tooltip p-2 rounded shadow-md">
      <p className="fs-14 condensed fw-500 mb-1">
        <strong>{t("date")}:</strong> {displayDate}
      </p>
      <p className="fs-14 condensed fw-500 m-0">
        <strong>{mode === "nav" ? t("redemptionPrice") : t("tvl")}:</strong>{" "}
        {mode === "tvl" ? "$ " : ""}
        {formattedValue}
      </p>
    </div>
  );
};

const ChartToggle: FC<{
  navOrTvl: "nav" | "tvl";
  setNavOrTvl: (v: "nav" | "tvl") => void;
}> = ({ navOrTvl, setNavOrTvl }) => {
  const { t } = useTranslation();
  return (
    <>
      <a
        className={navOrTvl === "nav" ? "selected" : ""}
        onClick={() => setNavOrTvl("nav")}>
        {t("price")}
      </a>
      <a
        className={navOrTvl === "tvl" ? "selected" : ""}
        onClick={() => setNavOrTvl("tvl")}>
        {t("tvl")}
      </a>
    </>
  );
};
