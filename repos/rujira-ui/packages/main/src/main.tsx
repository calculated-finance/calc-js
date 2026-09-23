import { initEccLib } from "rujira.js";
import * as ecc from "tiny-secp256k1";
// import "./services/sentry";
initEccLib(ecc);

import clsx from "clsx";
import { motion } from "motion/react";
import { Component, FC, PropsWithChildren, StrictMode, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Routes, useLocation } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import {
  Footer,
  GlobalModal,
  I18nProvider,
  Loader,
  TxButtonTip,
  useLocale,
} from "rujira.ui";
import "rujira.ui/scss/index.scss";
import { Borrow } from "./borrow/Borrow";
import { BalanceSubscriptionProvider } from "./common/components/Balance";
import { Header } from "./common/components/Header";
import ScrollToTop from "./common/components/ScrollToTop";
import { Messages, SplitText } from "./common/Loading";
import { NotFound } from "./common/NotFound";
import { PrivacyPolicy } from "./common/PrivacyPolicy";
import { TermsOfUse } from "./common/TermsOfUse";
import { VultisigProvider } from "./common/Vultisig";
import { ContextWrapper } from "./ContextWrapper";
import { AnalyticsSample } from "./developer/AnalyticsSample.tsx";
import { ContractPage } from "./developer/Contract";
import { Deployment } from "./developer/Deployment";
import { Link, route } from "./Gate";
import { Home } from "./home/Home";
import "./index.scss";
import { Index } from "./index/Index";
import { Indexes } from "./index/Indexes";
import { Leaderboard } from "./leagues/Leaderboard";
import { Merge } from "./merge/Merge";
import { Connect } from "./portfolio/components/Connect";
import { Portfolio } from "./portfolio/Portfolio";
import { AccountDataContext } from "./services/accountData";
import { AccountsContext } from "./services/accounts";
import {
  PendingDepositLoadedContext,
  PendingDepositStorageContext,
} from "./services/deposits";
import { FavoritesContext } from "./services/favorites";
import { NotificationContext } from "./services/notifcation";
import { RelayContext } from "./services/relay";
import { Lend } from "./lending/Lend";
import { Algorithmic } from "./algorithmic/Algorithmic";
import { Lending } from "./lending/Lending";
import { Liquidate } from "./liquidate/Liquidate";
import { Stake } from "./staking/Stake";
import { StakeOverview } from "./staking/StakeOverview";
import { Strategies } from "./strategies/Strategies";
import { Strategy } from "./strategies/Strategy";
import { Swap } from "./swap/Swap";
import { TorChart } from "./tor/TorChart";
import { Trade } from "./trade/Trade";
import { TradeMarkets } from "./trade/TradeMarkets";

const TOAST_OPTIONS = {
  style: {
    background: "#22242f",
    color: "#fff",
    fontSize: 14,
    fontWeight: 500,
  },
  success: {
    style: {
      background: "#34aa89",
      color: "#fff",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#34aa89",
    },
  },
  error: {
    style: {
      background: "#B71C1C",
      color: "#fff",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#B71C1C",
    },
  },
};

const Wrapper: FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const { localePrefix } = useLocale();
  const rootPath = localePrefix
    ? location.pathname.substring(localePrefix.length) || "/"
    : location.pathname;
  const normalizedRootPath = rootPath.startsWith("/")
    ? rootPath
    : `/${rootPath}`;

  const routes = import.meta.env.VITE_STATIC;
  const STATIC: string[] = routes ? routes.split(",") : [];

  return (
    <div
      className={clsx({
        rujira: true,
        "rujira--dark":
          normalizedRootPath === "/" ||
          normalizedRootPath === "/leaderboard" ||
          normalizedRootPath.startsWith("/merge") ||
          normalizedRootPath.startsWith("/switch") ||
          normalizedRootPath.startsWith("/ecosystem"),
      })}>
      {children}
      <Footer routerElement={Link} staticRoutes={STATIC} />
      <TxButtonTip />
    </div>
  );
};

const Pages: FC = () => {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        {route({ index: true, element: <Home /> })}
        {route({ path: "connect", element: <Connect /> })}
        {route({ path: "merge/:asset?", element: <Merge /> })}
        {route({ path: "portfolio/*", element: <Portfolio /> })}
        {route({ path: "strategies", element: <Strategies /> })}
        {route({
          path: "strategies/:category/:type/:assets",
          element: <Strategy />,
        })}
        {route({ path: "strategies/:category/:assets", element: <Strategy /> })}
        {route({ path: "lend", element: <Lending /> })}
        {route({
          path: "automated",
          element: <Navigate to="/automated-trading" replace />,
        })}
        {route({ path: "automated-trading", element: <Algorithmic /> })}
        {route({ path: "lend/:asset", element: <Lend /> })}
        {route({ path: "stake", element: <StakeOverview /> })}
        {route({ path: "stake/:asset", element: <Stake /> })}
        {route({ path: "liquidate", element: <Liquidate /> })}
        {route({ path: "index", element: <Indexes /> })}
        {route({ path: "index/:asset", element: <Index /> })}
        {route({
          path: "swap",
          element: <Navigate to="/swap/ETH/BTC" replace />,
        })}
        {route({ path: "swap/:from?/:to?", element: <Swap /> })}
        {route({ path: "trade", element: <TradeMarkets /> })}
        {route({ path: "trade/:base/:quote", element: <Trade /> })}
        {route({
          path: "borrow",
          element: <Navigate to="/borrow/BTC/USDC" replace />,
        })}
        {route({ path: "borrow/:collateral", element: <Borrow /> })}
        {route({ path: "borrow/:collateral/:debt", element: <Borrow /> })}
        {route({ path: "thorchain/:asset/TOR", element: <TorChart /> })}
        {route({ path: "leaderboard", element: <Leaderboard /> })}
        {route({ path: "privacypolicy", element: <PrivacyPolicy /> })}
        {route({ path: "tou", element: <TermsOfUse /> })}
        {route({ path: "developer/deployment", element: <Deployment /> })}
        {route({
          path: "developer/analytics-test",
          element: <AnalyticsSample />,
        })}
        {route({
          path: "developer/contract/:address",
          element: <ContractPage />,
        })}
        {route({ path: "*", element: <NotFound /> })}
      </Routes>
    </Suspense>
  );
};

type State = { error: Error | null | undefined };

class ErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    const { children } = this.props;
    const { error } = this.state;
    if (error) {
      return (
        <>
          <Header />
          <div className="rujira__main rujira__main--gradient">
            <div className="rujira__inner rujira__inner--pad">
              <section className="home__banner">
                <p>{error instanceof Error ? error.message : String(error)}</p>
              </section>
            </div>
          </div>
        </>
      );
    }
    return children;
  }
}

const Fallback: FC = () => {
  const rand = Math.round(Math.random() * Messages.length);
  return (
    <div className="rujira__main flex ai-c jc-c dir-c">
      <Loader className="w-10 h-10" />
      <motion.div
        className="mt-2"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}>
        <SplitText
          initial={{ y: "100%" }}
          animate="visible"
          variants={{
            visible: (i: number) => ({
              y: 0,
              transition: {
                delay: i * 0.025,
              },
            }),
          }}>
          {Messages[rand] + "..."}
        </SplitText>
      </motion.div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ContextWrapper
      contexts={[
        BrowserRouter,
        I18nProvider,
        RelayContext,
        AccountsContext,
        NotificationContext,
        FavoritesContext,
        AccountDataContext,
        PendingDepositStorageContext,
        PendingDepositLoadedContext,
        GlobalModal,
        VultisigProvider,
        BalanceSubscriptionProvider,
      ]}>
      <Wrapper>
        <ErrorBoundary>
          <Header />
          <Pages />
          <ScrollToTop />
        </ErrorBoundary>
      </Wrapper>
      <Tooltip id="global-tip" className="tooltip" />
      <Toaster toastOptions={TOAST_OPTIONS} />
    </ContextWrapper>
  </StrictMode>
);
