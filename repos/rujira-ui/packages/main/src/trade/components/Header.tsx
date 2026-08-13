import { Buffer } from "buffer";
import { FC, useEffect } from "react";
import { useFragment, useRelayEnvironment } from "react-relay";
import { useParams } from "react-router-dom";
import { graphql, requestSubscription } from "relay-runtime";
import {
  AssetLabel,
  BreakPoints,
  Decimal,
  Fiat,
  IconDenom,
  Icons,
  nFormatter,
  Toggle,
  useTranslation,
  useWindowSize,
} from "rujira.ui";

import { SITE_URL } from "../../home/constants";
import {
  assetToTradeUrlSegment,
  parseUrlSegment,
} from "../../services/assetUrl";
import { useFavorites } from "../../services/favorites";
import { HeaderTradeFragment$key } from "./__generated__/HeaderTradeFragment.graphql";
import { HeaderTradeSummaryFragment$key } from "./__generated__/HeaderTradeSummaryFragment.graphql";
import { Tab, useOrdersContext } from "./Orders/Context";
import { useRangeContext } from "./Range";
const { AngleDown, Star, TrendUp } = Icons;

const fragment = graphql`
  fragment HeaderTradeFragment on FinPair {
    id
    address
    assetBase {
      asset
      type
      chain
      metadata {
        symbol
        decimals
      }
      price {
        mcap
      }
    }
    assetQuote {
      asset
      type
      chain
      metadata {
        symbol
        decimals
      }
    }
    summary {
      ...HeaderTradeSummaryFragment
    }
  }
`;

const summaryFragment = graphql`
  fragment HeaderTradeSummaryFragment on FinSummary {
    last
    lastUsd
    high
    low
    change
    volumeUsd
  }
`;

const subscription = graphql`
  subscription HeaderTradeSubscription($id: ID!) {
    node(id: $id) {
      ... on FinPair {
        summary {
          ...HeaderTradeSummaryFragment
        }
      }
    }
  }
`;

export const Header: FC<{
  k?: HeaderTradeFragment$key;
  lastTradeType?: string;
}> = ({ k, lastTradeType }) => {
  const { t } = useTranslation();
  const data = useFragment(fragment, k);
  const summary = useFragment<HeaderTradeSummaryFragment$key>(
    summaryFragment,
    data?.summary
  );
  const { width } = useWindowSize();
  const min = 470;

  const decimals = 4; // get from base denom
  const change = BigInt(summary?.change || 0);
  const analyticsHref = data
    ? `${SITE_URL}/analytics/trade/${assetToTradeUrlSegment(data.assetBase)}/${assetToTradeUrlSegment(data.assetQuote)}`
    : undefined;

  const env = useRelayEnvironment();

  useEffect(() => {
    if (!data?.id) return;
    const sub = requestSubscription(env, {
      subscription,
      variables: {
        id: data?.id,
      },
    });
    return () => {
      sub.dispose();
    };
  }, [data?.id]);
  const { enabled } = useRangeContext();
  const { selectTab, selectPreviousTab } = useOrdersContext();

  return (
    <>
      <div className="trade__header-price">
        <Decimal
          amount={BigInt(summary?.last || 0)}
          decimals={12}
          round={width < min ? 4 : decimals}
          as="h2"
          clip
          className={
            lastTradeType === "sell"
              ? "color-red"
              : lastTradeType === "buy"
                ? "color-teal"
                : ""
          }
          symbol={data?.assetQuote.metadata.symbol}
          symbolClassName={"fs-12 color-grey condensed fw-500"}
        />
        <Fiat
          amount={BigInt(summary?.lastUsd || 0)}
          decimals={12}
          symbol="$"
          padSymbol={false}
        />
      </div>
      <div className="trade__header-stat">
        <h4>{t("change24h")}</h4>
        {change > 0n ? (
          <div className="flex ai-c color-teal">
            <span>+{(Number(change) / 10 ** 10).toLocaleDecimal(2)}%</span>
            <TrendUp className="block w-2 ml-0.5" />
          </div>
        ) : change < 0n ? (
          <div className="flex ai-c color-red">
            <span>{(Number(change) / 10 ** 10).toLocaleDecimal(2)}%</span>
            <Icons.TrendDown className="block w-2 ml-0.5" />
          </div>
        ) : (
          <div className="flex ai-c color-teal">
            <span>0.00%</span>
          </div>
        )}
      </div>
      <div className="trade__header-stat">
        <h4>{t("high24h")}</h4>
        <Decimal
          subscript
          amount={BigInt(summary?.high || 0)}
          decimals={12}
          round={width < min ? 4 : decimals}
          symbol={data?.assetQuote.metadata.symbol}
          symbolClassName={"fs-12 color-grey condensed fw-500"}
          clip
        />
      </div>
      <div className="trade__header-stat">
        <h4>{t("low24h")}</h4>
        <Decimal
          subscript
          amount={BigInt(summary?.low || 0)}
          decimals={12}
          round={width < min ? 4 : decimals}
          symbol={data?.assetQuote.metadata.symbol}
          symbolClassName={"fs-12 color-grey condensed fw-500"}
          clip
        />
      </div>
      <div className="trade__header-stat">
        <h4>{t("vol24h")}</h4>
        <div>
          ${nFormatter(BigInt(summary?.volumeUsd || 0), width < min ? 2 : 3, 8)}
        </div>
      </div>
      {data?.assetBase.price?.mcap && width > BreakPoints.small ? (
        <div className="trade__header-stat">
          <h4>{t("marketCap")}</h4>
          <div>
            $
            {nFormatter(
              BigInt(data?.assetBase.price?.mcap || 0),
              width < min ? 2 : 3,
              0
            )}
          </div>
        </div>
      ) : null}
      {analyticsHref && (
        <a
          href={analyticsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="trade__header-stat trade__header-analytics no-underline nowrap">
          <h4 className="iflex ai-c">
            {t("analytics")}
            <Icons.External className="w-1.5 h-1.5 ml-0.5" />
          </h4>
        </a>
      )}

      <div className="trade__header-range ml-a mr-a mr-md-2 flex ai-c">
        {/* {enabled ? (
          <Button
            className="button--sm button--waiting"
            onClick={() => setEnabled(false)}
            label={t("range")}>
            <Icons.Code />
          </Button>
        ) : (
          <Button
            className="button--sm button--grey button--outline"
            onClick={() => setEnabled(true)}
            label={t("manual")}>
            <Icons.Chart />
          </Button>
        )} */}
        <span
          onClick={() =>
            enabled ? selectPreviousTab() : selectTab(Tab.Automated)
          }
          className={`pointer fs-14 condensed fw-500 ${!enabled ? "color-white" : "color-grey"} block mr-1`}>
          {t("manual")}
        </span>
        <Toggle
          className={`toggle--sm ${enabled ? "color-white" : "color-grey"}`}
          label={t("automated")}
          checked={enabled}
          onChange={(e) =>
            e.target.checked ? selectTab(Tab.Automated) : selectPreviousTab()
          }
        />
      </div>
      {/* <div className="break" /> */}
    </>
  );
};

export const MarketSelect: FC<{
  k?: HeaderTradeFragment$key;
  openDrawer: () => void;
  initialPairId?: string;
}> = ({ k, openDrawer, initialPairId }) => {
  const params = useParams();
  const data = useFragment(fragment, k);
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const pairId = data?.address
    ? Buffer.from(`FinPair:${data.address}`).toString("base64")
    : initialPairId;
  const isFavorite = !!pairId && favorites.includes(pairId);

  const starClick = () => {
    if (!pairId) return;
    if (isFavorite) {
      removeFavorite(pairId);
    } else {
      addFavorite(pairId);
    }
  };

  const base = params.base?.split(".")[0];
  const quote = params.quote?.split(".")[0];
  const baseChain = params.base?.split(".")[1] || "";
  const quoteChain = params.quote?.split(".")[1] || "";

  const baseAsset = data?.assetBase || {
    ...parseUrlSegment(params.base || ""),
    type: baseChain !== "" ? "SECURED" : "LAYER_1",
  };
  const quoteAsset = data?.assetQuote || {
    ...parseUrlSegment(params.quote || ""),
    type: quoteChain !== "" ? "SECURED" : "LAYER_1",
  };

  return (
    <div className="flex condensed ai-c gap-0.5">
      {isFavorite ? (
        <Icons.StarSolid
          className="trade__header-favorite trade__header-favorite--solid pointer"
          onClick={starClick}
        />
      ) : (
        <Star className="trade__header-favorite pointer" onClick={starClick} />
      )}
      <button
        className="trade__selector-pair"
        onClick={() => {
          openDrawer();
        }}>
        <IconDenom
          denom={data?.assetBase.metadata.symbol || base || ""}
          className="denom"
        />
        <IconDenom
          denom={data?.assetQuote.metadata.symbol || quote || ""}
          className="denom"
        />
        <h1 className="mr-1">
          <AssetLabel
            asset={baseAsset}
            Container={({ children }) => (
              <small className="color-grey">{children}</small>
            )}
          />{" "}
          <span>/</span>{" "}
          <AssetLabel
            asset={quoteAsset}
            Container={({ children }) => (
              <small className="color-grey">{children}</small>
            )}
          />{" "}
        </h1>
        <AngleDown />
      </button>
    </div>
  );
};

export const MarketSummary: FC<{
  k?: HeaderTradeFragment$key;
}> = ({ k }) => {
  const { t } = useTranslation();
  const data = useFragment(fragment, k);
  const summary = useFragment<HeaderTradeSummaryFragment$key>(
    summaryFragment,
    data?.summary
  );

  const { width } = useWindowSize();
  const min = 470;

  const decimals = 4; // get from base denom
  const change = BigInt(summary?.change || 0);

  const env = useRelayEnvironment();

  useEffect(() => {
    if (!data?.id) return;
    const sub = requestSubscription(env, {
      subscription,
      variables: {
        id: data?.id,
      },
    });
    return () => {
      sub.dispose();
    };
  }, [data?.id]);

  return (
    <div className="trade__header">
      <div className="trade__header-price">
        <Decimal
          amount={BigInt(summary?.last || 0)}
          decimals={12}
          round={width < min ? 4 : decimals}
          as="h2"
        />
        <Fiat
          amount={BigInt(summary?.lastUsd || 0)}
          decimals={12}
          symbol="$"
          padSymbol={false}
        />
      </div>
      <div className="trade__header-stat">
        <h4>{t("change24h")}</h4>
        {change > 0n ? (
          <div className="flex ai-c color-teal">
            <span>+{(Number(change) / 10 ** 10).toLocaleDecimal(2)}%</span>
            <TrendUp className="block w-2 ml-0.5" />
          </div>
        ) : change < 0n ? (
          <div className="flex ai-c color-red">
            <span>{(Number(change) / 10 ** 10).toLocaleDecimal(2)}%</span>
            <Icons.TrendDown className="block w-2 ml-0.5" />
          </div>
        ) : (
          <div className="flex ai-c color-teal">
            <span>0.00%</span>
          </div>
        )}
      </div>
      <div className="trade__header-stat">
        <h4>{t("high24h")}</h4>
        <Decimal
          amount={BigInt(summary?.high || 0)}
          decimals={12}
          round={width < min ? 4 : decimals}
        />
      </div>
      <div className="trade__header-stat">
        <h4>{t("low24h")}</h4>
        <Decimal
          amount={BigInt(summary?.low || 0)}
          decimals={12}
          round={width < min ? 4 : decimals}
        />
      </div>
      <div className="trade__header-stat">
        <h4>{t("vol24h")}</h4>
        <div>
          ${nFormatter(BigInt(summary?.volumeUsd || 0), width < min ? 2 : 3, 8)}
        </div>
      </div>
      {data?.assetBase.price?.mcap ? (
        <div className="trade__header-stat">
          <h4>{t("marketCap")}</h4>
          <div>
            $
            {nFormatter(
              BigInt(data?.assetBase.price?.mcap || 0),
              width < min ? 2 : 3,
              0
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export const MarketSummaryFallback = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="trade__header-price">
        <h2>{t("loading")}</h2>
        <Fiat amount={0n} symbol="$" padSymbol={false} />
      </div>
      <div className="trade__header-stat">
        <h4>{t("change24h")}</h4>
        <span>{t("loading")}</span>
      </div>
      <div className="trade__header-stat">
        <h4>{t("high24h")}</h4>
        <span>{t("loading")}</span>
      </div>
      <div className="trade__header-stat">
        <h4>{t("low24h")}</h4>
        <span>{t("loading")}</span>
      </div>
      <div className="trade__header-stat">
        <h4>{t("vol24h")}</h4>
        <span>{t("loading")}</span>
      </div>
      {/* <div className="break" /> */}
    </>
  );
};
