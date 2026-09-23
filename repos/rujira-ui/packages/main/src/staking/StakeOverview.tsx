import { type FC, Suspense, useState } from "react";
import { useFragment, useLazyLoadQuery } from "react-relay";
import { Link } from "react-router-dom";
import { graphql } from "relay-runtime";
import {
  Decimal,
  Fiat,
  IconDenom,
  Icons,
  SortDir,
  TranslationProvider,
  formatApr,
  nFormatter,
  useLocale,
  useTranslation,
} from "rujira.ui";
import { usePreloadedBalances } from "../common/components/Balance";
import { Graph } from "../merge/components/Graph";
import { getStaticProductSeo, ProductSeoHelmet } from "../seo";
import { usePreloadedAccountData } from "../services/accountData";
import { Subscription } from "../services/useNodeSubscription";
import type {
  StakeOverviewAccountFragment$data,
  StakeOverviewAccountFragment$key,
} from "./__generated__/StakeOverviewAccountFragment.graphql";
import type {
  StakeOverviewQuery,
  StakeOverviewQuery$data,
} from "./__generated__/StakeOverviewQuery.graphql";
import { stakeRoute } from "./routes";

const EXCLUDED_STAKING_SYMBOLS = new Set(["NAMI"]);
const STAKE_SYMBOL_ORDER = new Map([
  ["RUJI", 0],
  ["BRUNE", 1],
  ["TCY", 2],
]);
const STAKE_OVERVIEW_LOADING_ROWS = [
  "stake-overview-loading-1",
  "stake-overview-loading-2",
  "stake-overview-loading-3",
];
const STAKING_ANALYTICS_PERIOD_DAYS = 30;
const STAKING_ANALYTICS_LOOKBACK_DAYS = 7;
const DAYS_PER_YEAR = 365n;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const query = graphql`
  query StakeOverviewQuery(
    $analyticsFrom: Timestamp!
    $analyticsTo: Timestamp!
    $analyticsPeriod: Int!
  ) {
    staking {
      pools {
        id
        bondAsset {
          metadata {
            symbol
            decimals
          }
          price {
            current
          }
        }
        stakingStatus: status {
          accountBond
          liquidBondSize
          valueUsd
        }
        stakingSummary: summary {
          apr {
            value
            status
          }
        }
        analyticsBins(
          first: 7
          from: $analyticsFrom
          to: $analyticsTo
          resolution: "1D"
          period: $analyticsPeriod
        ) {
          edges {
            node {
              bin
              totalRevenue {
                value
                movingAvg
              }
              totalBalanceStaked {
                value
                movingAvg
              }
            }
          }
        }
      }
    }
  }
`;

const accountFragment = graphql`
  fragment StakeOverviewAccountFragment on Account {
    stakingV2 {
      id
      pool {
        id
        bondAsset {
          metadata {
            symbol
          }
        }
      }
      bonded {
        amount
      }
      liquidSize {
        amount
      }
      valueUsd
    }
  }
`;

const subscription = graphql`
  subscription StakeOverviewPoolSubscription($id: ID!) {
    node(id: $id) {
      ... on StakingPool {
        status {
          accountBond
          liquidBondSize
          valueUsd
        }
        stakingSummary: summary {
          apr {
            value
            status
          }
        }
      }
    }
  }
`;

type StakeOverviewPool = StakeOverviewQuery$data["staking"]["pools"][number];
type StakeOverviewStakingAccount =
  StakeOverviewAccountFragment$data["stakingV2"][number];
type StakeOverviewAnalyticsEdge = NonNullable<
  NonNullable<StakeOverviewPool["analyticsBins"]>["edges"]
>[number];
type StakeOverviewAnalyticsBin = NonNullable<
  NonNullable<StakeOverviewAnalyticsEdge>["node"]
>;
type StakeOverviewSortBy =
  | "token"
  | "tvl"
  | "apr"
  | "yearlyRewards"
  | "autoCompounding"
  | "myBalance";

export const StakeOverview: FC = () => {
  const { locale } = useLocale();

  return (
    <TranslationProvider namespace="staking">
      <ProductSeoHelmet seo={getStaticProductSeo("/stake", locale)} />
      <StakeOverviewContent />
    </TranslationProvider>
  );
};

const StakeOverviewContent: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <main className="rujira__main rujira__main--gradient stake-overview">
        <div className="rujira__inner--pad">
          <div className="rujira__inner">
            <section className="stake-overview__hero">
              <h1 className="h1">{t("title")}</h1>
              <p className="fs-20 lh-28 mw-md-100 balance">
                {t("description")}
              </p>
            </section>
            <section
              className="relative card p-3 mt-4 stake-overview__table"
              aria-labelledby="stake-overview-assets-heading">
              <h2
                id="stake-overview-assets-heading"
                className="visually-hidden">
                {t("supportedStakingAssets")}
              </h2>
              <Suspense fallback={<StakeOverviewFallback />}>
                <StakeOverviewTable />
              </Suspense>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

const StakeOverviewTable: FC = () => {
  const { t } = useTranslation();
  const { sortBy, sortDir, toggleSort } = useStakeOverviewSort();
  const analyticsWindow = useStakeAnalyticsWindow();
  const data = useLazyLoadQuery<StakeOverviewQuery>(query, analyticsWindow, {
    fetchPolicy: "store-and-network",
  });
  const { accountData } = usePreloadedAccountData();
  const account = useFragment<StakeOverviewAccountFragment$key>(
    accountFragment,
    accountData ?? null
  );
  const stakingAccounts = account?.stakingV2 ?? [];
  const balances = usePreloadedBalances();

  const pools = getOverviewStakePools(data);
  const sortedPools = sortStakePools(pools, stakingAccounts, sortBy, sortDir);

  return (
    <div className="table-sticky">
      <table className="table table--big condensed mb-0">
        <StakeOverviewColgroup />
        <StakeOverviewHead
          sortBy={sortBy}
          sortDir={sortDir}
          toggleSort={toggleSort}
        />
        <tbody>
          {sortedPools.map((pool) => (
            <StakeOverviewRow
              key={pool.id}
              pool={pool}
              account={findStakingAccount(stakingAccounts, pool)}
              hasStakeableBalance={hasStakeableWalletBalance(balances, pool)}
            />
          ))}
          {sortedPools.length === 0 && (
            <tr>
              <td colSpan={7}>
                <span className="color-grey fs-12">{t("empty")}</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const StakeOverviewRow: FC<{
  pool: StakeOverviewPool;
  account?: StakeOverviewStakingAccount;
  hasStakeableBalance: boolean;
}> = ({ pool, account, hasStakeableBalance }) => {
  const { toRoot } = useLocale();
  const { t } = useTranslation();
  const symbol = pool.bondAsset.metadata.symbol;
  const url = toRoot(stakeRoute(symbol));
  const totalStaked = totalPoolStake(pool);
  const accountStaked = totalAccountStake(account);
  const accountValueUsd = account?.valueUsd ?? 0n;
  const decimals = pool.bondAsset.metadata.decimals;
  const autoCompounding = autoCompoundingPercentage(pool.stakingStatus);
  const hasStakePosition = accountStaked > 0n;
  const hasActiveStakeAction = hasStakePosition || hasStakeableBalance;
  const actionLabel = hasStakePosition
    ? t("managePosition")
    : t("createPosition");
  const actionShortLabel = hasStakePosition
    ? t("managePositionShort")
    : t("createPositionShort");

  return (
    <tr>
      <Subscription id={pool.id} subscription={subscription} />
      <td>
        <Link to={url} className="stake-overview__token no-underline">
          <IconDenom denom={symbol} className="w-4" />
          <h3 className="condensed fs-22 lh-22 fs-lg-28 lh-lg-28 fw-400 mb-0 ml-1 nowrap color-white">
            {symbol}
          </h3>
        </Link>
      </td>
      <td>
        {pool.stakingStatus ? (
          <div className="flex dir-c">
            <Fiat
              amount={BigInt(pool.stakingStatus.valueUsd)}
              symbol="$"
              decimals={8}
              className="fs-16 fs-md-18 color-white"
            />
            <Decimal
              amount={totalStaked}
              decimals={decimals}
              round={4}
              symbol={symbol}
              className="fs-12 fs-md-14 condensed color-grey mt-0.5"
              clip
            />
          </div>
        ) : (
          <EmptyValue />
        )}
      </td>
      <td className="stake-overview__auto-compound-cell">
        <AutoCompoundingIndicator percentage={autoCompounding} />
      </td>
      <td className="text-center">
        <YearlyRewardsPerToken pool={pool} />
      </td>
      <td className="text-center">{formatApr(pool.stakingSummary.apr)}</td>
      <td>
        {account && accountStaked > 0n ? (
          <StakeOverviewBalance
            account={account}
            total={accountStaked}
            valueUsd={accountValueUsd}
            symbol={symbol}
            decimals={decimals}
          />
        ) : (
          <EmptyValue />
        )}
      </td>
      <td className="stake-overview__action-cell">
        <Link
          to={url}
          aria-label={actionLabel}
          className={`button button--xs button--icon-right stake-overview__action${
            hasActiveStakeAction ? "" : " button--outline button--grey"
          }`}>
          {actionShortLabel}
          <Icons.ArrowUpRight />
        </Link>
      </td>
    </tr>
  );
};

const StakeOverviewFallback: FC = () => (
  <div className="table-sticky">
    <table className="table table--big condensed mb-0">
      <StakeOverviewColgroup />
      <StakeOverviewFallbackHead />
      <tbody>
        {STAKE_OVERVIEW_LOADING_ROWS.map((row) => (
          <tr key={row}>
            <td>
              <div className="flex ai-c">
                <div className="icon-denom skeleton br-2" />
                <div className="ml-1 skeleton h-1.5 w-6 br-2" />
              </div>
            </td>
            <td>
              <div className="skeleton h-1.5 w-6 br-2" />
              <div className="skeleton h-1.5 w-8 br-2 mt-0.5" />
            </td>
            <td>
              <div className="skeleton br-round w-6 h-6" />
            </td>
            <td>
              <div className="skeleton h-1.5 w-6 br-2" />
            </td>
            <td>
              <div className="skeleton h-1.5 w-5 br-2" />
            </td>
            <td>
              <div className="skeleton h-1.5 w-8 br-2" />
              <div className="skeleton h-1.5 w-6 br-2 mt-0.5" />
            </td>
            <td>
              <div className="skeleton h-3 w-8 br-4 ml-a" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const StakeOverviewFallbackHead: FC = () => {
  const { sortBy, sortDir, toggleSort } = useStakeOverviewSort();

  return (
    <StakeOverviewHead
      sortBy={sortBy}
      sortDir={sortDir}
      toggleSort={toggleSort}
    />
  );
};

const StakeOverviewColgroup: FC = () => (
  <colgroup>
    <col className="stake-overview__col stake-overview__col--token" />
    <col className="stake-overview__col stake-overview__col--tvl" />
    <col className="stake-overview__col stake-overview__col--auto-compound" />
    <col className="stake-overview__col stake-overview__col--yearly-rewards" />
    <col className="stake-overview__col stake-overview__col--apr" />
    <col className="stake-overview__col stake-overview__col--balance" />
    <col className="stake-overview__col stake-overview__col--action" />
  </colgroup>
);

const StakeOverviewHead: FC<{
  sortBy: StakeOverviewSortBy;
  sortDir: SortDir;
  toggleSort: (value: StakeOverviewSortBy) => void;
}> = ({ sortBy, sortDir, toggleSort }) => {
  const { t } = useTranslation();

  return (
    <thead>
      <tr>
        <SortHeader
          label={t("table.token")}
          value="token"
          active={sortBy}
          dir={sortDir}
          onSort={toggleSort}
        />
        <SortHeader
          label={t("table.tvl")}
          value="tvl"
          active={sortBy}
          dir={sortDir}
          onSort={toggleSort}
          tooltip={t("tvlTooltip")}
        />
        <SortHeader
          label={t("table.autoCompounding")}
          value="autoCompounding"
          active={sortBy}
          dir={sortDir}
          onSort={toggleSort}
          align="center"
          tooltip={t("autoCompoundingTooltip")}
        />
        <SortHeader
          label={t("table.yearlyRewardsPerToken")}
          value="yearlyRewards"
          active={sortBy}
          dir={sortDir}
          onSort={toggleSort}
          tooltip={t("yearlyRewardsPerTokenTooltip")}
          align="center"
        />
        <SortHeader
          label={t("table.apr")}
          value="apr"
          active={sortBy}
          dir={sortDir}
          onSort={toggleSort}
          tooltip={t("aprTooltip")}
          align="center"
        />
        <SortHeader
          label={t("table.myBalance")}
          value="myBalance"
          active={sortBy}
          dir={sortDir}
          onSort={toggleSort}
        />
        <th className="text-right">
          <span className="visually-hidden">{t("table.action")}</span>
        </th>
      </tr>
    </thead>
  );
};

const SortHeader: FC<{
  label: string;
  value: StakeOverviewSortBy;
  active: StakeOverviewSortBy;
  dir: SortDir;
  onSort: (value: StakeOverviewSortBy) => void;
  align?: "left" | "center" | "right";
  tooltip?: string;
}> = ({ label, value, active, dir, onSort, align = "left", tooltip }) => {
  const selected = active === value;

  return (
    <th
      aria-sort={
        selected ? (dir === SortDir.Asc ? "ascending" : "descending") : "none"
      }>
      <button
        type="button"
        className={`stake-overview__sort-header stake-overview__sort-header--${align}`}
        onClick={() => onSort(value)}>
        <span className="stake-overview__sort-label">
          {label}
          {tooltip && (
            <span
              className="stake-overview__sort-info"
              data-tooltip-id="global-tip"
              data-tooltip-html={`<div class="w-25">${tooltip}</div>`}
              aria-label={tooltip}
              onClick={(event) => event.stopPropagation()}>
              <Icons.Info className="w-2 h-2 color-grey block" />
            </span>
          )}
        </span>
        {selected && dir === SortDir.Desc && (
          <Icons.SortDown className="color-white ml-0.5 w-2 h-a" />
        )}
        {selected && dir === SortDir.Asc && (
          <Icons.SortUp className="color-white ml-0.5 w-2 h-a" />
        )}
        {!selected && <Icons.Sort className="color-grey ml-0.5 w-2 h-a" />}
      </button>
    </th>
  );
};

const YearlyRewardsPerToken: FC<{ pool: StakeOverviewPool }> = ({ pool }) => {
  const yearlyRewards = yearlyRewardsPerToken(pool);

  if (yearlyRewards === undefined) return <EmptyValue />;

  return (
    <Fiat
      amount={yearlyRewards}
      symbol="$"
      decimals={8}
      round={4}
      className="fs-16 condensed fw-500"
    />
  );
};

const StakeOverviewBalance: FC<{
  account: StakeOverviewStakingAccount;
  total: bigint;
  valueUsd: bigint;
  symbol: string;
  decimals: number;
}> = ({ account, total, valueUsd, symbol, decimals }) => {
  const { t } = useTranslation();
  const autoCompoundingAmount = BigInt(account.liquidSize.amount);
  const yieldingAmount = BigInt(account.bonded.amount);
  const autoCompoundingUsd = stakeBalanceValueUsd(
    valueUsd,
    autoCompoundingAmount,
    total
  );
  const yieldingUsd = valueUsd - autoCompoundingUsd;
  const tooltip = balanceBreakdownTooltip({
    autoCompoundingAmount,
    autoCompoundingUsd,
    decimals,
    symbol,
    t,
    yieldingAmount,
    yieldingUsd,
  });

  return (
    <div
      className="flex dir-c stake-overview__balance"
      data-tooltip-id="global-tip"
      data-tooltip-html={tooltip}
      aria-label={tooltipText(tooltip)}>
      <Fiat
        amount={valueUsd}
        symbol="$"
        decimals={8}
        className="fs-16 condensed fw-500"
      />
      <Decimal
        amount={total}
        decimals={decimals}
        round={4}
        symbol={symbol}
        className="fs-12 fs-md-14 condensed color-grey mt-0.5"
        clip
      />
    </div>
  );
};

const AutoCompoundingIndicator: FC<{ percentage?: number }> = ({
  percentage,
}) => {
  const { t } = useTranslation();

  if (percentage === undefined) return <EmptyValue />;

  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const label = formatPercentage(clampedPercentage);

  return (
    <div
      className="stake-overview__auto-compound lending__graph-container"
      role="img"
      aria-label={t("autoCompoundingAriaLabel", { percentage: label })}>
      <Graph percentage={clampedPercentage} width={50} />
      <span className="lending__graph-container-pct" aria-hidden="true">
        {label}
      </span>
      <span className="visually-hidden">
        {t("autoCompoundingAriaLabel", { percentage: label })}
      </span>
    </div>
  );
};

const EmptyValue: FC = () => <span className="color-grey fs-12">-</span>;

const getOverviewStakePools = (
  data: StakeOverviewQuery$data
): readonly StakeOverviewPool[] =>
  data.staking.pools.filter(
    (pool) =>
      !EXCLUDED_STAKING_SYMBOLS.has(
        pool.bondAsset.metadata.symbol.toUpperCase()
      )
  );

const useStakeOverviewSort = () => {
  const [sortBy, setSortBy] = useState<StakeOverviewSortBy>("token");
  const [sortDir, setSortDir] = useState<SortDir>(SortDir.Asc);

  const toggleSort = (value: StakeOverviewSortBy) => {
    if (sortBy === value) {
      setSortDir(sortDir === SortDir.Asc ? SortDir.Desc : SortDir.Asc);
      return;
    }

    setSortBy(value);
    setSortDir(value === "token" ? SortDir.Asc : SortDir.Desc);
  };

  return {
    sortBy,
    sortDir,
    toggleSort,
  };
};

const useStakeAnalyticsWindow = () => {
  const [window] = useState(createStakeAnalyticsWindow);

  return window;
};

const createStakeAnalyticsWindow = () => {
  const analyticsTo = getCurrentUtcDayStart();
  const analyticsFrom = new Date(
    analyticsTo.getTime() - STAKING_ANALYTICS_LOOKBACK_DAYS * MS_PER_DAY
  );

  return {
    analyticsFrom: analyticsFrom.toISOString(),
    analyticsPeriod: STAKING_ANALYTICS_PERIOD_DAYS,
    analyticsTo: analyticsTo.toISOString(),
  };
};

const getCurrentUtcDayStart = () => {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
};

const sortStakePools = (
  pools: readonly StakeOverviewPool[],
  stakingAccounts: readonly StakeOverviewStakingAccount[],
  sortBy: StakeOverviewSortBy,
  sortDir: SortDir
): readonly StakeOverviewPool[] =>
  [...pools].sort((a, b) => {
    const result = compareStakePools(a, b, stakingAccounts, sortBy);
    if (result !== 0) {
      return sortDir === SortDir.Asc ? result : -result;
    }

    return compareStakePools(a, b, stakingAccounts, "token");
  });

const compareStakePools = (
  a: StakeOverviewPool,
  b: StakeOverviewPool,
  stakingAccounts: readonly StakeOverviewStakingAccount[],
  sortBy: StakeOverviewSortBy
): number => {
  switch (sortBy) {
    case "token":
      return compareStakeSymbols(
        a.bondAsset.metadata.symbol,
        b.bondAsset.metadata.symbol
      );
    case "tvl":
      return compareBigint(
        a.stakingStatus?.valueUsd ?? 0n,
        b.stakingStatus?.valueUsd ?? 0n
      );
    case "apr":
      return compareBigint(
        a.stakingSummary.apr.value ?? -1n,
        b.stakingSummary.apr.value ?? -1n
      );
    case "yearlyRewards":
      return compareBigint(
        yearlyRewardsPerToken(a) ?? -1n,
        yearlyRewardsPerToken(b) ?? -1n
      );
    case "autoCompounding":
      return (
        autoCompoundingPercentage(a.stakingStatus) -
        autoCompoundingPercentage(b.stakingStatus)
      );
    case "myBalance":
      return compareBigint(
        findStakingAccount(stakingAccounts, a)?.valueUsd ?? 0n,
        findStakingAccount(stakingAccounts, b)?.valueUsd ?? 0n
      );
    default:
      return 0;
  }
};

const compareStakeSymbols = (a: string, b: string): number => {
  const rankA = stakeSymbolRank(a);
  const rankB = stakeSymbolRank(b);
  if (rankA !== rankB) return rankA - rankB;

  return a.localeCompare(b);
};

const stakeSymbolRank = (symbol: string): number =>
  STAKE_SYMBOL_ORDER.get(symbol.toUpperCase()) ?? Number.MAX_SAFE_INTEGER;

const compareBigint = (a: bigint, b: bigint): number => {
  if (a === b) return 0;

  return a > b ? 1 : -1;
};

const findStakingAccount = (
  stakingAccounts: readonly StakeOverviewStakingAccount[],
  pool: StakeOverviewPool
): StakeOverviewStakingAccount | undefined =>
  stakingAccounts.find((account) => account.pool.id === pool.id);

const hasStakeableWalletBalance = (
  balances: ReturnType<typeof usePreloadedBalances>,
  pool: StakeOverviewPool
): boolean => {
  const symbols = stakeableWalletSymbols(pool.bondAsset.metadata.symbol);

  return balances.some(
    (balance) =>
      symbols.has(balance.asset.metadata.symbol.toUpperCase()) &&
      balance.balance > 0n
  );
};

const stakeableWalletSymbols = (symbol: string): ReadonlySet<string> =>
  symbol.toUpperCase() === "BRUNE"
    ? new Set(["BRUNE", "RUNE"])
    : new Set([symbol.toUpperCase()]);

const stakeBalanceValueUsd = (
  valueUsd: bigint,
  amount: bigint,
  total: bigint
): bigint => (total > 0n ? (valueUsd * amount) / total : 0n);

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const balanceBreakdownTooltip = ({
  autoCompoundingAmount,
  autoCompoundingUsd,
  decimals,
  symbol,
  t,
  yieldingAmount,
  yieldingUsd,
}: {
  autoCompoundingAmount: bigint;
  autoCompoundingUsd: bigint;
  decimals: number;
  symbol: string;
  t: (key: string) => string;
  yieldingAmount: bigint;
  yieldingUsd: bigint;
}): string => `
  <div class="stake-overview__balance-tooltip">
    <div class="stake-overview__balance-tooltip-row">
      ${escapeHtml(t("balanceBreakdown.autoCompounding"))}: ${escapeHtml(formatTooltipFiat(autoCompoundingUsd))}
      (${escapeHtml(formatTooltipToken(autoCompoundingAmount, decimals, symbol))})
    </div>
    <div class="stake-overview__balance-tooltip-row">
      ${escapeHtml(t("balanceBreakdown.yielding"))}: ${escapeHtml(formatTooltipFiat(yieldingUsd))}
      (${escapeHtml(formatTooltipToken(yieldingAmount, decimals, symbol))})
    </div>
  </div>
`;

const formatTooltipFiat = (amount: bigint): string =>
  `$ ${nFormatter(amount, 2, 8)}`;

const formatTooltipToken = (
  amount: bigint,
  decimals: number,
  symbol: string
): string => `${nFormatter(amount, 2, decimals)} ${symbol}`;

const tooltipText = (html: string): string =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const totalPoolStake = (pool: StakeOverviewPool | undefined): bigint => {
  if (!pool?.stakingStatus) return 0n;

  return (
    BigInt(pool.stakingStatus.accountBond) +
    BigInt(pool.stakingStatus.liquidBondSize)
  );
};

const totalAccountStake = (
  account: StakeOverviewStakingAccount | undefined
): bigint => {
  if (!account) return 0n;

  return BigInt(account.bonded.amount) + BigInt(account.liquidSize.amount);
};

const autoCompoundingPercentage = (
  status: StakeOverviewPool["stakingStatus"]
): number => {
  if (!status) return 0;

  const total = BigInt(status.accountBond) + BigInt(status.liquidBondSize);
  if (total === 0n) return 0;

  const basisPoints = (BigInt(status.liquidBondSize) * 10000n) / total;
  return Number(basisPoints) / 100;
};

const yearlyRewardsPerToken = (pool: StakeOverviewPool): bigint | undefined => {
  const analytics = latestStakeAnalyticsBin(pool);
  if (!analytics) return undefined;

  const dailyRevenueUsd = BigInt(analytics.totalRevenue.movingAvg);
  const totalBalanceStaked = analyticsBalanceStaked(analytics);

  if (totalBalanceStaked === 0n) return undefined;

  return (
    (dailyRevenueUsd *
      DAYS_PER_YEAR *
      10n ** BigInt(pool.bondAsset.metadata.decimals)) /
    totalBalanceStaked
  );
};

const latestStakeAnalyticsBin = (
  pool: StakeOverviewPool
): StakeOverviewAnalyticsBin | undefined => {
  const bins = (pool.analyticsBins?.edges ?? [])
    .map((edge) => edge?.node)
    .filter(
      (node): node is StakeOverviewAnalyticsBin =>
        !!node && analyticsBalanceStaked(node) > 0n && isCompletedUtcBin(node)
    )
    .sort((a, b) => new Date(a.bin).getTime() - new Date(b.bin).getTime());

  return bins[bins.length - 1];
};

const analyticsBalanceStaked = (
  analytics: StakeOverviewAnalyticsBin
): bigint => {
  const movingAverage = BigInt(analytics.totalBalanceStaked.movingAvg);

  return movingAverage > 0n
    ? movingAverage
    : BigInt(analytics.totalBalanceStaked.value);
};

const isCompletedUtcBin = (analytics: StakeOverviewAnalyticsBin): boolean =>
  new Date(analytics.bin).getTime() < getCurrentUtcDayStart().getTime();

const formatPercentage = (percentage: number): string =>
  `${percentage.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
