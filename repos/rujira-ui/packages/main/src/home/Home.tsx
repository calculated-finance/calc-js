import { Component, type PropsWithChildren, useEffect, useRef, useState } from "react";
import Rive, { Alignment, Fit, Layout } from "@rive-app/react-canvas";
import {
  Button,
  Icons,
  Pill,
  TranslationProvider,
  useLocale,
  useTranslation,
} from "rujira.ui";
import { Link } from "../Gate";
import backgroundGrid from "./assets/background grid.svg";
import BuiltDifferentSection from "./components/BuiltDifferentSection";
import ColorBends from "./components/ColorBends";
import ProductsSection from "./components/ProductsSection";
import PurposeStory from "./components/PurposeStory";
import RujiTokenSection from "./components/RujiTokenSection";
import {
  GET_STARTED_URL,
  HOME_BEND_COLORS,
  OMNICHAIN_URL,
} from "./constants";
import { getStaticProductSeo, ProductSeoHelmet } from "../seo";

const OMNICHAIN_LAYOUT = new Layout({
  fit: Fit.Cover,
  alignment: Alignment.Center,
});

const STAR_ICON = <Icons.StarAlt aria-hidden="true" />;

class RiveErrorBoundary extends Component<PropsWithChildren> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const OmnichainStage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="home__omnichain-stage">
      <img
        src={backgroundGrid}
        className="home__omnichain-grid"
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />
      {visible && (
        <RiveErrorBoundary>
          <Rive
            src="/home/omnichain.riv"
            className="home__omnichain"
            layout={OMNICHAIN_LAYOUT}
            aria-hidden="true"
          />
        </RiveErrorBoundary>
      )}
    </div>
  );
};

const Meta = () => {
  const { locale } = useLocale();

  return <ProductSeoHelmet seo={getStaticProductSeo("/", locale)} />;
};

export const Home = () => {
  return (
    <TranslationProvider namespace="home">
      <HomeContent />
    </TranslationProvider>
  );
};

const HomeContent = () => {
  const { t } = useTranslation();

  return (
    <>
      <Meta />
      <div className="home">
        <ColorBends
          colors={HOME_BEND_COLORS}
          autoRotate={1}
          aria-hidden="true"
        />
        <div className="home__banner gap-4">
          <Pill icon={STAR_ICON} label={t("heroPill")} />
          <h1 className="home__banner-title uppercase fs-32 fs-md-70 fw-600">
            {t("heroTitleLine1")}
            <br />
            {t("heroTitleLine2")}
          </h1>
          <p className="intro balanced text-center">
            {t("heroIntroLine1")}
            <br /> {t("heroIntroLine2")}
          </p>
          <div className="flex ai-c jc-c gap-2">
            <Button
              as="a"
              className="button--grey button--outline button--icon-right"
              href={GET_STARTED_URL}
              label={t("heroLearnMore")}>
              <Icons.AngleRight aria-hidden="true" />
            </Button>
            <Button
              label={t("heroStartTrading")}
              as={Link}
              to="/trade/BTC/USDC"
              className="button--icon-right">
              <Icons.AngleRight aria-hidden="true" />
            </Button>
          </div>
        </div>
        <PurposeStory />
        <section
          className="home__omnichain-section"
          aria-labelledby="omnichain-title">
          <div className="px-4">
            <div className="rujira__inner rujira__inner--small flex dir-c ai-c gap-2.5 text-center">
              <Pill icon={STAR_ICON} label={t("omnichainPill")} />
              <h2 id="omnichain-title" className="fs-32 fw-600">
                {t("omnichainTitle")}
              </h2>
              <p className="home__omnichain-copy intro balanced">
                {t("omnichainCopy")}
              </p>
            </div>
          </div>
          <div className="rujira__inner">
            <OmnichainStage />
          </div>
          <div className="home__omnichain-cta px-4">
            <div className="rujira__inner rujira__inner--small">
              <div className="home__omnichain-cta__inner">
                <p>{t("omnichainCtaCopy")}</p>
                <Button
                  as="a"
                  className="button--small button--icon-right home__omnichain-cta__button"
                  href={OMNICHAIN_URL}
                  label={t("omnichainCta")}>
                  <Icons.AngleRight aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </section>
        <BuiltDifferentSection />
        <ProductsSection />
        <RujiTokenSection />
      </div>
    </>
  );
};
