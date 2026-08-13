import clsx from "clsx";
import { ChangeEvent, ElementType, FC } from "react";
import { useTranslation } from "react-i18next";
import { ResolveLink } from "../header/ResolveLink";
import {
  Discord,
  Instagram,
  LinkedIn,
  Reddit,
  Telegram,
  TikTok,
  X,
  YouTube,
} from "../icons/Icons";
import { RujiraLogo } from "../logos/RujiraLogo";
import { Select } from "../inputs/Select";
import {
  setLanguage,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "../../i18n/config";

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: "English",
  de: "Deutsch",
};

type FooterProps = {
  className?: string;
  domain?: string;
  routerElement: any;
  staticRoutes?: string[];
};

type InternalFooterLink = {
  kind: "internal";
  label: string;
  to: string;
};

type ExternalFooterLink = {
  href: string;
  kind: "external";
  label: string;
};

type StaticFooterLink = {
  to: string;
  kind: "static";
  label: string;
};

type FooterLink = InternalFooterLink | ExternalFooterLink | StaticFooterLink;

type FooterSection = {
  links: FooterLink[];
  title: string;
};

type SocialLink = {
  href: string;
  Icon: ElementType;
  label: string;
};

const DOCS_URL = "https://docs.rujira.network";
const DISCORD_URL = "https://discord.com/invite/XPvsxhWKfb";
const TELEGRAM_URL = "https://t.me/Rujira_Community";
const REDDIT_URL = "https://www.reddit.com/r/RujiraNetworkOfficial/";

const footerSections: FooterSection[] = [
  {
    title: "Products",
    links: [
      { kind: "internal", label: "Cross-chain Swaps", to: "swap" },
      { kind: "internal", label: "Orderbook DEX", to: "trade" },
      { kind: "internal", label: "Earn Opportunities", to: "strategies" },
      { kind: "internal", label: "Money Market", to: "/borrow/BTC/USDC" },
      {
        kind: "internal",
        label: "Automated Trading",
        to: "/trade/BTC/USDC?type=automated",
      },
      {
        kind: "internal",
        label: "RUJI Staking",
        to: "stake",
      },
      { kind: "internal", label: "Indices", to: "index" },
      { kind: "internal", label: "Recurring Buys", to: "trade" },
      { kind: "static", label: "Analytics", to: "/analytics" },
    ],
  },
  {
    title: "Learn",
    links: [
      { kind: "static", label: "Discover Rujira", to: "/discover-rujira" },
      { kind: "static", label: "Architecture", to: "/architecture" },
      { kind: "static", label: "RUJI Token", to: "/ruji-token" },
      { kind: "static", label: "Enshrined Oracles", to: "/enshrined-oracles" },
      { kind: "static", label: "Secured Assets", to: "/secured-assets" },
      { kind: "static", label: "Cypherpunk", to: "/cypherpunk" },
      { kind: "static", label: "Omnichain", to: "/omnichain" },
      { kind: "static", label: "Security", to: "/security" },
      { kind: "static", label: "Articles", to: "/articles" },
      { kind: "static", label: "Roadmap", to: "/roadmap" },
      { kind: "external", label: "Product Docs", href: DOCS_URL },
    ],
  },
  {
    title: "Ecosystem",
    links: [
      { kind: "static", label: "Ecosystem", to: "/ecosystem" },
      {
        kind: "external",
        label: "Deving Zone",
        href: "http://deving.zone/r/rujira",
      },
      { kind: "external", label: "Rune Tools", href: "https://rune.tools" },
      {
        kind: "external",
        label: "Blockchain Explorer",
        href: "https://thorchain.net",
      },
      {
        kind: "external",
        label: "Brand Assets",
        href: `${DOCS_URL}/resources/branding`,
      },
    ],
  },
  {
    title: "Developers",
    links: [
      {
        kind: "external",
        label: "Developer Tools",
        href: `${DOCS_URL}/developers/getting-started`,
      },
      {
        kind: "external",
        label: "Developer docs",
        href: `${DOCS_URL}/developers`,
      },
      {
        kind: "external",
        label: "GitLab",
        href: "https://gitlab.com/thorchain/rujira",
      },
      {
        kind: "external",
        label: "Rujira.ui",
        href: "https://gitlab.com/thorchain/rujira-ui",
      },
    ],
  },
  {
    title: "Support",
    links: [
      { kind: "static", label: "Get Started", to: "/get-started" },
      { kind: "static", label: "Knowledge Hub", to: "/support" },
      { kind: "static", label: "FAQ", to: "/faq" },
      { kind: "static", label: "Deposit", to: "/how-to-deposit" },
      {
        kind: "external",
        label: "Developer Help",
        href: DISCORD_URL,
      },
      { kind: "internal", label: "Terms of Use", to: "/tou" },
      { kind: "internal", label: "Privacy Policy", to: "/privacypolicy" },
    ],
  },
];

const communityLinks: SocialLink[] = [
  { label: "Twitter", href: "https://x.com/RujiraNetwork", Icon: X },
  { label: "Telegram", href: TELEGRAM_URL, Icon: Telegram },
  { label: "Discord", href: DISCORD_URL, Icon: Discord },
];

const socialLinks: SocialLink[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/rujiranetwork/",
    Icon: Instagram,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/rujira-network/",
    Icon: LinkedIn,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@rujiranetwork",
    Icon: TikTok,
  },
  { label: "Reddit", href: REDDIT_URL, Icon: Reddit },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@RujiraNetwork",
    Icon: YouTube,
  },
];

const FooterLinkItem: FC<
  FooterLink & { domain: string; routerElement: any }
> = (props) => {
  const { domain, routerElement } = props;

  switch (props.kind) {
    case "internal":
      return (
        <ResolveLink
          as={routerElement}
          className="rujira__footer-link"
          domain={domain}
          to={props.to}>
          {props.label}
        </ResolveLink>
      );
    case "static":
      return (
        <ResolveLink
          as={routerElement}
          className="rujira__footer-link"
          domain={domain}
          to={props.to}
          isStatic={true}>
          {props.label}
        </ResolveLink>
      );
    case "external":
      return (
        <a
          href={props.href}
          className="rujira__footer-link"
          rel="noopener noreferrer"
          target="_blank">
          {props.label}
        </a>
      );
  }
};

export const Footer: FC<FooterProps> = ({
  className,
  domain = "",
  routerElement,
  staticRoutes = [],
}) => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value as SupportedLanguage);
  };

  return (
    <div
      className={clsx({
        rujira__footer: true,
        [`${className}`]: className,
      })}>
      <div className="rujira__inner">
        <div className="rujira__footer-grid">
          {footerSections.map(({ title, links }) => (
            <section key={title} className="rujira__footer-section">
              <h4 className="rujira__footer-title">{title}</h4>
              <nav aria-label={title}>
                <ul className="rujira__footer-list">
                  {links.map((link) => {
                    const isStatic = staticRoutes?.includes(
                      "to" in link ? link.to : link.href
                    );
                    const linkWithKind: FooterLink = isStatic
                      ? {
                          ...link,
                          kind: "static" as const,
                          to: "to" in link ? link.to : link.href,
                        }
                      : link;
                    return (
                      <li key={link.label}>
                        <FooterLinkItem
                          {...linkWithKind}
                          domain={domain}
                          routerElement={routerElement}
                        />
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </section>
          ))}
          <section className="rujira__footer-section rujira__footer-section--social">
            <div className="rujira__footer-social-group">
              <h4 className="rujira__footer-title">Community</h4>
              <nav
                aria-label="Rujira community links"
                className="rujira__footer-socials">
                {communityLinks.map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}>
                    <Icon
                      className="rujira__footer-social-icon"
                      aria-hidden="true"
                    />
                  </a>
                ))}
              </nav>
            </div>
            <div className="rujira__footer-social-group">
              <h4 className="rujira__footer-title">Socials</h4>
              <nav
                aria-label="Rujira social links"
                className="rujira__footer-socials">
                {socialLinks.map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}>
                    <Icon
                      className={clsx("rujira__footer-social-icon", {
                        "rujira__footer-social-icon--tiktok":
                          label === "TikTok",
                      })}
                      aria-hidden="true"
                    />
                  </a>
                ))}
              </nav>
            </div>
            <div>
              <h4 className="rujira__footer-title">Language</h4>
              <Select
                className="select--sm"
                value={i18n.language}
                onChange={handleLanguageChange}
                aria-label="Language">
                {SUPPORTED_LANGUAGES.map((code) => (
                  <option key={code} value={code}>
                    {LANGUAGE_LABELS[code]}
                  </option>
                ))}
              </Select>
            </div>
          </section>
        </div>
        <div className="rujira__footer-bottom">
          <RujiraLogo
            animate={true}
            textColor="#fff"
            className="rujira__footer-logo"
          />
          <p className="rujira__footer-copy">
            All Rujira brand is in public domain. No rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};
