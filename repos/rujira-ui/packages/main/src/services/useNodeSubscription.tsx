import { FC, useMemo } from "react";
import { useSubscription } from "react-relay";
import { GraphQLTaggedNode } from "relay-runtime";

export const useNodeSubscription = (
  subscription: GraphQLTaggedNode,
  id: string
) => {
  const config = useMemo(
    () => ({
      subscription,
      variables: { id },
      onError: console.log,
    }),
    [id]
  );

  return useSubscription(config);
};

/** Convenience component to allow conditional hooks */
export const Subscription: FC<{
  id: string;
  subscription: GraphQLTaggedNode;
}> = ({ id, subscription }) => {
  // Subscribe to updates
  useNodeSubscription(subscription, id);
  return null;
};

export const useEdgeSubscription = (
  subscription: GraphQLTaggedNode,
  prefix?: string
) => {
  const config = useMemo(
    () => ({
      subscription,
      variables: { prefix },
    }),
    [prefix]
  );

  return useSubscription(config);
};

/** Convenience component to allow conditional hooks */
export const EdgeSubscription: FC<{
  prefix: string;
  subscription: GraphQLTaggedNode;
}> = ({ prefix, subscription }) => {
  // Subscribe to updates
  useEdgeSubscription(subscription, prefix);
  return null;
};
