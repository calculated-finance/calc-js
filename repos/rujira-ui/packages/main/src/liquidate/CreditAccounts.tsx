import clsx from "clsx";
import { FC, Suspense, useEffect, useState } from "react";
import {
  PreloadedQuery,
  useFragment,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { Link } from "react-router-dom";
import { graphql } from "relay-runtime";
import {
  Button,
  Icons,
  Toggle,
  TranslationProvider,
  useGlobalModalContext,
  useTranslation,
} from "rujira.ui";
import { LtvGraph } from "../borrow/components/Health";
import { assetToTradeUrlSegment } from "../services/assetUrl";
import { PostitionRowDebt } from "../borrow/components/Position";
import { MultiAsset } from "../borrow/components/MultiAsset";
import { CreditAccountsQuery } from "./__generated__/CreditAccountsQuery.graphql";
import { CreditAccountsRowFragment$key } from "./__generated__/CreditAccountsRowFragment.graphql";
import { Side } from "../trade/types";
import {
  LiquidationBidModal,
  LiquidationBidModalFallback,
} from "./LiquidationBidModal";
import { LIQUIDATION_BID_DISCOUNT_DEFAULT_BPS } from "./constants";
import { liquidationBidDeviationBps } from "./utils";

type AssetSegment = {
  readonly chain: string;
  readonly type: string;
  readonly metadata: { readonly symbol: string };
};
type FinPair = {
  readonly assetBase: AssetSegment;
  readonly assetQuote: AssetSegment;
};
type BidRoute = {
  bidSymbol: string;
  collateralSymbol: string;
  pairKey: string;
  side: Side;
};

const QUOTE_FALLBACKS = ["USDC", "USDT", "BTC"] as const;
const DEFAULT_PAIR_KEY = "BTC/USDC";

function buildBidRoute(
  collateral: AssetSegment,
  debt: AssetSegment,
  pairs: ReadonlyMap<string, FinPair>
): BidRoute {
  const collSeg = assetToTradeUrlSegment(collateral);
  const debtSeg = assetToTradeUrlSegment(debt);
  const collateralSymbol = collateral.metadata.symbol;
  const debtSymbol = debt.metadata.symbol;

  // Rule 2: direct COLLATERAL/DEBT pair means a buy tracking bid.
  if (pairs.has(`${collSeg}/${debtSeg}`))
    return {
      bidSymbol: debtSymbol,
      collateralSymbol,
      pairKey: `${collSeg}/${debtSeg}`,
      side: Side.Quote,
    };

  // Rule 3: inverse DEBT/COLLATERAL pair means a sell tracking bid.
  if (pairs.has(`${debtSeg}/${collSeg}`))
    return {
      bidSymbol: debtSymbol,
      collateralSymbol,
      pairKey: `${debtSeg}/${collSeg}`,
      side: Side.Base,
    };

  // Rule 4: fall back through COLLATERAL/USDC, COLLATERAL/USDT, COLLATERAL/BTC.
  for (const quote of QUOTE_FALLBACKS) {
    if (pairs.has(`${collSeg}/${quote}`))
      return {
        bidSymbol: quote,
        collateralSymbol,
        pairKey: `${collSeg}/${quote}`,
        side: Side.Quote,
      };
  }

  return {
    bidSymbol: "USDC",
    collateralSymbol: "BTC",
    pairKey: DEFAULT_PAIR_KEY,
    side: Side.Quote,
  };
}

type LiquidationDirection = {
  side: Side;
  baseSymbol: string;
  quoteSymbol: string;
};

function getLiquidationDirection(
  collateral: AssetSegment,
  debt: AssetSegment,
  pair: FinPair | undefined
): LiquidationDirection | null {
  if (!pair) return null;

  const baseSegment = assetToTradeUrlSegment(pair.assetBase);
  const baseSymbol = pair.assetBase.metadata.symbol;
  const quoteSymbol = pair.assetQuote.metadata.symbol;

  if (assetToTradeUrlSegment(collateral) === baseSegment) {
    return { side: Side.Quote, baseSymbol, quoteSymbol };
  }

  if (assetToTradeUrlSegment(debt) === baseSegment) {
    return { side: Side.Base, baseSymbol, quoteSymbol };
  }

  return null;
}

function buildBidDetailsUrl(route: BidRoute): string {
  const params = new URLSearchParams({
    type: "manual",
    order: "tracking",
  });

  if (route.side === Side.Base) params.set("side", Side.Base);
  params.set(
    "deviation",
    liquidationBidDeviationBps(
      route.side,
      LIQUIDATION_BID_DISCOUNT_DEFAULT_BPS
    ).toString()
  );

  return `/trade/${route.pairKey}?${params.toString()}`;
}

const query = graphql`
  query CreditAccountsQuery {
    ghostCredit {
      accounts(first: 20, sortBy: LTV, sortDir: DESC) {
        edges {
          node {
            account {
              address
            }
            ...CreditAccountsRowFragment
          }
        }
      }
    }
    finV2(first: 100, sortBy: VOLUME_USD, sortDir: DESC) {
      edges {
        node {
          assetBase {
            chain
            type
            metadata {
              symbol
            }
          }
          assetQuote {
            chain
            type
            metadata {
              symbol
            }
          }
        }
      }
    }
  }
`;

const Header: FC<{
  ariaLabel?: string;
  label: string;
  tooltip: string;
  centered?: boolean;
}> = ({ ariaLabel, label, tooltip, centered = false }) => {
  return (
    <th className={clsx({ "text-center": centered })}>
      <span
        className="iflex ai-c no-select"
        tabIndex={0}
        aria-label={ariaLabel ?? tooltip}
        data-tooltip-id="global-tip"
        data-tooltip-html={`<div class="w-30 text-left">${tooltip}</div>`}>
        {label}
        <Icons.Info className="ml-0.5 block w-2" />
      </span>
    </th>
  );
};

const LiquidationTableHeaders: FC = () => {
  const { t } = useTranslation("liquidate");

  return (
    <>
      <Header
        label={t("liquidationCollateral")}
        tooltip={t("liquidationCollateralHeaderTooltip")}
      />
      <Header
        label={t("liquidationDebt")}
        tooltip={t("liquidationDebtHeaderTooltip")}
      />
      <Header
        ariaLabel={t("liquidationDirectionHeaderAria")}
        label={t("liquidationDirection")}
        tooltip={t("liquidationDirectionHeaderTooltip")}
        centered
      />
      <Header
        label={t("liquidationLtv")}
        tooltip={t("liquidationLtvHeaderTooltip")}
        centered
      />
      <th className="text-right">{t("liquidationBidOnLiquidation")}</th>
    </>
  );
};

const LiquidationTableColumns: FC = () => (
  <colgroup>
    <col style={{ width: "23%" }} />
    <col style={{ width: "17%" }} />
    <col style={{ width: "16%" }} />
    <col style={{ width: "28%" }} />
    <col style={{ width: "16%" }} />
  </colgroup>
);

export const CreditAccountsFallback: FC = () => (
  <div className="table-sticky">
    <table
      className="table table--big condensed"
      style={{ tableLayout: "fixed" }}>
      <LiquidationTableColumns />
      <thead>
        <tr>
          <LiquidationTableHeaders />
        </tr>
      </thead>
      <tbody>
        {[...Array(4)].map((_, i) => (
          <tr key={`skeleton_${i}`}>
            <td>
              <div className="skeleton h-1.5 w-10 br-2" />
            </td>
            <td>
              <div className="skeleton h-1.5 w-10 br-2" />
            </td>
            <td>
              <div className="flex jc-c">
                <div className="skeleton h-1.5 w-4 br-2" />
              </div>
            </td>
            <td className="text-center">
              <div className="skeleton h-1.5 w-5 br-2 mx-a" />
            </td>
            <td>
              <div className="skeleton h-2 w-8 br-2 ml-a" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const CreditAccounts: FC = () => {
  const [q, load] = useQueryLoader<CreditAccountsQuery>(query);
  useEffect(() => {
    load({});
  }, []);
  if (!q) return <CreditAccountsFallback />;
  return (
    <TranslationProvider namespace="portfolio">
      <Suspense fallback={<CreditAccountsFallback />}>
        <Content q={q} />
      </Suspense>
    </TranslationProvider>
  );
};

const Content: FC<{ q: PreloadedQuery<CreditAccountsQuery> }> = ({ q }) => {
  const data = usePreloadedQuery<CreditAccountsQuery>(query, q);
  const [hideSmall, setHideSmall] = useState(true);
  const { t } = useTranslation();

  const pairs = new Map<string, FinPair>(
    data.finV2?.edges?.flatMap((e) =>
      e?.node
        ? [
            [
              `${assetToTradeUrlSegment(e.node.assetBase)}/${assetToTradeUrlSegment(e.node.assetQuote)}`,
              {
                assetBase: e.node.assetBase,
                assetQuote: e.node.assetQuote,
              },
            ] as const,
          ]
        : []
    ) ?? []
  );

  return (
    <div className="table-sticky mt-3">
      <div
        className="text-right"
        style={{ position: "absolute", top: "0.5rem", right: "2rem" }}>
        <Toggle
          label={t("common:hideLowValueBalances")}
          className="toggle--xs color-white as-c mb-2"
          checked={hideSmall}
          onChange={(e) => setHideSmall(e.currentTarget.checked)}
        />
      </div>
      <table
        className="table table--big condensed"
        style={{ tableLayout: "fixed" }}>
        <LiquidationTableColumns />
        <thead>
          <tr>
            <LiquidationTableHeaders />
          </tr>
        </thead>
        <tbody>
          {data.ghostCredit?.accounts.edges?.map((a) =>
            a?.node ? (
              <Row
                key={a.node.account.address}
                k={a.node}
                hideSmall={hideSmall}
                pairs={pairs}
              />
            ) : null
          )}
        </tbody>
      </table>
    </div>
  );
};

const fragment = graphql`
  fragment CreditAccountsRowFragment on GhostCreditAccount {
    collaterals {
      collateral {
        __typename
        ... on Balance {
          asset {
            asset
            chain
            type
            metadata {
              symbol
            }
          }
          amount
        }
      }
      valueFull
      valueAdjusted
    }
    debts {
      value
      debt {
        current
        borrower {
          vault {
            status {
              debtRate
            }
          }
          asset {
            chain
            type
            metadata {
              symbol
            }
          }
        }
      }
    }
    ltv
    valueUsd
  }
`;

export const Row: FC<{
  k: CreditAccountsRowFragment$key;
  hideSmall: boolean;
  pairs: ReadonlyMap<string, FinPair>;
}> = ({ k, hideSmall, pairs }) => {
  const data = useFragment(fragment, k);
  const { showModal, hideModal } = useGlobalModalContext();
  const { t } = useTranslation("liquidate");
  if (hideSmall && data.valueUsd < 100_000_000n) return null;

  // Rule 1: pick the highest-value collateral
  const primaryCollateral = [...data.collaterals]
    .filter((c) => c.collateral.__typename === "Balance")
    .sort((a, b) => Number(b.valueFull - a.valueFull))[0];

  // Pick the highest-value debt
  const primaryDebt = [...data.debts].sort((a, b) =>
    Number(b.value - a.value)
  )[0];

  const bidRoute =
    primaryCollateral?.collateral.__typename === "Balance" && primaryDebt
      ? buildBidRoute(
          primaryCollateral.collateral.asset,
          primaryDebt.debt.borrower.asset,
          pairs
        )
      : null;
  const detailsTo = bidRoute ? buildBidDetailsUrl(bidRoute) : null;
  const direction =
    bidRoute &&
    primaryCollateral?.collateral.__typename === "Balance" &&
    primaryDebt
      ? getLiquidationDirection(
          primaryCollateral.collateral.asset,
          primaryDebt.debt.borrower.asset,
          pairs.get(bidRoute.pairKey)
        )
      : null;

  const openBid = () => {
    if (!bidRoute) return;
    showModal({
      backgroundClose: false,
      children: (
        <Suspense
          fallback={
            <LiquidationBidModalFallback
              bidSymbol={bidRoute.bidSymbol}
              collateralSymbol={bidRoute.collateralSymbol}
              side={bidRoute.side}
            />
          }>
          <LiquidationBidModal
            bidSymbol={bidRoute.bidSymbol}
            collateralSymbol={bidRoute.collateralSymbol}
            hideModal={hideModal}
            pairKey={bidRoute.pairKey}
            side={bidRoute.side}
          />
        </Suspense>
      ),
    });
  };

  return (
    <tr>
      <td>
        <MultiAsset collaterals={data.collaterals} />
      </td>
      <td>
        {data.debts.map((x, idx) => (
          <PostitionRowDebt key={idx} {...x} />
        ))}
      </td>
      <td className="text-center">
        <DirectionPill direction={direction} />
      </td>
      <td className="text-center">
        <div className="iflex">
          <LtvGraph ltv={BigInt(data.ltv)} />
        </div>
      </td>
      <td>
        {bidRoute && detailsTo && (
          <div className="flex dir-c gap-0.5 w-14 ml-a">
            <Button
              className="button--xs w-full"
              label={t("liquidationBidPlaceBid")}
              onClick={openBid}
            />
            <Link
              to={detailsTo}
              className="button button--xs button--outline button--grey w-full button--icon-right">
              {t("liquidationBidDetails")}
              <Icons.ArrowUpRight />
            </Link>
          </div>
        )}
      </td>
    </tr>
  );
};

const DirectionPill: FC<{
  direction: LiquidationDirection | null;
}> = ({ direction }) => {
  const { t } = useTranslation("liquidate");

  if (!direction) return <span className="color-grey">-</span>;

  const isBuy = direction.side === Side.Quote;
  const tooltip = isBuy
    ? t("liquidationDirectionBuyTooltip", {
        base: direction.baseSymbol,
        quote: direction.quoteSymbol,
      })
    : t("liquidationDirectionSellTooltip", {
        base: direction.baseSymbol,
        quote: direction.quoteSymbol,
      });

  return (
    <span
      className={clsx("tag tag--borderless", {
        "tag--teal": isBuy,
        "tag--red": !isBuy,
      })}
      tabIndex={0}
      aria-label={tooltip}
      data-tooltip-id="global-tip"
      data-tooltip-content={tooltip}>
      {isBuy
        ? t("liquidationDirectionBuy")
        : t("liquidationDirectionSell")}
    </span>
  );
};
