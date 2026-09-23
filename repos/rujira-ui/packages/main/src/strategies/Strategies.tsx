import {
  FC,
  Suspense,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { PreloadedQuery, usePreloadedQuery, useQueryLoader } from "react-relay";
import { Tooltip } from "react-tooltip";
import { graphql } from "relay-runtime";
import {
  createSortContext,
  Input,
  Loader,
  Pagination,
  SortDir,
  TranslationProvider,
  useLocale,
  useQueryParam,
  useQueryParams,
  useTranslation,
} from "rujira.ui";

import { Icons } from "rujira.ui";
import { getStaticProductSeo, ProductSeoHelmet } from "../seo";
import {
  StrategiesQuery,
  StrategiesQuery$data,
  StrategySortBy,
} from "./__generated__/StrategiesQuery.graphql";
import { Balances, BalancesFallback } from "./components/Balances";
import { BowPoolXykRow } from "./components/BowPoolXyk";
import { GhostVaultRow } from "./components/GhostVault";
import { IndexVaultRow } from "./components/IndexVault";
import { StakingPoolRow } from "./components/StakingPool";
import { ThorchainPoolRow } from "./components/ThorchainPool";

const Meta = () => {
  const { locale } = useLocale();

  return <ProductSeoHelmet seo={getStaticProductSeo("/strategies", locale)} />;
};

const query = graphql`
  query StrategiesQuery(
    $first: Int
    $last: Int
    $query: String
    $typenames: [String!]
    $after: String
    $before: String
    $sortBy: StrategySortBy
    $sortDir: SortDir
  ) {
    strategies(
      first: $first
      last: $last
      query: $query
      typenames: $typenames
      sortBy: $sortBy
      sortDir: $sortDir
      after: $after
      before: $before
    ) {
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      edges {
        cursor
        node {
          __typename
          ... on BowPoolXyk {
            ...BowPoolXykRowFragment
          }
          ... on ThorchainPool {
            ...ThorchainPoolRowFragment
          }
          ... on IndexVault {
            ...IndexVaultRowFragment
          }
          ... on StakingPool {
            ...StakingPoolRowFragment
          }
          ... on GhostVault {
            ...GhostVaultRowFragment
          }
        }
      }
    }
  }
`;

const sort = createSortContext<StrategySortBy>("TVL", SortDir.Desc);

export const Strategies: FC = () => {
  return (
    <TranslationProvider namespace="strategies">
      <sort.Provider>
        <Meta />
        <Content />
      </sort.Provider>
    </TranslationProvider>
  );
};

export const options = [
  { labelKey: "ammXyk", value: "BowPoolXyk" },
  //{ labelKey: "ammThorchainClp", value: "ThorchainPool" },
  // { labelKey: "index", value: "IndexVault" },
  { labelKey: "lending", value: "GhostVault" },
  { labelKey: "staking", value: "StakingPool" },
];

const Content: FC = () => {
  const { t } = useTranslation();
  const [filters_, setFilters_] = useQueryParam<string>(
    "filters",
    options
      .filter((x) => x.value !== "ThorchainPool")
      .map((x) => x.value)
      .join(",")
  );

  const filters = useMemo(
    () => (filters_ ? filters_.split(",") : []),
    [filters_]
  );
  const setFilters = (f: string[]) => setFilters_(f.join(","));
  const [params, setParams] = useQueryParams<string>({
    after: "",
    before: "",
    search: "",
  });
  const { search, after, before } = params;

  const resetFilters = () => {
    //setFilters([]);
    setFilters(options.map((x) => x.value));
  };

  const setFilter = (filter: string) => {
    setParams({});
    setFilters([filter]);
  };

  const toggleFilter = (filter: string) => {
    setParams({});
    setFilters(
      filters.includes(filter)
        ? filters.filter((x) => x !== filter)
        : [...filters, filter]
    );
  };

  const [q, loadQuery] = useQueryLoader<StrategiesQuery>(query);
  const [isLoading, transition] = useTransition();
  const { sortBy, sortDir } = sort.useValues();

  useEffect(() => {
    transition(() => {
      loadQuery(
        {
          [before ? "last" : "first"]: 20,
          query: search?.toLowerCase() || undefined,
          typenames: filters.length ? filters : undefined,
          sortBy,
          sortDir,
          after: after || undefined,
          before: before || undefined,
        },
        { fetchPolicy: "store-and-network" }
      );
    });
  }, [search, filters, sortBy, sortDir, after, before]);

  return (
    <>
      <div className="rujira__main rujira__main--gradient pools">
        <div className="rujira__inner--pad">
          <div className="pools__container">
            <div className="pools__left" />
            <div className="pools__main">
              <h1 className="h1">{t("title")}</h1>

              <h2 className="fs-24 lh-32 fw-400 color-white">
                {t("description")}
              </h2>

              <div className="flex wrap ai-c mb-2 mt-2">
                <h4 className="h4 fs-12 mb-0 mr-1 color-grey">
                  {t("quickFilters")}
                </h4>
                <nav className="tabs tabs--sm wrap w-full">
                  <a
                    className={filters.length === 0 ? "selected" : ""}
                    onClick={resetFilters}>
                    {t("common:all")}
                  </a>
                  <div className="divider mx-1" />
                  {options.map((o) => (
                    <Option
                      key={o.value}
                      label={t(o.labelKey)}
                      value={o.value}
                      selected={!filters.length || filters.includes(o.value)}
                      toggleFilter={toggleFilter}
                      setFilter={setFilter}
                    />
                  ))}
                  {isLoading && <Loader className="w-4 h-4" />}
                </nav>
              </div>
              <Input
                label={t("common:search")}
                value={search}
                className="mt-1 mb-2"
                onChange={(e) =>
                  setParams({
                    before: "",
                    after: "",
                    search: e.currentTarget.value,
                  })
                }>
                {search !== "" && (
                  <Icons.MinusCircle
                    className="input-container__clear"
                    onClick={() =>
                      setParams({ before: "", after: "", search: "" })
                    }
                  />
                )}
              </Input>

              <div className="relative card p-3">
                {q ? (
                  <Table
                    q={q}
                    setAfter={(v) => {
                      setParams({ after: v, before: "", search });
                    }}
                    setBefore={(v) => {
                      setParams({ before: v, after: "", search });
                    }}
                  />
                ) : (
                  <Fallback />
                )}
              </div>
            </div>
            <Suspense fallback={<BalancesFallback />}>
              <Balances />
            </Suspense>
          </div>
        </div>
      </div>
      <Tooltip id="pools-tip" className="tooltip" float={true} />
    </>
  );
};

const Option = ({
  label,
  value,
  selected,
  toggleFilter,
  setFilter,
}: {
  label: string;
  value: string;
  selected: boolean;
  toggleFilter: (value: string) => void;
  setFilter: (value: string) => void;
}) => {
  const [hover, setHover] = useState(false);
  return (
    <a onClick={() => setFilter(value)} className={selected ? "selected" : ""}>
      {label}
      {selected ? (
        <button
          onMouseOver={() => setHover(true)}
          onMouseOut={() => setHover(false)}
          className="transparent color-grey hover-white pointer"
          onClick={(e) => {
            e.stopPropagation();
            setHover(false);
            toggleFilter(value);
          }}>
          {hover ? <Icons.Minus /> : <Icons.Check />}
        </button>
      ) : (
        <button
          className="transparent color-grey hover-white pointer"
          onClick={(e) => {
            e.stopPropagation();
            toggleFilter(value);
          }}>
          <Icons.Plus />
        </button>
      )}
    </a>
  );
};

const Table: FC<{
  q: PreloadedQuery<StrategiesQuery>;
  setAfter: (v: string) => void;
  setBefore: (v: string) => void;
}> = ({ q, setAfter, setBefore }) => {
  const { t } = useTranslation();
  const data = usePreloadedQuery(query, q);

  return (
    <div className="table-sticky">
      <table className="table table--big condensed mb-2">
        <thead>
          <tr>
            <sort.Item label={t("strategy")} value="NAME" />
            <sort.Item label={t("tvl")} value="TVL" />
            <th className="text-right">{t("apr")}</th>
            <th className="text-right">{t("earnMechanism")}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {data?.strategies.edges?.map((x) =>
            x?.node ? <Row key={x.cursor} node={x.node} /> : null
          )}
        </tbody>
      </table>
      <Pagination
        className="mb-2"
        pageInfo={data.strategies.pageInfo}
        setAfter={setAfter}
        setBefore={setBefore}
      />
    </div>
  );
};

type Edge = NonNullable<
  NonNullable<StrategiesQuery$data["strategies"]["edges"]>[number]
>;
type Node = NonNullable<Edge["node"]>;

const Row: FC<{ node: Node }> = ({ node }) => {
  switch (node.__typename) {
    case "BowPoolXyk":
      return <BowPoolXykRow k={node} />;
    case "ThorchainPool":
      return <ThorchainPoolRow k={node} />;
    case "IndexVault":
      return <IndexVaultRow k={node} />;
    case "StakingPool":
      return <StakingPoolRow k={node} />;
    case "GhostVault":
      return <GhostVaultRow k={node} />;
  }
};

const Fallback: FC = () => {
  const { t } = useTranslation();
  return (
    <div className="table-sticky">
      <table className="table table--big condensed">
        <thead>
          <tr>
            <th>{t("common:deposit")}</th>
            <th>{t("tvl")}</th>
            <th className="text-right">{t("apr")}</th>
            <th className="text-right">{t("earnMechanism")}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, i) => (
            <tr key={`skeleton_${i}`}>
              <td>
                <div className="flex ai-c">
                  <div className="lp">
                    <div className="icon-denom skeleton br-2" />
                    <div className="icon-denom skeleton br-2" />
                  </div>
                  <div className="ml-1 w-full skeleton h-1.5 w-1.5 br-2" />
                </div>
              </td>
              <td>
                <div className="w-full skeleton h-1.5 w-1.5 br-2" />
              </td>
              <td>
                <div className="w-full skeleton h-1.5 w-1.5 br-2" />
              </td>
              <td>
                <div className="w-full skeleton h-1.5 w-1.5 br-2" />
              </td>
              <td />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
