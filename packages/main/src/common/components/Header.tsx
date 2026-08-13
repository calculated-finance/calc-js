import { FC, Suspense, useEffect } from "react";
import { useFragment } from "react-relay";
import {
  Header as BaseHeader,
  ProviderIcon,
  useGlobalModalContext,
  WalletIcons,
  WalletProps,
} from "rujira.ui";
import "rujira.ui/scss/index.scss";

import { Link } from "../../Gate";
import { PortfolioFragment$key } from "../../portfolio/__generated__/PortfolioFragment.graphql";
import { PortfolioFragment } from "../../portfolio/Portfolio";
import { totalValue } from "../../portfolio/utils";
import { usePreloadedAccountData } from "../../services/accountData";
import { useAccounts } from "../../services/accounts";
import { usePreloadedPendingDeposits } from "../../services/deposits";
import { usePreloadedBalanceData } from "./Balance";
import { Deposit } from "./Deposit";
import { BannerContent, shouldShowBanner } from "../Banner";

export const WALLETS: WalletProps[] = [
  /* {
    key: "ctrl",
    label: "Ctrl",
    provider: "Ctrl",
    icon: <WalletIcons.Ctrl className="color-white" />,
    url: "https://ctrl.xyz/download/",
  }, */
  {
    key: "brave",
    label: "Brave",
    provider: "Brave",
    icon: <WalletIcons.Brave />,
    url: "https://brave.com/wallet/",
  },
  {
    key: "coinbase",
    label: "Coinbase",
    provider: "Coinbase",
    icon: <WalletIcons.Coinbase />,
    url: "https://www.coinbase.com/en-gb/wallet",
  },
  {
    key: "daodao",
    label: "DaoDao",
    provider: "DaoDao",
    icon: <WalletIcons.Daodao className="color-white" />,
  },
  {
    key: "keplr",
    label: "Keplr",
    provider: "Keplr",
    icon: <WalletIcons.Keplr />,
    url: "https://www.keplr.app/",
  },
  // {
  //   key: "ledger",
  //   label: "Ledger",
  //   provider: "Ledger",
  //   icon: <WalletIcons.Vultisig />,
  // },
  {
    key: "metamask",
    label: "Metamask",
    provider: "Metamask",
    icon: <WalletIcons.MetaMask />,
    url: "https://metamask.io/",
  },

  {
    key: "rabby",
    label: "Rabby",
    provider: "Rabby",
    icon: <WalletIcons.Rabby />,
    url: "https://rabby.io/",
  },

  {
    key: "okx",
    label: "OKX",
    provider: "Okx",
    icon: <WalletIcons.OKX className="color-white" />,
    url: "https://web3.okx.com",
  },
  // {
  //   key: "tronlink",
  //   label: "TronLink",
  //   provider: "Tronlink",
  //   icon: <WalletIcons.Tronlink />,
  //   url: "https://www.tronlink.org",
  // },
  {
    key: "trust-extenion",
    label: "Trust Extension",
    provider: "Trust",
    icon: <WalletIcons.Trust />,
    url: "https://trustwallet.com/browser-extension",
  },

  {
    key: "vultisig",
    label: "Vultisig",
    provider: "Vulticonnect",
    icon: <WalletIcons.Vultisig />,
    url: "https://vultisig.com",
  },
  // {
  //   key: "xaman",
  //   label: "Xaman",
  //   provider: "Xaman",
  //   icon: <WalletIcons.Xaman />,
  //   url: "https://xaman.app",
  // },
];

export const Header: FC = () => {
  return (
    <Suspense fallback={<HeaderLoading />}>
      <HeaderContent />
    </Suspense>
  );
};
export const HeaderContent: FC = () => {
  const { accountData, isLoading } = usePreloadedAccountData();
  const balances = usePreloadedBalanceData();
  const account = useFragment<PortfolioFragment$key>(
    PortfolioFragment,
    accountData
  );
  const { showModal, hideModal } = useGlobalModalContext();
  const [deposits, , clearDeposit, clearAllDeposits] =
    usePreloadedPendingDeposits();
  const getValue = (): bigint =>
    account && balances?.ok
      ? totalValue(account, balances.value.edges) * 10000n
      : 0n;

  const accountProvider = useAccounts();
  const deposit = () => {
    showModal({
      title: ``,
      className: "modal--large",
      backgroundClose: false,
      children: <Deposit />,
    });
  };

  useEffect(() => {
    if (shouldShowBanner()) {
      showModal({
        title: ``,
        className: "modal--small",
        backgroundClose: true,
        children: <BannerContent close={hideModal} />,
      });
    }
  }, []);

  const routes = import.meta.env.VITE_STATIC;
  const STATIC: string[] = routes ? routes.split(",") : [];

  return (
    <BaseHeader
      accountProvider={{ ...accountProvider, isLoading }}
      routingElement={Link}
      ProviderIcon={ProviderIcon}
      wallets={WALLETS}
      onDeposit={deposit}
      deposits={{
        deposits,
        dismissDeposit: clearDeposit,
        clearAll: clearAllDeposits,
      }}
      getAccountValue={getValue}
      staticRoutes={STATIC}
    />
  );
};

const HeaderLoading: FC = () => {
  const { showModal } = useGlobalModalContext();
  const [deposits, , clearDeposit, clearAllDeposits] =
    usePreloadedPendingDeposits();

  const accountProvider = useAccounts();
  const routes = import.meta.env.VITE_STATIC;
  const STATIC: string[] = routes ? routes.split(",") : [];
  const deposit = () => {
    showModal({
      title: ``,
      className: "modal--large",
      backgroundClose: false,
      children: <Deposit />,
    });
  };

  return (
    <BaseHeader
      accountProvider={{ ...accountProvider, isLoading: true }}
      routingElement={Link}
      ProviderIcon={ProviderIcon}
      wallets={WALLETS}
      onDeposit={deposit}
      deposits={{
        deposits,
        dismissDeposit: clearDeposit,
        clearAll: clearAllDeposits,
      }}
      getAccountValue={() => 0n}
      staticRoutes={STATIC}
    />
  );
};
