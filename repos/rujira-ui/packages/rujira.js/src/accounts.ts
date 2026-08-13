import { Address } from "./address";
import { Asset } from "./asset";
import { Network, THOR } from "./network";
import { Signer } from "./signer";

export interface AccountProvider<P> {
  /** undefined until loaded. null if loaded and not present */
  accounts: { address: Address; provider: P }[] | undefined | null;
  selected?: { address: Address; provider: P };
  signer: (address: string) => Signer;
  select: (account?: { address: Address; provider: P } | null) => void;
  connect: (provider: P) => ConnectionResponse;
  disconnect: (provider: P) => void;
  disconnectAll: () => void;
  isAvailable: (provider: P) => boolean;
  isLoading?: boolean;
}

export const isThor = (a: Address): boolean => a.networks.includes(THOR);

export interface Account {
  address: string;
  network: Network;
}

export interface BalanceAccount {
  address: string;
  balance: bigint;
  asset: Asset;
  valueUsd: bigint;
}

export type Balance = {
  asset: Asset;
  balance: bigint;
  accounts: ReadonlyArray<BalanceAccount>;
  valueUsd: bigint;
};

export type Balances = Balance[];

export type ConnectionResponse = Promise<void>;

export interface InboundAddress {
  address: string;
  dustThreshold: bigint;
  router?: string;
  gasRate: bigint;
}

export namespace Account {
  export const fromAddress = (
    address: Address,
    network: Network = THOR
  ): Account => {
    if (!address.networks.includes(network))
      throw new Error(
        `Invalid network ${network} for address ${address.address}`
      );
    return { address: address.address, network };
  };
}
