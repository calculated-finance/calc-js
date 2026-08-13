import { Address } from "./address";
import { Msg } from "./msgs";
import { Network } from "./network";

export interface Simulation {
  symbol: string;
  decimals: number;
  amount: bigint;
  gas: bigint;
}

export type TxResult = {
  network: Network;
  address: string;
  txHash: string;
  deposited: {
    amount: bigint;
    symbol: string;
  } | null;
  label?: string;
};

export interface Signer {
  /**
   * Retrieves the connected wallet addresses from the current provider
   */
  connect(): Promise<Address[]>;
  /**
   * Simulates a Rujira Network Tx for displaying gas fees etc
   * @param account The currently selected account
   * @param tx The Tx to be signed & broadcast
   * @returns Simulated gas amount
   */
  simulate(tx: Msg): Promise<Simulation>;
  /**
   * Signs and broadcasts the tx over the currently selected network.
   * The Rujira Network Tx is converted to a tx suitble for the currently selected network, signed and broacast
   * @param account The currently selected account
   * @param simulation The simulation returned by `simulate`
   * @param tx The Tx to be signed & broadcast
   */
  signAndBroadcast(simulation: Simulation, tx: Msg): Promise<TxResult>;

  /**
   *
   * @param cb Provide a function to be called when an account change is detected in the provider
   */
  onChange?: (cb: () => void) => void;

  isAvailable: () => boolean;

  disconnect?: () => void;

  networks: () => Network[];
}
