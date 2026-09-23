import { useTranslation, Icons } from "rujira.ui";
import Halborn from "../assets/halborn.png";
import Zellic from "../assets/zellic.png";
import FYEO from "../assets/fyeo.png";

interface AuditorData {
  img: string;
  alt: string;
  descKey: string;
  links: { href: string; icon: React.ReactNode }[];
}

export const Auditors = () => {
  const { t } = useTranslation("ecosystem");

  const auditors: AuditorData[] = [
    {
      img: Halborn,
      alt: "Halborn Logo",
      descKey: "halbornDesc",
      links: [
        { href: "https://www.halborn.com", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/HalbornSecurity", icon: <Icons.X /> },
        { href: "https://github.com/HalbornSecurity", icon: <Icons.GitHub /> },
      ],
    },
    {
      img: Zellic,
      alt: "Zellic Logo",
      descKey: "zellicDesc",
      links: [
        { href: "https://www.zellic.io", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/zellic_io", icon: <Icons.X /> },
        { href: "https://github.com/zellic/", icon: <Icons.GitHub /> },
        { href: "https://t.me/zellic_io", icon: <Icons.Telegram /> },
      ],
    },
    {
      img: FYEO,
      alt: "FYEO Logo",
      descKey: "fyeoDesc",
      links: [
        { href: "https://www.fyeo.io", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/gofyeo", icon: <Icons.X /> },
        { href: "https://github.com/fyeo-io/public-audit-reports/blob/main/PublicAuditMatrix.md", icon: <Icons.GitHub /> },
      ],
    },
  ];

  return (
    <div className="row wrap pad">
      {auditors.map((auditor, i) => (
        <div className="col-12 col-sm-6 col-lg-4 mt-4" key={`auditor_${i}`}>
          <div className="ecosystem">
            <img src={auditor.img} alt={auditor.alt} />
            <p>{t(auditor.descKey)}</p>
            <div>
              {auditor.links.map((link, j) => (
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
