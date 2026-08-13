import { FC } from "react";
import { useLazyLoadQuery } from "react-relay";
import { useParams } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { graphql } from "relay-runtime";
import { TranslationProvider, useLocale, useTranslation } from "rujira.ui";
import swapAni from "rujira.ui/assets/images/swap-circle.gif";
import {
  SwapThorchainQuery,
  SwapThorchainQuery$data,
} from "./__generated__/SwapThorchainQuery.graphql";
import { getSwapPairSeo, ProductSeoHelmet } from "../seo";
import { Context, useSwapContext } from "./components/Context";
import { InputDestination } from "./components/InputDestination";
import { InputSource } from "./components/InputSource";
import { Quote } from "./components/Quote";

const rootQuery = graphql`
  query SwapThorchainQuery {
    thorchainV2 {
      ...InputDestinationFragment
    }
  }
`;

const Meta = () => {
  const { from, to } = useParams<{ from: string; to: string }>();
  const { locale } = useLocale();

  return <ProductSeoHelmet seo={getSwapPairSeo(from, to, locale)} />;
};

export const Swap: FC = () => {
  const tc = useLazyLoadQuery<SwapThorchainQuery>(rootQuery, {});

  return (
    <TranslationProvider namespace="swap">
      <Context>
        <Meta />
        <Content data={tc} />
        <Tooltip id="swap-tip" className="tooltip" float={true} />
      </Context>
    </TranslationProvider>
  );
};

const Content: FC<{ data: SwapThorchainQuery$data }> = ({ data }) => {
  const { t } = useTranslation();
  const { destination, from, source, to } = useSwapContext();
  const fromAsset = source?.asset.metadata.symbol || from || "";
  const toAsset = destination?.asset.metadata.symbol || to || "";
  return (
    <div className="rujira__main rujira__main--gradient swap">
      <div className="rujira__inner--pad">
        <div className="rujira__inner">
          <div className="text-center">
            <h1 className="h1 mb-1">{t("title", { fromAsset, toAsset })}</h1>
            <h2 className="fs-24 lh-32 fw-400 color-white">
              {t("description")}
            </h2>
          </div>

          <div className="mt-6">
            <InputSource />
            <button className="transparent block mx-a my-2">
              <img
                src={swapAni}
                alt="Swap Animation"
                className="w-7 h-7 filter-grey opacity-5 block"
              />
            </button>
            <InputDestination r={data.thorchainV2 || undefined} />
            <Quote />
          </div>
        </div>
      </div>
    </div>
  );
};
