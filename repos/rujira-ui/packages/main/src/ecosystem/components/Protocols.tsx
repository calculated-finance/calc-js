import { useTranslation, Icons } from "rujira.ui";
import AutoRujira from "../assets/autorujira.png";
import Liquidy from "../assets/liquidy.png";
import Calc from "../assets/calc.png";
import Coral from "../assets/coral.png";
import Daodao from "../assets/daodao.png";

const shuffleArray = <T,>(arr: T[]): T[] =>
  arr
    .map((a) => [Math.random(), a] as [number, T])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1]);

interface ProtocolData {
  img: string;
  alt: string;
  descKey: string;
  className?: string;
  links: { href: string; icon: React.ReactNode }[];
}

export const Protocols = () => {
  const { t } = useTranslation("ecosystem");

  const protocols: ProtocolData[] = [
    {
      img: Liquidy,
      alt: "Liquidy Logo",
      descKey: "liquidyDesc",
      links: [
        { href: "https://liquidy.finance", icon: <Icons.LinkAngle /> },
        { href: "https://x.com/LiquidyFinance", icon: <Icons.X /> },
        { href: "https://t.me/LiquidyFinance", icon: <Icons.Telegram /> },
        {
          href: "https://discord.com/channels/1095005002201833495",
          icon: <Icons.Discord />,
        },
      ],
    },
    {
      img: AutoRujira,
      alt: "AutoRujira Logo",
      descKey: "autoRujiraDesc",
      className: "bigger",
      links: [
        { href: "https://autorujira.app/", icon: <Icons.LinkAngle /> },
        { href: "https://x.com/autorujira", icon: <Icons.X /> },
        { href: "https://t.me/autorujira", icon: <Icons.Telegram /> },
        { href: "https://discord.gg/P77vPrnWyr", icon: <Icons.Discord /> },
        { href: "https://autorujira.medium.com/", icon: <Icons.Medium /> },
      ],
    },
    {
      img: Calc,
      alt: "Calc Logo",
      descKey: "calcDesc",
      links: [
        { href: "https://calculated.fi", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/CALC_finance", icon: <Icons.X /> },
        { href: "https://t.me/calcprotocol", icon: <Icons.Telegram /> },
      ],
    },
    {
      img: Coral,
      alt: "Coral Logo",
      descKey: "coralDesc",
      links: [
        { href: "https://x.com/CoralP2P", icon: <Icons.X /> },
        { href: "https://t.co/OKNStQ1nq4", icon: <Icons.Telegram /> },
      ],
    },
    {
      img: Daodao,
      alt: "Dao Dao Logo",
      descKey: "daodaoDesc",
      links: [
        { href: "https://daodao.zone", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/DA0_DA0", icon: <Icons.X /> },
        { href: "https://discord.daodao.zone", icon: <Icons.Discord /> },
        { href: "https://github.com/DA0-DA0", icon: <Icons.GitHub /> },
      ],
    },
  ];

  return (
    <div className="row wrap pad">
      {shuffleArray(protocols).map((protocol, i) => (
        <div className="col-12 col-sm-6 col-lg-4 mt-4" key={`eco_${i}`}>
          <div className="ecosystem">
            <img
              src={protocol.img}
              alt={protocol.alt}
              className={protocol.className}
            />
            <p>{t(protocol.descKey)}</p>
            <div>
              {protocol.links.map((link, j) => (
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
