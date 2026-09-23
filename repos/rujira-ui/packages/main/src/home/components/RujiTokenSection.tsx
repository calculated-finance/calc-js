import { useMemo } from "react";
import { Button, Icons, Pill, RujiraLogo, useTranslation } from "rujira.ui";
import { Link } from "../../Gate";
import ecosystemOverviewGraphic from "../assets/Ecosystemoverview.svg";
import enshrinedOraclesGraphic from "../assets/enshrinedoracles.svg";
import journeyGlow from "../assets/Journeyglow.svg";
import securedAssetsGraphic from "../assets/securedassets.svg";
import {
  AUTOMATED_TRADING_PATH,
  BRUNE_STAKING_PATH,
  ENSHRINED_ORACLES_URL,
  RUJI_TOKEN_URL,
  SECURED_ASSETS_URL,
} from "../constants";

type EcosystemProductFieldBase = {
  height: number;
  id: string;
  soon?: boolean;
  soonX?: number;
  width: number;
  x: number;
  y: number;
};

type LinkedEcosystemProductField = EcosystemProductFieldBase & {
  ariaLabelKey: string;
  external?: boolean;
  href: string;
};

type DisabledEcosystemProductField = EcosystemProductFieldBase & {
  href?: never;
};

type EcosystemProductField =
  | LinkedEcosystemProductField
  | DisabledEcosystemProductField;

const STAR_ICON = <Icons.StarAlt aria-hidden="true" />;

const ecosystemProductFields: EcosystemProductField[] = [
  {
    ariaLabelKey: "ecosystemThorchainPoolsAria",
    external: true,
    height: 71,
    href: "https://thorchain.net/pools/main",
    id: "thorchain-pools",
    width: 269,
    x: 0.5,
    y: 184.5,
  },
  {
    height: 71,
    id: "ruji-collections",
    soon: true,
    soonX: 506,
    width: 269,
    x: 290.5,
    y: 0.5,
  },
  {
    ariaLabelKey: "ecosystemLaunchpadAria",
    external: true,
    height: 71,
    href: "https://docs.rujira.network/core-products/ruji-launchpad",
    id: "ruji-launchpad",
    soon: true,
    soonX: 506,
    width: 269,
    x: 290.5,
    y: 92.5,
  },
  {
    ariaLabelKey: "ecosystemSwapAria",
    height: 71,
    href: "/swap/ETH/BTC",
    id: "ruji-swap",
    width: 269,
    x: 290.5,
    y: 184.5,
  },
  {
    ariaLabelKey: "ecosystemPerpsAria",
    external: true,
    height: 71,
    href: "https://docs.rujira.network/core-products/ruji-perps",
    id: "ruji-perps",
    soon: true,
    soonX: 1086,
    width: 269,
    x: 870.5,
    y: 0.5,
  },
  {
    height: 71,
    id: "ruji-predict",
    soon: true,
    soonX: 1086,
    width: 269,
    x: 870.5,
    y: 92.5,
  },
  {
    height: 71,
    id: "ruji-options",
    soon: true,
    soonX: 1086,
    width: 269,
    x: 870.5,
    y: 184.5,
  },
  {
    ariaLabelKey: "ecosystemAmmAria",
    height: 71,
    href: AUTOMATED_TRADING_PATH,
    id: "ruji-amm",
    width: 269,
    x: 0.5,
    y: 287.5,
  },
  {
    ariaLabelKey: "ecosystemBruneAria",
    height: 67,
    href: BRUNE_STAKING_PATH,
    id: "brune",
    width: 269,
    x: 0.5,
    y: 388.5,
  },
  {
    ariaLabelKey: "ecosystemTradeAria",
    height: 71,
    href: "/trade/BTC/USDC",
    id: "ruji-trade",
    width: 269,
    x: 290.5,
    y: 287.5,
  },
  {
    ariaLabelKey: "ecosystemIndexAria",
    height: 71,
    href: "/index",
    id: "ruji-index",
    width: 269,
    x: 290.5,
    y: 388.5,
  },
  {
    ariaLabelKey: "ecosystemMoneyMarketAria",
    height: 71,
    href: "/borrow/BTC/USDC",
    id: "ruji-money-market",
    width: 269,
    x: 580.5,
    y: 287.5,
  },
  {
    ariaLabelKey: "ecosystemLiquidationsAria",
    height: 71,
    href: "/liquidate",
    id: "ruji-liquidations",
    width: 553,
    x: 580.5,
    y: 389.5,
  },
  {
    height: 71,
    id: "stablecoin",
    soon: true,
    soonX: 1086,
    width: 269,
    x: 870.5,
    y: 287.5,
  },
];

export default function RujiTokenSection() {
  const { t } = useTranslation();
  const ecosystemAriaLabels = useMemo<Record<string, string>>(() => ({
    "thorchain-pools": t("ecosystemThorchainPoolsAria"),
    "ruji-launchpad": t("ecosystemLaunchpadAria"),
    "ruji-swap": t("ecosystemSwapAria"),
    "ruji-perps": t("ecosystemPerpsAria"),
    "ruji-amm": t("ecosystemAmmAria"),
    brune: t("ecosystemBruneAria"),
    "ruji-trade": t("ecosystemTradeAria"),
    "ruji-index": t("ecosystemIndexAria"),
    "ruji-money-market": t("ecosystemMoneyMarketAria"),
    "ruji-liquidations": t("ecosystemLiquidationsAria"),
  }), [t]);

  return (
    <section
      className="home__ruji-token px-4"
      aria-labelledby="ruji-token-title">
      <div className="rujira__inner">
        <section
          className="home__ruji-token-showcase home__ruji-token-showcase--secured"
          aria-labelledby="secured-assets-title">
          <div className="home__ruji-token-copy home__ruji-token-showcase-copy">
            <Pill
              className="home__ruji-token-pill"
              icon={STAR_ICON}
              label={t("securedAssetsPill")}
            />
            <h2
              id="secured-assets-title"
              className="home__ruji-token-title fw-600">
              {t("securedAssetsTitle")}
            </h2>
            <p className="home__ruji-token-body">
              {t("securedAssetsBody1")}
              <br />
              <br />
              {t("securedAssetsBody2")}
            </p>
            <Button
              as="a"
              className="button--small button--icon-right home__ruji-token-button home__ruji-token-button--feature"
              href={SECURED_ASSETS_URL}
              label={t("securedAssetsButton")}>
              <Icons.AngleRight aria-hidden="true" />
            </Button>
          </div>
          <div className="home__ruji-token-graphic home__ruji-token-showcase-graphic">
            <img
              src={securedAssetsGraphic}
              alt={t("securedAssetsAlt")}
              loading="lazy"
              decoding="async"
            />
          </div>
        </section>
        <section
          className="home__ruji-token-showcase home__ruji-token-showcase--oracles"
          aria-labelledby="enshrined-oracles-title">
          <div className="home__ruji-token-graphic home__ruji-token-showcase-graphic">
            <img
              src={enshrinedOraclesGraphic}
              alt={t("enshrinedOraclesAlt")}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="home__ruji-token-copy home__ruji-token-showcase-copy">
            <Pill
              className="home__ruji-token-pill"
              icon={STAR_ICON}
              label={t("enshrinedOraclesPill")}
            />
            <h2
              id="enshrined-oracles-title"
              className="home__ruji-token-title fw-600">
              {t("enshrinedOraclesTitle")}
            </h2>
            <p className="home__ruji-token-body">
              {t("enshrinedOraclesBody1")}
              <br />
              <br />
              {t("enshrinedOraclesBody2")}
            </p>
            <Button
              as="a"
              className="button--small button--icon-right home__ruji-token-button home__ruji-token-button--feature"
              href={ENSHRINED_ORACLES_URL}
              label={t("enshrinedOraclesButton")}>
              <Icons.AngleRight aria-hidden="true" />
            </Button>
          </div>
        </section>
        <div className="home__ruji-token-feature">
          <div className="home__ruji-token-copy home__ruji-token-copy--center">
            <Pill
              className="home__ruji-token-pill"
              icon={STAR_ICON}
              label={t("rujiTokenPill")}
            />
            <h2 id="ruji-token-title" className="home__ruji-token-title fw-600">
              <span className="home__ruji-token-title-line home__ruji-token-title-line--top">
                {t("rujiTokenTitleLine1")}
              </span>
              <span className="home__ruji-token-title-line home__ruji-token-title-line--middle">
                {t("rujiTokenTitleLine2")}
              </span>
              <span className="home__ruji-token-title-line home__ruji-token-title-line--bottom">
                {t("rujiTokenTitleLine3")}
              </span>
            </h2>
            <p className="home__ruji-token-subtitle">
              {t("rujiTokenSubtitle")}
            </p>
            <p className="home__ruji-token-body">
              {t("rujiTokenBody")}
            </p>
            <Button
              as="a"
              className="button--small button--icon-right home__ruji-token-button home__ruji-token-button--feature"
              href={RUJI_TOKEN_URL}
              label={t("rujiTokenButton")}>
              <Icons.AngleRight aria-hidden="true" />
            </Button>
          </div>
          <div
            className="home__ruji-token-ecosystem"
            aria-label={t("ecosystemOverviewAria")}>
            <svg
              className="home__ruji-token-ecosystem-map"
              viewBox="0 0 1153 470"
              role="img"
              aria-labelledby="ruji-ecosystem-title ruji-ecosystem-description"
              xmlns="http://www.w3.org/2000/svg">
              <title id="ruji-ecosystem-title">
                {t("ecosystemOverviewTitle")}
              </title>
              <desc id="ruji-ecosystem-description">
                {t("ecosystemOverviewDescription")}
              </desc>
              <image
                href={ecosystemOverviewGraphic}
                width="1153"
                height="470"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
              />
              {ecosystemProductFields.map((field) => {
                const hitArea = (
                  <rect
                    className="home__ruji-token-ecosystem-hit"
                    x={field.x}
                    y={field.y}
                    width={field.width}
                    height={field.height}
                    rx="19.5"
                    aria-hidden="true"
                  />
                );

                return field.href ? (
                  <a
                    key={field.id}
                    className="home__ruji-token-ecosystem-link"
                    href={field.href}
                    aria-label={ecosystemAriaLabels[field.id]}
                    rel={field.external ? "noopener noreferrer" : undefined}
                    target={field.external ? "_blank" : undefined}>
                    {hitArea}
                  </a>
                ) : (
                  <rect
                    key={field.id}
                    className="home__ruji-token-ecosystem-hit home__ruji-token-ecosystem-hit--disabled"
                    x={field.x}
                    y={field.y}
                    width={field.width}
                    height={field.height}
                    rx="19.5"
                    aria-hidden="true"
                  />
                );
              })}
              {ecosystemProductFields
                .filter((field) => field.soon)
                .map((field) => (
                  <g
                    key={`${field.id}-soon`}
                    className="home__ruji-token-ecosystem-soon"
                    aria-hidden="true">
                    <rect
                      x={field.soonX ?? field.x + field.width - 53}
                      y={field.y + 9}
                      width="43"
                      height="17"
                      rx="8.5"
                    />
                    <text
                      x={(field.soonX ?? field.x + field.width - 53) + 21.5}
                      y={field.y + 21}>
                      {t("soonShort")}
                    </text>
                  </g>
                ))}
              <foreignObject
                className="home__ruji-token-ecosystem-logo"
                x="660"
                y="82"
                width="106"
                height="106"
                aria-hidden="true">
                <div>
                  <RujiraLogo
                    animate={true}
                    showText={false}
                    className="home__ruji-token-ecosystem-logo-mark"
                  />
                </div>
              </foreignObject>
            </svg>
          </div>
        </div>
        <section
          className="home__ruji-token-cta"
          aria-labelledby="ruji-token-cta-title">
          <h2
            id="ruji-token-cta-title"
            className="home__ruji-token-cta-title fw-600">
            {t("journeyTitle")}
          </h2>
          <p className="home__ruji-token-cta-copy">
            {t("journeyCopy")}
          </p>
          <Button
            as={Link}
            className="home__ruji-token-button home__ruji-token-button--cta"
            to={AUTOMATED_TRADING_PATH}
            label={t("journeyButton")}
          />
          <img
            className="home__ruji-token-journey-glow"
            src={journeyGlow}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
        </section>
      </div>
    </section>
  );
}
