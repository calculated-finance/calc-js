import { Buffer } from "buffer";
import { useMemo } from "react";
import { useLazyLoadQuery, useSubscription } from "react-relay";
import { graphql } from "relay-runtime";
import {
  useSimulationQuery,
  useSimulationQuery$data,
} from "./__generated__/useSimulationQuery.graphql";

const query = graphql`
  query useSimulationQuery($id: ID!) {
    node(id: $id) {
      ... on FinSimulation {
        id
        amount
        denom
        fee
        returned
      }
    }
  }
`;

const subscription = graphql`
  subscription useSimulationSubscription(
    $address: Address!
    $denom: String!
    $amount: Bigint!
  ) {
    finSimulation(address: $address, denom: $denom, amount: $amount) {
      id
      amount
      denom
      fee
      returned
    }
  }
`;

export type Simulation = NonNullable<useSimulationQuery$data["node"]>;

export const useSimulation = (
  address: string,
  denom: string,
  amount: bigint
): Simulation | null => {
  const data = useLazyLoadQuery<useSimulationQuery>(
    query,
    {
      id: Buffer.from(`FinSimulation:${address}:${denom}:${amount}`).toString(
        "base64"
      ),
    },
    { fetchPolicy: "network-only" }
  );
  const config = useMemo(
    () => ({
      subscription,
      variables: { address, amount: amount.toString(), denom },
    }),
    [address, amount, denom]
  );
  useSubscription(config);
  return data.node || null;
};
