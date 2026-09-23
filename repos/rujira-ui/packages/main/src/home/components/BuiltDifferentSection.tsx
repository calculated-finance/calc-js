import { useMemo } from "react";
import { Icons, Pill, useTranslation } from "rujira.ui";
import builtToScaleGraphic from "../assets/builttoscale.svg";
import deepLiquidityGraphic from "../assets/deepliquidity.png";
import fullyDecentralizedGraphic from "../assets/fullydecentralized.svg";
import onePlatformGraphic from "../assets/oneplatform.svg";
import realNativeAssetsGraphic from "../assets/realnativeassets.svg";
import thorchainLogo from "../assets/thorchain.svg";
import SentenceGroup from "./SentenceGroup";

const STAR_ICON = <Icons.StarAlt aria-hidden="true" />;

type BuiltDifferentCard = {
  bodyLines: string[];
  footerGraphic?: {
    alt: string;
    src: string;
  };
  graphic: string;
  id: string;
  mobileBodyLines: string[];
  modifier: "decentralized" | "liquidity" | "assets" | "platform" | "scale";
  phoneBodyLines?: string[];
  title: string;
};

function FeatureCard({ card }: { card: BuiltDifferentCard }) {
  return (
    <div
      className={`home__fairness-card home__fairness-card--${card.modifier}${
        card.phoneBodyLines ? " home__fairness-card--has-phone-copy" : ""
      }`}>
      <img
        className="home__fairness-card__surface"
        src={card.graphic}
        alt=""
        loading="lazy"
        decoding="async"
      />
      <div className="home__fairness-card__content">
        <h3>{card.title}</h3>
        <p className="home__fairness-card__copy home__fairness-card__copy--desktop">
          {card.bodyLines.map((line, index) => (
            <span
              className="home__fairness-card__line"
              key={`desktop-${card.id}-${index}`}>
              {line}
            </span>
          ))}
        </p>
        <p className="home__fairness-card__copy home__fairness-card__copy--mobile">
          {card.mobileBodyLines.map((line, index) => (
            <span
              className="home__fairness-card__line"
              key={`mobile-${card.id}-${index}`}>
              {line}
            </span>
          ))}
        </p>
        {card.phoneBodyLines ? (
          <p className="home__fairness-card__copy home__fairness-card__copy--phone">
            {card.phoneBodyLines.map((line, index) => (
              <span
                className="home__fairness-card__line"
                key={`phone-${card.id}-${index}`}>
                {line}
              </span>
            ))}
          </p>
        ) : null}
      </div>
      {card.footerGraphic ? (
        <img
          className="home__fairness-card__footer-logo"
          src={card.footerGraphic.src}
          alt={card.footerGraphic.alt}
          loading="lazy"
          decoding="async"
        />
      ) : null}
    </div>
  );
}

export default function BuiltDifferentSection() {
  const { t } = useTranslation();
  const cards = useMemo<BuiltDifferentCard[]>(() => [
    {
      bodyLines: [
        t("builtCardDecentralizedBodyLine1"),
        t("builtCardDecentralizedBodyLine2"),
      ],
      mobileBodyLines: [
        t("builtCardDecentralizedMobileLine1"),
        t("builtCardDecentralizedMobileLine2"),
        t("builtCardDecentralizedMobileLine3"),
      ],
      graphic: fullyDecentralizedGraphic,
      id: "decentralized",
      modifier: "decentralized",
      title: t("builtCardDecentralizedTitle"),
    },
    {
      bodyLines: [
        t("builtCardLiquidityBodyLine1"),
        t("builtCardLiquidityBodyLine2"),
      ],
      mobileBodyLines: [
        t("builtCardLiquidityMobileLine1"),
        t("builtCardLiquidityMobileLine2"),
      ],
      phoneBodyLines: [
        t("builtCardLiquidityPhoneLine1"),
        t("builtCardLiquidityPhoneLine2"),
      ],
      footerGraphic: {
        alt: t("builtCardLiquidityFooterAlt"),
        src: thorchainLogo,
      },
      graphic: deepLiquidityGraphic,
      id: "liquidity",
      modifier: "liquidity",
      title: t("builtCardLiquidityTitle"),
    },
    {
      bodyLines: [t("builtCardAssetsBodyLine1"), t("builtCardAssetsBodyLine2")],
      mobileBodyLines: [
        t("builtCardAssetsMobileLine1"),
        t("builtCardAssetsMobileLine2"),
      ],
      graphic: realNativeAssetsGraphic,
      id: "assets",
      modifier: "assets",
      title: t("builtCardAssetsTitle"),
    },
    {
      bodyLines: [
        t("builtCardPlatformBodyLine1"),
        t("builtCardPlatformBodyLine2"),
        t("builtCardPlatformBodyLine3"),
      ],
      mobileBodyLines: [
        t("builtCardPlatformMobileLine1"),
        t("builtCardPlatformMobileLine2"),
        t("builtCardPlatformMobileLine3"),
      ],
      graphic: onePlatformGraphic,
      id: "platform",
      modifier: "platform",
      title: t("builtCardPlatformTitle"),
    },
    {
      bodyLines: [
        t("builtCardScaleBodyLine1"),
        t("builtCardScaleBodyLine2"),
        t("builtCardScaleBodyLine3"),
        t("builtCardScaleBodyLine4"),
      ],
      mobileBodyLines: [
        t("builtCardScaleMobileLine1"),
        t("builtCardScaleMobileLine2"),
        t("builtCardScaleMobileLine3"),
        t("builtCardScaleMobileLine4"),
      ],
      graphic: builtToScaleGraphic,
      id: "scale",
      modifier: "scale",
      title: t("builtCardScaleTitle"),
    },
  ], [t]);
  const cardRows = [
    {
      cards: cards.slice(0, 3),
      modifier: "top",
    },
    {
      cards: cards.slice(3),
      modifier: "bottom",
    },
  ];

  return (
    <section
      className="home__fairness px-4"
      aria-labelledby="built-different-title">
      <div className="rujira__inner rujira__inner--small">
        <div className="home__fairness-intro">
          <Pill icon={STAR_ICON} label={t("builtDifferentPill")} />
          <h2
            id="built-different-title"
            className="home__fairness-title fs-32 fw-600">
            {t("builtDifferentTitle")}
          </h2>
          <SentenceGroup
            className="home__fairness-copy intro balanced"
            sentenceClassName="home__fairness-copy-sentence"
            sentences={[
              t("builtDifferentCopy1"),
              t("builtDifferentCopy2"),
            ]}
          />
        </div>
      </div>
      <div className="rujira__inner">
        <div className="home__fairness-grid">
          {cardRows.map((row) => (
            <div
              className={`home__fairness-row home__fairness-row--${row.modifier}`}
              key={row.modifier}>
              {row.cards.map((card) => (
                <FeatureCard card={card} key={card.id} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
