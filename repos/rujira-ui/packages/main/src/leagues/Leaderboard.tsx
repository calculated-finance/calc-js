import { Buffer } from "buffer";
import clsx from "clsx";
import { motion } from "motion/react";
import {
  createContext,
  FC,
  PropsWithChildren,
  Suspense,
  useContext,
  useEffect,
  useRef,
  useTransition,
} from "react";
import {
  PreloadedQuery,
  useFragment,
  useLazyLoadQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { graphql } from "relay-runtime";
import {
  Button,
  Input,
  nFormatter,
  TranslationProvider,
  useLocale,
  useQueryParam,
  useTranslation,
} from "rujira.ui";
import rujiraLogo from "rujira.ui/assets/images/rujira.png";

import { Address } from "rujira.js";
import { Icons } from "rujira.ui";
import { getStaticProductSeo, ProductSeoHelmet } from "../seo";
import { useAccounts } from "../services/accounts";
import { useCapture } from "../services/useCapture";
import { LeaderboardAccountQuery } from "./__generated__/LeaderboardAccountQuery.graphql";
import { LeaderboardItemFragment$key } from "./__generated__/LeaderboardItemFragment.graphql";
import {
  LeaderboardLeaderboardQuery,
  LeagueLeaderboardSortBy,
  SortDir,
} from "./__generated__/LeaderboardLeaderboardQuery.graphql";
import { LeaderboardQuery } from "./__generated__/LeaderboardQuery.graphql";
import bg from "./assets/background.jpg";
import bolt from "./assets/bolt.webp";
import bronze from "./assets/bronze.png";
import silver from "./assets/silver.png";
import trophy from "./assets/trophy.png";

const Meta = () => {
  const { locale } = useLocale();

  return <ProductSeoHelmet seo={getStaticProductSeo("/leaderboard", locale)} />;
};

const query = graphql`
  query LeaderboardQuery {
    league {
      league
      season
      stats {
        totalPoints
        participants
      }
    }
  }
`;

const leaderboardQuery = graphql`
  query LeaderboardLeaderboardQuery(
    $search: String
    $sortBy: LeagueLeaderboardSortBy!
    $sortDir: SortDir!
  ) {
    league {
      leaderboard(
        first: 50
        search: $search
        sortBy: $sortBy
        sortDir: $sortDir
      ) {
        edges {
          node {
            address
            ...LeaderboardItemFragment
          }
        }
      }
    }
  }
`;

const accountQuery = graphql`
  query LeaderboardAccountQuery($id: ID!) {
    node(id: $id) {
      ... on LeagueAccount {
        address
        points
        rank
        rankPrevious
      }
    }
  }
`;

const context = createContext<
  [
    {
      sortBy: LeagueLeaderboardSortBy;
      sortDir: SortDir;
      search: string | undefined;
    },
    {
      setSortBy: (v: LeagueLeaderboardSortBy) => void;
      setSortDir: (v: SortDir) => void;
      setSearch: (v: string) => void;
    },
  ]
>([
  {
    sortBy: "RANK",
    sortDir: "ASC",
    search: "",
  },
  {
    setSortBy: () => {},
    setSortDir: () => {},
    setSearch: () => {},
  },
]);

const Context: FC<PropsWithChildren> = ({ children }) => {
  const [sortBy, setSortBy] = useQueryParam<LeagueLeaderboardSortBy>(
    "by",
    "RANK"
  );
  const [sortDir, setSortDir] = useQueryParam<SortDir>("dir", "ASC");
  const [search, setSearch] = useQueryParam<string>("q", "");

  return (
    <context.Provider
      value={[
        {
          sortBy,
          sortDir,
          search: search || undefined,
        },
        {
          setSortBy,
          setSortDir,
          setSearch,
        },
      ]}>
      {children}
    </context.Provider>
  );
};

export const Leaderboard: FC = () => {
  return (
    <TranslationProvider namespace="leagues">
      <LeaderboardContent />
    </TranslationProvider>
  );
};

const LeaderboardContent: FC = () => {
  const { t } = useTranslation();
  const data = useLazyLoadQuery<LeaderboardQuery>(query, {});
  const league = data.league[0];
  const { selected } = useAccounts();

  return (
    <Context>
      <Meta />
      <motion.div
        className="leaderboard__background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 4 }}
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="rujira__main">
        <div className="rujira__inner--pad leaderboard">
          <div className="rujira__inner">
            <h1 className="h1">{t("leaderboard")}</h1>
            <p className="intro">{t("pageDescription")}</p>
            <div className="row wrap pad mt-6">
              <div className="col-12 col-sm-4 col-md-3">
                <div className="card card--semi-transparent card--blur h-full p-3">
                  <h2 className="fs-16 lh-22 fw-400 color-grey">
                    {t("participatingAddresses")}
                  </h2>
                  <h3 className="fs-22 fs-md-32 condensed fw-500 mt-1">
                    {league.stats.participants}
                  </h3>
                </div>
              </div>
              <div className="col-12 col-sm-4 col-md-3 mt-2 mt-sm-0">
                <div className="card card--semi-transparent card--blur h-full p-3">
                  <h2 className="fs-16 lh-22 fw-400 color-grey">
                    {t("pointsGenerated")}
                  </h2>
                  <h3 className="fs-22 fs-md-32 condensed fw-500 mt-1">
                    {nFormatter(BigInt(league.stats.totalPoints), 2)}
                  </h3>
                </div>
              </div>
              <div className="col-12 col-sm-4 col-md-6 mt-2 mt-sm-0">
                <Suspense>
                  {selected && (
                    <AccountProvider
                      Component={Position}
                      account={selected.address}
                    />
                  )}
                </Suspense>
              </div>
            </div>
            <div className="card card--semi-transparent card--blur mt-4 p-2">
              <Filters />
              <Header />
              <Suspense fallback={<Fallback />}>
                <QueryProvider />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </Context>
  );
};

const Filters: FC = () => {
  const { t } = useTranslation("leagues");
  const [{ search }, { setSearch }] = useContext(context);

  return (
    <div className="row wrap pad--sm">
      <div className="col-12">
        <Input
          value={search || ""}
          onChange={(e) => setSearch(e.currentTarget.value)}
          label={t("search")}>
          {search && (
            <Icons.MinusCircle
              className="input-container__clear"
              onClick={() => setSearch("")}
            />
          )}
        </Input>
      </div>
    </div>
  );
};

const QueryProvider: FC = () => {
  const [q, loadQuery] =
    useQueryLoader<LeaderboardLeaderboardQuery>(leaderboardQuery);
  const [variables] = useContext(context);
  const [, transition] = useTransition();
  useEffect(() => {
    transition(() => {
      loadQuery(variables);
    });
  }, [variables]);

  return q ? <Content q={q} /> : null;
};

const Content: FC<{
  q: PreloadedQuery<LeaderboardLeaderboardQuery>;
}> = ({ q }) => {
  const d = usePreloadedQuery(leaderboardQuery, q);

  const league = d.league[0];

  const leaderboard = league.leaderboard;
  const [{ sortBy, sortDir, search }] = useContext(context);
  const showPodium =
    search === undefined
      ? (sortBy === "POINTS" && sortDir === "DESC") ||
        (sortBy === "RANK" && sortDir === "ASC")
      : false;

  return (
    <>
      {showPodium && leaderboard?.edges && leaderboard.edges.length >= 3 ? (
        <Podium
          items={[
            leaderboard.edges[0]!.node!,
            leaderboard.edges[1]!.node!,
            leaderboard.edges[2]!.node!,
          ]}
        />
      ) : null}
      {leaderboard?.edges
        ?.slice(showPodium ? 3 : 0)
        .map((x) =>
          x?.node ? <Item key={x.node.address} k={x.node} /> : null
        )}
      <NoResults count={league.leaderboard?.edges?.length || 0} />
    </>
  );
};
const itemFragment = graphql`
  fragment LeaderboardItemFragment on LeagueLeaderboardEntry {
    address
    points
    rank
    rankPrevious
    totalTx
    badges
  }
`;

const Podium: FC<{
  items: [
    LeaderboardItemFragment$key,
    LeaderboardItemFragment$key,
    LeaderboardItemFragment$key,
  ];
}> = ({ items }) => {
  return (
    <div className="gradient-card-container">
      <div className="gradient-card gradient-card--gold bg-deepBlack px-1 condensed fs-14 py-1">
        <PodiumItem k={items[0]} />
        <PodiumItem k={items[1]} />
        <PodiumItem k={items[2]} />
      </div>
    </div>
  );
};

const PodiumItem: FC<{
  k: LeaderboardItemFragment$key;
}> = ({ k }) => {
  const { t } = useTranslation("leagues");
  const item = useFragment(itemFragment, k);
  const rankChange = item.rankPrevious ? item.rankPrevious - item.rank : 0;

  return (
    <div
      className={clsx({
        "row ai-c pad-mini fs-22 fw-500 py-1": true,
        gold: item.rank === 1,
        silver: item.rank === 2,
        bronze: item.rank === 3,
      })}>
      <div className="col-1 text-center">{item.rank}</div>
      <div
        className={clsx({
          "col-2 text-center": true,
          "color-teal": rankChange > 0,
          "color-red": rankChange < 0,
          "color-grey": rankChange === 0,
        })}>
        {rankChange > 0 && <Icons.TrendUp className="w-2.5" />}
        {rankChange < 0 && <Icons.TrendDown className="w-2.5" />}{" "}
        {rankChange > 0 && "+"}
        {rankChange}
      </div>
      <div className="col-5">
        {nFormatter(BigInt(item.points), 2)}
        <span className="fs-16 color-grey fw-400 block">{`${item.address.slice(0, 8)} ... ${item.address.slice(-12)}`}</span>
      </div>
      <div className="col-2">
        <div className="flex ai-c">
          <span
            className={clsx({
              "fw-500": true,
              "color-teal": item.badges?.length,
            })}>
            {item.totalTx}
          </span>
          {item.badges?.map((b) => (
            <img
              src={bolt}
              alt="bolt"
              className="w-2.5 h-a ml-0.5"
              data-tooltip-id="global-tip"
              data-tooltip-content={t("leaderTooltip", { badge: b })}
            />
          ))}
        </div>
      </div>
      <div className="col-2 text-center">
        {item.rank === 1 && (
          <img src={trophy} alt="trophy" className="w-a h-5" />
        )}
        {item.rank === 2 && (
          <img src={silver} alt="medal" className="w-a h-5" />
        )}
        {item.rank === 3 && (
          <img src={bronze} alt="medal" className="w-a h-5" />
        )}
      </div>
    </div>
  );
};

const Item: FC<{
  k: LeaderboardItemFragment$key;
}> = ({ k }) => {
  const item = useFragment(itemFragment, k);
  const rankChange = item.rankPrevious ? item.rankPrevious - item.rank : 0;
  return (
    <div
      className={clsx({
        "row ai-c pad-mini fs-16 fw-400 py-1": true,
        gold: item.rank === 1,
        silver: item.rank === 2,
        bronze: item.rank === 3,
      })}>
      <div className="col-1 text-center">{item.rank}</div>
      <div
        className={clsx({
          "col-2 text-center": true,
          "color-teal": rankChange > 0,
          "color-red": rankChange < 0,
          "color-grey": rankChange === 0,
        })}>
        {rankChange > 0 && <Icons.TrendUp className="w-1.5" />}
        {rankChange < 0 && <Icons.TrendDown className="w-1.5" />}{" "}
        {rankChange > 0 && "+"}
        {rankChange}
      </div>
      <div className="col-5">
        {nFormatter(BigInt(item.points), 2, 8)}
        <span className="fs-14 color-grey fw-400 block">{`${item.address.slice(0, 8)} ... ${item.address.slice(-12)}`}</span>
      </div>
      <div className="col-2">
        {item.badges?.length ? (
          <div className="flex ai-c">
            <span className="fw-500 color-teal">
              {item.totalTx.toLocaleString()}
            </span>
            <img src={bolt} alt="bolt" className="w-2.5 h-a ml-0.5" />
          </div>
        ) : (
          <>{item.totalTx.toLocaleString()}</>
        )}
      </div>
      <div className="col-2 text-center">
        {item.rank === 1 && (
          <img src={trophy} alt="trophy" className="w-a h-3" />
        )}
        {item.rank === 2 && (
          <img src={silver} alt="medal" className="w-a h-3" />
        )}
        {item.rank === 3 && (
          <img src={bronze} alt="medal" className="w-a h-3" />
        )}
      </div>
    </div>
  );
};

const NoResults: FC<{ count: number }> = ({ count }) => {
  const { t } = useTranslation("leagues");
  if (count > 0) return null;
  return (
    <div className="px-1 condensed fs-14 leaderboard__table">
      <div className="col-12 text-center color-white fs-16 fw-400 py-3">
        {t("noResultsFound")}
      </div>
    </div>
  );
};

const Fallback: FC = () => {
  return (
    <>
      {[...Array(50)].map((_, i) => (
        <div className="row ai-c pad-mini fs-16 fw-400 py-1" key={i}>
          <div className="col-1 skeleton mx-1 br-2 h-1.5" />
          <div className="col-2 skeleton mx-1 br-2 h-1.5" />
          <div className="col-5 skeleton mx-1 br-2 h-1.5" />
          <div className="col-2 skeleton mx-1 br-2 h-1.5" />
          <div className="col-2  mx-1 br-2 h-1.5" />
        </div>
      ))}
    </>
  );
};

const Header: FC = () => {
  const { t } = useTranslation("leagues");
  return (
    <div className="row pad-mini p-1 condensed color-grey fs-14 fw-500 mt-2">
      <SortItem label={t("rank")} value={"RANK"} className="col-1 jc-c" />
      <div className={`flex ai-c no-select pointer col-2 jc-c`}>
        {t("change7d")}
      </div>

      <SortItem label={t("points")} value={"POINTS"} className="col-5" />
      <SortItem label={t("totalTxs")} value={"TOTAL_TX"} className="col-4" />
    </div>
  );
};

const AccountProvider: FC<
  PropsWithChildren<{
    account: Address;
    Component: FC<
      PropsWithChildren<{
        a: PreloadedQuery<LeaderboardAccountQuery>;
        address: Address;
      }>
    >;
  }>
> = ({ account, children, Component }) => {
  const [a, loadAccountQuery] =
    useQueryLoader<LeaderboardAccountQuery>(accountQuery);

  useEffect(() => {
    loadAccountQuery({
      id: Buffer.from(`LeagueAccount:genesis/0/${account.address}`).toString(
        "base64"
      ),
    });
  }, [account]);

  return a ? (
    <Component a={a} address={account}>
      {children}
    </Component>
  ) : null;
};

const Position: FC<{
  address: Address;
  a: PreloadedQuery<LeaderboardAccountQuery>;
}> = ({ address, a }) => {
  const { t } = useTranslation("leagues");
  const { selected } = useAccounts();
  const account = usePreloadedQuery(accountQuery, a);
  const rankChange =
    account.node?.rankPrevious && account.node.rank
      ? account.node?.rankPrevious - account.node?.rank
      : 0;

  const ref = useRef<HTMLDivElement>(null);
  const { copy, share } = useCapture(ref);

  /* const Prepare = (then: () => void) => {
    then();
  } */

  return (
    <>
      {/* Start Screenshot Capture Element */}
      <div className="leaderboard__share" ref={ref}>
        <div className="fs-16 lh-18 fw-400 color-grey">{t("rujiLeagues")}</div>
        <div className="fs-22 lh-22 fw-400 mt-0.5">
          {t("leaderboardPosition")}
        </div>
        <div className="flex ai-c mt-2">
          {account.node?.rank === 1 && (
            <img src={trophy} alt="trophy" className="w-a h-3 mr-1.5" />
          )}
          {account.node?.rank === 2 && (
            <img src={silver} alt="trophy" className="w-a h-3 mr-1.5" />
          )}
          {account.node?.rank === 3 && (
            <img src={bronze} alt="trophy" className="w-a h-3 mr-1.5" />
          )}
          <div className="fs-28 condensed fw-500 mr-2.5">
            #{account.node?.rank || "N/A"}
          </div>
          <div
            className={clsx({
              "fs-28 condensed fw-500 mr-1.5": true,
              "color-teal": rankChange > 0,
              "color-red": rankChange < 0,
              "color-grey": rankChange === 0,
            })}>
            {rankChange > 0 && <Icons.TrendUp className="w-2" />}
            {rankChange < 0 && <Icons.TrendDown className="w-2" />}{" "}
            {rankChange > 0 && "+"}
            {rankChange}
          </div>
        </div>
        <div className="flex ai-s mt-2 fs-22 fs-md-32 condensed fw-500">
          <div className="">
            {nFormatter(BigInt(account.node?.points || 0), 2)}{" "}
            <small className="fs-18 fs-md-22">
              {t("points").toLowerCase()}
            </small>
            <span className="fs-14 color-grey fw-400 block mt-0.5">
              https://rujira.network
            </span>
          </div>
        </div>
        <img src={rujiraLogo} className="leaderboard__share-logo mt-a ml-a" />
      </div>
      {/* End Screenshot Capture Element */}
      <div>
        <div
          className={clsx({
            "card card--semi-transparent card--blur h-full p-3": true,
            leaderboard__wallet: selected,
          })}>
          <div className="flex wrap-ai-c">
            <h2 className="fs-16 lh-22 fw-400 color-grey">{t("myPosition")}</h2>
            <Button
              className="button--xs ml-a"
              onClick={share}
              label={t("share")}
            />
            <Button
              className="button--xs ml-0.5"
              onClick={copy}
              label={t("screenshot")}
            />
          </div>
          {selected ? (
            <div className="flex ai-c">
              {account.node && (
                <>
                  <div className="fs-18 fs-md-24 condensed fw-500 mr-2.5">
                    #{account.node?.rank}
                  </div>
                  <div
                    className={clsx({
                      "fs-18 fs-md-24 condensed fw-500 mr-2.5": true,
                      "color-teal": rankChange > 0,
                      "color-red": rankChange < 0,
                      "color-grey": rankChange === 0,
                    })}>
                    {rankChange > 0 && <Icons.TrendUp className="w-2" />}
                    {rankChange < 0 && <Icons.TrendDown className="w-2" />}{" "}
                    {rankChange > 0 && "+"}
                    {rankChange}
                  </div>
                </>
              )}
              <div className="fs-22 fs-md-32 condensed fw-500">
                {nFormatter(BigInt(account.node?.points || 0), 2)}{" "}
                <small className="fs-18 fs-md-22">
                  {t("points").toLowerCase()}
                </small>
                <span className="fs-14 color-grey fw-400 block">
                  {`${address?.address.slice(0, 8)} ... ${address?.address.slice(-12)}`}
                </span>
              </div>
            </div>
          ) : (
            <p className="mt-1">{t("connectWalletMessage")}</p>
          )}
        </div>
      </div>
    </>
  );
};

const SortItem: FC<{
  label: string;
  value: LeagueLeaderboardSortBy;
  className: string;
}> = ({ className, label, value }) => {
  const [{ sortBy, sortDir }, { setSortBy, setSortDir }] = useContext(context);
  return (
    <div
      className={`flex ai-c no-select pointer ${className}`}
      onClick={() => {
        if (sortBy === value) setSortDir(sortDir === "ASC" ? "DESC" : "ASC");
        else setSortBy(value);
      }}>
      {label}
      {sortBy === value && sortDir === "DESC" && (
        <Icons.SortDown className="color-white ml-0.5 w-2 h-a" />
      )}
      {sortBy === value && sortDir === "ASC" && (
        <Icons.SortUp className="color-white ml-0.5 w-2 h-a" />
      )}
      {sortBy !== value && <Icons.Sort className="color-grey ml-0.5 w-2 h-a" />}
    </div>
  );
};
