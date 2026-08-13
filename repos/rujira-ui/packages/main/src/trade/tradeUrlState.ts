import { useCallback, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { bigIntToDecimalString } from "rujira.ui";
import { OrderType } from "./types";

export type TradeMode = "manual" | "automated";
export type ManualOrder = OrderType;
export type AutomatedStrategy = "ccl";
export type CclSetting =
  | "custom"
  | "passive"
  | "wide"
  | "tight"
  | "lower"
  | "higher";
type CclUrlParamKey = "high" | "low" | "spread" | "fee";
export type CclUrlParams = Partial<{
  high: bigint;
  low: bigint;
  spread: bigint;
  fee: bigint;
}>;

export type TradeUrlState =
  | {
      type: "manual";
      order: ManualOrder;
    }
  | {
      type: "automated";
      strategy: AutomatedStrategy;
    };

const MANUAL_ORDERS = new Set<string>(Object.values(OrderType));
const AUTOMATED_STRATEGIES = new Set<string>(["ccl"]);
const CCL_SETTINGS = new Set<string>([
  "custom",
  "passive",
  "wide",
  "tight",
  "lower",
  "higher",
]);
export const DEFAULT_CCL_SETTING: CclSetting = "wide";
const DEPRECATED_TRADE_PARAMS = ["orders", "range"];
const MANUAL_PRESERVED_PARAMS = ["side"];
const CCL_PARAM_KEYS = [
  "high",
  "low",
  "spread",
  "fee",
] as const satisfies readonly CclUrlParamKey[];
export const CCL_INITIAL_PARAM_KEYS = ["setting", ...CCL_PARAM_KEYS] as const;
const TRADE_STATE_PARAM_KEYS = [
  "type",
  "order",
  "strategy",
  "deviation",
  ...CCL_INITIAL_PARAM_KEYS,
  ...DEPRECATED_TRADE_PARAMS,
];
// Compact aliases carried by the share links, so a copied position fits in chat message
const SHORT_MODE_KEY = "m";
const SHORT_MODE_CCL = "ccl";
const SHORT_CCL_PARAMS = {
  h: "high",
  l: "low",
  s: "spread",
  f: "fee",
} as const;
const SHORT_TRADE_PARAM_KEYS = [
  SHORT_MODE_KEY,
  ...Object.keys(SHORT_CCL_PARAMS),
];

const TRADE_MANAGED_PARAM_KEYS = [
  ...TRADE_STATE_PARAM_KEYS,
  ...MANUAL_PRESERVED_PARAMS,
];

const hasTradeStateParams = (params: URLSearchParams) =>
  TRADE_STATE_PARAM_KEYS.some((key) => params.has(key));

const CCL_BIGINT_DECIMALS: Record<Exclude<CclUrlParamKey, "fee">, number> = {
  high: 12,
  low: 12,
  spread: 10,
};
const FEE_RATIO_DECIMALS = 10;
const FEE_RATIO_SCALE = 10n ** BigInt(FEE_RATIO_DECIMALS);
const MAX_FEE_RATIO = (98n * FEE_RATIO_SCALE) / 100n;

const DECIMAL_PARAM = /^\d+(?:\.\d+)?$/;
const SIGNED_INTEGER_PARAM = /^-?\d+$/;
const MAX_DECIMAL_INTEGER_DIGITS = 18;

const isManualOrder = (value: string | null): value is ManualOrder =>
  !!value && MANUAL_ORDERS.has(value);

const isAutomatedStrategy = (
  value: string | null
): value is AutomatedStrategy => !!value && AUTOMATED_STRATEGIES.has(value);

const isCclSetting = (value: string | null): value is CclSetting =>
  !!value && CCL_SETTINGS.has(value);

export const parseCclSettingParam = (value: string | null): CclSetting =>
  isCclSetting(value) ? value : DEFAULT_CCL_SETTING;

const parseDecimalParam = (value: string | null, decimals: number) => {
  if (!value) return null;
  if (!DECIMAL_PARAM.test(value)) return null;

  const [integer, fractional = ""] = value.split(".");
  if (integer.replace(/^0+/, "").length > MAX_DECIMAL_INTEGER_DIGITS) {
    return null;
  }
  const scaledInteger = BigInt(integer) * 10n ** BigInt(decimals);
  const scaledFractional = fractional
    ? BigInt(fractional.slice(0, decimals).padEnd(decimals, "0"))
    : 0n;

  return scaledInteger + scaledFractional;
};

const parseFeeParam = (value: string | null, spread: bigint | null) => {
  if (!spread || spread <= 0n) return null;
  const ratio = parseDecimalParam(value, FEE_RATIO_DECIMALS);
  if (ratio === null) return null;
  if (ratio > MAX_FEE_RATIO) return null;

  return (spread * ratio) / FEE_RATIO_SCALE;
};

// Compact form of bigIntToDecimalString (trailing zeros trimmed, no dangling
// separator) to keep the deep links short; parseDecimalParam accepts either form.
const serializeDecimalParam = (v: bigint, decimals: number): string =>
  bigIntToDecimalString(v, decimals).replace(/\.?0+$/, "");

// Inverse of parseFeeParam: fee travels as a fraction of spread, capped at 98%.
// Mirroring the cap here means the link always hydrates instead of being
// rejected and falling back to the default preset.
const serializeFeeParam = (fee: bigint, spread: bigint): string => {
  if (spread <= 0n) return "0";
  const ratio = (fee * FEE_RATIO_SCALE) / spread;
  return serializeDecimalParam(
    ratio > MAX_FEE_RATIO ? MAX_FEE_RATIO : ratio,
    FEE_RATIO_DECIMALS
  );
};

/**
 * Deep link into the trade page's automated (CCL) strategy form, pre-filled
 * with this position's parameters. Inverse of `parseCclUrlParams`. The scales
 * and the fee cap have to stay in step with it. Skew is not URL-hydratable (yet).
 *
 * Emitted in the compact form because these links get pasted into chat
 * messages.
 */
export const cclCopyParams = (position: {
  low: bigint;
  high: bigint;
  spread: bigint;
  fee: bigint;
}): string =>
  `?${SHORT_MODE_KEY}=${SHORT_MODE_CCL}` +
  `&h=${serializeDecimalParam(position.high, CCL_BIGINT_DECIMALS.high)}` +
  `&l=${serializeDecimalParam(position.low, CCL_BIGINT_DECIMALS.low)}` +
  `&s=${serializeDecimalParam(position.spread, CCL_BIGINT_DECIMALS.spread)}` +
  `&f=${serializeFeeParam(position.fee, position.spread)}`;

// Expands the compact share-link form into the canonical params
export const expandShortTradeParams = (
  params: URLSearchParams
): URLSearchParams => {
  if (params.get(SHORT_MODE_KEY) !== SHORT_MODE_CCL) return params;

  const next = new URLSearchParams(params);
  SHORT_TRADE_PARAM_KEYS.forEach((key) => next.delete(key));

  const setIfAbsent = (key: string, value: string | null) => {
    if (value !== null && !next.has(key)) next.set(key, value);
  };

  setIfAbsent("type", "automated");
  setIfAbsent("strategy", "ccl");
  setIfAbsent("setting", "custom");

  // Short params always win over a same-named long-form param that may
  // already be present (e.g. from stale route state) — silently deferring
  // to it would open a shared link on the wrong position.
  Object.entries(SHORT_CCL_PARAMS).forEach(([short, long]) => {
    const value = params.get(short);
    if (value !== null) next.set(long, value);
  });

  return next;
};

export const parseTrackingDeviationParam = (value: string | null) => {
  if (!value) return null;
  if (!SIGNED_INTEGER_PARAM.test(value)) return null;

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  if (parsed < -10000 || parsed > 10000) return null;

  return parsed;
};

export const parseCclUrlParams = (params: URLSearchParams): CclUrlParams => {
  const high = parseDecimalParam(params.get("high"), CCL_BIGINT_DECIMALS.high);
  const low = parseDecimalParam(params.get("low"), CCL_BIGINT_DECIMALS.low);
  const spread = parseDecimalParam(
    params.get("spread"),
    CCL_BIGINT_DECIMALS.spread
  );
  const fee = parseFeeParam(params.get("fee"), spread);

  return {
    ...(high !== null ? { high } : {}),
    ...(low !== null ? { low } : {}),
    ...(spread !== null ? { spread } : {}),
    ...(fee !== null ? { fee } : {}),
  };
};

export const parseTradeUrlState = (params: URLSearchParams): TradeUrlState => {
  if (params.get("type") === "automated") {
    const strategy = params.get("strategy");

    return {
      type: "automated",
      strategy: isAutomatedStrategy(strategy) ? strategy : "ccl",
    };
  }

  const order = params.get("order");
  const manualOrder = isManualOrder(order) ? order : OrderType.Market;

  return {
    type: "manual",
    order: manualOrder,
  };
};

export const removeDeprecatedTradeParams = (params: URLSearchParams) => {
  const next = new URLSearchParams(params);
  DEPRECATED_TRADE_PARAMS.forEach((key) => next.delete(key));

  return next;
};

export const applyTradeUrlState = (
  params: URLSearchParams,
  state: TradeUrlState
) => {
  const current = removeDeprecatedTradeParams(params);
  const currentState = parseTradeUrlState(current);
  const next = new URLSearchParams();
  next.set("type", state.type);

  if (state.type === "manual") {
    next.set("order", state.order);
    if (currentState.type === "manual") {
      MANUAL_PRESERVED_PARAMS.forEach((key) => {
        current.getAll(key).forEach((value) => next.append(key, value));
      });
    }
    // Tracking params are accepted as initial deep-link values, but never
    // serialized after the order form has hydrated.
    return next;
  }

  next.set("strategy", state.strategy);
  return next;
};

export const normalizeTradeUrlParams = (params: URLSearchParams) => {
  const source = expandShortTradeParams(params);
  if (!hasTradeStateParams(source)) return null;

  const tradeState = parseTradeUrlState(source);
  const canonicalTradeParams = applyTradeUrlState(source, tradeState);
  if (
    tradeState.type === "manual" &&
    tradeState.order === OrderType.Tracking &&
    source.has("deviation")
  ) {
    // Keep the raw deep-link value available until the tracking form has
    // hydrated it (or selected its default for an invalid value).
    canonicalTradeParams.set("deviation", source.get("deviation") ?? "");
  }
  if (tradeState.type === "automated" && tradeState.strategy === "ccl") {
    // Automated configuration is also input-only. Preserve the raw values
    // until RangeContext has hydrated them, including invalid values that
    // need to fall back before cleanup.
    CCL_INITIAL_PARAM_KEYS.forEach((key) => {
      source.getAll(key).forEach((value) => {
        canonicalTradeParams.append(key, value);
      });
    });
  }
  const next = new URLSearchParams(source);
  TRADE_MANAGED_PARAM_KEYS.forEach((key) => next.delete(key));
  canonicalTradeParams.forEach((value, key) => next.append(key, value));
  return next.toString() === params.toString() ? null : next;
};

export const pairSwitchTradeUrlParams = (params: URLSearchParams) => {
  const source = normalizeTradeUrlParams(params) ?? params;
  if (!hasTradeStateParams(source)) return null;

  return applyTradeUrlState(source, parseTradeUrlState(source));
};

export const searchFromParams = (params: URLSearchParams) => {
  const search = params.toString();

  return search ? `?${search}` : "";
};

type TradeUrlSetOptions = {
  replace?: boolean;
};

export const useTradeUrlState = (): [
  TradeUrlState,
  (state: TradeUrlState, options?: TradeUrlSetOptions) => void,
] => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const state = useMemo(
    () => parseTradeUrlState(expandShortTradeParams(params)),
    [params]
  );
  const normalizedParams = useMemo(
    () => normalizeTradeUrlParams(params),
    [params]
  );
  useEffect(() => {
    if (!normalizedParams) return;

    navigate(`${location.pathname}${searchFromParams(normalizedParams)}`, {
      replace: true,
    });
  }, [location.pathname, navigate, normalizedParams]);
  const setState = useCallback(
    (nextState: TradeUrlState, options?: TradeUrlSetOptions) => {
      const nextParams = applyTradeUrlState(
        new URLSearchParams(location.search),
        nextState
      );
      navigate(`${location.pathname}${searchFromParams(nextParams)}`, options);
    },
    [location.pathname, location.search, navigate]
  );

  return [state, setState];
};
