import clsx from "clsx";
import { FC, useMemo } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { priceFormatter } from "rujira.js";
import { Decimal, IconDenom, useTranslation, useWindowSize } from "rujira.ui";
import { TradeBreakpoint } from "../Trade";
import { HistoryFragment$key } from "./__generated__/HistoryFragment.graphql";
import { HistoryItemFragment$key } from "./__generated__/HistoryItemFragment.graphql";

const fragment = graphql`
  fragment HistoryFragment on FinTradeEdge {
    cursor
    node {
      id
      ...HistoryItemFragment
    }
  }
`;

export const HistoryFallback: FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <h3 className="fs-12 fw-500 mb-2 color-white">{t("marketHistory")}</h3>
      <div
        className={clsx({
          "table-sticky": true,
          "pr-1": true,
        })}>
        <table className="table table--sm">
          <thead>
            <tr>
              <th style={{ width: "33%" }}>{t("price")} (...)</th>
              <th className="text-right">{t("amount")} (...)</th>
              <th className="text-right" style={{ width: "33%" }}>
                {t("time")}
              </th>
            </tr>
          </thead>
          <tbody className="mono fs-12">
            {[...Array(12)].map((_, i) => (
              <tr key={`history-skeleton-${i}`}>
                <td key={`skeleton-h-${i}`}>
                  <span className="inline-block skeleton w-full h-1 br-2" />
                </td>
                <td>
                  <span className="inline-block skeleton w-full h-1 br-2" />
                </td>
                <td>
                  <span className="inline-block skeleton w-full h-1 br-2" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export const History: FC<{
  base: string;
  quote: string;
  tick: number;
  k: HistoryFragment$key[];
}> = ({ k, base, quote, tick }) => {
  const { t } = useTranslation();
  const { width } = useWindowSize();

  return (
    <>
      <h3 className="fs-12 fw-500 mb-2 color-white">{t("marketHistory")}</h3>
      <div
        className={clsx({
          "table-sticky": true,
          "pr-1": width > TradeBreakpoint,
        })}>
        <table className="table table--sm">
          <thead>
            <tr>
              <th style={{ width: "33%" }}>
                {t("price")} ({quote})
              </th>
              <th className="text-right">
                {t("amount")} ({base})
              </th>
              <th className="text-right" style={{ width: "33%" }}>
                {t("time")}
              </th>
            </tr>
          </thead>
          <tbody className="mono fs-12">
            {k
              ?.slice(0, width > TradeBreakpoint ? 80 : 10)
              .map((e, idx) => <HistoryItem key={idx} k={e} tick={tick + 2} />)}
          </tbody>
        </table>
      </div>
    </>
  );
};

export const historyItemfragment = graphql`
  fragment HistoryItemFragment on FinTrade {
    type
    quoteAmount
    baseAmount
    price
    protocol
    timestamp
  }
`;

type HistoryTradeProtocol = {
  label: string;
  icon: "rune" | "rujira";
};

const THORCHAIN_TRADE_PROTOCOL: HistoryTradeProtocol = {
  label: "Swap on THORChain Base Layer",
  icon: "rune",
};

const RUJIRA_TRADE_PROTOCOL: HistoryTradeProtocol = {
  label: "Trade on Rujira App Layer",
  icon: "rujira",
};

const historyTradeProtocol = (
  protocol: string
): HistoryTradeProtocol | null => {
  const normalized = protocol.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (
    normalized === "thor" ||
    normalized === "base" ||
    normalized === "baselayer" ||
    normalized.includes("thorchain")
  ) {
    return THORCHAIN_TRADE_PROTOCOL;
  }

  if (
    normalized === "app" ||
    normalized === "applayer" ||
    normalized === "fin" ||
    normalized.includes("ruji")
  ) {
    return RUJIRA_TRADE_PROTOCOL;
  }

  return null;
};

export const HistoryItem: FC<{ tick: number; k: HistoryFragment$key }> = ({
  tick,
  k,
}) => {
  const i = useFragment(fragment, k);
  const d = useFragment<HistoryItemFragment$key>(historyItemfragment, i.node);
  const tradeProtocol = useMemo(
    () => (d ? historyTradeProtocol(d.protocol) : null),
    [d?.protocol]
  );
  if (!d) return null;

  return (
    <tr>
      <td className={d.type === "sell" ? "color-red" : "color-teal"}>
        <span className="iflex ai-c gap-x-0.5">
          {tradeProtocol && (
            <span
              className="block w-1.5 h-1.5 no-shrink"
              data-tooltip-content={tradeProtocol.label}
              data-tooltip-id="global-tip"
              role="img"
              aria-label={tradeProtocol.label}>
              <IconDenom
                denom={tradeProtocol.icon === "rune" ? "RUNE" : "RUJI"}
                className="block w-1.5 h-1.5"
              />
            </span>
          )}
          <span>
            {priceFormatter(BigInt(d.price), {
              precision: tick,
              trim: false,
            })}
          </span>
        </span>
      </td>
      <td className="text-right">
        <Decimal
          subscript
          amount={BigInt(d.baseAmount)}
          round={4}
          className="color-grey"
          clip
        />
      </td>
      <td className="text-right color-grey mono fs-12">
        {new Date(d.timestamp).toLocaleTimeString("en-GB")}
      </td>
    </tr>
  );
};
