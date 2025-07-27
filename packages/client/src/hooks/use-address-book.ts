import type { ChainId } from "@template/domain/src/chains";
import { useEffect } from "react";
import { create } from "zustand";
import { useWallets } from "./use-wallets";

type AddressBookEntry = {
  chainId: ChainId;
  address: string;
  label: string;
};

type AddressBook = Record<ChainId, Record<string, AddressBookEntry>>;

interface AddressBookState {
  addressBook: AddressBook;
  addEntry: (entry: AddressBookEntry) => void;
  loadFromStorage: () => void;
}

const ADDRESS_BOOK_KEY = "address-book";

const addressBookStore = create<AddressBookState>((set) => ({
  addressBook: {},
  addEntry: (entry) =>
    set((state) => {
      const updated = {
        ...state.addressBook,
        [entry.chainId]: { ...state.addressBook[entry.chainId], [entry.address]: entry },
      };
      localStorage.setItem(ADDRESS_BOOK_KEY, JSON.stringify(updated));
      return { addressBook: updated };
    }),
  loadFromStorage: () => {
    const stored = localStorage.getItem(ADDRESS_BOOK_KEY);
    if (stored) {
      set({ addressBook: JSON.parse(stored) });
    }
  },
}));

export function useAddressBook() {
  const { wallets } = useWallets();
  const addEntry = addressBookStore((s) => s.addEntry);
  const loadFromStorage = addressBookStore((s) => s.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    wallets.forEach((wallet) => {
      if (wallet.connection.status === "connected" && typeof wallet.connection.chain !== "string") {
        addEntry({
          chainId: wallet.connection.chain.id,
          address: wallet.connection.address,
          label: wallet.connection.label,
        });
      }
    });
  }, [wallets, addEntry]);

  const addressBook = addressBookStore((s) => s.addressBook);
  return { addressBook };
}
