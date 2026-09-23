import { motion } from "motion/react";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Icons, useTranslation, useLocale } from "rujira.ui";
import { defaultRoute } from "../Gate";
import { NoIndexHelmet } from "../seo";

const Meta = () => {
  return (
    <NoIndexHelmet>
      <title>Rujira</title>
      <meta
        name="description"
        content="Rujira is born from the powerful merger of Kujira and THORChain, uniting fragmented DeFi tools into a seamless experience. Empower your financial journey with native cross-chain capabilities and unrivaled liquidity. No bridges. No barriers. Just DeFi."
      />
      <meta
        name="og:description"
        content="Rujira is born from the powerful merger of Kujira and THORChain, uniting fragmented DeFi tools into a seamless experience. Empower your financial journey with native cross-chain capabilities and unrivaled liquidity. No bridges. No barriers. Just DeFi."
      />
      <meta
        name="twitter:description"
        content="Rujira is born from the powerful merger of Kujira and THORChain, uniting fragmented DeFi tools into a seamless experience. Empower your financial journey with native cross-chain capabilities and unrivaled liquidity. No bridges. No barriers. Just DeFi."
      />
    </NoIndexHelmet>
  );
};

export const NotFound = () => {
  const { t } = useTranslation("common");
  const location = useLocation();
  const navigate = useNavigate();
  const { toRoot } = useLocale();

  useEffect(() => {
    const target = defaultRoute(location.pathname);
    if (target) {
      navigate(toRoot(target), { replace: true });
    }
  }, [location.pathname, navigate, toRoot]);

  return (
    <>
      <Meta />
      <div className="rujira__main rujira__main--gradient">
        <div className="rujira__inner">
          <section className="home__banner">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="fs-32 lh-40 fs-md-40 lh-md-48 fw-400 mb-1 color-white">
              {t("notFoundCode")}
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.35 }}
              className="fs-48 lh-48 fs-md-70 lh-md-70 fw-600 uppercase color-white">
              {t("notFoundTitle")}
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="fs-20 lh-24 fw-400 mt-4">
              {t("notFoundMessage")}
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.25 }}
              className="mt-6">
              <Button
                className="button--outline button--grey button--icon-right ml-1"
                label={t("learnMore")}>
                <Icons.AngleDown />
              </Button>
              <Button
                as={Link}
                to="../trade"
                className="button--outline button--icon-right ml-1"
                label={t("tradeNow")}>
                <Icons.AngleRight />
              </Button>
            </motion.div>
          </section>
        </div>
      </div>
    </>
  );
};
