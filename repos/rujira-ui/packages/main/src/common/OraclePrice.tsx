import { useEffect } from "react";
import { useFragment, useRelayEnvironment } from "react-relay";
import { graphql, requestSubscription } from "relay-runtime";
import { OraclePriceFragment$key } from "./__generated__/OraclePriceFragment.graphql";

const fragment = graphql`
  fragment OraclePriceFragment on ThorchainOraclePrice {
    id
    current
  }
`;

const subscription = graphql`
  subscription OraclePriceSubscription($id: ID!) {
    node(id: $id) {
      ... on ThorchainOraclePrice {
        ...OraclePriceFragment
      }
    }
  }
`;

export const useOraclePrice = (
  k: OraclePriceFragment$key | null | undefined
): bigint | undefined => {
  const env = useRelayEnvironment();
  const data = useFragment(fragment, k);

  useEffect(() => {
    if (!data?.id) return;
    const { dispose } = requestSubscription(env, {
      subscription,
      variables: {
        id: data.id,
      },
    });
    return () => {
      dispose();
    };
  }, [data?.id]);

  return data ? data.current : undefined;
};
