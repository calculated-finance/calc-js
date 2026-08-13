import { graphql } from "relay-runtime";

export const query = graphql`
  query AlgorithmicLeaderboardQuery(
    $status: FinRangeStatus!
    $count: Int!
    $contracts: [Address!]
  ) {
    ...AlgorithmicLeaderboard_query
      @arguments(status: $status, count: $count, contracts: $contracts)
  }
`;

export const rangesFragment = graphql`
  fragment AlgorithmicLeaderboard_query on RootQueryType
  @argumentDefinitions(
    status: { type: "FinRangeStatus!" }
    count: { type: "Int!" }
    cursor: { type: "String" }
    contracts: { type: "[Address!]" }
  )
  @refetchable(queryName: "AlgorithmicLeaderboardPaginationQuery") {
    finV3 {
      ranges(
        first: $count
        after: $cursor
        contracts: $contracts
        status: $status
        sortBy: APR
        sortDir: DESC
      ) @connection(key: "AlgorithmicLeaderboard_ranges") {
        edges {
          node {
            id
            owner
            high
            low
            price
            spread
            fee
            valueUsd
            rewardStrategy
            tightnessFactor
            pair {
              assetBase {
                asset
                type
                chain
                metadata {
                  symbol
                  decimals
                }
              }
              assetQuote {
                asset
                type
                chain
                metadata {
                  symbol
                  decimals
                }
                price {
                  current
                }
              }
            }
            analytics {
              weightedAverageInvestmentAgeDays
              apr
              moic
              dpi
            }
          }
        }
      }
    }
  }
`;

// Relay artifacts cannot be shared across the main and analytics environments.
export const pairsQuery = graphql`
  query AlgorithmicLeaderboardPairsQuery {
    finV3 {
      pairs(first: 200, sortBy: NAME, sortDir: ASC) {
        edges {
          node {
            address
            assetBase {
              asset
              type
              chain
              metadata {
                symbol
                decimals
              }
            }
            assetQuote {
              asset
              type
              chain
              metadata {
                symbol
                decimals
              }
            }
          }
        }
      }
    }
  }
`;
