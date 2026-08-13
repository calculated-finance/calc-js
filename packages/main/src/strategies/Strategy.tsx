import { FC, Suspense, useEffect } from "react";
import {
  PreloadedQuery,
  useFragment,
  useLazyLoadQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { useParams } from "react-router-dom";
import { graphql } from "relay-runtime";
import { TranslationProvider, useLocale } from "rujira.ui";
import { NotFound } from "../common/NotFound";
import { getStrategySeo, ProductSeoHelmet } from "../seo";
import { usePreloadedAccountData } from "../services/accountData";
import { StrategyAccountFragment$key } from "./__generated__/StrategyAccountFragment.graphql";
import { StrategyQuery } from "./__generated__/StrategyQuery.graphql";
import { StrategyRootQuery } from "./__generated__/StrategyRootQuery.graphql";
import { BowPoolXyk } from "./components/BowPoolXyk";
import { StrategyContainer } from "./components/Common";
import { ThorchainPool } from "./components/ThorchainPool";

const accountFragment = graphql`
  fragment StrategyAccountFragment on Account {
    ...BowPoolXykAccountFragment
    ...ThorchainPoolAccountFragment
  }
`;

const rootQuery = graphql`
  query StrategyRootQuery {
    strategies(first: 100, typenames: ["BowPoolXyk", "ThorchainPool"]) {
      edges {
        cursor
        node {
          __typename
          ... on BowPoolXyk {
            id
            config {
              x {
                metadata {
                  symbol
                }
              }
              y {
                metadata {
                  symbol
                }
              }
            }
          }
          ... on ThorchainPool {
            id
            asset {
              asset
            }
          }
        }
      }
    }
  }
`;

const query = graphql`
  query StrategyQuery($id: ID!) {
    node(id: $id) {
      __typename
      ... on BowPoolXyk {
        ...BowPoolXykFragment
      }
      ... on ThorchainPool {
        ...ThorchainPoolFragment
      }
    }
  }
`;

const Meta: FC<{
  category?: string;
  type?: string;
  assets?: string;
}> = ({ category, type, assets }) => {
  const { locale } = useLocale();
  const seo =
    category === "amm"
      ? getStrategySeo({
          category,
          type,
          assets,
          locale,
        })
      : null;

  return <ProductSeoHelmet seo={seo} />;
};

export const Strategy: FC = () => {
  const { category, type, assets } = useParams<{
    category: string;
    type?: string;
    assets: string;
  }>();

  return (
    <TranslationProvider namespace="strategies">
      <Meta category={category} type={type} assets={assets} />
      <Suspense fallback={<Fallback />}>
        <QueryProvider />
      </Suspense>
    </TranslationProvider>
  );
};

const QueryProvider: FC = () => {
  const [q, loadQuery] = useQueryLoader<StrategyQuery>(query);
  const { category, type, assets } = useParams<{
    category: string;
    type?: string;
    assets: string;
  }>();
  const { strategies } = useLazyLoadQuery<StrategyRootQuery>(rootQuery, {});

  const node =
    category && assets
      ? ((category, type, assets) => {
          switch (category) {
            case "amm":
              switch (type) {
                case "thorchain":
                  return strategies.edges?.find(
                    (a) =>
                      a?.node?.__typename === "ThorchainPool" &&
                      a.node.asset.asset === assets
                  );
                case "xyk":
                  if (!assets) return null;
                  const [x, y] = assets.split("-");
                  return strategies.edges?.find(
                    (p) =>
                      p?.node?.__typename === "BowPoolXyk" &&
                      p?.node.config.x?.metadata.symbol === x &&
                      p?.node.config.y?.metadata.symbol === y
                  );
              }
              break;
          }
        })(category, type, assets)
      : null;
  const id = node?.node?.__typename !== "%other" ? node?.node?.id : undefined;
  useEffect(() => {
    if (!id) return;
    loadQuery({ id }, { fetchPolicy: "store-and-network" });
  }, [id, loadQuery]);

  if (!node) return <NotFound />;
  return q ? <Content q={q} /> : <Fallback />;
};

const Content: FC<{
  q: PreloadedQuery<StrategyQuery>;
}> = ({ q }) => {
  const data = usePreloadedQuery(query, q);
  const { accountData } = usePreloadedAccountData();
  const account =
    useFragment<StrategyAccountFragment$key>(accountFragment, accountData) ||
    undefined;

  switch (data.node?.__typename) {
    case "BowPoolXyk":
      return <BowPoolXyk k={data.node} a={account} />;
    case "ThorchainPool":
      return <ThorchainPool k={data.node} a={account} />;
  }
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
