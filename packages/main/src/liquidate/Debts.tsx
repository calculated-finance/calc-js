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
  AssetLabel,
  Button,
  Decimal,
  Fiat,
  formatApr,
  IconDenom,
  Icons,
  Progress,
  TranslationProvider,
  useGlobalModalContext,
  useLocale,
} from "rujira.ui";
import { formatBigintPercent } from "../common/bigint";
import {
  BalanceProvider,
  usePreloadedBalances,
} from "../common/components/Balance";
import { lendRoute } from "../lending/routes";
import { usePreloadedAccountData } from "../services/accountData";
import { GhostVaultWithdraw } from "../strategies/components/GhostVaultBalance";
import { GhostVaultDeposit } from "../strategies/components/GhostVaultDeposit";
import { GhostVaultBalanceWithdrawFragment$key } from "../strategies/components/__generated__/GhostVaultBalanceWithdrawFragment.graphql";
import {
  DebtsAccountFragment$data,
  DebtsAccountFragment$key,
} from "./__generated__/DebtsAccountFragment.graphql";
import {
  DebtsQuery,
  DebtsQuery$data,
} from "./__generated__/DebtsQuery.graphql";
import { Graph } from "../merge/components/Graph";

const query = graphql`
  query DebtsQuery {
    ghostCredit {
      collaterals {
        ratio
        asset {
          metadata {
            symbol
          }
        }
      }
      vaults {
        borrower {
          limit
          current
          vault {
            address
          }
        }
      }
    }
    strategies(first: 100, typenames: ["GhostVault"]) {
      edges {
        node {
          __typename
          ... on GhostVault {
            id
            address
            asset {
              asset
              type
              chain
              metadata {
                symbol
                decimals
              }
              variants {
                native {
                  denom
                }
              }
              price {
                current
              }
            }
            status {
              utilizationRatio
              debtPool {
                size
              }
              depositPool {
                size
              }
              valueUsd
              apr {
                status
                value
              }
              debtRate
              lendRate
            }
          }
        }
      }
    }
  }
`;

const accountFragment = graphql`
  fragment DebtsAccountFragment on Account {
    strategies {
      ... on GhostVaultAccount {
        id
        vault {
          address
        }
        receiptValue: value {
          amount
          asset {
            metadata {
              symbol
              decimals
            }
            price {
              current
            }
          }
        }
        valueUsd
        ...GhostVaultBalanceWithdrawFragment
      }
    }
  }
`;

type CollateralConfig = NonNullable<
  DebtsQuery$data["ghostCredit"]
>["collaterals"][number];

type CapData = NonNullable<
  DebtsQuery$data["ghostCredit"]
>["vaults"][number]["borrower"];

type VaultNode = Extract<
  NonNullable<
    NonNullable<DebtsQuery$data["strategies"]["edges"]>[number]
  >["node"],
  { readonly __typename: "GhostVault" }
>;

type VaultStrategy = DebtsAccountFragment$data["strategies"][number];

type SortKey =
  | "symbol"
  | "deposits"
  | "borrowed"
  | "utilization"
  | "cap"
  | "collateral"
  | "lendApr"
  | "borrowApr"
  | "myBalance";
type SortDir = "asc" | "desc";

const SortIcon: FC<{ col: SortKey; active: SortKey; dir: SortDir }> = ({
  col,
  active,
  dir,
}) =>
  active === col ? (
    dir === "asc" ? (
      <Icons.SortUp className="color-white ml-0.5 w-2 h-a" />
    ) : (
      <Icons.SortDown className="color-white ml-0.5 w-2 h-a" />
    )
  ) : (
    <Icons.Sort className="color-grey ml-0.5 w-2 h-a" />
  );

export const DebtsFallback: FC = () => (
  <div className="table-sticky">
    <table className="table table--big condensed">
      <thead>
        <tr>
          <th>Token</th>
          <th>Total Deposits</th>
          <th>Total Borrowed</th>
          <th>Utilization</th>
          <th>Borrow Cap</th>
          <th className="text-right">Lending APR</th>
          <th className="text-right">Borrow APR</th>
          <th className="text-right">My Balance</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {[...Array(4)].map((_, i) => (
          <tr key={`skeleton_${i}`}>
            <td>
              <div className="flex ai-c">
                <div className="icon-denom skeleton br-2" />
                <div className="ml-1 skeleton h-1.5 w-6 br-2" />
              </div>
            </td>
            <td className="text-right">
              <div className="skeleton h-1.5 w-8 br-2 ml-a" />
            </td>
            <td>
              <div className="skeleton h-1.5 w-8 br-2" />
            </td>
            <td>
              <div className="skeleton h-1.5 w-6 br-2" />
            </td>
            <td>
              <div className="skeleton h-1.5 w-5 br-2 ml-a" />
            </td>
            <td>
              <div className="skeleton h-1.5 w-5 br-2 ml-a" />
            </td>
            <td>
              <div className="skeleton h-1.5 w-5 br-2 ml-a" />
            </td>
            <td>
              <div className="skeleton h-1.5 w-8 br-2" />
            </td>
            <td />
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const Debts: FC = () => {
  const [q, load] = useQueryLoader<DebtsQuery>(query);
  useEffect(() => {
    load({});
  }, []);
  if (!q) return <DebtsFallback />;
  return (
    <Suspense fallback={<DebtsFallback />}>
      <Content q={q} />
    </Suspense>
  );
};

const Content: FC<{ q: PreloadedQuery<DebtsQuery> }> = ({ q }) => {
  const data = usePreloadedQuery<DebtsQuery>(query, q);
  const { accountData } = usePreloadedAccountData();
  const account = useFragment<DebtsAccountFragment$key>(
    accountFragment,
    accountData ?? null
  );

  const collaterals = data.ghostCredit?.collaterals || [];
  const caps = data.ghostCredit?.vaults || [];
  const accountStrategies = account?.strategies || [];

  const [sortKey, setSortKey] = useState<SortKey>("lendApr");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const getSortValue = (
    edge: NonNullable<DebtsQuery$data["strategies"]["edges"]>[number]
  ): number | string => {
    if (!edge?.node || edge.node.__typename !== "GhostVault") return -Infinity;
    const vault = edge.node as VaultNode;
    switch (sortKey) {
      case "symbol":
        return vault.asset.metadata.symbol;
      case "deposits":
        return Number(vault.status.valueUsd);
      case "borrowed":
        return Number(
          vault.status.utilizationRatio > 0n
            ? (vault.status.valueUsd * vault.status.utilizationRatio) /
                10n ** 12n
            : 0n
        );
      case "utilization":
        return Number(vault.status.utilizationRatio);
      case "cap": {
        const cap = caps.find(
          (c) => c.borrower.vault.address === vault.address
        )?.borrower;
        return cap && cap.limit > 0n
          ? Number((cap.current * 10000n) / cap.limit) / 100
          : -1;
      }
      case "lendApr":
        return vault.status.apr.value != null
          ? Number(vault.status.apr.value)
          : -1;
      case "borrowApr":
        return Number(vault.status.debtRate);
      case "myBalance": {
        const s = accountStrategies.find(
          (s) => s.vault?.address === vault.address
        );
        return Number(s?.valueUsd ?? 0n);
      }
      default:
        return 0;
    }
  };

  const sorted = [...(data.strategies.edges ?? [])].sort((a, b) => {
    const aVal = getSortValue(a);
    const bVal = getSortValue(b);
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDir === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    const aNum = typeof aVal === "number" ? aVal : -Infinity;
    const bNum = typeof bVal === "number" ? bVal : -Infinity;
    return sortDir === "asc" ? aNum - bNum : bNum - aNum;
  });

  return (
    <div className="table-sticky">
      <table className="table table--big condensed">
        <thead>
          <tr>
            <th className="pointer" onClick={() => toggleSort("symbol")}>
              <div className="flex ai-c gap-0.5 no-select">
                Token
                <SortIcon col="symbol" active={sortKey} dir={sortDir} />
              </div>
            </th>
            <th className="pointer" onClick={() => toggleSort("deposits")}>
              <div className="flex ai-c gap-0.5 no-select">
                Total Deposits
                <SortIcon col="deposits" active={sortKey} dir={sortDir} />
              </div>
            </th>
            <th className="pointer" onClick={() => toggleSort("borrowed")}>
              <div className="flex ai-c gap-0.5 no-select">
                Total Borrowed
                <SortIcon col="borrowed" active={sortKey} dir={sortDir} />
              </div>
            </th>
            <th className="pointer" onClick={() => toggleSort("utilization")}>
              <div className="flex ai-c gap-0.5 no-select">
                Utilization
                <SortIcon col="utilization" active={sortKey} dir={sortDir} />
              </div>
            </th>
            <th className="pointer" onClick={() => toggleSort("cap")}>
              <div className="flex ai-c gap-0.5 no-select">
                Borrow Cap
                <SortIcon col="cap" active={sortKey} dir={sortDir} />
              </div>
            </th>
            <th
              className="text-right pointer"
              onClick={() => toggleSort("lendApr")}>
              <div className="flex ai-c jc-e gap-0.5 no-select">
                Lending APR
                <SortIcon col="lendApr" active={sortKey} dir={sortDir} />
              </div>
            </th>
            <th
              className="text-right pointer"
              onClick={() => toggleSort("borrowApr")}>
              <div className="flex ai-c jc-e gap-0.5 no-select">
                Borrow APR
                <SortIcon col="borrowApr" active={sortKey} dir={sortDir} />
              </div>
            </th>
            <th
              className="text-right pointer"
              onClick={() => toggleSort("myBalance")}>
              <div className="flex ai-c jc-e gap-0.5 no-select">
                My Balance
                <SortIcon col="myBalance" active={sortKey} dir={sortDir} />
              </div>
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          {sorted.map((edge) => {
            if (edge?.node?.__typename !== "GhostVault") return null;
            const vault = edge.node as VaultNode;
            const cap = caps.find(
              (c) => c.borrower.vault.address === vault.address
            )?.borrower;
            const myStrategy = accountStrategies.find(
              (s) => s.vault?.address === vault.address
            );
            return (
              <Row
                key={vault.id}
                vault={vault}
                cap={cap}
                collaterals={collaterals}
                myStrategy={myStrategy}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const Row: FC<{
  vault: VaultNode;
  cap: CapData | undefined;
  collaterals?: readonly CollateralConfig[];
  myStrategy?: VaultStrategy;
}> = ({ vault, cap, myStrategy }) => {
  const { showModal, hideModal } = useGlobalModalContext();
  const { toRoot } = useLocale();
  const { asset, status } = vault;
  const url = toRoot(lendRoute(asset));

  const depositUsd = status.valueUsd;
  const borrowedUsd =
    status.utilizationRatio > 0n
      ? (depositUsd * status.utilizationRatio) / 10n ** 12n
      : 0n;

  const capPct =
    cap && cap.limit > 0n
      ? Number((cap.current * 10000n) / cap.limit) / 100
      : 0;

  const myDeposit = myStrategy?.receiptValue?.amount ?? 0n;
  const myDepositUsd = myStrategy?.valueUsd ?? 0n;

  const balances = usePreloadedBalances();
  const hasBalance = balances.some(
    (b) => b.asset.asset === asset.asset && b.balance > 0n
  );

  const openLend = () => {
    showModal({
      backgroundClose: false,
      children: (
        <TranslationProvider namespace="strategies">
          <BalanceProvider asset={asset}>
            <GhostVaultDeposit
              asset={asset}
              address={vault.address}
              currentBalance={myDeposit}
            />
          </BalanceProvider>
        </TranslationProvider>
      ),
    });
  };

  const openWithdraw = () => {
    if (!myStrategy) return;
    showModal({
      backgroundClose: false,
      children: (
        <TranslationProvider namespace="strategies">
          <Suspense>
            <GhostVaultWithdraw
              k={myStrategy as GhostVaultBalanceWithdrawFragment$key}
              cancel={hideModal}
            />
          </Suspense>
        </TranslationProvider>
      ),
    });
  };

  return (
    <tr>
      <td>
        <Link
          to={url}
          state={{ from: "lend" }}
          className="flex ai-c mt-0.5 no-underline color-white w-full">
          <IconDenom denom={asset.metadata.symbol} className="w-4" />
          <h3 className="condensed fs-22 lh-22 fs-lg-28 lh-lg-28 fw-400 mb-0 ml-1 nowrap">
            <AssetLabel
              asset={asset}
              Container={({ children }) => (
                <small className="color-grey fs-12 fs-lg-14">{children}</small>
              )}
            />
          </h3>
        </Link>
      </td>

      <td>
        <div className="flex dir-c">
          <Decimal
            amount={status.depositPool.size}
            symbol={asset.metadata.symbol}
            decimals={asset.metadata.decimals}
            className="fs-16 condensed fw-500"
            clip
          />
          <Fiat
            amount={depositUsd}
            symbol="$"
            decimals={8}
            className="color-grey fs-12 condensed"
          />
        </div>
      </td>

      <td>
        <div className="flex dir-c">
          <Decimal
            amount={status.debtPool.size}
            symbol={asset.metadata.symbol}
            decimals={asset.metadata.decimals}
            className="fs-16 condensed fw-500"
            clip
          />
          <Fiat
            amount={borrowedUsd}
            symbol="$"
            decimals={8}
            className="color-grey fs-12 condensed"
          />
        </div>
      </td>

      <td>
        <div className="lending__graph-container">
          <Graph
            percentage={Number(status.utilizationRatio) / 10_000_000_000}
            width={50}
          />
          <span className="lending__graph-container-pct">
            {formatBigintPercent(status.utilizationRatio)}
          </span>
        </div>
      </td>

      <td>
        {cap ? (
          <>
            <Decimal
              amount={cap.limit}
              symbol={asset.metadata.symbol}
              decimals={asset.metadata.decimals}
              className="fs-16 condensed fw-500"
              clip
            />
            <Progress percentage={capPct} height={3} className="mt-1" />
          </>
        ) : (
          <span className="color-grey fs-12">—</span>
        )}
      </td>

      {/* <td className="text-right">
        {(() => {
          const c = collaterals.find(
            (c) => c.asset.metadata.symbol === asset.metadata.symbol
          );
          return c ? (
            <>{formatBigintPercent(c.ratio)}</>
          ) : (
            <span className="color-grey">—</span>
          );
        })()}
      </td> */}

      <td className="text-right">{formatApr(status.apr)}</td>

      <td className="text-right">{formatBigintPercent(status.debtRate)}</td>

      <td className="text-right">
        {myDeposit > 0n ? (
          <div className="flex dir-c ai-e">
            <Decimal
              amount={myDeposit}
              symbol={
                myStrategy?.receiptValue?.asset.metadata.symbol ||
                asset.metadata.symbol
              }
              decimals={
                myStrategy?.receiptValue?.asset.metadata.decimals ??
                asset.metadata.decimals
              }
              className="fs-16 condensed fw-500"
              clip
            />
            <Fiat
              amount={myDepositUsd}
              symbol="$"
              decimals={8}
              className="color-grey fs-12 condensed"
            />
          </div>
        ) : (
          <span className="color-grey fs-12">—</span>
        )}
      </td>

      <td>
        <div
          className={clsx("flex dir-c gap-0.5", {
            "gap-1": myDeposit > 0n,
          })}>
          {myDeposit > 0n && (
            <Button
              className="button--xs button--outline button--blue w-full"
              label="Withdraw"
              onClick={openWithdraw}
            />
          )}
          <Button
            className={clsx("button--xs w-full", {
              "button--outline": !hasBalance,
            })}
            disabled={!hasBalance}
            label="Deposit"
            onClick={openLend}
          />
          <Link
            to={url}
            state={{ from: "lend" }}
            className="button button--xs button--outline button--grey w-full button--icon-right">
            Details
            <Icons.ArrowUpRight />
          </Link>
        </div>
      </td>
    </tr>
  );
};
