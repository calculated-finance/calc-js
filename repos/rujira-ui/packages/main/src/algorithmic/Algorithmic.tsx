import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useTranslation,
  TranslationProvider,
  useLocale,
  Button,
  Icons,
} from "rujira.ui";
import { getStaticProductSeo, ProductSeoHelmet } from "../seo";
import { assetToTradeUrlSegment } from "../services/assetUrl";
import { Leaderboard } from "./AlgorithmicLeaderboard";
import {
  AlgorithmicPairPicker,
  SelectedPairAssets,
} from "./components/AlgorithmicPairPicker";

export function Algorithmic() {
  const { locale } = useLocale();

  return (
    <TranslationProvider namespace="algorithmic">
      <ProductSeoHelmet
        seo={getStaticProductSeo("/automated-trading", locale)}
      />
      <AlgorithmicContent />
    </TranslationProvider>
  );
}

function AlgorithmicContent() {
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("algorithmic");
  const { toRoot } = useLocale();
  const navigate = useNavigate();
  const Description = t("description");

  const [selectedPair, setSelectedPair] = useState<SelectedPairAssets>();
  const createStrategyTo = selectedPair
    ? toRoot(
        `/trade/${assetToTradeUrlSegment(selectedPair.baseAsset)}/${assetToTradeUrlSegment(selectedPair.quoteAsset)}?type=automated`
      )
    : undefined;

  return (
    <>
      <div className="rujira__main rujira__main--gradient lending">
        <div className="rujira__inner--pad">
          <div className="rujira__inner">
            <h1 className="h1">{t("title")}</h1>
            <p className="fs-20 lh-28 mw-md-100 balance">{Description}</p>

            <div className="flex wrap ai-c gap-1 mt-4">
              <AlgorithmicPairPicker
                className="w-30"
                onSelect={setSelectedPair}
              />

              <div className="flex gap-x-1">
                <Button
                  className="button--icon-right"
                  disabled={!createStrategyTo}
                  onClick={() => createStrategyTo && navigate(createStrategyTo)}
                  label={t("createStrategy")}>
                  <Icons.AngleRight />
                </Button>

                <Button
                  data-tooltip-content={tCommon("comingSoon")}
                  data-tooltip-id="global-tip"
                  disabled
                  className="button--outline button--icon-right"
                  label={tCommon("learnMore")}>
                  <Icons.External />
                </Button>
              </div>
            </div>

            <div className="flex dir-c gap-2 mt-5">
              <div className="h4 mb-0">{t("leaderboard")}</div>
              <Leaderboard />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
