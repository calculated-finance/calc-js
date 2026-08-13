import { FC } from "react";
import { TranslationProvider, useLocale, useTranslation } from "rujira.ui";
import { getStaticProductSeo, ProductSeoHelmet } from "../seo";
import { Markets } from "./components/Markets";

const TradeMarketsContent: FC = () => {
  const { t } = useTranslation();
  return (
    <div className="rujira__main rujira__main--gradient pools">
      <div className="rujira__inner--pad">
        <div className="rujira__inner">
          <h1 className="h1">{t("pageTitle")}</h1>

          <h2 className="fs-24 lh-32 fw-400 color-white mb-4">
            {t("pageDescription")}
          </h2>
          <Markets />
        </div>
      </div>
    </div>
  );
};

export const TradeMarkets: FC = () => {
  const { locale } = useLocale();

  return (
    <TranslationProvider namespace="trade">
      <ProductSeoHelmet seo={getStaticProductSeo("/trade", locale)} />
      <TradeMarketsContent />
    </TranslationProvider>
  );
};
