import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { Address } from "rujira.js";
import { AccountProvider, Provider, WalletIcons, WalletProps } from "rujira.ui";

const ERROR = () => {
  throw new Error("AccountProvider Context not defined");
};

const Context = createContext<AccountProvider>({
  accounts: [],
  select: ERROR,
  connect: ERROR,
  disconnect: ERROR,
  disconnectAll: ERROR,
  isAvailable: ERROR,
  signer: ERROR,
});
type State = Partial<Record<Provider.Key, Address[]>>;

const MOCK_ADDRESSES: Address[] = [
  {
    networks: ["BTC"],
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  },
  {
    networks: ["GAIA"],
    address: "cosmos1m4pprm4emhdf7z2dcd4klw2kzwfne55wdp5frq",
  },
  {
    networks: ["ETH"],
    address: "0x73f7b1184B5cD361cC0f7654998953E2a251dd58",
  },
  {
    networks: ["THOR"],
    address: "thor1kp68vjldscfw5ke6gktyaufkvq8gzh2kyfyuyn",
  },
];

export const AccountsContext: FC<PropsWithChildren> = ({ children }) => {
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>();
  const [addresses, setAddresses] = useState<State>({});

  const selected = useMemo(() => {
    return Object.entries(addresses).find((a) =>
      a[1].find((x) => x.address === selectedAddress)
    );
  }, [selectedAddress, addresses]);

  const connect = async (provider: Provider.Key) => {
    setAddresses({
      [provider]: MOCK_ADDRESSES,
    });
    select({
      address: MOCK_ADDRESSES[3],
      provider,
    });
  };

  const select = (
    account?: { address: Address; provider: Provider.Key } | null
  ) => {
    if (!account) {
      setSelectedAddress(undefined);
      return;
    }

    setSelectedAddress(account.address.address);
  };

  const disconnect = (p: Provider.Key) => {
    setAddresses(({ [p]: _, ...rest }) => rest);
  };

  const disconnectAll = () => {
    setAddresses({});
  };
  const isAvailable = (p: Provider.Key) => {
    return [
      "Keplr",
      "Leap",
      "Metamask",
      "Sonar",
      "Station",
      "Vultisig",
    ].includes(p);
  };

  const accounts = new Set(
    Object.entries(addresses).reduce(
      (a: { address: Address; provider: Provider.Key }[], [provider, v]) => [
        ...a,
        ...v.map((address) => ({
          address,
          provider: provider as Provider.Key,
        })),
      ],
      []
    )
  );

  const value: AccountProvider = {
    accounts: [...accounts],
    selected:
      selectedAddress && selected
        ? {
            address: selected[1].find((a) => a.address === selectedAddress)!,
            provider: selected[0] as Provider.Key,
          }
        : undefined,
    select,
    connect,
    disconnect,
    disconnectAll,
    isAvailable,
    signer: ERROR,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useAccounts = (): AccountProvider => useContext(Context);

export const WALLETS: WalletProps[] = [
  {
    key: "station",
    label: "Station",
    provider: "Station",
    icon: <WalletIcons.StationText />,
  },
  {
    key: "vultisig",
    label: "Vultisig",
    provider: "Vultisig",
    icon: <WalletIcons.Vultisig />,
  },

  {
    key: "keplr",
    label: "Keplr",
    provider: "Keplr",
    icon: <WalletIcons.Keplr />,
  },

  {
    key: "leap",
    label: "Leap",
    provider: "Leap",
    icon: <WalletIcons.Leap />,
  },

  {
    key: "ctrl",
    label: "Ctrl",
    url: "https://ctrl.xyz/download/",
    icon: <WalletIcons.Ctrl className="color-white" />,
  },

  {
    key: "metamask",
    label: "Metamask",
    provider: "Metamask",
    icon: <WalletIcons.MetaMask />,
  },
];

export const ProviderIcon: FC<{
  provider: Provider.Key;
  selected: boolean;
}> = ({ provider, selected }) => {
  switch (provider) {
    case "Keplr":
      return selected ? (
        <WalletIcons.Keplr className="address__wallet" />
      ) : (
        <WalletIcons.KeplrSimple className="address__wallet" />
      );
    case "Leap":
      return selected ? (
        <WalletIcons.Leap className="address__wallet" />
      ) : (
        <WalletIcons.LeapSimple className="address__wallet" />
      );
    case "Metamask":
      return selected ? (
        <WalletIcons.MetaMask className="address__wallet" />
      ) : (
        <WalletIcons.MetaMaskSimple className="address__wallet" />
      );
    case "Station":
      return (
        <WalletIcons.StationSimple
          className="address__wallet"
          gradient={selected}
        />
      );
    case "Vultisig":
    case "Vulticonnect":
      return selected ? (
        <WalletIcons.Vultisig className="address__wallet" />
      ) : (
        <WalletIcons.VultisigSimple className="address__wallet" />
      );
  }
};
