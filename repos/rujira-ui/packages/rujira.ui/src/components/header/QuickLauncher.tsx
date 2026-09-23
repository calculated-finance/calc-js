import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useTranslation } from "../../i18n";
import { Grid } from "../icons/Icons";
import { ResolveLink } from "./ResolveLink";

export const QuickLauncher = ({
  domain,
  routingElement,
}: {
  domain: string;
  routingElement: any;
}) => {
  const { t } = useTranslation("header");
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      className="rujira-header__quick"
      onMouseOver={() => setShowMenu(true)}
      onMouseOut={() => setShowMenu(false)}>
      <Grid />
      <AnimatePresence>
        {showMenu && (
          <motion.div
            className="rujira-header__popup sub-nav fw-400 px-2 py-1.5"
            initial={{ opacity: 0, marginTop: -4 }}
            animate={{ opacity: 1, marginTop: 0 }}
            exit={{ opacity: 0, marginTop: -4 }}>
            <ResolveLink domain={domain} as={routingElement} to="buy">
              <span className="fs-12 fw-500">{t("buyCrypto")}</span>
            </ResolveLink>
            <ResolveLink domain={domain} as={routingElement} to="swap">
              <span className="fs-12 fw-500">{t("tokenSwap")}</span>
            </ResolveLink>
            <ResolveLink domain={domain} as={routingElement} to="trade">
              <span className="fs-12 fw-500">{t("spotTrading")}</span>
            </ResolveLink>
            <ResolveLink domain={domain} as={routingElement} to="options">
              <span className="fs-12 fw-500">{t("options")}</span>
            </ResolveLink>
            <ResolveLink domain={domain} as={routingElement} to="/perps">
              <span className="fs-12 fw-500">{t("perps")}</span>
            </ResolveLink>
            <ResolveLink domain={domain} as={routingElement} to="stake">
              <span className="fs-12 fw-500">{t("stake")}</span>
            </ResolveLink>
            <ResolveLink domain={domain} as={routingElement} to="lp">
              <span className="fs-12 fw-500">{t("liquidityPools")}</span>
            </ResolveLink>
            <ResolveLink domain={domain} as={routingElement} to="money-market">
              <span className="fs-12 fw-500">{t("lendAndBorrow")}</span>
            </ResolveLink>
            <ResolveLink domain={domain} as={routingElement} to="liquidate">
              <span className="fs-12 fw-500">{t("liquidate")}</span>
            </ResolveLink>
            <ResolveLink domain={domain} as={routingElement} to="ventures">
              <span className="fs-12 fw-500">{t("ventures")}</span>
            </ResolveLink>
            <ResolveLink domain={domain} as={routingElement} to="nfts">
              <span className="fs-12 fw-500">{t("collections")}</span>
            </ResolveLink>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
