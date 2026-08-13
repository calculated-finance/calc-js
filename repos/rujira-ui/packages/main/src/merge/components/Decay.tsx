import { useEffect } from "react";
import { useRefetchableFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { useNodeSubscription } from "../../services/useNodeSubscription";
import { DecayFragment$key } from "./__generated__/DecayFragment.graphql";

const fragment = graphql`
  fragment DecayFragment on MergePool
  @refetchable(queryName: "DecayRefetchQuery") {
    id
    startRate
    currentRate
  }
`;

const subscription = graphql`
  subscription DecaySubscription($id: ID!) {
    node(id: $id) {
      ... on MergePool {
        currentRate
      }
    }
  }
`;

export const toFixed = (num: number, fixed: number): string => {
  var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  return num.toString().match(re)?.[0] ?? num.toString();
};

export const GetDecay = (k: DecayFragment$key): number => {
  const [data, refetch] = useRefetchableFragment(fragment, k);
  useEffect(() => {
    refetch({}, { fetchPolicy: "store-and-network" });
  }, []);
  const rate = Number(data.currentRate) / Number(data.startRate);
  useNodeSubscription(subscription, data.id);

  return rate;
};
