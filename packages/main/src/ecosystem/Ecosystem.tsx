import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation, TranslationProvider } from "rujira.ui";
import { motion } from "motion/react";
import Background from "./assets/background.jpg";

/* import { Integrations } from "./components/Integrations"; */
import { Protocols } from "./components/Protocols";
import { Wallets } from "./components/Wallets";
import { Auditors } from "./components/Auditors";
/* import { Exchanges } from "./components/Exchanges";
import { Community } from "./components/Community"; */

const Meta = ({ desc }: { desc: any }) => {
  return (
    <Helmet>
      <title>Rujira Ecosystem</title>
      <meta name="description" content={desc} />
      <meta name="og:description" content={desc} />
      <meta name="twitter:description" content={desc} />
    </Helmet>
  );
};

export function Ecosystem() {
  return (
    <TranslationProvider namespace="ecosystem">
      <EcosystemContent />
    </TranslationProvider>
  );
}

function EcosystemContent() {
  const { t } = useTranslation();
  const { tab } = useParams();
  const protocolsTo = tab ? ".." : ".";
  const walletsTo = tab ? "../wallets" : "wallets";
  const auditorsTo = tab ? "../auditors" : "auditors";

  const Description = t("description");

  /* const Description = () => {
    switch (tab) {
      case "integrations":
        return "The expansion of the Rujira ecosystem necessitates integrations with other projects to increase the range of services and products it can offer. This page catalogues the current integration landscape and the function each partner fulfils.";
      case "community-tools":
        return "A thriving ecosystem requires services that are a public good. These benefit the community using the blockchain. They supply information and services without a revenue stream, often relying on philanthropy and donations for support.";
      case "wallets":
        return "Interact with the Rujira ecosystem with your preferred mobile and desktop app";
      case "exchanges":
        return "Trade RUJI on a centralized exchange";
      default:
        return "The Rujira ecosystem is continuously growing. This is an overview of all the dApps, protocols, products and services calling Rujira their home blockchain. Web3 is growing rapidly, and this will be regularly updated with new additions.";
    }
  }; */

  return (
    <>
      <Meta desc={Description} />
      <motion.div
        className="ecosystem__background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 4 }}
        style={{ backgroundImage: `url(${Background})` }}
      />
      <div className="rujira__main">
        <div className="rujira__inner rujira__inner--pad">
          <h1 className="h1">{t("title")}</h1>
          <p className="fs-20 lh-28 mw-md-100 balance">{Description}</p>
          <div className="tabs mt-3 mx-0 mb-4">
            <Link
              to={protocolsTo}
              className={tab === undefined ? "selected" : ""}>
              {t("protocols")}
            </Link>
            {/* <Link
              to={tab ? "../integrations" : "integrations"}
              className={tab === "integrations" ? "selected" : ""}>
              {t("integrations")}
            </Link> */}
            {/* <Link
              to={tab ? "../community-tools" : "community-tools"}
              className={tab === "community-tools" ? "selected" : ""}>
              {t("communityTools")}
            </Link> */}
            <Link
              to={walletsTo}
              className={tab === "wallets" ? "selected" : ""}>
              {t("wallets")}
            </Link>
            <Link
              to={auditorsTo}
              className={tab === "auditors" ? "selected" : ""}>
              {t("auditors")}
            </Link>
            {/* <Link
              to={tab ? "../exchanges" : "exchanges"}
              className={tab === "exchanges" ? "selected" : ""}>
              {t("centralizedExchanges")}
            </Link> */}
            {/* <Link to={tab ? "../dapps" : "dapps"}>{t("nativeDapps")}</Link> */}

            {/* <Link
              to={tab ? "../validators" : "validators"}
              className={tab === "validators" ? "selected" : ""}>
              {t("validators")}
            </Link> */}
          </div>

          {tab === undefined && <Protocols />}
          {/* {tab === "integrations" && <Integrations />} */}
          {/* {tab === "community-tools" && <Community />} */}
          {tab === "wallets" && <Wallets />}
          {tab === "auditors" && <Auditors />}
          {/* {tab === "exchanges" && <Exchanges />} */}
        </div>
      </div>
    </>
  );
}
