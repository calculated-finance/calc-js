import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import { Address, isThor, Signer } from "rujira.js";
import { AccountProvider, Provider, wallets } from "rujira.ui";
const {
  addProviderKey,
  clearProviderKeys,
  clearSelected,
  loadProviderKeys,
  loadSelected,
  removeProviderKey,
  saveSelected,
} = wallets;

const ERROR = () => {
  throw new Error("AccountProvider Context not defined");
};

const Context = createContext<AccountProvider>({
  accounts: undefined,
  signer: ERROR,
  select: ERROR,
  connect: ERROR,
  disconnect: ERROR,
  disconnectAll: ERROR,
  isAvailable: ERROR,
});

// Currently we only support 1-1 relationship between providers and connected account(s)
// If for example a user has multiple accounts connected on a Metamask wallet, the context
// will provide just the one that is currently selected
// This is relatively easily extended to allow a user to connect to a provider multiple
// times, registering each account/address and allowing the UI to visually represent
// (or auto-fix) a mis-match between UI-selected account and provider-selected account
const storedSelected = loadSelected();
// These are the providers that have been previously connected, and so we should attempt to re-connect
// on a page refresh, where possible without triggering annoying modal prompts from the wallets
// If a connection is refused, it should be removed from the list of stored providers
const connectedProviders: Provider.Key[] = loadProviderKeys();

type State = Partial<Record<Provider.Key, Address[]>>;

const insertResult = (
  agg: State,
  v: PromiseSettledResult<{ p: Provider.Key; x: Address[] }>
): State => {
  return v.status === "fulfilled"
    ? {
        ...agg,
        [v.value.p]: v.value.x,
      }
    : agg;
};

export const AccountsContext: FC<PropsWithChildren> = ({ children }) => {
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>(
    storedSelected?.address
  );

  const [addresses, setAddresses] = useState<State>({});

  useEffect(() => {
    Promise.allSettled(
      connectedProviders.map((p) => {
        return Provider.signer(p)
          .connect()
          .then((x) => ({ p, x }))
          .catch((err) => {
            // Don't keep trying
            removeProviderKey(p);
            throw err;
          });
      })
    ).then((x) => setAddresses(x.reduce(insertResult, {})));
  }, []);

  useEffect(() => {
    Object.keys(addresses).forEach((x) => {
      const provider = x as Provider.Key;
      const signer = Provider.signer(provider);
      signer.onChange?.(() => {
        signer.connect().then((addresses) => {
          const thorAccount = addresses.find(isThor);
          if (thorAccount) select({ address: thorAccount, provider });
          return setAddresses((prev) => ({ ...prev, [x]: addresses }));
        });
      });
    });
  }, [addresses]);

  const connect = async (key: Provider.Key) => {
    try {
      const signer = Provider.signer(key);
      const addresses = await signer.connect();
      addProviderKey(key);
      const thorAccount = addresses.find(isThor);
      if (!selectedAddress && thorAccount)
        select({ address: thorAccount, provider: key });
      setAddresses((prev) => ({ ...prev, [key]: addresses }));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const select = (
    account?: { address: Address; provider: Provider.Key } | null
  ) => {
    if (!account) {
      clearSelected();
      setSelectedAddress(undefined);
      return;
    }

    saveSelected(account.address.address);
    setSelectedAddress(account.address.address);
  };

  const disconnect = (p: Provider.Key) => {
    Provider.signer(p).disconnect?.();
    removeProviderKey(p);
    setAddresses(({ [p]: _, ...rest }) => rest);
  };

  const disconnectAll = () => {
    Object.keys(addresses).map((a) =>
      Provider.signer(a as Provider.Key).disconnect?.()
    );
    clearProviderKeys();
    clearSelected();
    setAddresses({});
  };

  const selected = useMemo(() => {
    return Object.entries(addresses).find((a) =>
      a[1].find((x) => x.address === selectedAddress)
    );
  }, [selectedAddress, addresses]);

  const signer = (address: string): Signer => {
    const provider = Object.entries(addresses).find(
      ([_, addrs]) => !!addrs.find((a) => a.address === address)
    )?.[0];
    if (!provider) throw new Error(`No Signer found for ${address}`);
    return Provider.signer(provider as Provider.Key);
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

  const selectedAccount = selected?.[1].find(
    (a) => a.address === selectedAddress
  );

  const value: AccountProvider = {
    accounts: [...accounts],
    selected:
      selectedAddress && selected && selectedAccount
        ? {
            address: selectedAccount,
            provider: selected[0] as Provider.Key,
          }
        : undefined,
    select,
    connect,
    disconnect,
    disconnectAll,
    isAvailable: (p: Provider.Key) => Provider.signer(p).isAvailable(),
    signer,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useAccounts = (): AccountProvider => useContext(Context);
