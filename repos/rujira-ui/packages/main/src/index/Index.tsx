import { FC, Suspense, useEffect } from "react";
import {
  PreloadedQuery,
  useFragment,
  useLazyLoadQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { Link, useParams } from "react-router-dom";
import { graphql } from "relay-runtime";
import {
  IconDenom,
  Icons,
  TranslationProvider,
  useLocale,
  useTranslation,
} from "rujira.ui";
import { IndexQuery } from "./__generated__/IndexQuery.graphql";

import { BalanceProvider } from "../common/components/Balance";
import { usePreloadedAccountData } from "../services/accountData";
import { Subscription } from "../services/useNodeSubscription";
import { getIndexAssetSeo, ProductSeoHelmet } from "../seo";
import {
  IndexAccountFragment$data,
  IndexAccountFragment$key,
} from "./__generated__/IndexAccountFragment.graphql";
import { IndexRootQuery } from "./__generated__/IndexRootQuery.graphql";
import { Actions } from "./components/Actions";
import { Allocation } from "./components/Allocation";
import { Chart } from "./components/Chart";
import { IndexContainer } from "./components/Common";
import { FAQ } from "./components/FAQ";
import { IndexShareCard } from "./components/IndexShareCard";

const accountFragment = graphql`
  fragment IndexAccountFragment on Account {
    ...ActionsAccountFragment
    ...IndexBalancesFragment
    ...ShareCardBadgeAccountFragment
  }
`;

const rootQuery = graphql`
  query IndexRootQuery {
    index {
      id
      shareAsset {
        metadata {
          symbol
        }
      }
    }
  }
`;

const query = graphql`
  query IndexQuery($id: ID!) {
    node(id: $id) {
      ... on IndexVault {
        id
        address
        status {
          totalShares
          nav
          navPerShare
          redemptionRate
          navQuote
          navChange
          navPerShareChange
          ...AllocationFragment
          ...PartialWithdrawFragment
        }
        config {
          quoteAsset {
            asset
            type
            chain
            metadata {
              decimals
              symbol
            }
            variants {
              native {
                denom
              }
            }
          }
        }
        shareAsset {
          asset
          metadata {
            decimals
            symbol
            description
            display
            name
          }
          variants {
            native {
              denom
            }
          }
        }
        entryAdapter
        type
        ...FAQFragment
      }
    }
  }
`;

const subscription = graphql`
  subscription IndexSubscription($id: ID!) {
    node(id: $id) {
      ... on IndexVault {
        status {
          allocations {
            value
            price
            currentWeight
            balance
          }
          nav
          navPerShare
          navPerShareChange
          redemptionRate
          navQuote
          navChange
        }
      }
    }
  }
`;

const Meta: FC<{ asset?: string }> = ({ asset }) => {
  const { locale } = useLocale();

  return <ProductSeoHelmet seo={getIndexAssetSeo(asset, locale)} />;
};

export const Index: FC = () => {
  const { asset } = useParams<{ asset: string }>();

  return (
    <TranslationProvider namespace="index">
      <Meta asset={asset} />
      <Suspense fallback={<Fallback />}>
        <QueryProvider />
      </Suspense>
    </TranslationProvider>
  );
};

const QueryProvider: FC = () => {
  const [q, loadQuery] = useQueryLoader<IndexQuery>(query);
  const { asset } = useParams<{ asset: string }>();
  const { index } = useLazyLoadQuery<IndexRootQuery>(rootQuery, {});

  const requested = asset?.toLowerCase() ?? "";

  const found = index?.find((i) => {
    const sym = i.shareAsset?.metadata.symbol ?? "";
    return sym.toLowerCase() === requested;
  });

  const id = found?.id;

  useEffect(() => {
    if (!id) return;
    loadQuery({ id }, { fetchPolicy: "store-and-network" });
  }, [id]);

  return q ? (
    <>
      <Subscription id={id as string} subscription={subscription} />
      <Content q={q} />
    </>
  ) : null;
};

const Content: FC<{
  q: PreloadedQuery<IndexQuery>;
}> = ({ q }) => {
  const data = usePreloadedQuery(query, q);
  const { accountData } = usePreloadedAccountData();
  const account =
    useFragment<IndexAccountFragment$key>(accountFragment, accountData) ||
    undefined;

  if (!data.node) return <Fallback />;

  return <IndexDetails k={data.node} a={account} />;
};

const IndexDetails: FC<{
  k?: IndexQuery["response"]["node"];
  a?: IndexAccountFragment$data;
}> = ({ k, a }) => {
  const { t } = useTranslation();
  const symbol = k?.shareAsset?.metadata.symbol.toLowerCase() || "";
  const localizedName =
    symbol === "yrune"
      ? t("indexNameYrune")
      : symbol === "ytcy"
        ? t("indexNameYtcy")
        : symbol === "rji"
          ? t("indexNameRji")
          : k?.shareAsset?.metadata.name;
  const localizedDescription =
    symbol === "yrune"
      ? t("indexDescriptionYrune")
      : symbol === "ytcy"
        ? t("indexDescriptionYtcy")
        : symbol === "rji"
          ? t("indexDescriptionRji")
          : k?.shareAsset?.metadata.description;

  return (
    <div className="rujira__main rujira__main--gradient indices">
      <div className="rujira__inner--pad">
        <div className="rujira__inner">
          <Link
            to="/index"
            className="fs-14 color-grey hover-white no-underline flex ai-c mb-2">
            <Icons.ArrowLeft className="w-2 h-a mr-0.5" />
            {t("backToIndexOverview")}
          </Link>
          <div className="flex row ai-c pb-2">
            <h1 className="mr-2 fw-500">
              {k?.shareAsset?.metadata.symbol} - {localizedName}
            </h1>
            <IconDenom
              denom={k?.shareAsset?.metadata.symbol || ""}
              className="index__denomIcon"
            />
            <IndexShareCard
              symbol={k?.shareAsset?.metadata.symbol || ""}
              indexId={k?.id || ""}
              account={a}
              variant="icon-purple"
              className="ml-2"
              iconSize="4"
            />
          </div>
          <h3 className="fw-300 pb-4 unset-wrap">
            {localizedDescription}
          </h3>
          <div className="grid index__detailGrid">
            {k?.id && <Chart id={k.id} />}
            <Suspense fallback={<ActionsFallback />}>
              {k?.config && (
                <BalanceProvider asset={k.config.quoteAsset}>
                  <Actions index={k} account={a} />
                </BalanceProvider>
              )}
            </Suspense>
          </div>
          {k?.status && (
            <Allocation
              k={k.status}
              t={k.type}
              s={k.shareAsset?.metadata.symbol || ""}
            />
          )}
          {k?.shareAsset?.metadata.symbol && <FAQ k={k} />}
        </div>
      </div>
    </div>
  );
};

const Fallback: FC = () => {
  return (
    <IndexContainer>
      <div className="flex ai-c wrap mt-2">
        <div className="skeleton h-6 w-12 w-sm-18 w-md-22 w-lg-45 br-6 mr-2" />

        <div className="lp big mr-3">
          <div className="icon-denom skeleton br-4" />
          <div className="icon-denom skeleton br-4" />
        </div>
        <div className="skeleton h-3.5 w-10 w-lg-26.5 br-4" />
      </div>
    </IndexContainer>
  );
};

const ActionsFallback: FC = () => (
  <div className="index__actionsContainer card card--shadow p-3">
    <div className="skeleton h-4 w-12 w-md-24 br-4 mb-2" />
    <div>
      <div className="skeleton h-6 w-32 w-md-full br-4 mt-2 mb-2" />
      <div className="skeleton h-3 w-6 w-md-12 mx-a br-4 mt-2 mb-2" />
      <div className="skeleton h-6 w-32 w-md-full br-4 mb-2" />
    </div>
  </div>
);
