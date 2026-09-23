import { useTranslation, Icons, WalletIcons } from "rujira.ui";

interface WalletData {
  icon: React.ReactNode;
  descKey: string;
  links: { href: string; icon: React.ReactNode }[];
}

export const Wallets = () => {
  const { t } = useTranslation("ecosystem");

  const wallets: WalletData[] = [
    {
      icon: <WalletIcons.VultisigText />,
      descKey: "vultisigDesc",
      links: [
        { href: "https://vultisig.com", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/vultisig", icon: <Icons.X /> },
        { href: "https://github.com/Vultisig/", icon: <Icons.GitHub /> },
        { href: "https://discord.gg/54wEtGYxuv", icon: <Icons.Discord /> },
        { href: "https://t.me/vultisig", icon: <Icons.Telegram /> },
      ],
    },
    {
      icon: <WalletIcons.KeplrText />,
      descKey: "keplrDesc",
      links: [
        { href: "https://www.keplr.app/", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/keplrwallet", icon: <Icons.X /> },
      ],
    },
    {
      icon: <WalletIcons.BraveText />,
      descKey: "braveDesc",
      links: [{ href: "https://brave.com/wallet/", icon: <Icons.LinkAngle /> }],
    },
    {
      icon: <WalletIcons.CoinbaseText />,
      descKey: "coinbaseDesc",
      links: [
        {
          href: "https://www.coinbase.com/en-gb/wallet",
          icon: <Icons.LinkAngle />,
        },
        { href: "https://x.com/coinbaseuk", icon: <Icons.X /> },
      ],
    },
    /* {
      icon: <WalletIcons.CtrlText />,
      descKey: "ctrlDesc",
      links: [
        { href: "https://ctrl.xyz/", icon: <Icons.LinkAngle /> },
        { href: "https://x.com/ctrl_wallet", icon: <Icons.X /> },
        { href: "https://t.me/ctrl_wallet", icon: <Icons.Telegram /> },
        { href: "https://discord.gg/ctrlwallet", icon: <Icons.Discord /> },
      ],
    }, */
    {
      icon: <WalletIcons.LeapText />,
      descKey: "leapDesc",
      links: [
        { href: "https://www.leapwallet.io/", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/leap_wallet", icon: <Icons.X /> },
        { href: "https://t.me/ctrl_wallet", icon: <Icons.Telegram /> },
        { href: "https://discord.gg/ctrlwallet", icon: <Icons.Discord /> },
      ],
    },
    {
      icon: <WalletIcons.MetaMaskText />,
      descKey: "metamaskDesc",
      links: [
        { href: "https://metamask.io/", icon: <Icons.LinkAngle /> },
        {
          href: "https://github.com/MetaMask/metamask-extension/",
          icon: <Icons.GitHub />,
        },
      ],
    },
    {
      icon: <WalletIcons.OKXText />,
      descKey: "okxDesc",
      links: [
        {
          href: "https://chromewebstore.google.com/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge",
          icon: <Icons.LinkAngle />,
        },
      ],
    },
    {
      icon: <WalletIcons.RabbyText />,
      descKey: "rabbyDesc",
      links: [
        { href: "https://rabby.io/", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/Rabby_io", icon: <Icons.X /> },
        { href: "https://github.com/RabbyHub/Rabby", icon: <Icons.GitHub /> },
        { href: "https://discord.gg/seFBCWmUre", icon: <Icons.Discord /> },
      ],
    },
    {
      icon: <WalletIcons.TonKeeperText />,
      descKey: "tonkeeperDesc",
      links: [
        { href: "https://tonkeeper.com", icon: <Icons.LinkAngle /> },
        { href: "https://twitter.com/tonkeeper", icon: <Icons.X /> },
        { href: "https://discord.gg/DyQERhN7qV", icon: <Icons.Discord /> },
        { href: "https://github.com/tonkeeper", icon: <Icons.GitHub /> },
      ],
    },
    {
      icon: <WalletIcons.TrustText />,
      descKey: "trustDesc",
      links: [
        {
          href: "https://trustwallet.com/browser-extension",
          icon: <Icons.LinkAngle />,
        },
      ],
    },
    {
      icon: <WalletIcons.XamanText />,
      descKey: "xamanDesc",
      links: [
        { href: "https://xaman.app", icon: <Icons.LinkAngle /> },
        { href: "https://x.com/xamanwallet", icon: <Icons.X /> },
      ],
    },
  ];

  return (
    <div className="row wrap pad">
      {wallets.map((wallet, i) => (
        <div className="col-12 col-sm-6 col-lg-4 mt-4" key={`wallet_${i}`}>
          <div className="ecosystem">
            {wallet.icon}
            <p>{t(wallet.descKey)}</p>
            <div>
              {wallet.links.map((link, j) => (
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
