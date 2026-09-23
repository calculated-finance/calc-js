import { useEffect, useMemo } from "react";
import { useFragment, useRelayEnvironment, useSubscription } from "react-relay";
import { graphql, requestSubscription } from "relay-runtime";
import { bigintToFixed } from "rujira.js";
import { useNotifications } from "../services/notifcation";
import {
  TradeSubscriptionsFinRangeFragment$data,
  TradeSubscriptionsFinRangeFragment$key,
} from "./__generated__/TradeSubscriptionsFinRangeFragment.graphql";
import { TradeSubscriptionsFragment$key } from "./__generated__/TradeSubscriptionsFragment.graphql";
import { TradeSubscriptionsRangeSubscription } from "./__generated__/TradeSubscriptionsRangeSubscription.graphql";
import { TradeSubscriptionsSubscription } from "./__generated__/TradeSubscriptionsSubscription.graphql";

export const fragment = graphql`
  fragment TradeSubscriptionsFragment on Account {
    address
    fin {
      ordersV2(first: 100)
        @connection(key: "TradeSubscriptionsFragment_ordersV2") {
        __id
        edges {
          node {
            __typename
            ... on FinOrder {
              pair {
                address
              }
              side
              rate
              type
              owner
              deviation
              remaining
              filled
              ...LimitOrdersFragment
            }
            ... on CalcOrder {
              id
              updatedAt
              valueUsd
              source
              status
              balances {
                amount
              }
              config {
                nodes {
                  ... on CalcAction {
                    action {
                      ... on CalcActionSwap {
                        routes {
                          ... on CalcSwapRouteFin {
                            pairAddress
                          }
                        }
                      }
                    }
                  }
                }
              }
              ...RecurringOrdersFragment
            }
          }
        }
      }
      ranges(first: 100) @connection(key: "TradeSubscriptionsFragment_ranges") {
        __id
        edges {
          node {
            ... on FinRange {
              id
              idx
              pair {
                address
              }
            }
          }
        }
      }
    }
  }
`;

const rangeFragment = graphql`
  fragment TradeSubscriptionsFinRangeFragment on FinRange {
    id
    idx
    low
    high
    skew
    spread
    fee
    base
    quote
    feesBase
    feesQuote
    principalUsd
    yieldUsd
    pair {
      address
      book {
        center
      }
      assetBase {
        type
        chain
        asset
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
      assetQuote {
        type
        chain
        asset
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
    }
    inRange
    analytics {
      firstDepositDate
      weightedAverageInvestmentAgeDays
      totalInvested
      totalWithdrawn
      realizedYield
      unrealizedInvestment
      unrealizedYield
      moic
      dpi
      apr
    }
  }
`;
export const useTradeSubscriptionsFinRangeFragment = (
  k: TradeSubscriptionsFinRangeFragment$key
): TradeSubscriptionsFinRangeFragment$data => {
  return useFragment(rangeFragment, k);
};

const finOrderSubscription = graphql`
  subscription TradeSubscriptionsSubscription(
    $contract: Address!
    $owner: Address!
    $price: String!
    $side: String!
  ) {
    finOrderFilled(
      contract: $contract
      owner: $owner
      price: $price
      side: $side
    ) {
      node {
        __typename
        ... on FinOrder {
          pair {
            assetBase {
              metadata {
                symbol
              }
            }
            assetQuote {
              metadata {
                symbol
              }
            }
          }
        }

        ...LimitOrdersFragment
      }
    }
  }
`;

const finOrderUpdatedSubscription = graphql`
  subscription TradeSubscriptionsOrderSubscription(
    $connection: ID!
    $owner: Address!
  ) {
    finOrderUpdated(owner: $owner) @appendEdge(connections: [$connection]) {
      node {
        ... on FinOrder {
          valueUsd
        }
        ...LimitOrdersFragment
      }
    }
  }
`;

const calcOrdersUpdatedSubscription = graphql`
  subscription TradeSubscriptionsCalcOrdersUpdatedSubscription(
    $connection: ID!
    $owner: Address!
  ) {
    calcOrdersUpdated(owner: $owner) @appendEdge(connections: [$connection]) {
      node {
        ... on CalcOrder {
          valueUsd
          source
          status
          balances {
            amount
          }
          ...RecurringOrdersFragment
        }
      }
    }
  }
`;

const finRangeSubscription = graphql`
  subscription TradeSubscriptionsRangeSubscription($id: ID!) {
    node(id: $id) {
      ... on FinRange {
        ...TradeSubscriptionsFinRangeFragment
      }
    }
  }
`;

const finRangeUpdatedSubscription = graphql`
  subscription TradeSubscriptionsRangeUpdatedSubscription(
    $connection: ID!
    $owner: Address!
  ) {
    finRangeUpdated(owner: $owner) @appendEdge(connections: [$connection]) {
      node {
        ... on FinRange {
          valueUsd
          ...TradeSubscriptionsFinRangeFragment
        }
      }
    }
  }
`;

const finRangeClosedSubscription = graphql`
  subscription TradeSubscriptionsRangeClosedSubscription(
    $connection: ID!
    $owner: Address!
  ) {
    finRangeClosed(owner: $owner) @deleteEdge(connections: [$connection]) {
      node {
        ... on FinRange {
          id
        }
      }
    }
  }
`;

/**
 * Setting createSubscriptions = false allows us to no-op everything inside this hook,
 * without violating the rules of hooks at call sites using useTradeOrderSubscriptions.
 */
export const useTradeOrderSubscriptions = (
  k?: TradeSubscriptionsFragment$key,
  createSubscriptions = true
) => {
  const env = useRelayEnvironment();
  // Withholding the key is our "no-op" switch
  const account = useFragment(fragment, createSubscriptions ? k : undefined);

  useEffect(() => {
    if (!account?.address) return;

    const d = [finOrderUpdatedSubscription, calcOrdersUpdatedSubscription].map(
      (s) =>
        requestSubscription(env, {
          subscription: s,
          variables: {
            owner: account.address,
            connection: account.fin?.ordersV2?.__id,
          },
        })
    );

    return () => {
      d.forEach((d) => d.dispose());
    };
  }, [account]);

  useEffect(() => {
    const connection = account?.fin?.ranges?.__id;
    if (!connection) return;
    if (!account?.address) return;

    const subs = [finRangeUpdatedSubscription, finRangeClosedSubscription].map(
      (subscription) =>
        requestSubscription(env, {
          subscription,
          variables: {
            connection,
            owner: account.address,
          },
        })
    );

    return () => {
      subs.forEach((s) => s.dispose());
    };
  }, [account, env]);

  const { push } = useNotifications();

  useEffect(() => {
    const subs = (account?.fin?.ordersV2?.edges || []).map((o) => {
      if (!o?.node || o.node.__typename !== "FinOrder") return null;
      const price = o.node.deviation
        ? { oracle: Number(o.node.deviation) }
        : { fixed: bigintToFixed(o.node.rate) };
      return requestSubscription<TradeSubscriptionsSubscription>(env, {
        subscription: finOrderSubscription,
        variables: {
          contract: o.node.pair.address,
          owner: o.node.owner,
          price: `${o.node.type}:${price.oracle || price.fixed?.replace(/\.?0+$/, "")}`,
          side: o.node.side,
        },
        onNext: async (e) => {
          if (e?.finOrderFilled?.node?.__typename !== "FinOrder") return;
          push(
            `${e?.finOrderFilled?.node.pair?.assetBase.metadata.symbol}/${e?.finOrderFilled?.node.pair?.assetQuote.metadata.symbol} order filled`
          );
        },
      });
    });
    return () => {
      subs.map((x) => x?.dispose());
    };
  }, [account]);

  useEffect(() => {
    const subs = (account?.fin?.ranges?.edges || []).map((o) => {
      if (!o?.node) return null;
      return requestSubscription<TradeSubscriptionsRangeSubscription>(env, {
        subscription: finRangeSubscription,
        variables: { id: o.node.id },
      });
    });
    return () => {
      subs.map((x) => x?.dispose());
    };
  }, [account]);
};

const bookSubscription = graphql`
  subscription TradeSubscriptionsBookSubscription($id: ID!, $truncate: Int) {
    node(id: $id) {
      ... on FinBookV2 {
        ...OrderBookSubFragment @arguments(truncate: $truncate)
      }
    }
  }
`;

export const useTradeBookSubscription = (
  id: string | null | undefined,
  truncate?: number | null
) => {
  if (!id) return;
  const config = useMemo(
    () => ({
      subscription: bookSubscription,
      variables: { id, truncate },
    }),
    [truncate, id]
  );
  return useSubscription(config);
};
