import { useTranslation, Icons } from "rujira.ui";
import kraken from "../assets/kraken.svg";
import MEXC from "../assets/mexc.svg";

interface ExchangeData {
  img: string;
  alt: string;
  descKey: string;
  imgStyle?: React.CSSProperties;
  links: { href: string; icon: React.ReactNode }[];
}

export const Exchanges = () => {
  const { t } = useTranslation("ecosystem");

  const exchanges: ExchangeData[] = [
    {
      img: kraken,
      alt: "Kraken Logo",
      descKey: "krakenDesc",
      imgStyle: { height: "1.5rem", marginTop: "0.5rem" },
      links: [
        { href: "https://pro.kraken.com/app/trade/kuji-usd", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/krakenfx", icon: <Icons.X /> },
        { href: "https://t.me/kraken_exchange_official", icon: <Icons.Telegram /> },
      ],
    },
    {
      img: MEXC,
      alt: "Mexc Logo",
      descKey: "mexcDesc",
      imgStyle: { height: "1.5rem", marginTop: "0.5rem" },
      links: [
        { href: "https://www.mexc.com/exchange/KUJI_USDT", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/MEXC_Official", icon: <Icons.X /> },
        { href: "https://t.me/MEXCEnglish", icon: <Icons.Telegram /> },
      ],
    },
  ];

  return (
    <div className="row wrap pad">
      {exchanges.map((exchange, i) => (
        <div className="col-12 col-sm-6 col-lg-4 mt-4" key={`exchange_${i}`}>
          <div className="ecosystem">
            <img src={exchange.img} alt={exchange.alt} style={exchange.imgStyle} />
            <p>{t(exchange.descKey)}</p>
            <div>
              {exchange.links.map((link, j) => (
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
