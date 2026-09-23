import { clsx } from "clsx";
import { FC, PropsWithChildren, Suspense } from "react";
import { graphql, useFragment } from "react-relay";
import { Routes, useLocation } from "react-router-dom";
import { Link, route } from "../Gate";
import { useAccounts } from "../services/accounts";
import { Balances } from "./components/Balances";
//import { Merge } from "./components/Merge";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  Fiat,
  nFormatter,
  Toggle,
  TranslationProvider,
  useLocalStorage,
  useTranslation,
} from "rujira.ui";

import { usePreloadedAccountData } from "../services/accountData";
import { AccountSelect } from "./components/AccountSelect";
import { Bonded } from "./components/Bonded";
//import { Buy, Deposit } from "./components/Cta";
import { createContext, useContext } from "react";
import { Icons, useLocale } from "rujira.ui";
import { usePreloadedBalanceData } from "../common/components/Balance";
import { NoIndexHelmet } from "../seo";
import {
  PortfolioFragment$data,
  PortfolioFragment$key,
} from "./__generated__/PortfolioFragment.graphql";
import { Connect } from "./components/Connect";
import { Merging } from "./components/Merging";
import { Orders } from "./components/Orders";
import { Positions } from "./components/Positions";
import { Strategies } from "./components/Strategies";
import { Streaming } from "./components/Streaming";
import { balancesValue, isUnclaimedMerge, totalValue } from "./utils";

export const PortfolioFragment = graphql`
  fragment PortfolioFragment on Account {
    ...MergePortfolioAccountFragment
    fin {
      ordersV2(first: 100)
        @connection(key: "TradeSubscriptionsFragment_ordersV2") {
        edges {
          cursor
          node {
            __typename
            ... on FinOrder {
              valueUsd
            }
            ... on CalcOrder {
              valueUsd
              balances {
                amount
              }
              ...RecurringOrdersFragment
            }
          }
        }
      }
      ranges(first: 100)
        @connection(key: "TradeSubscriptionsFragment_ranges") {
        edges {
          node {
            valueUsd
            ...TradeSubscriptionsFinRangeFragment
          }
        }
      }
    }

    merge {
      accounts {
        merged {
          amount
        }
        shares
        valueUsd
      }
    }

    staking {
      single {
        bonded {
          amount
        }
        liquid {
          amount
        }
      }
    }
    credit {
      accounts {
        id
        valueUsd
      }
    }
    strategies {
      __typename
      ... on ThorchainLiquidityProvider {
        id
        valueUsd
      }
      ... on BowAccount {
        id
        valueUsd
      }
      ... on StakingAccount {
        id
        valueUsd
      }
      ... on IndexAccount {
        id
        sharesValue
      }
      ... on GhostVaultAccount {
        id
        valueUsd
      }
    }
  }
`;

enum Tab {
  Balances = "",
  Merging = "merging",
  Streaming = "streaming",
  Bonded = "bonded",
  Strategies = "strategies",
  Lent = "lent",
  Borrowing = "borrowing",
  Orders = "orders",
}

export const Portfolio: FC = () => {
  const { selected } = useAccounts();

  return (
    <TranslationProvider namespace="portfolio">
      <Meta />

      {selected ? (
        <div className="rujira__main rujira__main--gradient">
          <Container>
            <MyAccount />
          </Container>
        </div>
      ) : (
        <Connect />
      )}
    </TranslationProvider>
  );
};

const Meta = () => {
  const { t } = useTranslation();
  return (
    <NoIndexHelmet>
      <title>{t("pageTitle")}</title>
      <meta name="description" content={t("pageDescription")} />
      <meta name="og:description" content={t("pageDescription")} />
      <meta name="twitter:description" content={t("pageDescription")} />
    </NoIndexHelmet>
  );
};

const Container: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <div className="rujira__inner--pad portfolio">
      <div className="rujira__inner">
        <div className="row wrap pad ai-c">
          <div className="col-12 col-lg-5">
            <h1 className="h2">{t("myPortfolio")}</h1>
            <AccountSelect />
          </div>
          <PortfolioProvider>
            <Suspense fallback={<Fallback />}>{children}</Suspense>
          </PortfolioProvider>
        </div>
      </div>
    </div>
  );
};

const MyAccount: FC = () => {
  const { accountData } = usePreloadedAccountData();
  const { t } = useTranslation();
  const account = useFragment<PortfolioFragment$key>(
    PortfolioFragment,
    accountData
  );
  const balances = usePreloadedBalanceData();

  const value =
    account && balances?.ok ? totalValue(account, balances.value.edges) : 0n;

  const tabs = [
    {
      tab: Tab.Balances,
      label: t("balances"),
      value: balances?.ok ? balancesValue(balances.value.edges) : 0n,
    },
    ...(account ? accountTabs(account, t) : []),
  ];

  return <Content value={value} tabs={tabs} />;
};

const accountTabs = (
  account: PortfolioFragment$data,
  t: (key: string) => string
) => [
  {
    tab: Tab.Merging,
    label: t("merging"),
    count: (account?.merge?.accounts || []).filter(isUnclaimedMerge).length,
    hideable: true,
    value: (account?.merge?.accounts || [])
      .filter(isUnclaimedMerge)
      .reduce((a, v) => a + BigInt(v?.valueUsd || 0), 0n),
  },
  // { tab: Tab.Streaming, label: t("streaming"), count: 1 },
  {
    tab: Tab.Orders,
    label: t("orders"),
    count:
      (account?.fin?.ordersV2?.edges?.filter(
        (o) =>
          !!o?.node &&
          (o.node.__typename === "FinOrder" ||
            (o.node.__typename === "CalcOrder" &&
              o.node.balances?.some((b) => Number(b?.amount) > 10)))
      ).length || 0) + (account.fin?.ranges?.edges?.length || 0),
    hideable: true,
    value: (account?.fin?.ordersV2?.edges || []).reduce(
      (a, v) =>
        a +
        BigInt(
          !!v?.node && "valueUsd" in v?.node && v?.node.valueUsd
            ? v?.node?.valueUsd
            : 0
        ),
      (account.fin?.ranges?.edges || []).reduce(
        (a, v) => (v?.node ? a + v?.node.valueUsd : a),
        0n
      )
    ),
  },
  {
    tab: Tab.Borrowing,
    label: t("borrowing"),
    count: account?.credit.accounts?.length,
    hideable: true,
    value: (account?.credit.accounts || []).reduce(
      (a, v) => a + BigInt(v.valueUsd),
      0n
    ),
  },
  {
    tab: Tab.Strategies,
    label: t("strategies"),
    count: account?.strategies?.length ?? 0,
    hideable: true,
    value: (account?.strategies || []).reduce((a, v) => {
      return (
        a +
        BigInt(
          v.__typename === "%other"
            ? 0
            : v.__typename === "IndexAccount"
              ? v.sharesValue
              : v?.valueUsd || 0
        )
      );
    }, 0n),
  },
];

const Content: FC<{
  value: bigint;
  tabs: {
    tab: Tab;
    label: string;
    count?: number;
    hideable?: boolean;
    value?: bigint;
  }[];
}> = ({ value, tabs }) => {
  const { t } = useTranslation();
  const chart = tabs.map((x) => ({
    name: x.label,
    value: Number(x.value) / 10 ** 8,
  }));

  const colors = ["#D615EB", "#7e0c8a", "#8436F5", "#5A2AD1", "#60fbd0"];

  return (
    <>
      <div className="col-12 col-lg-7 mt-2">
        <div className="card h-full p-3 flex wrap gap-1">
          <div className="flex dir-c grow">
            <h3 className="fs-16 lh-22 fw-400 color-grey">
              {t("common:walletValue")}
            </h3>
            <Fiat
              symbol="$"
              amount={value}
              decimals={8}
              className="fs-42 condensed fw-500 mt-1"
            />
          </div>
          {value > 0n && (
            <div className="w-10 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart width={80} height={80}>
                  <Pie
                    dataKey="value"
                    data={chart}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={40}
                    strokeWidth={0}
                    fill="#82ca9d">
                    {chart.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip />}
                    allowEscapeViewBox={{ x: true, y: true }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="col-12">
        <Tabs tabs={tabs} />
      </div>
      <div className="col-12">
        <TabContent />
      </div>
    </>
  );
};

const Fallback: FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="col-12 col-lg-7 mt-2">
        <div className="card h-16 p-3">
          <h3 className="fs-16 lh-22 fw-400 color-grey">
            {t("common:walletValue")}
          </h3>
          <div className="skeleton h-6 w-24 br-10 mt-1.5 mb-2" />
        </div>
      </div>

      <div className="col-12">
        <div className="tabs mt-4">
          <a className="skeleton w-12" />
        </div>
      </div>
      <div className="col-12">
        <div className="relative card p-3 mt-2">
          <table className="table table--big condensed portfolio__balances table--no-hover">
            <tbody>
              {[...Array(3)].map((_, i) => (
                <tr key={`skeleton-${i}`}>
                  <td className="w-1">
                    <div className="skeleton h-4 w-4 br-4" />
                  </td>
                  <td>
                    <div className="skeleton h-2 w-12 br-2" />
                  </td>
                  <td className="text-right">
                    <div className="skeleton h-2 w-10 br-2 inline-block" />
                  </td>
                  <td className="text-right">
                    <div className="skeleton h-2 w-10 br-2 inline-block" />
                  </td>
                  <td className="text-right">
                    <div className="skeleton h-2 w-6 br-2 inline-block" />
                  </td>
                  <td className="text-right">
                    <div className="skeleton h-2 w-10 br-2 inline-block" />
                  </td>
                  <td className="w-1">
                    <div className="skeleton h-4 w-4 br-0.5" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="card bg-darkGrey p-1.5 fs-14 condensed">
        <p className="label">
          {payload[0].name}
          <br />${payload[0].value.toLocaleDecimal(2)}
        </p>
      </div>
    );
  }
  return null;
};

const Tabs: FC<{
  tabs: {
    tab: Tab;
    label: string;
    count?: number;
    hideable?: boolean;
    value?: bigint;
  }[];
}> = ({ tabs }) => {
  const { selected } = useAccounts();
  const { hideSmall, setHideSmall } = usePortfolio();
  const loc = useLocation();
  const { toRoot } = useLocale();
  const { t } = useTranslation();
  const portfolioRoot = toRoot("portfolio");
  const currentPath = loc.pathname.replace(/\/+$/, "");
  const isRoot =
    currentPath === portfolioRoot || currentPath === `${portfolioRoot}/`;

  return (
    <div className="tabs mt-4">
      {tabs.map((x) =>
        x.hideable === true && x.count === 0 ? null : (
          <TabItem key={x.label} tab={x.tab}>
            <div className="flex row ai-c">
              {x.label}
              {x.value !== undefined && x.value > 0n ? (
                <div className="tag tag--teal tag--md ml-1">
                  ${nFormatter(x.value || 0n, 2)}
                </div>
              ) : null}
              {x.count ? <i>{x.count}</i> : null}
            </div>
          </TabItem>
        )
      )}

      <a
        className="ml-a mr-0"
        href={`https://thorchain.net/address/${selected?.address.address ?? ""}`}
        target="_blank">
        {t("history", { ns: "common" })}
        <Icons.External className="ml-0.5" />
      </a>
      {isRoot && (
        <Toggle
          label={t("common:hideLowValueBalances")}
          className="toggle--xs color-white as-c ml-1"
          checked={hideSmall}
          onChange={(e) => setHideSmall(e.currentTarget.checked)}
        />
      )}
    </div>
  );
};

const TabItem: FC<
  PropsWithChildren<{
    tab: Tab;
    counter?: number;
  }>
> = ({ tab, counter, children }) => {
  const loc = useLocation();
  const { toRoot } = useLocale();
  const path = loc.pathname.replace(/\/+$/, "");
  const portfolioRoot = toRoot("portfolio");
  const isRoot = path === portfolioRoot || path === `${portfolioRoot}/`;
  const isSelected =
    tab === Tab.Balances ? isRoot : path === `${portfolioRoot}/${tab}`;

  return (
    <Link
      to={tab === Tab.Balances ? "." : tab}
      className={clsx({ "selected bg-black": isSelected })}>
      {children} {counter ? <i>{counter}</i> : null}
    </Link>
  );
};

const TabContent: FC = () => (
  <Routes>
    {route({
      path: "",
      element: <Balances />,
    })}
    {route({
      path: Tab.Streaming,
      element: <Streaming />,
    })}
    {route({
      path: Tab.Merging,
      element: <Merging />,
    })}

    {route({
      path: Tab.Orders,
      element: <Orders />,
    })}

    {route({
      path: Tab.Strategies,
      element: <Strategies />,
    })}

    {route({
      path: Tab.Bonded,
      element: <Bonded />,
    })}

    {route({
      path: Tab.Borrowing,
      element: <Positions />,
    })}

    {route({
      path: "*",
      element: <ComingSoon />,
    })}
  </Routes>
);

const ComingSoon: FC = () => {
  const { t } = useTranslation();
  return (
    <div className="card text-center p-3 mt-2 condensed color-grey">
      {t("common:comingSoon")}
    </div>
  );
};

interface PortfolioContextType {
  hideSmall: boolean;
  setHideSmall: (value: boolean) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined
);

export const PortfolioProvider: FC<PropsWithChildren> = ({ children }) => {
  const [hideSmall, setHideSmall] = useLocalStorage(
    "rujira-portfolio-small",
    false
  );

  return (
    <PortfolioContext.Provider value={{ hideSmall, setHideSmall }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
