import { FC, Suspense, useEffect, useState } from "react";
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
import { getStakingStrategySeo, ProductSeoHelmet } from "../seo";
import { usePreloadedAccountData } from "../services/accountData";
import { StakingContainer } from "./components/Common";
import { StakingPool } from "./components/StakePoolPage";
import { StakeAccountFragment$key } from "./__generated__/StakeAccountFragment.graphql";
import { StakeQuery } from "./__generated__/StakeQuery.graphql";
import { StakeRootQuery } from "./__generated__/StakeRootQuery.graphql";
import { matchesStakingPoolSegment } from "./routes";

const accountFragment = graphql`
  fragment StakeAccountFragment on Account {
    ...StakePoolPageAccountFragment
  }
`;

const rootQuery = graphql`
  query StakeRootQuery {
    staking {
      pools {
        id
        bondAsset {
          metadata {
            symbol
          }
        }
      }
    }
  }
`;

const query = graphql`
  query StakeQuery($id: ID!) {
    node(id: $id) {
      __typename
      ... on StakingPool {
        ...StakePoolPageFragment
      }
    }
  }
`;

const Meta = () => {
  const { asset } = useParams<{ asset: string }>();
  const { locale } = useLocale();

  return (
    <ProductSeoHelmet
      seo={asset ? getStakingStrategySeo(asset, locale) : null}
    />
  );
};

export const Stake: FC = () => {
  return (
    <TranslationProvider namespace="staking">
      <Meta />
      <Suspense fallback={<Fallback />}>
        <QueryProvider />
      </Suspense>
    </TranslationProvider>
  );
};

const QueryProvider: FC = () => {
  const { asset } = useParams<{ asset: string }>();
  const [q, loadQuery] = useQueryLoader<StakeQuery>(query);
  const [requestedId, setRequestedId] = useState<string>();
  const { staking } = useLazyLoadQuery<StakeRootQuery>(rootQuery, {});

  const node = asset
    ? staking.pools.find((pool) =>
        matchesStakingPoolSegment(pool.bondAsset, asset)
      )
    : undefined;
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
  q: PreloadedQuery<StakeQuery>;
}> = ({ q }) => {
  const data = usePreloadedQuery(query, q);
  const { accountData } = usePreloadedAccountData();
  const account =
    useFragment<StakeAccountFragment$key>(accountFragment, accountData) ||
    undefined;

  if (data.node?.__typename === "StakingPool") {
    return <StakingPool k={data.node} a={account} />;
  }

  return <NotFound />;
};

const Fallback: FC = () => {
  return (
    <StakingContainer>
      <div className="flex ai-c wrap mt-2">
        <div className="skeleton h-6 w-12 w-sm-18 w-md-22 w-lg-45 br-6 mr-2" />

        <div className="lp big mr-3">
          <div className="icon-denom skeleton br-4" />
        </div>
        <div className="skeleton h-3.5 w-10 w-lg-26.5 br-4" />
      </div>
    </StakingContainer>
  );
};
