import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { Asset } from "rujira.js";
import {
  AssetLabel,
  IconDenom,
  Icons,
  useTranslation,
  useWindowDimensions,
} from "rujira.ui";
import { assetToTradeUrlSegment } from "../../../services/assetUrl";
import {
  applyTradeUrlState,
  removeDeprecatedTradeParams,
  searchFromParams,
} from "../../tradeUrlState";
import type { TradeUrlState } from "../../tradeUrlState";
const OrdersBreakpoint = 1350;

export const Nav = <T extends string>({
  tab,
  setTab,
  tabs,
}: {
  tab: T;
  setTab: (v: T) => void;
  tabs: { value: T; count: number }[];
}) => {
  const isCondensed = useWindowDimensions(OrdersBreakpoint);
  const { t } = useTranslation();
  const count = tabs.find((a) => a.value === tab)?.count || 0;

  return isCondensed ? (
    <a className="flex jc-sb">
      <p className="color-white nowrap">
        {t(tab)}
        {count ? <i>{count}</i> : null}
      </p>
      <Icons.AngleDown className="color-white" />
      <nav>
        {tabs.map(({ value, count }) => (
          <span
            key={value}
            className="flex ai-c"
            style={{
              fontSize: "0.75rem",
            }}
            onClick={() => {
              setTab(value);
            }}>
            <label className="ml-1">{t(value)}</label>
            {count ? <i>{count || undefined}</i> : null}
          </span>
        ))}
      </nav>
    </a>
  ) : (
    tabs.map(({ value, count }) => (
      <a
        key={value}
        className={tab === value ? "selected" : ""}
        onClick={() => setTab(value)}>
        {t(value)}
        {count ? <i>{count}</i> : null}
      </a>
    ))
  );
};

export const OrderLink: FC<{
  assetBase: Asset;
  assetQuote: Asset;
  params?: URLSearchParams;
  state?: TradeUrlState;
  tooltip?: string;
}> = ({ assetBase, assetQuote, params, state, tooltip }) => {
  const baseTradePath = "/trade";
  const { search: locationSearch } = useLocation();
  const base = state
    ? applyTradeUrlState(new URLSearchParams(locationSearch), state)
    : removeDeprecatedTradeParams(new URLSearchParams(locationSearch));
  params?.forEach((value, key) => base.set(key, value));
  const to = `${baseTradePath}/${assetToTradeUrlSegment(assetBase)}/${assetToTradeUrlSegment(assetQuote)}${searchFromParams(base)}`;

  return (
    <>
      <td className="w-1">
        <Link to={to} relative="path" className="lp small">
          <IconDenom denom={assetBase.metadata.symbol} className="w-2" />
          <IconDenom denom={assetQuote.metadata.symbol} className="w-2" />
        </Link>
      </td>
      <td style={{ paddingLeft: "0" }}>
        <Link
          to={to}
          relative="path"
          className="color-white no-underline hover-teal fw-500 fs-14"
          data-tooltip-id={tooltip ? "global-tip" : undefined}
          data-tooltip-html={tooltip ? `<div>${tooltip}</div>` : undefined}>
          <AssetLabel
            asset={assetBase}
            Container={({ children }) => (
              <small className="color-grey">{children}</small>
            )}
          />{" "}
          <span className="color-grey">/</span>{" "}
          <AssetLabel
            asset={assetQuote}
            Container={({ children }) => (
              <small className="color-grey">{children}</small>
            )}
          />
        </Link>
      </td>
    </>
  );
};

export const Moic = () => (
  <span
    className="iflex ai-c jc-e"
    data-tooltip-id="global-tip"
    data-tooltip-html='<div class="w-30">Multiple of Invested Capital (MOIC) measures the total value of your position compared to the amount invested, including both realized and unrealized value.<br/><br/>Example: if you invested $1,000, already received $500 back from the position, and still have $1,500 remaining in the position, your total value is $2,000 and your MOIC is 2.0x.<br/><br/>Calculated as: (Realized Value + Unrealized Value) / Total Invested.</div>'>
    MOIC <Icons.Info className="w-2 h-2 color-grey block ml-0.5" />
  </span>
);

export const Dpi = () => (
  <span
    className="iflex ai-c jc-e"
    data-tooltip-id="global-tip"
    data-tooltip-html='<div class="w-30">Distribution-to-Paid-In (DPI) ratio measures how much value has been returned compared to the total amount invested.<br/><br/>Example: if you invested $1,000 and received $1,500 back from the position, your DPI is 1.5x and your realized profit is $500.</div>'>
    DPI <Icons.Info className="w-2 h-2 color-grey block ml-0.5" />
  </span>
);

export const Apr = () => (
  <span
    className="iflex ai-c jc-e"
    data-tooltip-id="global-tip"
    data-tooltip-html='<div class="w-30">Estimated yearly return based on the claimable yield earned relative to the weighted average value and duration of your position. To measure APR, part of your yield must be set as claimable instead of fully auto-compounded.<br/><br/>Example: if your position earned $100 in claimable yield on an average invested value of $1,000 over one year, the APR would be 10%.</div>'>
    APR <Icons.Info className="w-2 h-2 color-grey block ml-0.5" />
  </span>
);

export const CurrentValue = () => (
  <span
    className="iflex ai-c"
    data-tooltip-id="global-tip"
    data-tooltip-html='<div class="w-30">Current value of your Principal, excluding any unclaimed yield.</div>'>
    Current Value
    <Icons.Info className="w-2 h-2 color-grey block ml-0.5 mr-0.5" />
  </span>
);
