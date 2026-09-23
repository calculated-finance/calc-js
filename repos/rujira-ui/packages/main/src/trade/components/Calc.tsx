import { useLazyLoadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import { CalcQuery, CalcQuery$data } from "./__generated__/CalcQuery.graphql";

const query = graphql`
  query CalcQuery {
    calc {
      metadata {
        manager
        scheduler
        baseFeeBps
      }
    }
  }
`;

export const useCalcMetadata = (): CalcQuery$data["calc"]["metadata"] => {
  return useLazyLoadQuery<CalcQuery>(query, {})?.calc?.metadata;
};
