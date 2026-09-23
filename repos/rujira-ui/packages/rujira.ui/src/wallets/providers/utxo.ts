import { Psbt, Transaction } from "bitcoinjs-lib";
import {
  BCH,
  BTC,
  DOGE,
  LTC,
  Msg,
  Network,
  Simulation,
  TxResult,
  gasToken,
  signers,
} from "rujira.js";

type Deposit = Exclude<TxResult["deposited"], null>;
type PsbtSigner = (psbt: Psbt) => Promise<Psbt>;

export interface UtxoSignerContext {
  fetchUtxos(): Promise<signers.utxo.Utxo[]>;
  sign(psbt: Psbt): Promise<Psbt>;
  broadcast(
    address: string,
    tx: Transaction,
    deposit?: Deposit
  ): Promise<TxResult>;
}

export class UtxoContext {
  private endpoints = [
    "https://mempool.space/api/address",
    "https://blockstream.info/api/address",
  ];
  constructor(
    private address: string,
    private signer?: PsbtSigner
  ) {}

  public async fetchUtxos(): Promise<signers.utxo.Utxo[]> {
    return Promise.race(this.endpoints.map((x) => this.fetch(x)));
  }

  public async fetch(endpoint: string): Promise<signers.utxo.Utxo[]> {
    const res = await fetch(`${endpoint}/${this.address}/utxo`);
    const json: {
      txid: string;
      vout: number;
      status: {
        confirmed: boolean;
        block_height: number;
        block_hash: string;
        block_time: number;
      };
      value: number;
    }[] = await res.json();
    return json.map((x) => ({
      index: x.vout,
      hash: x.txid,
      value: BigInt(x.value),
    }));
  }

  public async broadcast(
    address: string,
    tx: Transaction,
    deposit?: Deposit
  ): Promise<TxResult> {
    const res = await fetch("https://mempool.space/api/tx", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: tx.toHex(),
    });
    switch (res.status) {
      case 200:
        const txHash = await res.text();

        return {
          network: BTC,
          address,
          txHash,
          deposited: deposit || null,
        };

      default:
        const body = await res.text();

        throw new Error(
          JSON.parse(body.replace("sendrawtransaction RPC error: ", "")).message
        );
    }
  }

  public async sign(psbt: Psbt): Promise<Psbt> {
    if (!this.signer) throw new Error("No UTXO signer configured");
    return this.signer(psbt);
  }
}

export const simulate = async (
  context: Pick<UtxoSignerContext, "fetchUtxos">,
  msg: Msg
): Promise<Simulation> => {
  const utxos = await context.fetchUtxos();
  const { fee } = await msg.toPsbt(utxos);
  return {
    ...gasToken(msg.account.network),
    amount: fee,
    gas: 0n,
  };
};

export const signAndBroadcast = async (
  context: UtxoSignerContext,
  msg: Msg
): Promise<TxResult> => {
  const utxos = await context.fetchUtxos();
  const { psbt } = await msg.toPsbt(utxos);
  const signed = await context.sign(psbt);
  return context.broadcast(
    msg.account.address,
    signed.extractTransaction(),
    msg.toDeposit?.() || undefined
  );
};

/** Fetch UTXOs just for simulating gas requirements. On CTRL only BTC can use signPsbt so we'll just use generic `transfer` for all UTXO networks */
export class UtxoQueryClient {
  private api = "https://gql-router.xdefi.services/graphql";

  constructor(
    private network: Network,
    private address: string
  ) {}
  async fetch(): Promise<signers.utxo.Utxo[]> {
    const query = `query GetUnspentTxOutputsV5($address: String!, $page: Int!) {
      ${utxoNetworkTochain(this.network)} {
        unspentTxOutputsV5(address: $address, page: $page) {
          oIndex
          oTxHash
          value {
            value
          }
          scriptHex
          oTxHex
          isCoinbase
          address
        }
      }
    }`;

    return fetch(this.api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apollographql-client-name": "docs-indexers-api",
        "apollographql-client-version": "v1.0",
      },
      body: JSON.stringify({
        query,
        variables: { address: this.address, page: 0 },
      }),
    })
      .then((response) => response.json())
      .then((result) =>
        result.data[utxoNetworkTochain(this.network)].unspentTxOutputsV5.map(
          (x: {
            oIndex: number;
            oTxHash: string;
            value: { value: string };
          }): signers.utxo.Utxo => ({
            value: BigInt(x.value.value),
            index: x.oIndex,
            hash: x.oTxHash,
          })
        )
      );
  }
}

export const utxoNetworkTochain = (network: Network): keyof UtxoNetworks => {
  switch (network) {
    case BTC:
      return "bitcoin";
    case BCH:
      return "bitcoincash";
    case DOGE:
      return "dogecoin";
    case LTC:
      return "litecoin";
    default:
      throw new Error(`Unsupported UTXO network: ${network}`);
  }
};

export type BitcoinProvider = {
  request: (
    req: { method: string; params: object },
    cb: (error: any, res: any) => void
  ) => void;
};
export interface UtxoNetworks {
  bitcoin: BitcoinProvider;
  bitcoincash: BitcoinProvider;
  dogecoin: BitcoinProvider;
  litecoin: BitcoinProvider;
}
