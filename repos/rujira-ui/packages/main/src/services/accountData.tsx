import {
  createContext,
  FC,
  PropsWithChildren,
  TransitionStartFunction,
  useContext,
  useEffect,
  useMemo,
  useTransition,
} from "react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { Id } from "../node";
import { useTradeOrderSubscriptions } from "../trade/TradeSubscriptions";
import {
  accountDataQuery,
  accountDataQuery$data,
} from "./__generated__/accountDataQuery.graphql";
import { useAccounts } from "./accounts";
import { balanceQueryAddresses } from "./balanceAddresses";

const one = graphql`
  query accountDataQuery($id: ID, $addresses: [Address!]!) {
    node(id: $id) {
      ... on Account {
        ...BalanceFragment
        ...BalanceContextFragment
        ...BalancesPoolFragment
        ...BorrowAccountFragment
        ...DebtsAccountFragment
        ...GhostVaultAccountFragment
        ...IndexAccountFragment
        ...IndexBalancesFragment
        ...MergingFragment
        ...OrderBookAccountFragment
        ...PortfolioFragment
        ...PositionsPortfolioFragment
        ...LimitOrdersAccountFragment
        ...RecurringOrdersAccountFragment
        ...RangeOrdersAccountFragment
        ...StakeAccountFragment
        ...StakeOverviewAccountFragment
        ...StrategyAccountFragment
        ...ThorchainPoolAccountFragment
        ...TradeSubscriptionsFragment
        ...useAutoClaimerFragment
      }
    }
  }
`;

const Context = createContext<{
  accountQuery: PreloadedQuery<accountDataQuery>;
  isLoading: boolean;
  transition: TransitionStartFunction;
}>({
  accountQuery: undefined as unknown as PreloadedQuery<accountDataQuery>,
  isLoading: false,
  transition: () => {},
});

export const AccountDataContext: FC<PropsWithChildren> = ({ children }) => {
  const { selected, accounts } = useAccounts();
  const addresses = useMemo(() => balanceQueryAddresses(accounts), [accounts]);
  const [accountQuery, loadAccountData] = useQueryLoader<accountDataQuery>(one);
  const [isLoading, transition] = useTransition();
  const selectedAddress = selected?.address.address;

  useEffect(() => {
    const vars = selectedAddress
      ? { id: Id.account({ address: selectedAddress }), addresses }
      : { addresses };

    loadAccountData(vars, { fetchPolicy: "store-and-network" });
  }, [addresses, loadAccountData, selectedAddress]);

  return (
    <Context.Provider
      value={{
        accountQuery: accountQuery as PreloadedQuery<accountDataQuery>,
        isLoading,
        transition,
      }}>
      {children}
    </Context.Provider>
  );
};

/**
 * @param createSubscriptions Pass `false` to read account data without also
 * opening this caller's trade-order subscriptions.
 */
export const usePreloadedAccountData = (
  createSubscriptions = true
): {
  accountData?: accountDataQuery$data["node"];
  isLoading: boolean;
} => {
  const { accountQuery, isLoading } = useContext(Context);
  if (!accountQuery) {
    return { accountData: undefined, isLoading: false };
  }
  const query = usePreloadedQuery(one, accountQuery);
  useTradeOrderSubscriptions(query.node || undefined, createSubscriptions);
  return { accountData: query.node || undefined, isLoading };
};
