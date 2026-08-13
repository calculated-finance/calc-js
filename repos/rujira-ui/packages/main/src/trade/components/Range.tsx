import {
  DrawingEventType,
  EntityId,
  IChartingLibraryWidget,
  VisibleTimeRange,
} from "charting_library";
import clsx from "clsx";
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFragment, useRelayEnvironment } from "react-relay";
import { useLocation, useNavigate } from "react-router-dom";
import { graphql, requestSubscription } from "relay-runtime";
import { Account, MsgExecute } from "rujira.js";
import {
  bigIntToDecimalString,
  clipFloat,
  fiatize,
  Icons,
  Numeric,
  Slider,
  useTranslation,
} from "rujira.ui";
import { coin } from "../../../../rujira.js/src/signers/cosmos";
import { BalanceProvider } from "../../common/components/Balance";
import { MsgProvider, TxButton } from "../../common/components/TxButton";
import { useAccounts } from "../../services/accounts";
import {
  CCL_INITIAL_PARAM_KEYS,
  DEFAULT_CCL_SETTING,
  expandShortTradeParams,
  parseCclSettingParam,
  parseCclUrlParams,
  parseTradeUrlState,
  searchFromParams,
} from "../tradeUrlState";
import type { CclSetting } from "../tradeUrlState";
import { useClampedPair } from "../hooks/useClampedPair";
import { RangeDepositResolver } from "./RangeDepositResolver.tsx";
import { useRangeDistribution } from "../hooks/useRangeDistribution";
import { adjust } from "../utils";
import { RangeDepositFragment$key } from "./__generated__/RangeDepositFragment.graphql";
import { RangeFragment$key } from "./__generated__/RangeFragment.graphql";
import { RangeInputsFragment$key } from "./__generated__/RangeInputsFragment.graphql";
import { useTradeContext } from "./Context";
import { InputQuantity } from "./InputQuantity";
import { RangeBalanceWarning } from "./RangeBalanceWarning.tsx";

const red = "#e53935";
const redBg = "rgba(229, 57, 53, 0.1)";
const green = "#60fbd0";
const greenBg = "rgba(96, 251, 208, 0.1)";
const grey = "rgba(113, 144, 159, 0.5)";

const overrides = {
  extendRight: true,
  extendLeft: true,
  linewidth: 1,
  fillBackground: false,
  level1: { visible: false },
  level2: { color: green, visible: true },
  level3: { visible: false },
  level4: { visible: false },
  level5: { visible: false },
  level6: { color: red, visible: true },
  level7: { visible: false },
};

const overridesHigh = {
  ...overrides,
  fillBackground: true,
  level2: { color: grey, visible: true },
  level6: { color: red, visible: true },
  backgroundColor: redBg,
};

const overridesLow = {
  ...overrides,
  fillBackground: true,
  level2: { color: green, visible: true },
  level6: { color: grey, visible: true },
  backgroundColor: greenBg,
};

export enum Preset {
  Passive = "Passive",
  Wide = "Wide",
  Tight = "Tight",
  Lower = "Lower",
  Higher = "Higher",
  Copy = "Copy",
}

const PRESET_BY_CCL_SETTING: Partial<Record<CclSetting, Preset>> = {
  passive: Preset.Passive,
  wide: Preset.Wide,
  tight: Preset.Tight,
  lower: Preset.Lower,
  higher: Preset.Higher,
};

const PRESET_PARAMETERS: Partial<
  Record<Preset, { spread: bigint; fee: bigint; skew: number }>
> = {
  [Preset.Passive]: {
    spread: 4n * 10n ** 9n,
    fee: (4n * 10n ** 9n * 98n) / 100n,
    skew: 0,
  },
  [Preset.Wide]: {
    spread: 3n * 10n ** 9n,
    fee: (3n * 10n ** 9n * 98n) / 100n,
    skew: 0,
  },
  [Preset.Tight]: {
    spread: 25n * 10n ** 8n,
    fee: (25n * 10n ** 8n * 98n) / 100n,
    skew: 0,
  },
  [Preset.Lower]: {
    spread: 2n * 10n ** 9n,
    fee: (2n * 10n ** 9n * 98n) / 100n,
    skew: 0,
  },
  [Preset.Higher]: {
    spread: 2n * 10n ** 9n,
    fee: (2n * 10n ** 9n * 98n) / 100n,
    skew: 0,
  },
};
const WIDE_PARAMETERS = PRESET_PARAMETERS[Preset.Wide]!;

type RangeSetter<T> = (v: T) => void;

const tickAlign = (price: bigint | undefined, tick: number) =>
  price === undefined ? undefined : adjust(price, tick);

const getInitialCclState = (search: string) => {
  const params = expandShortTradeParams(new URLSearchParams(search));
  const state = parseTradeUrlState(params);
  const isActive = state.type === "automated" && state.strategy === "ccl";
  const setting = isActive
    ? parseCclSettingParam(params.get("setting"))
    : DEFAULT_CCL_SETTING;

  return {
    hasParams:
      isActive && CCL_INITIAL_PARAM_KEYS.some((key) => params.has(key)),
    setting,
    values: isActive && setting === "custom" ? parseCclUrlParams(params) : {},
  };
};

const presetForCclSetting = (setting: CclSetting) =>
  setting === "custom" ? null : (PRESET_BY_CCL_SETTING[setting] ?? Preset.Wide);

const pctFromFee = (fee: bigint, spread: bigint) => {
  if (spread <= 0n) return 0;

  return Math.max(0, Math.min(98, Number((fee * 100n) / spread)));
};

const rangeForPreset = (
  preset: Preset,
  price: bigint,
  tight: [bigint, bigint],
  bestAsk?: bigint,
  bestBid?: bigint
): [bigint, bigint] => {
  switch (preset) {
    case Preset.Passive:
      return [price / 200n, price * 21n];
    case Preset.Wide:
      return [price / 2n, price * 2n];
    case Preset.Tight:
      return tight;
    case Preset.Lower: {
      const high = bestBid ?? price;
      return [high / 2n, high];
    }
    case Preset.Higher: {
      const low = bestAsk ?? price;
      return [low, low * 2n];
    }
    case Preset.Copy:
      throw new Error(`Copy Range not implemented`);
  }
};

export interface RangeContext {
  high?: bigint;
  low?: bigint;
  setHigh: RangeSetter<bigint>;
  setLow: RangeSetter<bigint>;
  enabled: boolean;
  preset: Preset | null;
  setPreset: (v: Preset | null) => void;
  spread: bigint;
  setSpread: RangeSetter<bigint>;
  fee: bigint;
  setFee: RangeSetter<bigint>;
  skew: number;
  setSkew: RangeSetter<number>;
  pct: number;
  setPct: (v: number) => void;
  price?: bigint;
  tick: number;
}

export const priceFragment = graphql`
  fragment RangeFragment on FinPair {
    id
    tick
    bookV2 {
      id
      center
      bestAsk: asks(first: 1) {
        edges {
          node {
            price
          }
        }
      }
      bestBid: bids(first: 1) {
        edges {
          node {
            price
          }
        }
      }
    }
    candles(
      after: $rangeAfter
      before: $rangeBefore
      last: 90
      resolution: "1D"
    ) {
      edges {
        node {
          close
          high
          low
        }
      }
    }
  }
`;

const subscription = graphql`
  subscription RangePriceSubscription($id: ID!) {
    node(id: $id) {
      ... on FinBookV2 {
        center
        bestAsk: asks(first: 1) {
          edges {
            node {
              price
            }
          }
        }
        bestBid: bids(first: 1) {
          edges {
            node {
              price
            }
          }
        }
      }
    }
  }
`;

const context = createContext<RangeContext>({
  setHigh: () => {},
  setLow: () => {},
  enabled: false,
  preset: Preset.Wide,
  setPreset: () => {},
  spread: 0n,
  setSpread: () => {},
  fee: 0n,
  setFee: () => {},
  skew: 0,
  setSkew: () => {},
  pct: 0,
  setPct: () => {},
  tick: 0,
});

export const RangeContext: FC<
  PropsWithChildren<{ k: RangeFragment$key; enabled: boolean }>
> = ({ children, k, enabled }) => {
  const env = useRelayEnvironment();
  const location = useLocation();
  const navigate = useNavigate();
  const data = useFragment(priceFragment, k);
  const tick = Number(data.tick);
  const [initialCcl] = useState(() => getInitialCclState(location.search));

  const [high, setHigh] = useState<bigint | undefined>(() =>
    tickAlign(initialCcl.values.high, tick)
  );
  const [low, setLow] = useState<bigint | undefined>(() =>
    tickAlign(initialCcl.values.low, tick)
  );
  const [preset, setPresetValue] = useState<Preset | null>(
    presetForCclSetting(initialCcl.setting)
  );
  const [spread, setSpread] = useState(
    initialCcl.values.spread ?? WIDE_PARAMETERS.spread
  );
  const [fee, setFee] = useState(initialCcl.values.fee ?? WIDE_PARAMETERS.fee);
  const [pct, setPct] = useState(() =>
    pctFromFee(
      initialCcl.values.fee ?? WIDE_PARAMETERS.fee,
      initialCcl.values.spread ?? WIDE_PARAMETERS.spread
    )
  );
  const [skew, setSkew] = useState(WIDE_PARAMETERS.skew);

  useEffect(() => {
    if (!initialCcl.hasParams) return;

    const nextParams = new URLSearchParams(location.search);
    if (!CCL_INITIAL_PARAM_KEYS.some((key) => nextParams.has(key))) return;

    CCL_INITIAL_PARAM_KEYS.forEach((key) => nextParams.delete(key));
    navigate(
      `${location.pathname}${searchFromParams(nextParams)}${location.hash}`,
      { replace: true }
    );
  }, [
    initialCcl.hasParams,
    location.hash,
    location.pathname,
    location.search,
    navigate,
  ]);

  useEffect(() => {
    const sub = requestSubscription(env, {
      subscription,
      variables: { id: data.bookV2.id },
    });

    return () => {
      sub.dispose();
    };
  }, [env, data.bookV2.id]);
  const price = data.bookV2.center || 0n;

  useEffect(() => {
    if (!preset) return;
    const params = PRESET_PARAMETERS[preset];
    if (!params) return;

    setSpread(params.spread);
    setFee(params.fee);
    setSkew(params.skew);
  }, [preset, setFee, setSkew, setSpread]);

  useEffect(() => {
    setPct(pctFromFee(fee, spread));
  }, [fee, spread]);

  return (
    <context.Provider
      value={{
        setHigh,
        high,
        setLow,
        low,
        enabled,
        preset,
        setPreset: setPresetValue,
        fee,
        setFee,
        spread,
        setSpread,
        skew,
        setSkew,
        price,
        pct,
        setPct,
        tick,
      }}>
      {children}
    </context.Provider>
  );
};

export const useRangeContext = (): RangeContext => useContext(context);

export const useRangeDrawing = (k: RangeFragment$key) => {
  const ctx = useRangeContext();
  const [ids, setIds] = useState<[EntityId, EntityId, EntityId]>();
  const asksRef = useRef<EntityId[]>([]);
  const bidsRef = useRef<EntityId[]>([]);
  const [widget, setWidget] = useState<IChartingLibraryWidget>();
  const chart = useMemo(() => widget?.activeChart(), [widget]);
  const data = useFragment(priceFragment, k);
  const distribution = useRangeDistribution();
  const price = Number(ctx.price);

  const dataRef = useRef(data);
  const ctxLowRef = useRef(ctx.low);
  const ctxHighRef = useRef(ctx.high);
  useLayoutEffect(() => {
    dataRef.current = data;
  });
  useLayoutEffect(() => {
    ctxLowRef.current = ctx.low;
    ctxHighRef.current = ctx.high;
  });

  const low = Number(ctx.low || 0n);
  const high = Number(ctx.high || 0n);

  const clearBars = useCallback(() => {
    if (!chart) return;
    asksRef.current.forEach((x) => {
      try {
        chart.removeEntity(x);
      } catch (error) {}
    });
    bidsRef.current.forEach((x) => {
      try {
        chart.removeEntity(x);
      } catch (error) {}
    });
    asksRef.current = [];
    bidsRef.current = [];
  }, [chart]);

  useEffect(() => {
    const d = dataRef.current;
    const p = d.candles?.edges?.at(-1)?.node?.close;

    if (!p) return;
    if (
      !ctx.preset &&
      ctxLowRef.current !== undefined &&
      ctxHighRef.current !== undefined
    )
      return;

    const high90 = d.candles?.edges?.reduce((a: null | bigint, v) => {
      const high = v?.node?.high;
      if (!high) return a;
      if (!a) return high;
      return high > a ? high : a;
    }, null);
    const low90 = d.candles?.edges?.reduce((a: null | bigint, v) => {
      const low = v?.node?.low;
      if (!low) return a;
      if (!a) return low;
      return low < a ? low : a;
    }, null);

    const bestAsk = d.bookV2.bestAsk?.edges?.[0]?.node?.price;
    const bestBid = d.bookV2.bestBid?.edges?.[0]?.node?.price;

    const [l, h] = rangeForPreset(
      ctx.preset ?? Preset.Wide,
      p,
      [low90 || 0n, high90 || 0n],
      bestAsk,
      bestBid
    );

    const nextLow = adjust(l, Number(d.tick));
    const nextHigh = adjust(h, Number(d.tick));
    ctx.setLow(ctx.preset ? nextLow : (ctxLowRef.current ?? nextLow));
    ctx.setHigh(ctx.preset ? nextHigh : (ctxHighRef.current ?? nextHigh));
  }, [ctx.preset]);

  const points = useCallback(
    ({ from, to }: VisibleTimeRange) => [
      [
        { price: low, time: from },
        { price: low, time: to },
        { price, time: from },
      ],
      [
        { price, time: from },
        { price, time: to },
        { price: high, time: from },
      ],
      [
        { price: low, time: from },
        { price: low, time: to },
        { price: high, time: from },
      ],
    ],
    [high, low, price]
  );

  const setShapePoints = useCallback(
    (id: EntityId, nextPoints: ReturnType<typeof points>[number]) => {
      if (!chart) return false;
      if (!nextPoints) return false;
      try {
        chart.getShapeById(id).setPoints(nextPoints);
        return true;
      } catch (error) {
        return false;
      }
    },
    [chart]
  );

  const bars = useCallback(
    ({ from, to }: VisibleTimeRange) => {
      const PRECISION = 1_000_000_000_000;
      const width = (to - from) / 5;

      return [
        [...distribution.asks].reverse().map((x) => [
          {
            price: Math.round(x.pStart * PRECISION),
            time: to - (width * x.pct) / 10,
          },
          { price: Math.round(x.pEnd * PRECISION), time: to },
        ]),
        distribution.bids.map((x) => [
          {
            price: Math.round(x.pStart * PRECISION),
            time: to - (width * x.pct) / 10,
          },
          { price: Math.round(x.pEnd * PRECISION), time: to },
        ]),
      ];
    },
    [distribution]
  );

  useEffect(() => {
    if (!chart) return;

    let range: VisibleTimeRange | null = null;
    try {
      range = chart.getVisibleRange();
    } catch (error) {
      return;
    }
    if (!range) return;
    const [askPoints, bidPoints] = bars(range);

    if (!ctx.enabled) {
      clearBars();
      return;
    }

    if (
      asksRef.current.length === askPoints.length &&
      bidsRef.current.length === bidPoints.length &&
      asksRef.current.length > 0 &&
      bidsRef.current.length > 0
    ) {
      const asksOk = asksRef.current.every((x, idx) =>
        setShapePoints(x, askPoints[idx])
      );
      const bidsOk = bidsRef.current.every((x, idx) =>
        setShapePoints(x, bidPoints[idx])
      );
      if (asksOk && bidsOk) {
        return;
      }
      clearBars();
    }

    clearBars();

    let disposed = false;
    Promise.all(
      askPoints.map((x) =>
        chart.createMultipointShape(x, {
          shape: "rectangle",
          disableSelection: true,
          lock: true,
          showInObjectsTree: false,
          overrides: {
            extendRight: true,
            extendLeft: false,
            linewidth: 1,
            color: "rgba(0,0,0,0)",
            backgroundColor: red,
          },
        })
      )
    )
      .then((nextAsks) => {
        if (disposed) {
          nextAsks.forEach((x) => {
            try {
              chart.removeEntity(x);
            } catch (error) {}
          });
          return;
        }
        asksRef.current = nextAsks;
      })
      .catch(() => {});

    Promise.all(
      bidPoints.map((x) =>
        chart.createMultipointShape(x, {
          shape: "rectangle",
          disableSelection: true,
          lock: true,
          showInObjectsTree: false,
          overrides: {
            extendRight: true,
            extendLeft: false,
            linewidth: 1,
            color: "rgba(0,0,0,0)",
            backgroundColor: green,
          },
        })
      )
    )
      .then((nextBids) => {
        if (disposed) {
          nextBids.forEach((x) => {
            try {
              chart.removeEntity(x);
            } catch (error) {}
          });
          return;
        }
        bidsRef.current = nextBids;
      })
      .catch(() => {});

    return () => {
      disposed = true;
    };
  }, [chart, bars, clearBars, ctx.enabled, setShapePoints]);

  const init = useCallback(() => {
    if (!chart) return;

    let range: VisibleTimeRange | null = null;
    try {
      range = chart.getVisibleRange();
    } catch (error) {
      return;
    }
    if (!range) return;
    const [lowPoints, highPoints, overall] = points(range);
    if (ids) return;

    Promise.all([
      chart.createMultipointShape(lowPoints, {
        shape: "parallel_channel",
        disableSelection: true,
        lock: true,
        overrides: overridesLow,
        showInObjectsTree: false,
      }),
      chart.createMultipointShape(highPoints, {
        shape: "parallel_channel",
        disableSelection: true,
        lock: true,
        overrides: overridesHigh,
        showInObjectsTree: false,
      }),
      chart.createMultipointShape(overall, {
        shape: "parallel_channel",
        overrides,
        showInObjectsTree: false,
      }),
    ]).then(setIds);
  }, [chart, points, ids]);

  const applyPoints = useCallback(
    (range: VisibleTimeRange) => {
      if (!ids) return;
      if (!chart) return;
      const [nextLow, nextHigh, overall] = points(range);
      try {
        chart.getShapeById(ids[0]).setPoints(nextLow);
        chart.getShapeById(ids[1]).setPoints(nextHigh);
        chart.getShapeById(ids[2]).setPoints(overall);
      } catch (error) {}
    },
    [ids, chart, points]
  );

  const onVisibleRangeChanged = useCallback(
    (range: VisibleTimeRange) => {
      if (!range) return;
      applyPoints(range);
      if (!chart) return;
      const [askPoints, bidPoints] = bars(range);
      const asks = asksRef.current;
      const bids = bidsRef.current;

      const asksOk = asks.every((x, idx) => setShapePoints(x, askPoints[idx]));
      const bidsOk = bids.every((x, idx) => setShapePoints(x, bidPoints[idx]));
      if (!asksOk || !bidsOk) clearBars();
    },
    [applyPoints, bars, chart, clearBars, setShapePoints]
  );

  useEffect(() => {
    if (!chart) return;
    let range: VisibleTimeRange | null = null;
    try {
      range = chart.getVisibleRange();
    } catch (error) {
      return;
    }
    if (!range) return;
    applyPoints(range);
  }, [chart, applyPoints]);

  const onPointsChanged = useCallback(() => {
    if (!chart) return;
    if (!ids) return;
    const shapePoints = chart.getShapeById(ids[2]).getPoints();
    const handle: "left" | "middle" | "right" =
      shapePoints[0].price === low
        ? "right"
        : shapePoints[0].price === shapePoints[1].price
          ? "middle"
          : "left";

    const newLow = BigInt(
      Math.round(
        handle === "middle"
          ? shapePoints[0].price
          : handle === "left"
            ? shapePoints[0].price
            : shapePoints[1].price
      )
    );
    const newHigh = BigInt(
      Math.round(
        handle === "right"
          ? shapePoints[2].price + shapePoints[1].price - shapePoints[0].price
          : shapePoints[2].price
      )
    );

    if (newLow !== ctx.low || newHigh !== ctx.high) {
      ctx.setLow(adjust(newLow, Number(data.tick)));
      ctx.setHigh(adjust(newHigh, Number(data.tick)));
      ctx.setPreset(null);
    }
  }, [
    chart,
    ids,
    low,
    ctx.low,
    ctx.high,
    ctx.setLow,
    ctx.setHigh,
    ctx.setPreset,
    data.tick,
  ]);

  const onChange = useCallback(
    (sourceId: EntityId, drawingEventType: DrawingEventType) => {
      if (!ids?.includes(sourceId)) return;
      if (!chart) return;
      if (sourceId !== ids[2]) throw new Error(`Invalid ID ${sourceId}`);
      if (drawingEventType === "points_changed") onPointsChanged();
    },
    [onPointsChanged, ids, chart]
  );

  useEffect(() => {
    if (ctx.enabled) {
      !ids && init();
    } else {
      if (chart && ids) {
        try {
          chart.removeEntity(ids[0]);
        } catch (error) {}
        try {
          chart.removeEntity(ids[1]);
        } catch (error) {}
        try {
          chart.removeEntity(ids[2]);
        } catch (error) {}
        setIds(undefined);
      }
      clearBars();
    }
  }, [ctx.enabled, ids, init, chart, clearBars]);

  useEffect(() => {
    if (!widget) return;
    if (!chart) return;
    let dataSub: ReturnType<typeof chart.onDataLoaded> | undefined;
    let rangesub: ReturnType<typeof chart.onVisibleRangeChanged> | undefined;

    try {
      dataSub = chart.onDataLoaded();
      dataSub.subscribe(null, init, true);
    } catch (error) {
      return;
    }

    try {
      rangesub = chart.onVisibleRangeChanged();
      rangesub.subscribe(null, onVisibleRangeChanged);
    } catch (error) {}

    try {
      widget.subscribe("drawing_event", onChange);
    } catch (error) {}

    return () => {
      // Widget teardown order can race during pair switches, so cleanup must
      // tolerate subscriptions that are already invalidated by the library.
      try {
        dataSub?.unsubscribe(null, init);
      } catch (error) {}
      try {
        rangesub?.unsubscribe(null, onVisibleRangeChanged);
      } catch (error) {}
      try {
        widget.unsubscribe("drawing_event", onChange);
      } catch (error) {}
    };
  }, [widget, chart, init, onChange, onVisibleRangeChanged]);

  return useCallback((widget: IChartingLibraryWidget) => {
    setWidget(widget);
  }, []);
};

const Presets: FC = () => {
  const { t } = useTranslation();
  const { base, quote } = useTradeContext();
  const baseSymbol = base || "the base asset";
  const quoteSymbol = quote || "the quote asset";

  return (
    <div className="trade__range-presets">
      <PresetButton
        preset={Preset.Passive}
        label="Passive"
        description="-99.5% — +2000%"
        details="Set and forget, less profitable than tighter ranges"
        tooltip={t("rangePresetPassiveTooltip")}
      />
      <PresetButton
        preset={Preset.Wide}
        label="Wide"
        description="–50% — +100%"
        details="Good for volatile pairs"
        tooltip={t("rangePresetWideTooltip")}
      />
      <PresetButton
        preset={Preset.Tight}
        label="Tight"
        description="90-day low — 90-day high"
        details="Good for stablecoins or low volatility pairs"
        tooltip={t("rangePresetTightTooltip")}
      />
      <PresetButton
        preset={Preset.Lower}
        label="One-sided Lower"
        description="-50%"
        details="Supply liquidity if price goes down"
        tooltip={t("rangePresetLowerTooltip", { base: baseSymbol })}
      />
      <PresetButton
        preset={Preset.Higher}
        label="One-sided Higher"
        description="+100%"
        details="Supply liquidity if price goes up"
        tooltip={t("rangePresetHigherTooltip", { quote: quoteSymbol })}
      />
      <PresetButton
        preset={Preset.Copy}
        label="Copy"
        description="Copied from #1 top performer"
        details="Copy the top performers"
        tooltip={t("rangePresetCopyTooltip")}
        disabled={true}
      />
    </div>
  );
};

const Inputs: FC = () => {
  const {
    high,
    setHigh,
    low,
    setLow,
    setPreset,
    fee,
    setFee,
    spread,
    setSpread,
    pct,
    setPct,
    price,
  } = useRangeContext();

  const { avgAskFillPrice, avgBidFillPrice } = useRangeDistribution();
  const { base, quote } = useTradeContext();
  const { t } = useTranslation();
  const lowRange = low ? (Number(low) / 1e12).toLocaleDecimal(12, true) : "0";
  const highRange = high
    ? (Number(high) / 1e12).toLocaleDecimal(12, true)
    : "0";

  const [distanceLow, setDistanceLow] = useState(0n);
  const [distanceHigh, setDistanceHigh] = useState(0n);
  const distanceFromPrice = useRef(false);

  const feeRef = useRef(fee);
  const spreadRef = useRef(spread);
  const pctRef = useRef(pct);
  feeRef.current = fee;
  spreadRef.current = spread;
  pctRef.current = pct;

  const handleSpreadChange = useCallback(
    (v: bigint) => {
      const nextFee =
        spreadRef.current > 0n
          ? (feeRef.current * v) / spreadRef.current
          : (v * BigInt(pctRef.current)) / 100n;

      setSpread(v);
      setFee(nextFee);
      setPreset(null);
    },
    [setSpread, setFee, setPreset]
  );

  useEffect(() => {
    if (distanceFromPrice.current) {
      distanceFromPrice.current = false;
      return;
    }
    const SCALE = 10000n;
    if (price && low) setDistanceLow(((price - low) * SCALE) / price);
    if (price && high) setDistanceHigh(((high - price) * SCALE) / price);
  }, [price, low, high]);

  return (
    <div className="row wrap pad--sm gap-y-2">
      <div className="col-12 col-md-6 flex dir-c gap-1">
        <Numeric
          className={clsx({
            "numeric-input numeric-input--white condensed": true,
            "numeric-input--error": false,
          })}
          amount={high || 0n}
          onChangeAmount={(v) => {
            setHigh(v);
            if (v !== high) setPreset(null);
          }}
          decimals={12}>
          <label
            //className="fs-14 condensed color-grey fw-500"
            data-tooltip-html={`<div class="w-35">Once the price moves above this level, your position will be 100% in ${quote}. As the price rises through your range, the strategy automatically sells ${base}, giving you a blended average sale price between the current market price and the top of your range.</div>`}
            data-tooltip-id="global-tip">
            High <small>({quote})</small>
            <Icons.Info className="w-2 h-2 ml-0.5 inline-block va-b" />
          </label>
        </Numeric>
      </div>
      <div className="col-12 col-md-6 flex dir-c gap-1">
        <Numeric
          className={clsx({
            "numeric-input numeric-input--white condensed": true,
            "color-teal": distanceHigh >= 0n,
            "color-red": distanceHigh < 0n,
            "numeric-input--error": false,
          })}
          amount={distanceHigh}
          onChangeAmount={(v) => {
            setDistanceHigh(v);
            if (price) {
              distanceFromPrice.current = true;
              setHigh(price + (price * v) / 10000n);
              setPreset(null);
            }
          }}
          prefix={`${distanceHigh >= 0n ? "+" : "-"}`}
          suffix="%"
          decimals={2}>
          <label
            data-tooltip-html={`<div class="w-35">Distance % from current mid-price.</div>`}
            data-tooltip-id="global-tip">
            ∆ vs. current price
            <Icons.Info className="w-2 h-2 ml-0.5 inline-block va-b" />
          </label>
        </Numeric>
      </div>
      <div className="col-12 col-md-6 flex dir-c gap-1">
        <Numeric
          className={clsx({
            "numeric-input numeric-input--white condensed": true,
            "numeric-input--error": false,
          })}
          amount={low || 0n}
          onChangeAmount={(v) => {
            setLow(v);
            if (v !== low) setPreset(null);
          }}
          decimals={12}>
          <label
            data-tooltip-html={`<div class="w-35">Once the price moves below this level, your position will be 100% in ${base}. As the price falls through your range, the strategy automatically buys more ${base}, giving you an average entry price between the current market price and the bottom of your range.</div>`}
            data-tooltip-id="global-tip">
            Low <small>({quote})</small>
            <Icons.Info className="w-2 h-2 ml-0.5 inline-block va-b" />
          </label>
        </Numeric>
      </div>
      <div className="col-12 col-md-6 flex dir-c gap-1">
        <Numeric
          className={clsx({
            "numeric-input numeric-input--white condensed": true,
            "color-teal": distanceLow <= 0n,
            "color-red": distanceLow > 0n,
            "numeric-input--error": false,
          })}
          amount={distanceLow}
          onChangeAmount={(v) => {
            setDistanceLow(v);
            if (price) {
              distanceFromPrice.current = true;
              setLow(price - (price * v) / 10000n);
              setPreset(null);
            }
          }}
          prefix={`${distanceLow > 0n ? "-" : "+"}`}
          suffix="%"
          decimals={2}>
          <label
            data-tooltip-html={`<div class="w-35">Distance % from current mid-price.</div>`}
            data-tooltip-id="global-tip">
            ∆ vs. current price
            <Icons.Info className="w-2 h-2 ml-0.5 inline-block va-b" />
          </label>
        </Numeric>
      </div>
      <div className="col-12 p-1.5 br-1 mx-1 row bg-grey-2">
        <div
          className={clsx("pl-0.5", {
            "col-4": avgBidFillPrice > 0 && avgAskFillPrice > 0,
            "col-6 text-center": avgBidFillPrice === 0 || avgAskFillPrice === 0,
          })}>
          <label
            className="fs-14 condensed color-grey fw-500"
            data-tooltip-html={`<div class="w-35">Range tightness measures how concentrated your liquidity is within your selected price range.<br/><br/>Lower values create a wider range that stays active across larger price movements, while higher values create a tighter range focused closer to the current market price. Tighter ranges can generate higher fees while the market stays within the range, but are also more likely to move out of range where no fees are earned.<br/><br/>Calculated as: Tightness = Low Price / High Price.</div>`}
            data-tooltip-id="global-tip">
            Tightness Factor
            <Icons.Info className="w-2 h-2 ml-0.5 inline-block va-b" />
          </label>
          <span className="fs-14 color-white condensed pl-1">
            {high && low
              ? `${((Math.abs(Number(low)) / Number(high)) * 100).toFixed(2)}%`
              : "0%"}
          </span>
        </div>

        {avgBidFillPrice > 0 !== avgAskFillPrice > 0 && (
          <div className={"color-grey pl-0.5"}>|</div>
        )}

        {avgBidFillPrice > 0 && (
          <div
            className={clsx("mr-0.5 jc-e color-grey text-center", {
              "col-4": avgBidFillPrice > 0 && avgAskFillPrice > 0,
              "col-6": avgBidFillPrice === 0 || avgAskFillPrice === 0,
            })}>
            <label
              className="fs-14 condensed color-grey fw-500"
              data-tooltip-html={`<div class="w-35">${t("avgBuyPriceTooltip", {
                base,
                lowRange,
                highRange,
              })}</div>`}
              data-tooltip-id="global-tip">
              Avg Buy Price
              <Icons.Info className="w-2 h-2 ml-0.5 inline-block va-b" />
            </label>
            <span className="condensed fw-400 fs-13 mr-0.5 color-white pl-1">
              {clipFloat(avgBidFillPrice)}
            </span>
            <span className="condensed fw-400 fs-13">{quote}</span>
          </div>
        )}

        {avgAskFillPrice > 0 && (
          <div
            className={clsx("mr-0.5 jc-e color-grey", {
              "col-4 text-right": avgBidFillPrice > 0 && avgAskFillPrice > 0,
              "col-6 text-center":
                avgBidFillPrice === 0 || avgAskFillPrice === 0,
            })}>
            <label
              className="fs-14 condensed color-grey fw-500"
              data-tooltip-html={`<div class="w-35">${t("avgSellPriceTooltip", {
                base,
                quote,
                lowRange,
                highRange,
              })}</div>`}
              data-tooltip-id="global-tip">
              Avg Sell Price
              <Icons.Info className="w-2 h-2 ml-0.5 inline-block va-b" />
            </label>
            <span className="condensed fw-400 fs-13 mr-0.5 color-white ml-1">
              {clipFloat(avgAskFillPrice)}
            </span>
            <span className="condensed fw-400 fs-13">{quote}</span>
          </div>
        )}
      </div>
      <div className="col-12 col-md-6 flex dir-c gap-1">
        <Numeric
          className={clsx({
            "numeric-input numeric-input--white condensed": true,
            "numeric-input--error": false,
          })}
          amount={spread}
          onChangeAmount={handleSpreadChange}
          decimals={10}>
          <label
            //className="fs-14 condensed color-grey fw-500"
            data-tooltip-html={`<div class="w-35">The spread defines the target profit between buy and sell orders within your range.<br/><br/>A higher spread increases profit per completed trade, but requires larger price movements for trades to execute. A lower spread reduces profit per trade, but can increase trading frequency.<br/><br/>Example: a 0.3% spread may complete trades more often and perform better in stable markets, while a 1% spread can generate more profit per trade but requires stronger market volatility for trades to execute.</div>`}
            data-tooltip-id="global-tip">
            Spread <small>%</small>
            <Icons.Info className="w-2 h-2 ml-0.5 inline-block va-b" />
          </label>
        </Numeric>
      </div>
      <div className="col-12 col-md-6 flex dir-c gap-0.5">
        <label
          className="fs-14 condensed color-grey"
          data-tooltip-html={`<div class="w-35">Determines how trading fee profits are distributed. Lower values reinvest more rewards back into your position, while higher values increase the amount of claimable yield.<br/><br/>Example: a 0% setting fully auto-compounds rewards into the position, while a 100% setting makes all rewards claimable instead of reinvested.<br/><br/>Choosing 0% fully auto-compounds rewards, which means APR tracking will not be available.</div>`}
          data-tooltip-id="global-tip">
          Reward Strategy
          <Icons.Info className="w-2 h-2 ml-0.5 inline-block va-b" />
        </label>
        <div className="flex ai-c gap-1">
          <button
            onClick={() => {
              setPct(0);
              setFee(0n);
              setPreset(null);
            }}
            className="transparent fs-14 condensed color-white">
            Compounding
          </button>
          <Slider
            min={0}
            max={98}
            step={1}
            value={pct}
            onChange={(v) => {
              setPct(v);
              setFee((spread * BigInt(v)) / 100n);
              setPreset(null);
            }}
            renderThumb={(props, state) => (
              <div className="slider__thumb" {...props}>
                <span className="condensed">{state.valueNow}%</span>
              </div>
            )}
          />
          <button
            className="fs-14 condensed color-white transparent"
            onClick={() => {
              setPct(98);
              setFee((spread * BigInt(98)) / 100n);
              setPreset(null);
            }}>
            Yielding
          </button>
        </div>
      </div>
      {/* <div className="col-12 mt-1">
        <div className="flex jc-c ai-c gap-1">
          <span className="condensed fw-500 fs-14 color-grey fw-500">
            Distribution function
          </span>
          <Button label="Linear" onClick={() => {}} className="button--xs" />
          <Button
            label="Quadratic"
            disabled
            className="button--xs button--grey"
            data-tooltip-content="Coming Soon"
            data-tooltip-id="global-tip"
            data-tooltip-float={true}
          />
        </div>
      </div> */}
    </div>
  );
};

const SkewInput: FC = () => {
  const { skew, setSkew } = useRangeContext();

  return (
    <div className="flex mt-1">
      <div>
        <div
          className="flex ai-c mb-1 w-full jc-e"
          data-tooltip-id="global-tip"
          data-tooltip-html={`<div class="w-30">The skew controls how your liquidity is distributed within your selected price range.<br/><br/>A skew of 0 spreads liquidity evenly across the entire range. Adjusting the skew lets you concentrate more liquidity closer to the center of the range or toward the edges.<br/><br/>Example: if the asset is trading near the middle of your range, concentrating liquidity closer to the current price can increase fee generation while trading activity remains in that area.</div>`}>
          <label className="condensed fw-500 fs-14 color-grey">Skew</label>
          <span className="ml-0.5 block">
            <Icons.Info className="w-2 h-2 color-grey block" />
          </span>
        </div>
      </div>

      <div
        className="grow ml-2"
        data-tooltip-id="global-tip"
        data-tooltip-content="Coming Soon">
        <Slider
          min={-1.9999}
          max={1.9999}
          step={0.25}
          value={skew}
          disabled={true}
          onChange={() => setSkew(0) /* (v) => setSkew(v) */}
        />
        <div className="flex jc-sb fs-12 color-grey mt-0.5 mono relative">
          <span
            className="pointer hover-white" /* onClick={() => setSkew(-2)} */
          >
            -2
          </span>
          <span
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
            className="pointer hover-white"
            /* onClick={() => setSkew(0)} */
          >
            Balanced
          </span>
          <span
            className="pointer hover-white" /* onClick={() => setSkew(2)} */
          >
            +2
          </span>
        </div>
      </div>
    </div>
  );
};

SkewInput;

const depositFragment = graphql`
  fragment RangeDepositFragment on FinPair {
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
  }
`;

const Deposit: FC<{ k: RangeDepositFragment$key }> = ({ k }) => {
  const { assetBase, assetQuote } = useFragment(depositFragment, k);
  const { address, base: baseSymbol, quote: quoteSymbol } = useTradeContext();
  const { t } = useTranslation();
  const { asks, bids, balanceRatio } = useRangeDistribution();
  const { high, low, spread, skew, fee, tick, setHigh, setLow } =
    useRangeContext();
  const { selected } = useAccounts();
  const hasAsks = asks?.at(0)?.pStart !== asks?.at(0)?.pEnd;
  const hasBids = bids?.at(0)?.pStart !== bids?.at(0)?.pEnd;

  const ratio =
    balanceRatio && balanceRatio > 0
      ? BigInt(Math.round(balanceRatio * 1e12))
      : 0n;

  const {
    baseAmount,
    quoteAmount,
    setBaseAmount,
    setQuoteAmount,
    onBaseFocus,
    onQuoteFocus,
    baseOver,
    quoteOver,
    insufficient,
    enteredSide,
    setMaxAvailable,
  } = useClampedPair({
    assetBase,
    assetQuote,
    hasBase: hasAsks,
    hasQuote: hasBids,
    ratioBase: 10n ** 12n,
    ratioQuote: ratio,
  });

  const baseLabel = baseSymbol || assetBase.metadata.symbol;
  const quoteLabel = quoteSymbol || assetQuote.metadata.symbol;

  const msg = useMemo(
    () =>
      selected &&
      address &&
      high &&
      low &&
      spread &&
      assetBase.variants.native &&
      assetQuote.variants.native &&
      (baseAmount || quoteAmount)
        ? new MsgExecute(
            Account.fromAddress(selected.address),
            [
              coin(
                hasAsks ? baseAmount.toString() : "0",
                assetBase.variants.native.denom
              ),
              coin(
                hasBids ? quoteAmount.toString() : "0",
                assetQuote.variants.native.denom
              ),
            ],
            address,
            {
              range: {
                create: {
                  config: {
                    high: bigIntToDecimalString(high, 12),
                    low: bigIntToDecimalString(low, 12),
                    spread: bigIntToDecimalString(spread, 12),
                    skew: skew.toFixed(12),
                    fee: bigIntToDecimalString(fee, 12),
                  },
                },
              },
            }
          )
        : null,
    [
      selected,
      address,
      high,
      low,
      spread,
      skew,
      baseAmount,
      quoteAmount,
      assetBase,
      assetQuote,
      fee,
      hasAsks,
      hasBids,
    ]
  );

  const createLabel = useMemo(() => {
    const assets = [
      { price: assetBase.price?.current, amount: baseAmount },
      { price: assetQuote.price?.current, amount: quoteAmount },
    ];
    return fiatize(t("createPosition"), assets);
  }, [baseAmount, assetBase, quoteAmount, assetQuote]);

  return (
    <div className="flex wrap">
      {hasAsks ? (
        <BalanceProvider asset={assetBase}>
          <InputQuantity
            containerClassName="trade__range-input"
            amount={baseAmount}
            onFocus={onBaseFocus}
            setAmount={setBaseAmount}
            highlightInvalid
            asset={assetBase}
            fiat={{ price: assetBase.price?.current, symbol: "$" }}
          />
        </BalanceProvider>
      ) : null}
      {hasAsks && hasBids ? <Icons.Plus className="trade__range-plus" /> : null}
      {hasBids ? (
        <BalanceProvider asset={assetQuote}>
          <InputQuantity
            containerClassName="trade__range-input"
            amount={quoteAmount}
            onFocus={onQuoteFocus}
            setAmount={setQuoteAmount}
            highlightInvalid
            asset={assetQuote}
            fiat={{ price: assetQuote.price?.current, symbol: "$" }}
          />
        </BalanceProvider>
      ) : null}
      <p className="color-grey fs-12 text-center flex ai-c jc-c fw-500 w-full mt-3">
        <span
          className="iflex ai-c"
          data-tooltip-html={`<div class="w-40 text-left">${t(
            "customConcentratedLiquidityTooltip",
            {
              base: baseSymbol || assetBase.metadata.symbol,
              quote: quoteSymbol || assetQuote.metadata.symbol,
            }
          )}</div>`}
          data-tooltip-id="global-tip">
          What is Custom Concentrated Liquidity?
          <Icons.Info className="w-2 h-2 ml-0.5" />
        </span>
      </p>
      {insufficient ? (
        <RangeBalanceWarning
          className="w-full"
          baseLabel={baseLabel}
          quoteLabel={quoteLabel}
          enteredSide={enteredSide}
          baseOver={baseOver}
          quoteOver={quoteOver}
          onFix={setMaxAvailable}
        />
      ) : (
        <RangeDepositResolver
          base={{ asset: assetBase, amount: baseAmount, needed: hasAsks }}
          quote={{ asset: assetQuote, amount: quoteAmount, needed: hasBids }}
          onAutoFit={setMaxAvailable}
          expand
          className="w-full mt-3">
          <MsgProvider msg={msg}>
            <TxButton
              hideSimulation
              className="w-full mt-3"
              label={createLabel}
              onSimulation={({ status }) => {
                if (status !== "running") return;
                // adjust prices on simulation so we don't clash with user keystrokes.
                const adjustedHigh = tickAlign(high, tick);
                const adjustedLow = tickAlign(low, tick);
                if (adjustedHigh !== undefined && adjustedHigh !== high)
                  setHigh(adjustedHigh);
                if (adjustedLow !== undefined && adjustedLow !== low)
                  setLow(adjustedLow);
              }}
            />
          </MsgProvider>
        </RangeDepositResolver>
      )}
    </div>
  );
};

const inputsFragment = graphql`
  fragment RangeInputsFragment on FinPair {
    ...RangeDepositFragment
  }
`;

export const RangeInputs: FC<{ k: RangeInputsFragment$key }> = ({ k }) => {
  const data = useFragment(inputsFragment, k);
  const { t } = useTranslation();
  const { base, quote } = useTradeContext();
  return (
    <>
      <Presets />
      <div className="flex dir-c mt-2 gap-y-2">
        <p className="color-grey fs-12 text-center flex ai-c jc-c fw-500 mt-1 mb-1">
          <span
            className="iflex ai-c"
            data-tooltip-html={`<div class="w-40 text-left">${t(
              "rangePresetSelectionTooltip",
              {
                base: base || "the base asset",
                quote: quote || "the quote asset",
              }
            )}</div>`}
            data-tooltip-id="global-tip">
            Which option is best for me?
            <Icons.Info className="w-2 h-2 ml-0.5" />
          </span>
        </p>
        <Inputs />
        {/* <SkewInput /> */}
        <hr className="hr opacity-10" />
        <Deposit k={data} />
      </div>
    </>
  );
};

const PresetButton: FC<{
  children?: React.ReactNode;
  label?: string;
  description?: string;
  details?: string;
  tooltip?: string;
  preset: Preset;
  disabled?: boolean;
}> = ({ children, label, details, description, tooltip, preset, disabled }) => {
  const { preset: selected, setPreset } = useRangeContext();

  return (
    <button
      className={clsx(
        "trade__range-preset transparent p-2 br-2 text-left condensed flex dir-c ai-s gap-y-0.5",
        {
          "glow-primary1 bg-grey-2 bg-hover-grey-2": selected === preset,
          "bg-grey-1 bg-hover-grey-2": selected !== preset && !disabled,
          "bg-grey-1 bg-hover-grey-1 opacity-10": disabled,
          pointer: !disabled,
        }
      )}
      onClick={() => !disabled && setPreset(preset)}>
      {tooltip && (
        <span
          className="trade__range-preset-info"
          data-tooltip-html={`<div class="w-35 text-left">${tooltip}</div>`}
          data-tooltip-id="global-tip"
          data-tooltip-place="top"
          onClick={(event) => event.stopPropagation()}>
          <Icons.Info />
        </span>
      )}
      {label && <p className="fs-14 color-grey">{label}</p>}
      {description && <p className="fs-20 color-white">{description}</p>}
      {details && <p className="fs-12 color-grey mt-a">{details}</p>}
      {children}
    </button>
  );
};
