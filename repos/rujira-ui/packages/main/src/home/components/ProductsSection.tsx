import { ElementType, useMemo } from "react";
import { Button, Card, Icons, Pill, useTranslation } from "rujira.ui";
import { Link } from "../../Gate";
import {
  AUTOMATED_TRADING_PATH,
  BRUNE_STAKING_PATH,
  RECURRING_BUYS_PATH,
  ROADMAP_URL,
} from "../constants";
import SentenceGroup from "./SentenceGroup";

type ProductCardBase = {
  buttonLabel: string;
  buttonStyle: "primary" | "secondary";
  icon: ElementType;
  id: string;
  soon?: boolean;
  title: string;
};

type ExternalProductCard = ProductCardBase & {
  kind: "external";
  href: string;
};

type InternalProductCard = ProductCardBase & {
  kind: "internal";
  to: string;
};

type ProductCard = ExternalProductCard | InternalProductCard;

type CardActionProps = Pick<ProductCardBase, "buttonLabel" | "buttonStyle"> &
  (
    | Pick<ExternalProductCard, "href" | "kind">
    | Pick<InternalProductCard, "kind" | "to">
  );

const CardAction = (props: CardActionProps) => {
  const { buttonLabel, buttonStyle } = props;
  const className =
    buttonStyle === "primary"
      ? "button--small home__products-button home__products-button--primary"
      : "button--small button--outline button--icon-right home__products-button home__products-button--secondary";

  const icon =
    buttonStyle === "secondary" ? <Icons.External aria-hidden="true" /> : null;

  if (props.kind === "external") {
    return (
      <Button
        as="a"
        className={className}
        href={props.href}
        label={buttonLabel}
        rel="noopener noreferrer"
        target="_blank">
        {icon}
      </Button>
    );
  }

  return (
    <Button as={Link} className={className} label={buttonLabel} to={props.to}>
      {icon}
    </Button>
  );
};

export default function ProductsSection() {
  const { t } = useTranslation();
  const productCards = useMemo<ProductCard[]>(
    () => [
      {
        buttonLabel: t("productOrderbookButton"),
        buttonStyle: "primary",
        icon: Icons.PieChart,
        id: "orderbook",
        kind: "internal",
        title: t("productOrderbookTitle"),
        to: "/trade",
      },
      {
        buttonLabel: t("productEarnButton"),
        buttonStyle: "primary",
        icon: Icons.Seedling,
        id: "earn",
        kind: "internal",
        title: t("productEarnTitle"),
        to: "/lend",
      },
      {
        buttonLabel: t("productAutomatedButton"),
        buttonStyle: "primary",
        icon: Icons.Binary,
        id: "automated",
        kind: "internal",
        title: t("productAutomatedTitle"),
        to: AUTOMATED_TRADING_PATH,
      },
      {
        buttonLabel: t("productIndicesButton"),
        buttonStyle: "primary",
        icon: Icons.Coins,
        id: "indices",
        kind: "internal",
        title: t("productIndicesTitle"),
        to: "/index",
      },
      {
        buttonLabel: t("productSwapButton"),
        buttonStyle: "primary",
        icon: Icons.Swap,
        id: "swaps",
        kind: "internal",
        title: t("productSwapTitle"),
        to: "/swap",
      },
      {
        buttonLabel: t("productRecurringButton"),
        buttonStyle: "primary",
        icon: Icons.History,
        id: "recurring",
        kind: "internal",
        title: t("productRecurringTitle"),
        to: RECURRING_BUYS_PATH,
      },
      {
        buttonLabel: t("productMoneyMarketButton"),
        buttonStyle: "primary",
        icon: Icons.MoneyTransfer,
        id: "money-market",
        kind: "internal",
        title: t("productMoneyMarketTitle"),
        to: "/borrow/BTC/USDC",
      },
      {
        buttonLabel: t("productBruneButton"),
        buttonStyle: "primary",
        icon: Icons.Stake,
        id: "brune",
        kind: "internal",
        title: t("productBruneTitle"),
        to: BRUNE_STAKING_PATH,
      },
      {
        buttonLabel: t("productLiquidationsButton"),
        buttonStyle: "primary",
        icon: Icons.Bolt,
        id: "liquidations",
        kind: "internal",
        title: t("productLiquidationsTitle"),
        to: "/liquidate",
      },
      {
        buttonLabel: t("productLearnMore"),
        buttonStyle: "secondary",
        href: "https://docs.rujira.network/core-products/ruji-perps",
        icon: Icons.ArrowRightLeft,
        id: "perps",
        kind: "external",
        soon: true,
        title: t("productPerpsTitle"),
      },
      {
        buttonLabel: t("productLearnMore"),
        buttonStyle: "secondary",
        icon: Icons.Rocket,
        id: "launchpad",
        kind: "internal",
        soon: true,
        title: t("productLaunchpadTitle"),
        to: "/launchpad",
      },
      {
        buttonLabel: t("productLearnMore"),
        buttonStyle: "secondary",
        icon: Icons.Sliders,
        id: "options",
        kind: "internal",
        soon: true,
        title: t("productOptionsTitle"),
        to: "/options",
      },
    ],
    [t]
  );

  return (
    <section
      className="home__products px-4"
      aria-labelledby="products-section-title">
      <div className="rujira__inner rujira__inner--small">
        <div className="home__products-intro">
          <Pill
            icon={<Icons.StarAlt aria-hidden="true" />}
            className="home__products-pill"
            label={t("productsPill")}
          />
          <h2
            id="products-section-title"
            className="home__products-title fs-32 fw-600">
            {t("productsTitle")}
          </h2>
          <SentenceGroup
            className="home__products-copy intro balanced"
            sentenceClassName="home__products-copy-sentence"
            sentences={[t("productsCopy1"), t("productsCopy2")]}
          />
        </div>
      </div>
      <div className="rujira__inner">
        <div className="home__products-grid-wrap">
          <div className="home__products-grid">
            {productCards.map((card) => {
              const Icon = card.icon;
              let actionProps: CardActionProps;

              if (card.kind === "external") {
                actionProps = {
                  buttonLabel: card.buttonLabel,
                  buttonStyle: card.buttonStyle,
                  kind: card.kind,
                  href: card.href,
                };
              } else {
                actionProps = {
                  buttonLabel: card.buttonLabel,
                  buttonStyle: card.buttonStyle,
                  kind: card.kind,
                  to: card.to,
                };
              }

              return (
                <Card
                  key={card.id}
                  className="home__products-card card--border card--hide-overflow card--h-full">
                  <div className="home__products-card__top">
                    <div className="home__products-icon">
                      <Icon
                        className="home__products-icon__svg"
                        aria-hidden="true"
                      />
                    </div>
                    {card.soon && (
                      <span className="tag tag--sm tag--purple">
                        {t("soonTrademark")}
                      </span>
                    )}
                  </div>
                  <div className="home__products-card__body">
                    <h3>{card.title}</h3>
                  </div>
                  <CardAction {...actionProps} />
                </Card>
              );
            })}
          </div>
        </div>
        <div className="home__products-cta">
          <p>{t("productsRoadmapCopy")}</p>
          <Button
            as="a"
            className="button--icon-right"
            href={ROADMAP_URL}
            label={t("productsRoadmapButton")}>
            <Icons.AngleRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}
