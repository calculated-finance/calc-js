import { Icons, useTranslation, WalletIcons } from "rujira.ui";
import { useAccounts } from "../../services/accounts";
import {
  WalletConnected,
  WalletOption,
  WalletOptionType,
} from "./WalletOption";
const { Discord, GitHub, Href, Telegram, X } = Icons;

import { Link } from "react-router-dom";
import { VultisigManager } from "../../common/Vultisig";
import { NoIndexHelmet } from "../../seo";

const Meta = () => {
  return (
    <NoIndexHelmet>
      <title>Manage Connections</title>
      <meta
        name="description"
        content="Use the assets and wallets you already own, wherever they are. Rujira connects every chain and wallet into one seamless experience, so you can trade, earn, and move freely without the confusion."
      />
      <meta
        name="og:description"
        content="Use the assets and wallets you already own, wherever they are. Rujira connects every chain and wallet into one seamless experience, so you can trade, earn, and move freely without the confusion."
      />
      <meta
        name="twitter:description"
        content="Use the assets and wallets you already own, wherever they are. Rujira connects every chain and wallet into one seamless experience, so you can trade, earn, and move freely without the confusion."
      />
    </NoIndexHelmet>
  );
};

type ConnectWalletOption = Omit<WalletOptionType, "description"> & {
  descriptionKey: string;
};

const options: ConnectWalletOption[] = [
  {
    descriptionKey: "connectDescriptionVultisig",
    links: [
      { url: "https://vultisig.com", icon: <Href /> },
      { url: "https://twitter.com/vultisig", icon: <X /> },
      { url: "https://github.com/Vultisig/", icon: <GitHub /> },
      { url: "https://discord.gg/54wEtGYxuv", icon: <Discord /> },
      { url: "https://t.me/vultisig", icon: <Telegram /> },
    ],
    logo: <WalletIcons.VultisigText />,
    provider: "Vulticonnect",
  },
  {
    descriptionKey: "connectDescriptionKeplr",
    links: [
      {
        url: "https://www.keplr.app/",
        icon: <Href />,
      },
      {
        url: "https://twitter.com/keplrwallet",
        icon: <X />,
      },
    ],
    logo: <WalletIcons.KeplrText />,
    provider: "Keplr",
  },
  {
    descriptionKey: "connectDescriptionBrave",
    links: [
      {
        url: "https://brave.com/wallet/",
        icon: <Href />,
      },
    ],
    logo: <WalletIcons.BraveText />,
    provider: "Brave",
  },
  /* {
    descriptionKey: "connectDescriptionCtrl",
    links: [
      {
        url: "https://ctrl.xyz/",
        icon: <Href />,
      },
      {
        url: "https://x.com/ctrl_wallet",
        icon: <X />,
      },
      {
        url: "https://discord.gg/ctrlwallet",
        icon: <Discord />,
      },
      {
        url: "https://t.me/ctrl_wallet",
        icon: <Telegram />,
      },
    ],
    logo: <WalletIcons.CtrlText />,
    provider: "Ctrl",
  }, */
  {
    descriptionKey: "connectDescriptionCoinbase",
    links: [
      {
        url: "https://www.coinbase.com/en-gb/wallet",
        icon: <Href />,
      },
      {
        url: "https://x.com/coinbaseuk",
        icon: <X />,
      },
    ],
    logo: <WalletIcons.CoinbaseText />,
    provider: "Coinbase",
  },
  {
    descriptionKey: "connectDescriptionMetamask",
    links: [
      {
        url: "https://metamask.io/",
        icon: <Href />,
      },
      {
        url: "https://github.com/MetaMask/metamask-extension/",
        icon: <GitHub />,
      },
    ],
    logo: <WalletIcons.MetaMaskText />,
    provider: "Metamask",
  },
  {
    descriptionKey: "connectDescriptionOkx",
    links: [
      {
        url: "https://chromewebstore.google.com/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge",
        icon: <Href />,
      },
    ],
    logo: <WalletIcons.OKXText />,
    provider: "Okx",
  },
  {
    descriptionKey: "connectDescriptionRabby",
    links: [
      {
        url: "https://rabby.io/",
        icon: <Href />,
      },
      {
        url: "https://twitter.com/Rabby_io",
        icon: <X />,
      },
      {
        url: "https://github.com/RabbyHub/Rabby",
        icon: <GitHub />,
      },
      {
        url: "https://discord.gg/seFBCWmUre",
        icon: <Discord />,
      },
    ],
    logo: <WalletIcons.RabbyText />,
    provider: "Rabby",
  },
  {
    descriptionKey: "connectDescriptionTonkeeper",
    links: [
      {
        url: "https://tonkeeper.com/",
        icon: <Href />,
      },
      {
        url: "https://twitter.com/tonkeeper",
        icon: <X />,
      },
      {
        url: "https://github.com/tonkeeper",
        icon: <GitHub />,
      },
      {
        url: "https://discord.gg/DyQERhN7qV",
        icon: <Discord />,
      },
    ],
    logo: <WalletIcons.TonKeeperText />,
    provider: "Ton",
  },
  {
    descriptionKey: "connectDescriptionTronlink",
    links: [
      {
        url: "https://www.tronlink.org/",
        icon: <Href />,
      },
      {
        url: "https://twitter.com/TronLinkWallet",
        icon: <X />,
      },
      {
        url: "https://t.me/TronLink",
        icon: <Telegram />,
      },
    ],
    logo: <WalletIcons.TronlinkText />,
    provider: "Tronlink",
  },
  {
    descriptionKey: "connectDescriptionTrust",
    links: [
      {
        url: "https://trustwallet.com/browser-extension",
        icon: <Href />,
      },
    ],
    logo: <WalletIcons.TrustText />,
    provider: "Trust",
  },
  {
    descriptionKey: "connectDescriptionXaman",
    links: [
      {
        url: "https://xaman.app",
        icon: <Href />,
      },
      {
        url: "https://x.com/xamanwallet",
        icon: <X />,
      },
    ],
    logo: <WalletIcons.XamanText />,
    provider: "Xaman",
  },
];

export const Connect = () => {
  const { t } = useTranslation("portfolio");
  const { accounts, isAvailable } = useAccounts();

  const thorProviders = ["Keplr", "Vulticonnect"];

  const supportsThor = (provider?: string) =>
    provider ? thorProviders.includes(provider) : false;

  const connected = options.filter(
    (o) => !!accounts?.find((a) => a.provider === o.provider)
  );

  const supported = options
    .filter(
      (o) =>
        o.provider /* && isAvaialable(o.provider) */ && supportsThor(o.provider)
    )
    .sort((a, b) => {
      const aInstalled = a.provider && isAvailable(a.provider);
      const bInstalled = b.provider && isAvailable(b.provider);

      // Installed wallets come first
      if (aInstalled && !bInstalled) return -1;
      if (!aInstalled && bInstalled) return 1;
      return 0;
    });

  /* const uninstalledThor = options.filter(
    (o) => o.provider && !isAvaialable(o.provider) && supportsThor(o.provider)
  ); */

  const others = options
    .filter((o) => o.provider && !supportsThor(o.provider))
    .sort((a, b) => {
      const aInstalled = a.provider && isAvailable(a.provider);
      const bInstalled = b.provider && isAvailable(b.provider);

      // Installed wallets come first
      if (aInstalled && !bInstalled) return -1;
      if (!aInstalled && bInstalled) return 1;
      return 0;
    });

  return (
    <>
      <Meta />
      <div className="rujira__main rujira__main--gradient">
        <div className="connect rujira__inner--pad">
          <div className="connect__header">
            <h1 className="h1">Manage Wallet Connections</h1>
            <h2 className="fs-20 lh-28 fw-400 color-grey">
              Use the assets and wallets you already own, wherever they are.
              Rujira connects every chain and wallet into one seamless
              experience, so you can trade, earn, and move freely without the
              confusion.
            </h2>
          </div>
          <div className="connect__container">
            <div className="connect__main">
              <h3 className="fs-26 fw-400">Rujira Wallets</h3>
              <p className="p color-grey mb-1">
                Connect at least one wallet that supports Rujira to take full
                use of what Rujira offers.
              </p>
              <p className="inline-block p-1.5 br-1 bg-grey-2 color-grey fw-500 fs-14">
                By connecting a wallet, you agree to Rujira's{" "}
                <Link to="/tou" className="color-grey hover-white">
                  Terms of Use
                </Link>
                .
              </p>
              <div className="row wrap pad gap-y-4 mt-4">
                {/* <VultisigOption /> */}
                {supported.map((x) => (
                  <WalletOption
                    key={x.provider || x.descriptionKey}
                    {...x}
                    description={t(x.descriptionKey)}
                  />
                ))}
              </div>

              {/* uninstalledThor.length > 0 && (
                <>
                  <h3 className="fs-26 fw-400 mt-8">
                    More Options to Connect
                  </h3>
                  <p className="p color-grey">These wallets support Rujira.</p>
                  <div className="row wrap pad gap-y-4 mt-4">
                    {uninstalledThor.map((x) => (
                      <WalletOption
                        key={x.provider || x.descriptionKey}
                        {...x}
                        description={t(x.descriptionKey)}
                      />
                    ))}
                  </div>
                </>
              ) */}

              {others.length > 0 && (
                <>
                  <h3 className="fs-26 fw-400 mt-8">Other Wallets</h3>
                  <p className="p color-grey">
                    Wallets that don't yet support Rujira but can be connected
                    to deposit, withdraw and swap cross chain.
                  </p>
                  <div className="row wrap pad gap-y-4 mt-4">
                    {others.map((x) => (
                      <WalletOption
                        key={x.provider || x.descriptionKey}
                        {...x}
                        description={t(x.descriptionKey)}
                        limited={true}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="connect__connected">
              <h3 className="fs-26 fw-400">Active Connections</h3>
              <div className="row wrap pad gap-y-2 mt-4">
                <VultisigManager />
                {connected.map((x) => (
                  <WalletConnected
                    key={x.provider || x.descriptionKey}
                    {...x}
                    description={t(x.descriptionKey)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
