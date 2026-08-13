import clsx from "clsx";
import { FC, Suspense, useEffect, useState } from "react";
import { useFragment, useLazyLoadQuery } from "react-relay";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { graphql } from "relay-runtime";
import {
  assetPairFilter,
  assetPairSearchRank,
  BTC,
  priceFormatter,
} from "rujira.js";
import {
  AssetLabel,
  createSortContext,
  Decimal,
  Fiat,
  IconDenom,
  Icons,
  Input,
  nFormatter,
  SortDir,
  useQueryParam,
  useTranslation,
} from "rujira.ui";

import { assetToTradeUrlSegment } from "../../services/assetUrl";
import { useFavorites } from "../../services/favorites";
import {
  pairSwitchTradeUrlParams,
  searchFromParams,
} from "../tradeUrlState";
import { MarketsItemFragment$key } from "./__generated__/MarketsItemFragment.graphql";
import {
  FinSortBy,
  MarketsQuery,
  MarketsQuery$data,
} from "./__generated__/MarketsQuery.graphql";

enum Section {
  Featured = "Featured",
  Usdc = "USDC",
  Btc = "BTC",
  Eth = "ETH",
  Pegged = "Pegged",
  All = "All",
  Favorites = "favorites",
}

const sections: Section[] = [
  Section.Featured,
  //Section.Usdc,
  Section.Btc,
  Section.Eth,
  Section.Pegged,
  Section.All,
  Section.Favorites,
];

const checkFeatured = (base: string): boolean =>
  [
    "AVAX-AVAX",
    "BASE-ETH",
    "BCH-BCH",
    "BSC-BNB",
    "BTC-BTC",
    "DOGE-DOGE",
    "ETH-ETH",
    "GAIA-ATOM",
    "LTC-LTC",
    "THOR.AUTO",
    "THOR.LQDY",
    "THOR.RUJI",
    "THOR.RUNE",
    "THOR.TCY",
    "XRP-XRP",
  ].includes(base);

const checkPegged = (base: string, quote: string): boolean =>
  (base.includes("USD") && quote.includes("USD")) ||
  (base.includes(BTC) && quote.includes(BTC)) ||
  (base === "bRUNE" && quote === "RUNE");

const sectionFilter =
  (favorites: /* Record<string, boolean> */ Array<string>, section?: Section) =>
  (a: {
    id: string;
    address: string;
    assetBase: { asset: string; metadata: { symbol: string } };
    assetQuote: { asset: string; metadata: { symbol: string } };
  }): boolean => {
    if (!section) return true;
    if (section === Section.All) return true;
    if (section === Section.Favorites) return favorites.includes(a.id);
    if (section === Section.Featured) return checkFeatured(a.assetBase.asset);
    if (section === Section.Pegged)
      return checkPegged(
        a.assetBase.metadata.symbol,
        a.assetQuote.metadata.symbol
      );

    return (
      a.assetBase.metadata.symbol === section ||
      a.assetQuote.metadata.symbol === section
    );
  };

const q = graphql`
  query MarketsQuery($sortBy: FinSortBy!, $sortDir: SortDir!) {
    finV2(first: 100, sortBy: $sortBy, sortDir: $sortDir) {
      edges {
        node {
          id
          address
          assetBase {
            asset
            chain
            metadata {
              symbol
            }
          }
          assetQuote {
            asset
            chain
            metadata {
              symbol
            }
          }
          ...MarketsItemFragment
        }
      }
    }
  }
`;

const sort = createSortContext<FinSortBy>("VOLUME_USD", SortDir.Desc);

export const Markets = ({ closeDrawer }: { closeDrawer?: () => void }) => {
  const { t } = useTranslation();
  const [section, setSection] = useQueryParam<Section>("s", Section.Featured);
  const [query, setQuery] = useQueryParam<string>("q", "");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!searched && section === Section.Featured && query !== "") {
      setSection(Section.All);
      setSearched(true);
    }
  }, [section, query]);

  const { base: selectedBase, quote: selectedQuote } = useParams<{
    base: string;
    quote: string;
  }>();
  const isMarketsPage = !selectedBase || !selectedQuote;

  const touch = matchMedia("(hover: none)").matches;

  return (
    <sort.Provider>
      <div className={!isMarketsPage ? "pr-2" : ""}>
        <Input
          autoFocus={!touch}
          label={t("search")}
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}>
          {query !== "" && (
            <Icons.MinusCircle
              className="input-container__clear"
              onClick={() => {
                setQuery("");
                setSearched(false);
              }}
            />
          )}
        </Input>
        <div className={"flex dir-r"}>
          <nav
            className="tabs tabs--sm mt-1 wrap gap-0.5"
            style={{ maxWidth: "100%" }}>
            {sections.map((s) => (
              <a
                key={s}
                className={clsx({
                  selected: section === s,
                  "px-1 lonely": s === Section.Favorites,
                })}
                onClick={() => setSection(s)}>
                {s === Section.Favorites ? (
                  <Icons.StarSolid className="w-2 h-2 ml-0" />
                ) : (
                  s
                )}
              </a>
            ))}
            {!isMarketsPage && (
              <Link to="../.." relative="path" className={"transparent"}>
                {t("details")}
                <Icons.External className="w-2 h-2" />
              </Link>
            )}
          </nav>
        </div>
      </div>
      <div
        className={
          isMarketsPage
            ? "relative card p-3 mt-2 table-sticky"
            : "trade__markets-overflow mt-3"
        }>
        <table
          className={
            isMarketsPage ? "table table--big condensed" : "table table--va-m"
          }>
          <thead className="border">
            <tr>
              <th className="nopad w-1"></th>
              <sort.Item label={t("pair")} value="NAME" />
              <th className="text-right nowrap">{t("lastPrice")}</th>
              <sort.Item
                label={t("change24h")}
                value="CHANGE"
                className="jc-e"
              />
              <sort.Item
                label={t("volume24h")}
                value="VOLUME_USD"
                className="jc-e"
              />
            </tr>
          </thead>
          <tbody>
            <Suspense fallback={<Fallback />}>
              <Content
                closeDrawer={closeDrawer}
                query={query}
                section={section}
              />
            </Suspense>
          </tbody>
        </table>
      </div>
    </sort.Provider>
  );
};

type Node = NonNullable<
  NonNullable<
    NonNullable<NonNullable<MarketsQuery$data>["finV2"]["edges"]>[0]
  >["node"]
>;

const Content: FC<{
  closeDrawer?: () => void;
  query?: string;
  section?: Section;
}> = ({ closeDrawer, query, section }) => {
  const { t } = useTranslation();
  const { sortBy, sortDir } = sort.useValues();
  const data = useLazyLoadQuery<MarketsQuery>(
    q,
    { sortBy, sortDir },
    { fetchPolicy: "store-and-network" }
  );

  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const toggleFavorite = (v: string) => {
    if (favorites.includes(v)) {
      removeFavorite(v);
    } else {
      addFavorite(v);
    }
  };

  const pairs: Node[] =
    data.finV2.edges?.reduceRight(
      (a: Node[], v) => (v?.node ? [v.node, ...a] : a),
      []
    ) || [];

  const items = pairs
    .filter(assetPairFilter(query))
    .filter(sectionFilter(favorites, section));

  if (query?.trim().toLowerCase() === "eth") {
    const rank = assetPairSearchRank(query);
    items.sort((a, b) => rank(a) - rank(b));
  }
  // .sort((a, b) => {
  //   // Prioritize LIVE status
  //   if (a.deploymentStatus === "LIVE" && b.deploymentStatus !== "LIVE")
  //     return -1;
  //   if (a.deploymentStatus !== "LIVE" && b.deploymentStatus === "LIVE")
  //     return 1;

  //   // If both are the same, sort by symbol
  //   return a.assetBase.metadata.symbol.localeCompare(
  //     b.assetBase.metadata.symbol
  //   );
  // });

  if (!items?.length) {
    return (
      <tr>
        <td colSpan={5} className="text-center color-grey">
          <br />
          {t("noResultsFound")}
        </td>
      </tr>
    );
  }

  return items.map((x) => (
    <Item
      key={x.address}
      k={x}
      closeDrawer={closeDrawer}
      favorite={favorites.includes(x.id)}
      toggleFavorite={() => toggleFavorite(x.id)}
    />
  ));
};

const fragment = graphql`
  fragment MarketsItemFragment on FinPair {
    id
    address
    assetBase {
      asset
      chain
      type
      metadata {
        symbol
        decimals
      }
    }
    assetQuote {
      asset
      chain
      type
      metadata {
        symbol
        decimals
      }
      price {
        current
      }
    }
    summary {
      last
      change
      volumeUsd
      volume {
        amount
        asset {
          metadata {
            symbol
          }
        }
      }
    }
  }
`;

const Item: FC<{
  k: MarketsItemFragment$key;
  closeDrawer?: () => void;
  toggleFavorite: () => void;
  favorite: boolean;
}> = ({ k, closeDrawer, toggleFavorite, favorite }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { base: selectedBase, quote: selectedQuote } = useParams<{
    base: string;
    quote: string;
  }>();
  const x = useFragment(fragment, k);
  const change = BigInt(x.summary?.change || 0);
  const isMarketsPage = !selectedBase || !selectedQuote;

  return (
    <tr
      key={x.address}
      className="pointer"
      onClick={() => {
        const nextParams = pairSwitchTradeUrlParams(
          new URLSearchParams(location.search)
        );
        const next = `${assetToTradeUrlSegment(x.assetBase)}/${assetToTradeUrlSegment(x.assetQuote)}${nextParams ? searchFromParams(nextParams) : ""}`;
        navigate(isMarketsPage ? next : `../../${next}`, {
          relative: "path",
          state: { pairId: x.id },
        });
        closeDrawer?.();
      }}>
      <td className="nopad">
        <button
          className="transparent py-1 pr-0.5 color-grey pointer"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite();
          }}>
          {favorite ? (
            <Icons.StarSolid
              className={isMarketsPage ? "w-3 h-3" : "w-2 h-2"}
            />
          ) : (
            <Icons.Star className={isMarketsPage ? "w-3 h-3" : "w-2 h-2"} />
          )}
        </button>
      </td>
      <td>
        <div
          className={clsx({
            "flex ai-c": true,
            "fs-20 fs-lg-26 fw-400": isMarketsPage,
          })}>
          <div className={isMarketsPage ? "lp mt-0.5" : "pair mr-0.5"}>
            <IconDenom
              className={isMarketsPage ? "" : "w-2"}
              denom={x.assetBase.metadata.symbol}
            />
            <IconDenom
              className={isMarketsPage ? "" : "w-2"}
              denom={x.assetQuote.metadata.symbol}
            />
          </div>
          <div
            className={clsx({
              "flex ai-b": true,
              "ml-1": isMarketsPage,
            })}>
            <AssetLabel
              asset={x.assetBase}
              Container={({ children }) => (
                <span
                  className={clsx({
                    "color-grey": true,
                    "fs-11 fw-500": !isMarketsPage,
                    "fs-14 fs-lg-16": isMarketsPage,
                  })}>
                  {children}
                </span>
              )}
            />

            <span className="color-grey ml-0.5">
              <AssetLabel
                asset={x.assetQuote}
                Container={({ children }) => (
                  <span
                    className={clsx({
                      "color-grey": true,
                      "fs-11 fw-500": !isMarketsPage,
                      "fs-14 fs-lg-16": isMarketsPage,
                    })}>
                    {children}
                  </span>
                )}
              />
            </span>
          </div>
        </div>
      </td>
      <td className="text-right">
        <span
          className={clsx({
            "condensed fs-16 fs-lg-18": isMarketsPage,
          })}>
          {priceFormatter(BigInt(x?.summary?.last || 0))}
          <span
            className={clsx("color-grey", {
              "fs-13 fs-lg-15": isMarketsPage,
              "fs-12": !isMarketsPage,
            })}>
            {" " + x.assetQuote.metadata.symbol}
          </span>
        </span>
        {isMarketsPage && (
          <>
            <br />
            <Fiat
              amount={
                BigInt(x?.summary?.last || 0) *
                BigInt(x.assetQuote.price?.current || 1)
              }
              decimals={24}
              symbol="$"
              className="color-grey fs-14 condensed"
            />
          </>
        )}
      </td>
      <td
        className={clsx({
          "text-right": true,
          "color-teal": change > 0n,
          "color-red": change < 0n,
          "color-grey": change === 0n,
        })}>
        {change > 0n ? "+" : ""}
        {(Number(change) / 10 ** 10).toLocaleDecimal(2)}%
      </td>
      <td
        className={clsx({
          "text-right": true,
          "fs-14 fs-lg-15": isMarketsPage,
        })}>
        ${nFormatter(BigInt(x.summary?.volumeUsd || 0), 2, 8)}
        {isMarketsPage && (
          <>
            <br />
            <Decimal
              amount={BigInt(x.summary?.volume.amount || 0)}
              decimals={8}
              symbol={x.summary?.volume.asset.metadata.symbol}
              className="color-grey fs-14 condensed"
            />
          </>
        )}
      </td>
    </tr>
  );
};

const Fallback = () => (
  <>
    {[...Array(10)].map((_, i) => (
      <tr key={`skeleton_${i}`}>
        <td className="nopad w-1"></td>
        <td className={`opacity-${20 - i * 2}`}>
          <div className="flex ai-c">
            <div className="pair mr-0.5">
              <div className="icon-denom skeleton h-2 w-2 br-2" />
              <div className="icon-denom skeleton h-2 w-2 br-2" />
            </div>
            <div className="w-full skeleton h-1.5 w-1.5 br-2" />
          </div>
        </td>
        <td className={`opacity-${20 - i * 2}`}>
          <div className="w-full skeleton h-1.5 w-1.5 br-2" />
        </td>
        <td className={`opacity-${20 - i * 2}`}>
          <div className="w-full skeleton h-1.5 w-1.5 br-2" />
        </td>
        <td className={`opacity-${20 - i * 2}`}>
          <div className="w-full skeleton h-1.5 w-1.5 br-2" />
        </td>
      </tr>
    ))}
  </>
);
