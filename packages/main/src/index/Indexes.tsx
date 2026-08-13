import { FC, memo, Suspense } from "react";
import { useLazyLoadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import {
  Fiat,
  IconDenom,
  TranslationProvider,
  useLocale,
  useTranslation,
} from "rujira.ui";

import { useNavigate } from "react-router-dom";
import { Subscription } from "../services/useNodeSubscription";
import { getStaticProductSeo, ProductSeoHelmet } from "../seo";
import {
  IndexesQuery,
  IndexesQuery$data,
} from "./__generated__/IndexesQuery.graphql";
import { DailyChange } from "./components/Common";
import { Balances } from "./components/IndexBalances";

const Meta = () => {
  const { locale } = useLocale();

  return <ProductSeoHelmet seo={getStaticProductSeo("/index", locale)} />;
};

const query = graphql`
  query IndexesQuery {
    index {
      id
      status {
        nav
        navPerShareChange
      }
      shareAsset {
        metadata {
          decimals
          symbol
          description
          name
        }
      }
    }
  }
`;

export const Indexes: FC = () => {
  return (
    <TranslationProvider namespace="index">
      <Meta />
      <IndexesContent />
    </TranslationProvider>
  );
};

const IndexesContent: FC = () => {
  const { t } = useTranslation();
  return (
    <div className="rujira__main rujira__main--gradient index">
      <div className="rujira__inner--pad">
        <div className="rujira__inner">
          <div className="index__container">
            <div className="index__main">
              <h1 className="h1">{t("indexTitle")}</h1>
              <h2 className="fs-24 lh-32 fw-400 color-white index__main__subheading">
                {t("indexSubheading")}
              </h2>
              <IndexesGrid />
            </div>
            <Balances />
          </div>
        </div>
      </div>
    </div>
  );
};

const IndexesGrid: FC = () => {
  const data = useLazyLoadQuery<IndexesQuery>(query, {});
  const items = data?.index ?? [];
  return (
    <Suspense fallback={<Fallback />}>
      <div className="index__grid mt-3">
        {items.map((x) =>
          x ? <MemoizedIndexCard key={x.id} data={x} /> : null
        )}
      </div>
    </Suspense>
  );
};

const indexesSubscription = graphql`
  subscription IndexesSubscription($id: ID!) {
    node(id: $id) {
      ... on IndexVault {
        status {
          nav
          navPerShareChange
        }
      }
    }
  }
`;

const IndexCard: FC<{ data: IndexesQuery$data["index"][number] }> = ({
  data,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  if (!data) return null;
  const url = data.shareAsset.metadata.symbol;
  const symbol = data.shareAsset.metadata.symbol.toLowerCase();
  const localizedName =
    symbol === "yrune"
      ? t("indexNameYrune")
      : symbol === "ytcy"
        ? t("indexNameYtcy")
        : symbol === "rji"
          ? t("indexNameRji")
          : data.shareAsset.metadata.name;
  const localizedDescription =
    symbol === "yrune"
      ? t("indexDescriptionYrune")
      : symbol === "ytcy"
        ? t("indexDescriptionYtcy")
        : symbol === "rji"
          ? t("indexDescriptionRji")
          : data.shareAsset.metadata.description;

  return (
    <>
      <Subscription id={data.id} subscription={indexesSubscription} />
      <div
        className="card p-3 card--shadow"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(url)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") navigate(url);
        }}
        role="button"
        aria-label={`View index ${data.shareAsset.metadata.symbol}`}>
        <div className="row ai-c ji-c mb-2">
          <IconDenom
            denom={data.shareAsset.metadata.symbol}
            className="index__denomIcon"
          />
          <h4 className="ml-2">
            {data.shareAsset.metadata.symbol} - {localizedName}
          </h4>
        </div>
        <div className="flex dir-c index__card-text">
          <p>{localizedDescription}</p>
          <div className="row ai-s ji-c pt-2">
            <div className="col-12 flex dir-c">
              <label className="h4 fs-16 lh-19 color-grey mb-1 fw-400">
                {t("marketCap")}
              </label>
              <Fiat
                amount={BigInt(data.status.nav || "0")}
                symbol="$"
                decimals={data.shareAsset.metadata.decimals}
                className="index__decimal"
              />
            </div>
            <div className="col-12 flex dir-c">
              <label className="h4 fs-16 lh-19 color-grey mb-1 fw-400">
                {t("priceChange24h")}
              </label>
              <DailyChange
                className="index__decimal"
                percentageChange={BigInt(data.status.navPerShareChange || "0")}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const MemoizedIndexCard = memo(IndexCard);

const Fallback: FC = () => (
  <div
    className="card p-3 card--shadow"
    style={{
      minHeight: 120,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}>
    <div className="row ai-c ji-c mb-2">
      <div
        className="icon-denom skeleton br-4"
        style={{ width: 36, height: 36 }}
      />
      <div className="skeleton br-2 ml-2" style={{ width: 120, height: 20 }} />
    </div>
    <div className="flex dir-c index__card-text">
      <div
        className="skeleton br-2 mb-2"
        style={{ width: "80%", height: 16 }}
      />
      <div className="row ai-s ji-c pt-2">
        <div className="col-12 flex dir-c mr-4">
          <div
            className="skeleton br-2 mb-1"
            style={{ width: 60, height: 14 }}
          />
          <div className="skeleton br-2" style={{ width: 80, height: 18 }} />
        </div>
        <div className="col-12 flex dir-c">
          <div
            className="skeleton br-2 mb-1"
            style={{ width: 90, height: 14 }}
          />
          <div className="skeleton br-2" style={{ width: 60, height: 18 }} />
        </div>
      </div>
    </div>
  </div>
);
