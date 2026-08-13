import { FC, Suspense, useEffect, useState } from "react";
import {
  PreloadedQuery,
  useLazyLoadQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { useParams } from "react-router-dom";
import { graphql } from "relay-runtime";
import { TranslationProvider, useLocale } from "rujira.ui";
import { NotFound } from "../common/NotFound";
import { getStrategySeo, ProductSeoHelmet } from "../seo";
import { StrategyContainer } from "../strategies/components/Common";
import { GhostVault } from "../strategies/components/GhostVault";
import { LendQuery } from "./__generated__/LendQuery.graphql";
import { LendRootQuery } from "./__generated__/LendRootQuery.graphql";
import { matchesLendVaultSegment } from "./routes";

const rootQuery = graphql`
  query LendRootQuery {
    strategies(first: 100, typenames: ["GhostVault"]) {
      edges {
        node {
          __typename
          ... on GhostVault {
            id
            asset {
              asset
              chain
              type
              metadata {
                symbol
              }
            }
          }
        }
      }
    }
  }
`;

const query = graphql`
  query LendQuery($id: ID!) {
    node(id: $id) {
      __typename
      ... on GhostVault {
        ...GhostVaultFragment
      }
    }
  }
`;

const Meta = () => {
  const { asset } = useParams<{ asset: string }>();
  const { locale } = useLocale();

  return (
    <ProductSeoHelmet
      seo={getStrategySeo({ category: "lend", assets: asset, locale })}
    />
  );
};

export const Lend: FC = () => {
  return (
    <TranslationProvider namespace="strategies">
      <Meta />
      <Suspense fallback={<Fallback />}>
        <QueryProvider />
      </Suspense>
    </TranslationProvider>
  );
};

const QueryProvider: FC = () => {
  const { asset } = useParams<{ asset: string }>();
  const [q, loadQuery] = useQueryLoader<LendQuery>(query);
  const [requestedId, setRequestedId] = useState<string>();
  const { strategies } = useLazyLoadQuery<LendRootQuery>(rootQuery, {});

  const edge = asset
    ? strategies.edges?.find((p) => {
        return (
          p?.node?.__typename === "GhostVault" &&
          matchesLendVaultSegment(p.node.asset, asset)
        );
      })
    : undefined;
  const node = edge?.node?.__typename === "GhostVault" ? edge.node : undefined;
  const id = node?.id;

  useEffect(() => {
    if (!id) return;
    loadQuery({ id }, { fetchPolicy: "store-and-network" });
    setRequestedId(id);
  }, [id, loadQuery]);

  if (!asset || !node) return <NotFound />;

  return q && requestedId === id ? <Content q={q} /> : <Fallback />;
};

const Content: FC<{
  q: PreloadedQuery<LendQuery>;
}> = ({ q }) => {
  const data = usePreloadedQuery(query, q);

  if (data.node?.__typename === "GhostVault") {
    return <GhostVault k={data.node} />;
  }

  return <NotFound />;
};

const Fallback: FC = () => {
  return (
    <StrategyContainer>
      <div className="flex ai-c wrap mt-2">
        <div className="skeleton h-6 w-12 w-sm-18 w-md-22 w-lg-45 br-6 mr-2" />

        <div className="lp big mr-3">
          <div className="icon-denom skeleton br-4" />
          <div className="icon-denom skeleton br-4" />
        </div>
        <div className="skeleton h-3.5 w-10 w-lg-26.5 br-4" />
      </div>
    </StrategyContainer>
  );
};
