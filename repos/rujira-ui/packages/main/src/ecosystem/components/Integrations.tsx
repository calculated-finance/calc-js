import { useTranslation, Icons } from "rujira.ui";
import Axelar from "../assets/axelar.svg";
import Squid from "../assets/squid.svg";
import Kado from "../assets/kado.svg";
import Gravity from "../assets/gravity-logo.svg";
import Stride from "../assets/stride.svg";
import Funtastic from "../assets/funtastic-logo@2x.png";
import Rango from "../assets/rango-logo@2x.png";
import Rocket from "../assets/rocketx-new-logo.png";
import Coinhall from "../assets/coinhall-logo@2x.png";
import Coinweb from "../assets/coinweb-logo.svg";
import Nansen from "../assets/nansen-logo@2x.png";
import Maya from "../assets/maya.png";

interface IntegrationData {
  img: string;
  alt: string;
  descKey: string;
  imgStyle?: React.CSSProperties;
  links: { href: string; icon: React.ReactNode }[];
}

export const Integrations = () => {
  const { t } = useTranslation("ecosystem");

  const integrations: IntegrationData[] = [
    {
      img: Axelar,
      alt: "Axelar Logo",
      descKey: "axelarDesc",
      imgStyle: { height: "1.5rem", marginTop: "0.5rem" },
      links: [
        { href: "https://axelar.network/", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/axelarcore", icon: <Icons.X /> },
        { href: "https://t.me/axelarcommunity", icon: <Icons.Telegram /> },
        { href: "https://discord.com/invite/aRZ3Ra6f7D", icon: <Icons.Discord /> },
        { href: "https://github.com/axelarnetwork", icon: <Icons.GitHub /> },
      ],
    },
    {
      img: Squid,
      alt: "Squid Logo",
      descKey: "squidDesc",
      links: [
        { href: "https://www.squidrouter.com/", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/squidrouter", icon: <Icons.X /> },
        { href: "http://discord.squidrouter.com/", icon: <Icons.Discord /> },
        { href: "https://github.com/0xsquid", icon: <Icons.GitHub /> },
      ],
    },
    {
      img: Kado,
      alt: "Kado Logo",
      descKey: "kadoDesc",
      links: [
        { href: "https://www.kado.money/blockchains/kujira", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/kado_money", icon: <Icons.X /> },
        { href: "https://t.me/joinchat/DBTEybbbFugwZjgx", icon: <Icons.Telegram /> },
      ],
    },
    {
      img: "https://www.stargaze.zone/logo.svg",
      alt: "Stargaze Logo",
      descKey: "stargazeDesc",
      links: [
        { href: "https://www.stargaze.zone/", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/stargazezone", icon: <Icons.X /> },
        { href: "https://t.me/joinchat/ZQ95YmIn3AI0ODFh", icon: <Icons.Telegram /> },
        { href: "https://discord.gg/stargaze", icon: <Icons.Discord /> },
        { href: "https://github.com/public-awesome", icon: <Icons.GitHub /> },
      ],
    },
    {
      img: Rango,
      alt: "Rango Logo",
      descKey: "rangoDesc",
      links: [
        { href: "https://app.rango.exchange/swap/BSC.BNB/KUJIRA.KUJI", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/RangoExchange", icon: <Icons.X /> },
        { href: "https://t.me/rango_info", icon: <Icons.Telegram /> },
      ],
    },
    {
      img: Rocket,
      alt: "RocketX Logo",
      descKey: "rocketxDesc",
      links: [
        { href: "https://app.rocketx.exchange/swap/ARBITRUM.ethereum/KUJIRA.kujira/100?from=Ethereum&to=Kuji", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/RocketXexchange", icon: <Icons.X /> },
        { href: "https://t.me/RocketXexchange", icon: <Icons.Telegram /> },
      ],
    },
    {
      img: "https://www.erisprotocol.com/assets/logo_eris_48.svg",
      alt: "Eris Logo",
      descKey: "erisDesc",
      links: [
        { href: "https://www.erisprotocol.com/kujira/amplifier", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/eris_protocol", icon: <Icons.X /> },
        { href: "https://t.me/eris_protocol", icon: <Icons.Telegram /> },
        { href: "https://github.com/erisprotocol", icon: <Icons.GitHub /> },
      ],
    },
    {
      img: Stride,
      alt: "Stride Logo",
      descKey: "strideDesc",
      links: [
        { href: "https://stride.zone/", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/stride_zone", icon: <Icons.X /> },
        { href: "https://discord.com/invite/e4bzG6zNdf", icon: <Icons.Discord /> },
        { href: "https://github.com/Stride-Labs/stride", icon: <Icons.GitHub /> },
      ],
    },
    {
      img: Maya,
      alt: "Maya Logo",
      descKey: "mayaDesc",
      links: [
        { href: "https://www.mayaprotocol.com/", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/Maya_Protocol", icon: <Icons.X /> },
        { href: "https://gitlab.com/mayachain", icon: <Icons.GitHub /> },
      ],
    },
    {
      img: "https://defillama.com/defillama-press-kit/defi/PNG/defillama.png",
      alt: "DefiLlama Logo",
      descKey: "defiLlamaDesc",
      links: [
        { href: "https://defillama.com/chain/Kujira", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/DefiLlama", icon: <Icons.X /> },
        { href: "https://discord.defillama.com/", icon: <Icons.GitHub /> },
      ],
    },
    {
      img: Gravity,
      alt: "Gravity Bridge Logo",
      descKey: "gravityDesc",
      links: [
        { href: "https://www.gravitybridge.net/", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/gravity_bridge", icon: <Icons.X /> },
        { href: "https://discord.gg/d3DshmHpXA", icon: <Icons.Discord /> },
        { href: "https://github.com/Gravity-Bridge", icon: <Icons.GitHub /> },
      ],
    },
    {
      img: "https://www.nomic.io/img/logo.svg",
      alt: "Nomic Logo",
      descKey: "nomicDesc",
      links: [
        { href: "https://www.nomic.io/", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/nomicbtc", icon: <Icons.X /> },
        { href: "https://t.me/nomicbtc", icon: <Icons.Telegram /> },
        { href: "https://discord.gg/EnB92TK6P7", icon: <Icons.Discord /> },
        { href: "https://github.com/nomic-io", icon: <Icons.GitHub /> },
      ],
    },
    {
      img: Coinhall,
      alt: "Coinhall Logo",
      descKey: "coinhallDesc",
      imgStyle: { height: "1.5rem", marginTop: "0.5rem" },
      links: [
        { href: "https://coinhall.org/?chains=Kujira&tab=Top&sort=Market+Cap&dir=desc&quote=usd", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/coinhall_org", icon: <Icons.X /> },
        { href: "https://t.me/coinhall_org", icon: <Icons.Telegram /> },
        { href: "https://discord.gg/EnB92TK6P7", icon: <Icons.Discord /> },
        { href: "https://github.com/nomic-io", icon: <Icons.GitHub /> },
      ],
    },
    {
      img: Funtastic,
      alt: "Funtastic Logo",
      descKey: "funtasticDesc",
      links: [
        { href: "https://www.funttastic.com/partners/kujira", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/FunttasticLabs", icon: <Icons.X /> },
        { href: "http://www.funttastic.com/telegram", icon: <Icons.Telegram /> },
        { href: "http://www.funttastic.com/discord", icon: <Icons.Discord /> },
      ],
    },
    {
      img: Nansen,
      alt: "Nansen Portfolio Logo",
      descKey: "nansenDesc",
      links: [
        { href: "https://portfolio.nansen.ai/", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/nansenportfolio", icon: <Icons.X /> },
        { href: "https://t.me/nansenportfolio", icon: <Icons.Telegram /> },
        { href: "https://nansen.ai/discord", icon: <Icons.Discord /> },
      ],
    },
    {
      img: Coinweb,
      alt: "Coinweb Logo",
      descKey: "coinwebDesc",
      links: [
        { href: "https://coinweb.io/", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/coinwebofficial", icon: <Icons.X /> },
        { href: "https://t.me/coinweb", icon: <Icons.Telegram /> },
      ],
    },
    {
      img: "https://app.pulsar.finance/pulsar-logo-default.svg",
      alt: "Pulsar Logo",
      descKey: "pulsarDesc",
      links: [
        { href: "https://app.pulsar.finance/", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/PulsarFinance", icon: <Icons.X /> },
        { href: "https://t.me/pulsarfinance", icon: <Icons.Telegram /> },
      ],
    },
  ];

  return (
    <div className="row wrap pad">
      {integrations.map((integration, i) => (
        <div className="col-12 col-sm-6 col-lg-4 mt-4" key={`integration_${i}`}>
          <div className="ecosystem">
            <img src={integration.img} alt={integration.alt} style={integration.imgStyle} />
            <p>{t(integration.descKey)}</p>
            <div>
              {integration.links.map((link, j) => (
                <a key={j} href={link.href} target="_blank">
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
