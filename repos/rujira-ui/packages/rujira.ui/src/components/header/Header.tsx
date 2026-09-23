import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import {
  FC,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { Account } from "rujira.js";
import { Drawer } from "vaul";
import deposit from "../../assets/images/deposit.gif";
import depositStatic from "../../assets/images/deposit.png";
import { useGlobalModalContext } from "../../context/GlobalModal";
import { useWindowSize } from "../../hooks/useWindowSize";
import { TranslationProvider, useTranslation } from "../../i18n";
import { AccountProvider, Provider } from "../../wallets";
import {
  AngleDown,
  Binary,
  Info,
  Building,
  Chart,
  ChartMixed,
  ChartUp,
  ChartUpDown,
  ChartUser,
  Code,
  Coins,
  CreditCard,
  Deposit,
  External,
  Gamepad,
  Gavel,
  Graduate,
  Home,
  History,
  MoneyTransfer,
  NFT,
  Nodes,
  PieChart,
  Seedling,
  Stake,
  Support,
  Swap,
  Terminal,
  Trophy,
  Users,
  Lend,
} from "../icons/Icons";
import { RujiraLogo } from "../logos/RujiraLogo";
import { Accounts, WalletProps, Wallets } from "./Accounts";
import { PendingDepositProps, PendingDeposits } from "./Pending";
import { ResolveLink } from "./ResolveLink";

export * from "./Accounts";
export * from "./QuickLauncher";

const HEADER_MENU_VISIBILITY: Record<
  "options" | "launchpad" | "games" | "predict" | "omniverse" | "collections",
  boolean
> = {
  options: false,
  launchpad: false,
  games: false,
  predict: false,
  omniverse: false,
  collections: false,
};

type HeaderProps = {
  accountProvider: AccountProvider;
  showAccount?: boolean;
  className?: string;
  domain?: string;
  routingElement: any;
  wallets: WalletProps[];
  ProviderIcon: FC<{ provider: Provider.Key; selected: boolean }>;
  onDeposit?: () => void;
  deposits?: Omit<PendingDepositProps, "accountProvider">;
  getAccountValue: (account: Account) => bigint;
  customActions?: ReactElement[];
  staticRoutes?: string[];
};

export const Header = ({
  accountProvider,
  className,
  domain = "",
  routingElement,
  wallets,
  ProviderIcon,
  onDeposit,
  deposits,
  getAccountValue,
  customActions,
  staticRoutes,
}: HeaderProps): ReactElement => {
  const { t } = useTranslation("header");
  const [hover, setHover] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const { accounts } = accountProvider;
  const { showModal } = useGlobalModalContext();

  const ConnectModal = () => {
    showModal({
      title: t("connectYourAccount"),
      backgroundClose: true,
      children: (
        <TranslationProvider namespace="header">
          <Wallets
            modalLayout={true}
            provider={accountProvider}
            wallets={wallets}
            routingElement={routingElement}
          />
        </TranslationProvider>
      ),
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 56);
      setScrollY(window.scrollY <= 56 ? window.scrollY : 56);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Container
      style={{ backgroundColor: `rgba(15, 17, 23, ${(scrollY / 56) * 0.9})` }}
      className={clsx({
        [`${className}`]: className,
        "rujira-header--scrolled": isScrolled,
      })}>
      <ResolveLink as={routingElement} to=".">
        <Logo />
      </ResolveLink>
      <MainNav
        domain={domain}
        accountProvider={accountProvider}
        routingElement={routingElement}
        staticRoutes={staticRoutes}
      />
      <div className="flex ai-c gradient-card-container rujira-header__right">
        {deposits && <PendingDeposits {...deposits} />}
        {onDeposit && (
          <button
            id="deposit"
            className="transparent rujira-header__deposit condensed"
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
            onClick={() => {
              accounts?.length === 0 ? ConnectModal() : onDeposit!();
            }}>
            <img src={hover ? deposit : depositStatic} alt="Deposit" />
            <span>{t("deposit")}</span>
          </button>
        )}
        {/* <QuickLauncher domain={domain || ""} routingElement={routingElement} /> */}
        <Accounts
          provider={accountProvider}
          ProviderIcon={ProviderIcon}
          routingElement={routingElement}
          wallets={wallets}
          getValue={getAccountValue}
          //hideNetworkSwitch={hideNetworkSwitch}
          customActions={customActions}
        />
      </div>
      <MobileNav
        domain={domain}
        routingElement={routingElement}
        accountProvider={accountProvider}
        staticRoutes={staticRoutes}
      />
    </Container>
  );
};

export const Container: React.FC<
  PropsWithChildren<{ className?: string; style?: React.CSSProperties }>
> = ({ children, className, style = {} }) => {
  return (
    <div
      className={clsx({
        "rujira-header": true,
        [`${className}`]: className,
      })}
      style={style}>
      {children}
    </div>
  );
};

export const Logo = () => {
  const size = useWindowSize();
  // `useWindowSize` returns 0 on SSR and first client render. Treat unknown as desktop
  // so the wordmark ships in initial HTML and doesn't pop in after hydration.
  return (
    <RujiraLogo
      textColor="#fff"
      className="rujira-header__logo"
      showText={size.width === 0 || size.width >= 520}
      animate={true}
    />
  );
};

interface MainNavProps {
  domain: string;
  accountProvider?: AccountProvider;
  routingElement: any;
  staticRoutes?: string[];
}

export const MainNav = ({
  domain,
  //accountProvider,
  routingElement,
  staticRoutes,
}: MainNavProps): ReactElement => {
  const { t } = useTranslation("header");
  //const { accounts } = accountProvider;
  const [showTrade, setShowTrade] = useState(false);
  const [showEarn, setShowEarn] = useState(false);
  const [showBorrow, setShowBorrow] = useState(false);
  const [showUtilities, setShowUtilities] = useState(false);
  const [showEntertainment, setShowEntertainment] = useState(false);
  const [showLearn, setShowLearn] = useState(false);

  const trade = useRef<HTMLDivElement | null>(null);
  const earn = useRef<HTMLDivElement | null>(null);
  const borrow = useRef<HTMLDivElement | null>(null);
  const utilities = useRef<HTMLDivElement | null>(null);
  const entertainment = useRef<HTMLDivElement | null>(null);
  const learn = useRef<HTMLDivElement | null>(null);
  const showEntertainmentMenu =
    HEADER_MENU_VISIBILITY.games ||
    HEADER_MENU_VISIBILITY.predict ||
    HEADER_MENU_VISIBILITY.omniverse ||
    HEADER_MENU_VISIBILITY.collections;

  useEffect(() => {
    if (
      showTrade ||
      showBorrow ||
      showUtilities ||
      showEarn ||
      showEntertainment ||
      showLearn
    ) {
      let popup = null;
      if (showTrade) {
        popup = trade.current;
      } else if (showEarn) {
        popup = earn.current;
      } else if (showBorrow) {
        popup = borrow.current;
      } else if (showUtilities) {
        popup = utilities.current;
      } else if (showEntertainment) {
        popup = entertainment.current;
      } else if (showLearn) {
        popup = learn.current;
      }
      if (popup) {
        const box = popup.getBoundingClientRect();
        const body = document.body;
        const docEl = document.documentElement;
        const scrollLeft =
          window.scrollX || docEl.scrollLeft || body.scrollLeft;
        const clientLeft = docEl.clientLeft || body.clientLeft || 0;
        const left = box.left + scrollLeft - clientLeft;
        if (left + box.width > window.innerWidth - 20) {
          const diff = Math.round(left + box.width - window.innerWidth + 20);
          popup.style.transform = "translateX(-" + diff + "px)";
        }
      }
    }
  }, [
    showTrade,
    showBorrow,
    showUtilities,
    showEarn,
    showEntertainment,
    showLearn,
  ]);

  return (
    <nav className="rujira-header__nav">
      {/* {accounts && accounts.length > 0 && (
        <ResolveLink as={routingElement} domain={domain} to="portfolio">
          {t("portfolio")}
        </ResolveLink>
      )} */}
      <span
        onMouseOver={() => setShowTrade(true)}
        onMouseOut={() => setShowTrade(false)}>
        {t("trade")}
        <AngleDown />
        <AnimatePresence>
          {showTrade && (
            <SubTrade
              useRef={trade}
              domain={domain}
              routingElement={routingElement}
              staticRoutes={staticRoutes}
            />
          )}
        </AnimatePresence>
      </span>
      <span
        onMouseOver={() => setShowEarn(true)}
        onMouseOut={() => setShowEarn(false)}>
        {t("earn")}
        <AngleDown />
        <AnimatePresence>
          {showEarn && (
            <SubEarn
              useRef={earn}
              domain={domain}
              routingElement={routingElement}
              staticRoutes={staticRoutes}
            />
          )}
        </AnimatePresence>
      </span>
      <span
        onMouseOver={() => setShowBorrow(true)}
        onMouseOut={() => setShowBorrow(false)}>
        {t("borrow")}
        <AngleDown />
        <AnimatePresence>
          {showBorrow && (
            <SubBorrow
              useRef={borrow}
              domain={domain}
              routingElement={routingElement}
              staticRoutes={staticRoutes}
            />
          )}
        </AnimatePresence>
      </span>
      <span
        onMouseOver={() => setShowUtilities(true)}
        onMouseOut={() => setShowUtilities(false)}>
        {t("utilities")}
        <AngleDown />
        <AnimatePresence>
          {showUtilities && (
            <SubUtilities
              useRef={utilities}
              domain={domain}
              routingElement={routingElement}
              staticRoutes={staticRoutes}
            />
          )}
        </AnimatePresence>
      </span>
      {showEntertainmentMenu && (
        <span
          onMouseOver={() => setShowEntertainment(true)}
          onMouseOut={() => setShowEntertainment(false)}>
          {t("entertainment")}
          <AngleDown />
          <AnimatePresence>
            {showEntertainment && (
              <SubEntertainment
                useRef={entertainment}
                domain={domain}
                routingElement={routingElement}
                staticRoutes={staticRoutes}
              />
            )}
          </AnimatePresence>
        </span>
      )}
      <span
        onMouseOver={() => setShowLearn(true)}
        onMouseOut={() => setShowLearn(false)}>
        {t("learnAndHelp")}
        <AngleDown />
        <AnimatePresence>
          {showLearn && (
            <SubLearn
              useRef={learn}
              domain={domain}
              routingElement={routingElement}
              staticRoutes={staticRoutes}
            />
          )}
        </AnimatePresence>
      </span>
    </nav>
  );
};

export const MobileNav = ({
  domain,
  routingElement,
  accountProvider,
  staticRoutes,
}: {
  domain: string;
  routingElement: any;
  accountProvider: AccountProvider;
  staticRoutes?: string[];
}) => {
  const { t } = useTranslation("header");
  const [showDrawer, setShowDrawer] = useState(false);
  const { accounts } = accountProvider;
  const entertainment = useRef<HTMLDivElement | null>(null);
  const showEntertainmentMenu =
    HEADER_MENU_VISIBILITY.games ||
    HEADER_MENU_VISIBILITY.predict ||
    HEADER_MENU_VISIBILITY.omniverse ||
    HEADER_MENU_VISIBILITY.collections;
  /*const mobile = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
    if (showMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showMobile]);*/

  useEffect(() => {
    let url = location.href;
    const handler = () => {
      requestAnimationFrame(() => {
        if (url !== location.href) {
          setShowDrawer(false);
          url = location.href;
        }
      });
    };
    document.body.addEventListener("click", handler, true);
    return () => document.body.removeEventListener("click", handler, true);
  }, []);

  return (
    <Drawer.Root
      direction="left"
      open={showDrawer}
      onOpenChange={(open: boolean) => setShowDrawer(open)}>
      <button
        className="rujira-header__hamburger"
        onClick={() => setShowDrawer(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path
            d="M0 64H448v48H0V64zM0 224H448v48H0V224zM448 384v48H0V384H448z"
            fill="currentColor"
          />
        </svg>
      </button>
      <Drawer.Portal>
        <Drawer.Overlay className="drawer__overlay" />
        <Drawer.Content className="drawer__content drawer__content--left">
          <Drawer.Description className="visually-hidden">
            Main navigation menu
          </Drawer.Description>
          <Drawer.Title className="visually-hidden">Main Menu</Drawer.Title>

          <div className="drawer__card mobile-drawer">
            <ResolveLink
              as={routingElement}
              domain={domain}
              to="."
              className="flex ai-c">
              <Home className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
              <div>
                <h4 className="fs-14 fw-600">{t("home")}</h4>
              </div>
            </ResolveLink>
            {accounts && accounts.length > 0 && (
              <ResolveLink
                as={routingElement}
                domain={domain}
                to="portfolio"
                className="flex ai-c mt-2">
                <Coins className="color-grey h-3.5 w-a block mr-2 no-shrink" />
                <div>
                  <h4 className="fs-14 fw-600">{t("portfolio")}</h4>
                </div>
              </ResolveLink>
            )}
            <h4>{t("trade")}</h4>
            <SubTrade
              useRef={useRef<HTMLDivElement | null>(null)}
              domain={domain}
              routingElement={routingElement}
              className=""
              staticRoutes={staticRoutes}
            />
            <h4>{t("earn")}</h4>
            <SubEarn
              useRef={useRef<HTMLDivElement | null>(null)}
              domain={domain}
              routingElement={routingElement}
              className=""
              staticRoutes={staticRoutes}
            />
            <h4>{t("borrow")}</h4>
            <SubBorrow
              useRef={useRef<HTMLDivElement | null>(null)}
              domain={domain}
              routingElement={routingElement}
              className=""
              staticRoutes={staticRoutes}
            />
            <h4>{t("utilities")}</h4>
            <SubUtilities
              useRef={useRef<HTMLDivElement | null>(null)}
              domain={domain}
              routingElement={routingElement}
              className=""
              staticRoutes={staticRoutes}
            />
            {showEntertainmentMenu && (
              <>
                <h4>{t("entertainment")}</h4>
                <SubEntertainment
                  useRef={entertainment}
                  domain={domain}
                  routingElement={routingElement}
                  className=""
                  staticRoutes={staticRoutes}
                />
              </>
            )}
            <h4>{t("learnAndHelp")}</h4>
            <SubLearn
              useRef={useRef<HTMLDivElement | null>(null)}
              domain={domain}
              routingElement={routingElement}
              className=""
              staticRoutes={staticRoutes}
            />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

const Popup = ({
  children,
  useRef,
  className = "rujira-header__popup sub-nav fw-400 p-2",
}: {
  children: React.ReactNode;
  useRef: React.RefObject<HTMLDivElement>;
  className?: string;
}) => (
  <motion.div
    ref={useRef}
    className={className}
    initial={{ opacity: 0, marginTop: -4 }}
    animate={{ opacity: 1, marginTop: 0 }}
    exit={{ opacity: 0, marginTop: -4 }}>
    {children}
  </motion.div>
);

type SubProps = {
  domain?: string;
  routingElement: any;
  useRef: React.RefObject<HTMLDivElement>;
  setShowMobile?: (e: any) => void;
  className?: string;
  staticRoutes?: string[];
};

const SoonNavItem = ({
  Icon,
  className = "flex ai-s",
  description,
  iconClassName = "color-grey h-3.5 w-a block mr-2 no-shrink mt-0",
  title,
}: {
  Icon: FC<{ className?: string }>;
  className?: string;
  description: string;
  iconClassName?: string;
  title: string;
}) => (
  <a aria-disabled="true" className={className} data-soon="true">
    <Icon className={iconClassName} />
    <div>
      <h4 className="fs-14 fw-600">{title}</h4>
      <p className="fs-12 mt-0.5">{description}</p>
    </div>
  </a>
);

const SubTrade = ({
  domain,
  routingElement,
  useRef,
  className,
  staticRoutes,
}: SubProps) => {
  const { t } = useTranslation("header");
  return (
    <Popup useRef={useRef} className={className}>
      <div className="grid w-60 mt-1">
        <ResolveLink
          as={routingElement}
          isStatic={staticRoutes?.includes("swap")}
          domain={domain}
          to="swap"
          className="flex ai-s">
          <Swap className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
          <div>
            <h4 className="fs-14 fw-600">{t("tokenSwap")}</h4>
            <p className="fs-12 mt-0.5">{t("tokenSwapDesc")}</p>
          </div>
        </ResolveLink>
        <ResolveLink
          as={routingElement}
          isStatic={staticRoutes?.includes("trade")}
          domain={domain}
          to="trade"
          className="flex ai-s">
          <Chart className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
          <div>
            <h4 className="fs-14 fw-600">{t("spotTrading")}</h4>
            <p className="fs-12 mt-0.5">{t("spotTradingDesc")}</p>
          </div>
        </ResolveLink>
        <ResolveLink
          as={routingElement}
          isStatic={staticRoutes?.includes("index")}
          domain={domain}
          to="index"
          className="flex ai-s">
          <PieChart className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
          <div>
            <h4 className="fs-14 fw-600">{t("index")}</h4>
            <p className="fs-12 mt-0.5">{t("indexDesc")}</p>
          </div>
        </ResolveLink>
        <SoonNavItem
          Icon={ChartUpDown}
          title={t("perps")}
          description={t("perpsDesc")}
        />
        {HEADER_MENU_VISIBILITY.options && (
          <ResolveLink
            as={routingElement}
            isStatic={staticRoutes?.includes("options")}
            domain={domain}
            to="options"
            className="flex ai-s">
            <ChartUp className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
            <div>
              <h4 className="fs-14 fw-600 flex ai-c">{t("options")}</h4>
              <p className="fs-12 mt-0.5">{t("optionsDesc")}</p>
            </div>
          </ResolveLink>
        )}
      </div>
    </Popup>
  );
};

const SubEarn = ({
  domain,
  routingElement,
  useRef,
  className,
  staticRoutes,
}: SubProps) => {
  const { t } = useTranslation("header");
  return (
    <Popup useRef={useRef} className={className}>
      <div className="grid w-60 mt-1">
        <ResolveLink
          as={routingElement}
          isStatic={staticRoutes?.includes("stake")}
          domain={domain}
          to="stake"
          className="flex ai-s">
          <Stake className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
          <div>
            <h4 className="fs-14 fw-600">{t("stake")}</h4>
            <p className="fs-12 mt-0.5">{t("stakeDesc")}</p>
          </div>
        </ResolveLink>
        <ResolveLink
          as={routingElement}
          isStatic={staticRoutes?.includes("trade")}
          domain={domain}
          to="automated-trading"
          className="flex ai-s">
          <Binary className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
          <div>
            <h4 className="fs-14 fw-600">{t("automatedTrading")}</h4>
            <p className="fs-12 mt-0.5">{t("automatedTradingDesc")}</p>
          </div>
        </ResolveLink>
        <ResolveLink
          as={routingElement}
          isStatic={staticRoutes?.includes("lending")}
          domain={domain}
          to="lend"
          className="flex ai-s">
          <Lend className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
          <div>
            <h4 className="fs-14 fw-600">{t("lending")}</h4>
            <p className="fs-12 mt-0.5">{t("lendingDesc")}</p>
          </div>
        </ResolveLink>
        <ResolveLink
          as={routingElement}
          isStatic={staticRoutes?.includes("liquidate")}
          domain={domain}
          to="liquidate"
          className="flex">
          <Gavel className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
          <div>
            <h4 className="fs-14 fw-600">{t("liquidate")}</h4>
            <p className="fs-12 mt-0.5">{t("liquidateDesc")}</p>
          </div>
        </ResolveLink>
        <ResolveLink
          as={routingElement}
          isStatic={staticRoutes?.includes("strategies")}
          domain={domain}
          to="strategies"
          className="flex ai-s">
          <Building className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
          <div>
            <h4 className="fs-14 fw-600">{t("strategies")}</h4>
            <p className="fs-12 mt-0.5">{t("strategiesDesc")}</p>
          </div>
        </ResolveLink>
        {HEADER_MENU_VISIBILITY.launchpad && (
          <ResolveLink
            as={routingElement}
            isStatic={staticRoutes?.includes("launchpad")}
            domain={domain}
            to="launchpad"
            className="flex ai-s">
            <Seedling className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
            <div>
              <h4 className="fs-14 fw-600 flex ai-c">{t("launchpad")}</h4>
              <p className="fs-12 mt-0.5">{t("launchpadDesc")}</p>
            </div>
          </ResolveLink>
        )}
      </div>
    </Popup>
  );
};

const SubBorrow = ({
  domain,
  routingElement,
  useRef,
  className,
  staticRoutes,
}: SubProps) => {
  const { t } = useTranslation("header");
  return (
    <Popup useRef={useRef} className={className}>
      <div className="grid w-60 mt-1">
        <ResolveLink
          as={routingElement}
          isStatic={staticRoutes?.includes("borrow")}
          domain={domain}
          to="/borrow/BTC/USDC"
          className="flex ai-s">
          <MoneyTransfer className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
          <div>
            <h4 className="fs-14 fw-600 flex ai-c">{t("borrowMenu")}</h4>
            <p className="fs-12 mt-0.5">{t("borrowDesc")}</p>
          </div>
        </ResolveLink>
        <SoonNavItem
          Icon={Deposit}
          iconClassName="color-grey h-a w-3 block mr-2 no-shrink mt-0"
          title={t("mintStablecoin")}
          description={t("mintStablecoinDesc")}
        />
      </div>
    </Popup>
  );
};

const SubUtilities = ({
  domain,
  routingElement,
  useRef,
  className,
  staticRoutes,
}: SubProps) => {
  const { t } = useTranslation("header");
  return (
    <Popup useRef={useRef} className={className}>
      <div className="grid w-60 mt-1">
        <a
          href="https://ai.autorujira.app/"
          target="_blank"
          className="flex ai-s">
          <Terminal className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
          <div>
            <h4 className="fs-14 fw-600 flex ai-c">
              {t("rujiAi")}
              <External className="h-1.5 w-a ml-1" />
            </h4>
            <p className="fs-12 mt-0.5">{t("rujiAiDesc")}</p>
          </div>
        </a>
        <ResolveLink
          as={routingElement}
          isStatic={staticRoutes?.includes("analytics")}
          domain={domain}
          to="/analytics"
          className="flex ai-s">
          <ChartMixed className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
          <div>
            <h4 className="fs-14 fw-600">{t("analytics")}</h4>
            <p className="fs-12 mt-0.5">{t("analyticsDesc")}</p>
          </div>
        </ResolveLink>
        <ResolveLink
          as={routingElement}
          isStatic={staticRoutes?.includes("leaderboard")}
          domain={domain}
          to="leaderboard"
          className="flex ai-s">
          <Trophy className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
          <div>
            <h4 className="fs-14 fw-600">{t("leagues")}</h4>
            <p className="fs-12 mt-0.5">{t("leaguesDesc")}</p>
          </div>
        </ResolveLink>
        <a href="https://daodao.zone" target="_blank" className="flex ai-s">
          <Users className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
          <div>
            <h4 className="fs-14 fw-600 flex ai-c">
              {t("daodao")} <External className="h-1.5 w-a ml-1" />
            </h4>
            <p className="fs-12 mt-0.5">{t("daodaoDesc")}</p>
          </div>
        </a>
        <SoonNavItem
          Icon={CreditCard}
          className="flex"
          title={t("buyCrypto")}
          description={t("buyCryptoDesc")}
        />
      </div>
    </Popup>
  );
};

const SubEntertainment = ({
  domain,
  routingElement,
  useRef,
  className,
  staticRoutes,
}: SubProps) => {
  const { t } = useTranslation("header");
  return (
    <Popup useRef={useRef} className={className}>
      <div className="grid w-60 mt-1">
        {HEADER_MENU_VISIBILITY.games && (
          <ResolveLink
            as={routingElement}
            isStatic={staticRoutes?.includes("games")}
            domain={domain}
            to="games"
            className="flex ai-s">
            <Gamepad className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
            <div>
              <h4 className="fs-14 fw-600">{t("games")}</h4>
              <p className="fs-12 mt-0.5">{t("gamesDesc")}</p>
            </div>
          </ResolveLink>
        )}
        {HEADER_MENU_VISIBILITY.predict && (
          <ResolveLink
            as={routingElement}
            isStatic={staticRoutes?.includes("predict")}
            domain={domain}
            to="predict"
            className="flex">
            <ChartUser className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
            <div>
              <h4 className="fs-14 fw-600">{t("predict")}</h4>
              <p className="fs-12 mt-0.5">{t("predictDesc")}</p>
            </div>
          </ResolveLink>
        )}
        {HEADER_MENU_VISIBILITY.omniverse && (
          <ResolveLink
            as={routingElement}
            isStatic={staticRoutes?.includes("omniverse")}
            domain={domain}
            to="omniverse"
            className="flex">
            <Nodes className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
            <div>
              <h4 className="fs-14 fw-600">{t("omniverse")}</h4>
              <p className="fs-12 mt-0.5">{t("omniverseDesc")}</p>
            </div>
          </ResolveLink>
        )}
        {HEADER_MENU_VISIBILITY.collections && (
          <ResolveLink
            as={routingElement}
            isStatic={staticRoutes?.includes("nfts")}
            domain={domain}
            to="nfts"
            className="flex ai-s">
            <NFT className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
            <div>
              <h4 className="fs-14 fw-600 flex ai-c">{t("collections")}</h4>
              <p className="fs-12 mt-0.5">{t("collectionsDesc")}</p>
            </div>
          </ResolveLink>
        )}
      </div>
    </Popup>
  );
};

const SubLearn = ({
  domain,
  routingElement,
  useRef,
  className,
  staticRoutes,
}: SubProps) => {
  const { t } = useTranslation("header");
  return (
    <Popup useRef={useRef} className={className}>
      <div className="grid w-60 mt-1">
        <ResolveLink
          as={routingElement}
          isStatic={true}
          domain={domain}
          to="/get-started"
          className="flex ai-s">
          <Graduate className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
          <div>
            <h4 className="fs-14 fw-600">{t("getStarted")}</h4>
            <p className="fs-12 mt-0.5">{t("getStartedDesc")}</p>
          </div>
        </ResolveLink>
        <ResolveLink
          as={routingElement}
          isStatic={true}
          domain={domain}
          to="/discover-rujira"
          className="flex ai-s">
          <Home className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
          <div>
            <h4 className="fs-14 fw-600">{t("discoverRujira")}</h4>
            <p className="fs-12 mt-0.5">{t("discoverRujiraDesc")}</p>
          </div>
        </ResolveLink>
        {/* <ResolveLink
          as={routingElement}
          domain={domain}
          to="ecosystem"
          className="flex ai-s">
          <Earth className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
          <div>
            <h4 className="fs-14 fw-600">{t("ecosystem")}</h4>
            <p className="fs-12 mt-0.5">{t("ecosystemDesc")}</p>
          </div>
        </ResolveLink> */}
        <ResolveLink
          as={routingElement}
          isStatic={staticRoutes?.includes("support")}
          domain={domain}
          to="/support"
          className="flex ai-s">
          <Support className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
          <div>
            <h4 className="fs-14 fw-600">{t("support")}</h4>
            <p className="fs-12 mt-0.5">{t("educationDesc")}</p>
          </div>
        </ResolveLink>
        <ResolveLink
          as={routingElement}
          isStatic={staticRoutes?.includes("faq")}
          domain={domain}
          to="/faq"
          className="flex">
          <Info className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
          <div>
            <h4 className="fs-14 fw-600">{t("commonQuestions")}</h4>
            <p className="fs-12 mt-0.5">{t("supportDesc")}</p>
          </div>
        </ResolveLink>
        <ResolveLink
          as={routingElement}
          isStatic={staticRoutes?.includes("articles")}
          domain={domain}
          to="/articles"
          className="flex ai-s">
          <History className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
          <div>
            <h4 className="fs-14 fw-600">{t("articles")}</h4>
            <p className="fs-12 mt-0.5">{t("articlesDesc")}</p>
          </div>
        </ResolveLink>
        <a
          href="https://docs.rujira.network/"
          target="_blank"
          className="flex ai-s">
          <Code className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
          <div>
            <h4 className="fs-14 fw-600 flex ai-c">
              {t("documentation")} <External className="h-1.5 w-a ml-1" />
            </h4>
            <p className="fs-12 mt-0.5">{t("documentationDesc")}</p>
          </div>
        </a>
        <a
          href="https://docs.rujira.network/developers/getting-started"
          target="_blank"
          className="flex ai-s">
          <Terminal className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
          <div>
            <h4 className="fs-14 fw-600 flex ai-c">
              {t("developers")}
              <External className="h-1.5 w-a ml-1" />
            </h4>
            <p className="fs-12 mt-0.5">{t("developersDesc")}</p>
          </div>
        </a>
        {/* <ResolveLink
          as={routingElement}
          domain={domain}
          to="developers"
          className="flex">
          <Terminal className="color-grey h-3.5 w-a block mr-2 no-shrink mt-0" />
          <div>
            <h4 className="fs-14 fw-600">{t("developers")}</h4>
            <p className="fs-12 mt-0.5">{t("developersDesc")}</p>
          </div>
        </ResolveLink> */}
      </div>
    </Popup>
  );
};
