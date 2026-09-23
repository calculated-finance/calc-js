import clsx from "clsx";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useId,
  useMemo,
} from "react";
import { useFragment, useRelayEnvironment } from "react-relay";
import { Tooltip } from "react-tooltip";
import { graphql, readInlineData, requestSubscription } from "relay-runtime";
import { Asset, Balance, BalanceAccount, THOR } from "rujira.js";
import { Icons, OmniBalance, useTranslation } from "rujira.ui";
import {} from "../../portfolio/utils";
import { usePreloadedAccountData } from "../../services/accountData";
import { useAccounts } from "../../services/accounts";
import { balanceSubscriptionAddresses } from "../../services/balanceAddresses";
import { GET_STARTED_URL } from "../../home/constants";
import {
  BalanceContextFragment$data,
  BalanceContextFragment$key,
} from "./__generated__/BalanceContextFragment.graphql";
import {
  BalanceV2AccountFragment$data,
  BalanceV2AccountFragment$key,
} from "./__generated__/BalanceV2AccountFragment.graphql";

const accountFragment = graphql`
  fragment BalanceV2AccountFragment on BalanceV2Account @inline {
    address
    balance
    valueUsd
    asset {
      asset
      type
      chain
      price {
        current
      }
      metadata {
        symbol
        decimals
      }
      variants {
        native {
          denom
        }
      }
    }
  }
`;

const readAccount = (
  ref: BalanceV2AccountFragment$key
): BalanceV2AccountFragment$data => readInlineData(accountFragment, ref);

const fragment = graphql`
  fragment BalanceContextFragment on Account {
    balancesV2(first: 100, addresses: $addresses)
      @catch
      @connection(key: "BalanceContext_balancesV2") {
      __id
      edges {
        node {
          id
          balance
          asset {
            id
            asset
            type
            chain
            metadata {
              symbol
              decimals
            }
            price {
              current
              changeDay
            }
            variants {
              native {
                denom
              }
            }
          }
          valueUsd
          accounts {
            ...BalanceV2AccountFragment
          }
        }
      }
    }
  }
`;

const subscription = graphql`
  subscription BalanceContextSubscription(
    $connection: ID!
    $addresses: [Address!]!
  ) {
    balances(addresses: $addresses) @appendEdge(connections: [$connection]) {
      cursor
      node {
        ... on BalanceV2 {
          id
          balance
          asset {
            id
            asset
            type
            chain
            metadata {
              symbol
              decimals
            }
            price {
              current
              changeDay
            }
          }
          valueUsd
          accounts {
            ...BalanceV2AccountFragment
          }
        }
      }
    }
  }
`;

export const BalanceSubscriptionProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { accountData } = usePreloadedAccountData();
  const { selected, accounts } = useAccounts();
  const data = useFragment<BalanceContextFragment$key>(fragment, accountData);
  // We need to filter the non-selected thorchain addresses; BalanceV2 nodes are Keyed
  // on concatenated addresses, so if extra thor1 addresses are added then we won't get updated
  const config = useMemo(() => {
    const addresses = balanceSubscriptionAddresses(accounts, selected);
    if (!data?.balancesV2.ok) return null;
    return {
      subscription,
      variables: { addresses, connection: data?.balancesV2?.value.__id },
    };
  }, [selected, accounts, data]);
  const env = useRelayEnvironment();
  useEffect(() => {
    if (!config?.variables.connection) return;
    const sub = requestSubscription(env, config);
    return () => {
      sub.dispose();
    };
  }, [config]);

  return children;
};

const context = createContext<BalanceResult>({
  asset: undefined as unknown as Asset,
});

type NodeRaw = NonNullable<
  NonNullable<
    NonNullable<
      Extract<
        BalanceContextFragment$data["balancesV2"],
        { ok: true }
      >["value"]["edges"]
    >[number]
  >["node"]
>;

type Node = Omit<NodeRaw, "accounts"> & {
  accounts: readonly BalanceV2AccountFragment$data[];
};

type BalanceProviderProps = {
  asset: Asset;
  additionalBalance?: bigint;
};

/**
 * @asset The asset details for balances.
 * @additionalBalance Used to increase the balance displayed for the given asset on the
 * Rujira network. This is useful when providing a balance on a UI that allows a user
 * to maintain an existing position, and you want to allow them to max out that position
 * using the Assets in their wallet plus the amount already in contract for that position.
 */
export const BalanceProvider: FC<PropsWithChildren<BalanceProviderProps>> = ({
  asset,
  additionalBalance,
  children,
}) => {
  const { accountData } = usePreloadedAccountData();
  const data = useFragment<BalanceContextFragment$key>(fragment, accountData);
  const walletBalance = findBalance(data, asset);
  const value = useMemo(
    () => ({ ...walletBalance, additionalBalance }),
    [walletBalance, additionalBalance]
  );
  return <context.Provider value={value}>{children}</context.Provider>;
};

export const usePreloadedBalance = () => {
  return useContext(context);
};

export const usePreloadedBalanceData = () => {
  const { accountData } = usePreloadedAccountData();
  return useFragment<BalanceContextFragment$key>(fragment, accountData)
    ?.balancesV2;
};

export const usePreloadedBalances = (): Node[] => {
  const data = usePreloadedBalanceData();
  if (!data?.ok) return [];
  return (
    data.value.edges?.reduce<Node[]>(
      (a, v) =>
        v?.node
          ? [{ ...v.node, accounts: v.node.accounts.map(readAccount) }, ...a]
          : a,
      []
    ) ?? []
  );
};

export const usePreloadedAssetBalance = (asset: Asset): BalanceResult => {
  const { accountData } = usePreloadedAccountData(false);
  const data = useFragment<BalanceContextFragment$key>(fragment, accountData);
  return findBalance(data, asset);
};

export type OmniFunding = {
  /** Held on Rujira, so an app-layer msg can spend it. */
  spendable: bigint;
  /** USD value held on other chains — what a deposit could still bring across. */
  depositableUsdValue: bigint;
};

/**
 * Split one asset's omnichain balance into what an app-layer msg can spend immediately
 * and what usd value is still sitting elsewhere.
 */
export const useOmniFunding = (asset: Asset): OmniFunding => {
  const accounts = usePreloadedAssetBalance(asset).balance?.accounts ?? [];
  const onRujira = (a: BalanceAccount) =>
    a.asset.type === "SECURED" || a.asset.chain === THOR;

  return {
    spendable: accounts.find(onRujira)?.balance ?? 0n,
    depositableUsdValue: accounts
      .filter((a) => !onRujira(a))
      .reduce((sum, a) => sum + a.valueUsd, 0n),
  };
};

export const BalanceCompact: FC<{
  className?: string;
  onClick?: (a: Balance | BalanceAccount) => void;
}> = ({ className, onClick }) => {
  const { t } = useTranslation("common");
  const { balance, additionalBalance } = usePreloadedBalance();
  const { accounts } = useAccounts();
  const tooltipId = useId();

  const balanceAdjusted = useMemo(() => {
    if (!balance) return undefined;
    if (!additionalBalance || additionalBalance === 0n) return balance;

    const adjustedAccounts = balance.accounts.map((account) => {
      if (account.asset.type === "SECURED") {
        const newBalanceAmount = account.balance + additionalBalance;
        return {
          ...account,
          balance: newBalanceAmount,
          valueUsd:
            account.balance === 0n
              ? 0n
              : BigInt(
                  Math.floor(
                    (Number(newBalanceAmount) / Number(account.balance)) *
                      Number(account.valueUsd)
                  )
                ),
        };
      } else {
        return account;
      }
    });

    return {
      ...balance,
      balance: (balance.balance ?? 0n) + (additionalBalance ?? 0n),
      accounts: adjustedAccounts,
    };
  }, [balance, additionalBalance]);

  return (
    <>
      <div
        className={clsx({
          "flex condensed fs-12 color-grey": true,
          [`${className}`]: className,
        })}>
        <div className="col">
          <span
            className="iflex ai-c pointer hover-white"
            data-tooltip-id={tooltipId}>
            {t("available")}
            <Icons.Info className="w-2 h-2 ml-0.5 color-grey" />
          </span>
        </div>
        <OmniBalance
          balance={balanceAdjusted}
          onClick={onClick}
          className="condensed fs-14 hover-white"
          accountProviders={accounts}
        />
      </div>
      <Tooltip
        id={tooltipId}
        className="tooltip"
        clickable
        delayHide={100}>
        <div className="w-30 text-left">
          {t("availableBalanceTooltipP1")}
          <br />
          <br />
          {t("availableBalanceTooltipP2")}
          <br />
          <br />
          <a
            href={`${GET_STARTED_URL}/omnichain`}
            className="color-primary1 hover-primary2 no-underline fw-500">
            {t("availableBalanceTooltipLink")}
          </a>
        </div>
      </Tooltip>
    </>
  );
};

export type BalanceResult = {
  asset: Asset;
  balance?: Balance;
  account?: BalanceAccount;
  additionalBalance?: bigint;
};

export const createBalanceProvider = <T extends string>(): [
  FC<
    PropsWithChildren<{
      assets: Record<T, Asset>;
    }>
  >,
  () => Record<T, BalanceResult>,
] => {
  const init = {} as Record<T, BalanceResult>;
  const context = createContext<Record<T, BalanceResult>>(init);
  const provider: FC<PropsWithChildren<{ assets: Record<T, Asset> }>> = ({
    children,
    assets,
  }) => {
    const { accountData } = usePreloadedAccountData();
    const data = useFragment<BalanceContextFragment$key>(fragment, accountData);
    const value = (Object.entries(assets) as [T, Asset][]).reduce(
      (a, [k, v]) => ({
        ...a,
        [k]: findBalance(data, v),
      }),
      init
    );
    return <context.Provider value={value}>{children}</context.Provider>;
  };
  const consumer = () => useContext(context);
  return [provider, consumer];
};

const findBalance = (
  data: BalanceContextFragment$data | null | undefined,
  asset: Asset
): BalanceResult => {
  if (!data?.balancesV2.ok) return { asset };
  const balanceNode = data?.balancesV2.value.edges?.find(
    (a) => a?.node?.asset?.asset === asset?.asset
  )?.node;
  if (balanceNode) {
    const accounts = balanceNode.accounts.map(readAccount);
    return {
      asset,
      balance: { ...balanceNode, accounts },
      account:
        accounts.find((x) => x.asset.asset === asset.asset) || accounts[0],
    };
  }

  // We might explicitly need a balance for a non-unified token, eg WBTC. In that case construct a new Balance object
  const account = (data?.balancesV2.value.edges || [])
    .flatMap((a) => a?.node?.accounts.map(readAccount) || [])
    .find((a) => a.asset.asset === asset.asset);
  if (account)
    return {
      asset,
      account,
      balance: {
        asset: account.asset,
        balance: account.balance,
        accounts: [account],
        valueUsd: account.valueUsd,
      },
    };
  return { asset };
};
