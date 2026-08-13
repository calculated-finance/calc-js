import { Address, isThor } from "rujira.js";

type AccountAddress = { address: Address };

const uniqueSorted = (addresses: string[]): string[] =>
  [...new Set(addresses)].sort();

export const toBalanceAddress = (address: Address): string => {
  if (isThor(address)) return address.address;
  if (address.networks.length === 1) {
    return `${address.networks[0].toLowerCase()}:${address.address}`;
  }
  // Multi-network addresses are left unprefixed so the API can fan out by address format.
  return address.address;
};

export const balanceQueryAddresses = (
  accounts: AccountAddress[] | undefined | null
): string[] =>
  uniqueSorted(
    accounts
      ?.map(({ address }) => address)
      .filter((address) => !isThor(address))
      .map(toBalanceAddress) ?? []
  );

export const balanceSubscriptionAddresses = (
  accounts: AccountAddress[] | undefined | null,
  selected: AccountAddress | undefined
): string[] => {
  const selectedAddress = selected?.address.address;
  return uniqueSorted(
    accounts
      ?.map(({ address }) => address)
      .filter(
        (address) => !isThor(address) || address.address === selectedAddress
      )
      .map(toBalanceAddress) ?? []
  );
};
