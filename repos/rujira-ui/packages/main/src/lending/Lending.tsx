import { useTranslation, TranslationProvider, useLocale } from "rujira.ui";
import { Debts } from "../liquidate/Debts";
import { getStaticProductSeo, ProductSeoHelmet } from "../seo";

export function Lending() {
  const { locale } = useLocale();

  return (
    <TranslationProvider namespace="lending">
      <ProductSeoHelmet seo={getStaticProductSeo("/lend", locale)} />
      <LendingContent />
    </TranslationProvider>
  );
}

function LendingContent() {
  const { t } = useTranslation();
  const Description = t("description");

  return (
    <>
      <div className="rujira__main rujira__main--gradient lending">
        <div className="rujira__inner--pad">
          <div className="rujira__inner">
            <h1 className="h1">{t("title")}</h1>
            <p className="fs-20 lh-28 mw-md-100 balance">{Description}</p>
            <div className="flex dir-c gap-2">
              <div className="relative card p-3 mt-4">
                <Debts />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
