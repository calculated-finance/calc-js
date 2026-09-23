import { useTranslation, Icons } from "rujira.ui";
import KujiraTrack from "../assets/kujira-track-logo@2x.png";
import SmartStake from "../assets/smartstake-logo@2px.png";
import SeaShanty from "../assets/seashanty-logo@2x.png";
import CosmoBot from "../assets/cosmobot-logo@2x.png";
import KujiKast from "../assets/kujikast-logo@2x.png";

interface CommunityData {
  img: string;
  alt: string;
  descKey: string;
  links: { href: string; icon: React.ReactNode }[];
}

export const Community = () => {
  const { t } = useTranslation("ecosystem");

  const communityTools: CommunityData[] = [
    {
      img: KujiraTrack,
      alt: "KUJIRA Track Logo",
      descKey: "kujiraTrackDesc",
      links: [
        { href: "https://kujira-track.app/", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/OcebotKuji", icon: <Icons.X /> },
      ],
    },
    {
      img: SmartStake,
      alt: "Smart Stake Logo",
      descKey: "smartStakeDesc",
      links: [
        { href: "https://kujira.smartstake.io/", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/SmartStake", icon: <Icons.X /> },
        { href: "https://t.me/SmartStake", icon: <Icons.Telegram /> },
      ],
    },
    {
      img: SeaShanty,
      alt: "SeaShanty Logo",
      descKey: "seaShantyDesc",
      links: [
        { href: "https://twitter.com/Capybara_Labs", icon: <Icons.X /> },
        { href: "https://t.me/KujiraNotification_bot", icon: <Icons.Telegram /> },
      ],
    },
    {
      img: CosmoBot,
      alt: "Cosmobot Logo",
      descKey: "cosmoBotDesc",
      links: [
        { href: "https://t.me/ibc_cosmobot", icon: <Icons.Telegram /> },
      ],
    },
    {
      img: KujiKast,
      alt: "Kuji Kast Logo",
      descKey: "kujiKastDesc",
      links: [
        { href: "https://kujikast.com/", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/KujiKast", icon: <Icons.Telegram /> },
      ],
    },
  ];

  return (
    <div className="row wrap pad">
      {communityTools.map((tool, i) => (
        <div className="col-12 col-sm-6 col-lg-4 mt-4" key={`community_${i}`}>
          <div className="ecosystem">
            <img src={tool.img} alt={tool.alt} />
            <p>{t(tool.descKey)}</p>
            <div>
              {tool.links.map((link, j) => (
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
