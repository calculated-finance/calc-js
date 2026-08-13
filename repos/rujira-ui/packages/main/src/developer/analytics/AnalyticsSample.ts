import { useLazyLoadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import { AnalyticsSampleQuery as AnalyticsSampleQueryType } from "./__generated__/AnalyticsSampleQuery.graphql";

const query = graphql`
  query AnalyticsSampleQuery {
    users {
      topTradersByVolume {
        tier
        amount
        percentage
      }
    }
  }
`;

// A bumped fetchKey is what makes a retry actually reach the network; a
// remount on its own would be served from the store whenever the previous
// attempt succeeded.
export const useAnalyticsTestQuery = (fetchKey?: number) =>
  useLazyLoadQuery<AnalyticsSampleQueryType>(
    query,
    {},
    { fetchKey, fetchPolicy: "network-only" }
  );
