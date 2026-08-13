import clsx from "clsx";
import { FC } from "react";
import { Provider } from "../../wallets";
import * as WalletIcons from "./Wallets";

export const ProviderIcon: FC<{
  provider: Provider.Key;
  selected: boolean;
  className?: string;
}> = ({ provider, selected, className }) => {
  switch (provider) {
    case "Keplr":
      return selected ? (
        <WalletIcons.Keplr className={clsx({ [`${className}`]: className })} />
      ) : (
        <WalletIcons.KeplrSimple
          className={clsx({ [`${className}`]: className })}
        />
      );
    case "Leap":
      return selected ? (
        <WalletIcons.Leap className={clsx({ [`${className}`]: className })} />
      ) : (
        <WalletIcons.LeapSimple
          className={clsx({ [`${className}`]: className })}
        />
      );
    case "Ledger":
      return (
        <WalletIcons.Ledger
          className={clsx({
            [`${className}`]: className,
            "color-white": selected,
          })}
        />
      );
    case "Metamask":
      return selected ? (
        <WalletIcons.MetaMask
          className={clsx({ [`${className}`]: className })}
        />
      ) : (
        <WalletIcons.MetaMaskSimple
          className={clsx({ [`${className}`]: className })}
        />
      );
    case "Rabby":
      return selected ? (
        <WalletIcons.Rabby className={clsx({ [`${className}`]: className })} />
      ) : (
        <WalletIcons.RabbySimple
          className={clsx({ [`${className}`]: className })}
        />
      );
    case "Station":
      return (
        <WalletIcons.StationSimple
          className={clsx({ [`${className}`]: className })}
          gradient={selected}
        />
      );
    case "Vulticonnect":
    case "Vultisig":
      return selected ? (
        <WalletIcons.Vultisig
          className={clsx({ [`${className}`]: className })}
        />
      ) : (
        <WalletIcons.VultisigSimple
          className={clsx({ [`${className}`]: className })}
        />
      );
    case "DaoDao":
      return (
        <WalletIcons.Daodao
          className={clsx({
            [`${className}`]: className,
            "color-white": selected,
          })}
        />
      );
    case "Coinbase":
      return selected ? (
        <WalletIcons.Coinbase
          className={clsx({ [`${className}`]: className })}
        />
      ) : (
        <WalletIcons.CoinbaseSimple
          className={clsx({ [`${className}`]: className })}
        />
      );
    case "Brave":
      return selected ? (
        <WalletIcons.Brave className={clsx({ [`${className}`]: className })} />
      ) : (
        <WalletIcons.BraveSimple
          className={clsx({ [`${className}`]: className })}
        />
      );
    case "Okx":
      return (
        <WalletIcons.OKX
          className={clsx({
            [`${className}`]: className,
            "color-white": selected,
          })}
        />
      );
    case "Trust":
      return selected ? (
        <WalletIcons.Trust className={clsx({ [`${className}`]: className })} />
      ) : (
        <WalletIcons.TrustSimple
          className={clsx({ [`${className}`]: className })}
        />
      );
    case "Tronlink":
      return selected ? (
        <WalletIcons.Tronlink
          className={clsx({ [`${className}`]: className })}
        />
      ) : (
        <WalletIcons.TronlinkSimple
          className={clsx({ [`${className}`]: className })}
        />
      );
    case "Xaman":
      return selected ? (
        <WalletIcons.Xaman className={clsx({ [`${className}`]: className })} />
      ) : (
        <WalletIcons.XamanSimple
          className={clsx({ [`${className}`]: className })}
        />
      );
  }
};
