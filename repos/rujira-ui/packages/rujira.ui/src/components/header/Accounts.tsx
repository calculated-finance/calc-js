import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { cloneElement, FC, ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Tooltip } from "react-tooltip";
import { Account, Address, isThor, THOR } from "rujira.js";
import {
  AccountProvider,
  Provider,
  Spinner,
  useLocalStorage,
} from "../..";
import combined from "../../assets/images/combined.png";
import connect from "../../assets/images/connect.gif";
import connectStatic from "../../assets/images/connect.png";
import { useGlobalModalContext } from "../../context/GlobalModal";
import { useTranslation } from "../../i18n";
import { Eye, EyeSlash, LinkDisconnect, Plus } from "../icons/Icons";
import { NetworkIcon } from "../icons/NetworkIcon";
import { Fiat } from "../numbers/Fiat";
import { ResolveLink } from "./ResolveLink";

interface AccountsProps {
  provider: AccountProvider;
  routingElement: any;
  wallets: WalletProps[];
  ProviderIcon: FC<{
    provider: Provider.Key;
    selected: boolean;
    className?: string;
  }>;
  getValue: (account: Account) => bigint;
  customActions?: ReactElement[];
  isLoading?: boolean;
}

export const Accounts = ({
  provider,
  routingElement,
  wallets,
  ProviderIcon,
  getValue,
  customActions,
}: AccountsProps): ReactElement => {
  const { t } = useTranslation("header");
  const { accounts: allAccounts, disconnectAll, selected } = provider;
  const [showBlur, setShowBlur] = useState(false);
  const [showBalance, setShowBalance] = useLocalStorage<string>(
    "rujira-show-balance",
    "true"
  );

  const accounts = allAccounts?.filter((a) => isThor(a.address));

  return (
    <>
      {!accounts || accounts.length === 0 ? (
        <ConnectAnimation routingElement={routingElement}>
          <Wallets
            provider={provider}
            wallets={wallets}
            routingElement={routingElement}
          />
        </ConnectAnimation>
      ) : (
        <MyAccount
          routingElement={routingElement}
          provider={provider}
          value={
            selected ? getValue(Account.fromAddress(selected.address)) : false
          }
          onHide={() => setShowBlur(false)}>
          {selected ? (
            <ResolveLink as={routingElement} to="portfolio" className="balance">
              <div className="flex ai-b">
                {showBalance === "true" ? (
                  <>
                    <Fiat
                      amount={getValue(Account.fromAddress(selected.address))}
                      decimals={12}
                      symbol="~$"
                      padSymbol={false}
                      className="color-white fs-26 condensed"
                    />
                    <button
                      className="transparent ml-1 color-grey hover-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowBalance("false");
                        return false;
                      }}
                      style={{ marginRight: "-1rem" }}>
                      <Eye className="w-2 h-2" />
                    </button>
                  </>
                ) : (
                  <>
                    <span
                      className="fiat color-grey fs-22"
                      style={{ fontFamily: "monospace" }}>
                      ****
                    </span>
                    <button
                      className="transparent ml-1 color-grey hover-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowBalance("true");
                        return false;
                      }}
                      style={{ marginRight: "-1rem" }}>
                      <EyeSlash className="w-2 h-2" />
                    </button>
                  </>
                )}
              </div>
              <p className="fs-12 condensed color-grey mt-0.5">
                {t("viewPortfolio")}
              </p>
            </ResolveLink>
          ) : null}

          {accounts.map((account) => (
            <AddressC
              key={`${account.address.address}:${account.provider}`}
              provider={provider}
              ProviderIcon={ProviderIcon}
              account={account}
              selected={
                selected?.address.address === account.address.address &&
                selected.provider === account.provider
              }
            />
          ))}

          <nav className="actions">
            <ResolveLink
              as={routingElement}
              className="action transparent"
              to="connect">
              <Plus />
              <span>{t("connectAnotherWallet")}</span>
            </ResolveLink>
            {customActions &&
              customActions.map((e, index) => cloneElement(e, { key: index }))}
            <button className="action transparent" onClick={disconnectAll}>
              <LinkDisconnect />
              <span>{t("disconnectAll")}</span>
            </button>
          </nav>
          {showBlur && <div className="blur" />}
        </MyAccount>
      )}
    </>
  );
};

const ConnectAnimation = ({
  children,
  routingElement,
}: {
  children: React.ReactNode;
  routingElement?: any;
}) => {
  const { t } = useTranslation("header");
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative py-q1 no-underline"
      onMouseOver={() => setShow(true)}
      onMouseOut={() => setShow(false)}>
      <div className="rujira-header__connect">
        <div className="fs-14 fw-500 fs-15 condensed">{t("connect")}</div>
        <img
          className={"w-3 h-3 filter-white"}
          src={show ? connect : connectStatic}
          alt="Connect"
        />
      </div>
      <AnimatePresence>
        {show && (
          <motion.div
            className="rujira-header__popup right condensed w-32 text-center p-2"
            initial={{ opacity: 0, marginTop: -4 }}
            animate={{ opacity: 1, marginTop: 4 }}
            exit={{ opacity: 0, marginTop: -4 }}>
            <ResolveLink
              as={routingElement}
              className="flex dir-c action transparent"
              to="connect">
              <p className="color-white">{t("connectYourWallet")}</p>
              <small className="color-grey">
                {t("createOrConnectWallet")}
              </small>
            </ResolveLink>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export interface WalletProps {
  key: string;
  label: string;
  provider?: Provider.Key;
  icon: ReactElement;
  url?: string;
}

interface WalletsProps {
  modalLayout?: boolean;
  provider: AccountProvider;
  routingElement?: any;
  wallets: WalletProps[];
}

export const Wallets = ({
  modalLayout = false,
  provider,
  wallets,
  routingElement,
}: WalletsProps): ReactElement => {
  const { t } = useTranslation("header");
  const { connect, isAvailable } = provider;
  const { hideModal } = useGlobalModalContext();
  const rujiraWalletOrder = ["vultisig", "keplr"];
  const rujiraWallets = wallets
    .filter((wallet) => rujiraWalletOrder.includes(wallet.key))
    .sort(
      (a, b) =>
        rujiraWalletOrder.indexOf(a.key) - rujiraWalletOrder.indexOf(b.key)
    );
  const otherWallets = wallets.filter(
    (wallet) => !rujiraWalletOrder.includes(wallet.key)
  );

  const walletButton = (wallet: WalletProps) => {
    const disabled = wallet.provider ? !isAvailable(wallet.provider) : true;
    return (
      <button
        key={wallet.label}
        id={`connect-${wallet.label}`}
        data-tooltip-content={wallet.label}
        data-tooltip-id="wallet-tip"
        className={clsx({
          "transparent block pointer": true,
          medium: modalLayout,
          "desaturate opacity-10": disabled,
        })}
        onClick={() => {
          if (disabled && wallet.url) {
            window.open(wallet.url, "_blank");
            return;
          }
          wallet.provider && connect(wallet.provider).then(hideModal);
        }}>
        {wallet.icon}
      </button>
    );
  };

  return (
    <>
      <div
        className={clsx("rujira-header__wallets", {
          "rujira-header__wallets--modal": modalLayout,
        })}>
        <span
          className="tag tag--borderless tag--primary no-shrink rujira-header__wallets-support"
          data-support-tooltip={t("rujiraSupportTooltip")}>
          {t("rujiraSupport")}
        </span>
        <div className="rujira-header__wallets-row">
          {rujiraWallets.map(walletButton)}
        </div>

        <hr className="rujira-header__wallets-divider" />

        <span
          className="tag tag--borderless tag--orange no-shrink rujira-header__wallets-support"
          data-support-tooltip={t("limitedSupportTooltip")}>
          {t("limitedSupport")}
        </span>
        <div className="rujira-header__wallets-row">
          {otherWallets.map(walletButton)}
        </div>
        <hr
          className={clsx({
            hr: true,
            "mt-0 mb-1": !modalLayout,
            "my-2": modalLayout,
          })}
        />
        <ResolveLink as={routingElement} to="/tou" className="terms mb-1">
          By connecting a wallet, you agree to Rujira's Terms of Use.
        </ResolveLink>
        <ResolveLink as={routingElement} to="/connect" onClick={hideModal}>
          {t("needHelpDeciding")}
        </ResolveLink>
      </div>
      <Tooltip id="wallet-tip" className="tooltip" />
    </>
  );
};

const MyAccount = ({
  provider,
  children,
  onHide,
  routingElement,
  value,
}: {
  provider: AccountProvider;
  children: React.ReactNode;
  onHide: () => void;
  routingElement?: any;
  value: bigint | false;
}) => {
  const [show, setShow] = useState(false);
  const { accounts, selected } = provider;
  const [showBalance] = useLocalStorage<string>("rujira-show-balance", "true");

  useEffect(() => {
    onHide();
  }, [show]);

  return (
    <div
      className="relative py-q1"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}>
      <ResolveLink
        as={routingElement}
        to="portfolio"
        className="rujira-header__pfp">
        {value !== false && showBalance === "true" && (
          <Fiat amount={value} symbol="~$" decimals={12} padSymbol={false} />
        )}
        {selected && <NetworkIcon network={THOR} />}
        {accounts?.length && !selected && <img src={combined} alt="combined" />}
        {provider.isLoading && <Spinner />}
      </ResolveLink>
      <AnimatePresence>
        {show && (
          <motion.div
            className="rujira-header__popup right condensed p-1.5 br-2"
            initial={{ opacity: 0, marginTop: -4, right: -8 }}
            animate={{ opacity: 1, marginTop: 4, right: -8 }}
            exit={{ opacity: 0, marginTop: -4, right: -8 }}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface AddressProps {
  account: { address: Address; provider: Provider.Key };
  selected: boolean;
  provider: AccountProvider;
  ProviderIcon: FC<{
    provider: Provider.Key;
    selected: boolean;
    className?: string;
  }>;
}

const AddressC: FC<AddressProps> = ({
  account,
  selected,
  provider,
  ProviderIcon,
}) => {
  const { t } = useTranslation("header");
  const { select, disconnect } = provider;
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      className={clsx({
        "flex ai-c px-1 address": true,
        "address--selected": selected,
      })}>
      <NetworkIcon
        network={THOR}
        className="address__wallet"
        selected={selected || hover}
      />
      {/* <ProviderIcon provider={account.provider} selected={selected} /> */}
      <p
        className="address__address pointer"
        onClick={() => {
          if (selected) {
            toast.success(t("addressCopied"));
            navigator.clipboard.writeText(account.address.address);
          } else {
            select(account);
          }
        }}>
        {hover && selected ? (
          t("copyAddress")
        ) : (
          <>
            {account.address.address.substring(0, 8)} ...{" "}
            {account.address.address.slice(-8)}
          </>
        )}
      </p>

      {hover ? (
        <LinkDisconnect
          className="address__disconnect"
          onClick={() => disconnect(account.provider)}
        />
      ) : (
        <ProviderIcon
          className="address__disconnect"
          provider={account.provider}
          selected={selected}
        />
      )}
    </div>
  );
};
