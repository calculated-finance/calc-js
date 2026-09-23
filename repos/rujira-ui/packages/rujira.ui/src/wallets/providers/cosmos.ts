import { fromBech32 } from "@cosmjs/encoding";
import { Decimal } from "@cosmjs/math";
import { ChainInfo, Keplr } from "@keplr-wallet/types";
import {
  Account,
  Address,
  GAIA,
  Msg,
  Network,
  Signer,
  Simulation,
  THOR,
  TxResult,
  signers,
} from "rujira.js";

import * as config from "../config";

const clientCache = new Map<string, signers.cosmos.RpcClient>();

export class CosmosAdapter implements Signer {
  constructor(
    private k: () => Keplr | undefined,
    private opts?: { skipSuggest?: boolean }
  ) {}
  onChange?: ((cb: () => void) => void) | undefined;
  isAvailable(): boolean {
    const k = this.k();
    if (!k) return false;
    if ("isOkxWallet" in k) return false;
    return true;
  }

  public async connect(): Promise<Address[]> {
    const k = this.k();
    if (!k) throw new Error(`Keplr unavailable`);

    return Promise.allSettled(
      getConfigs().map(async (chain) => {
        !this.opts?.skipSuggest && (await k.experimentalSuggestChain(chain));
        await k.enable(chain.chainId);
        const signer = await k.getOfflineSignerAuto(chain.chainId);
        const accounts = await signer.getAccounts();
        return accounts.map((a) => ({
          address: a.address,
          networks: [getNetwork(chain)],
        }));
      })
    ).then((res) => {
      return res.reduce(
        (a: Address[], v) =>
          v.status === "fulfilled" ? [...v.value, ...a] : a,
        []
      );
    });
  }

  public async simulate(msg: Msg): Promise<Simulation> {
    const client = await this.buildClient(msg.account);
    return simulate(client, msg);
  }

  public async signAndBroadcast(
    _simulation: Simulation,
    msg: Msg
  ): Promise<TxResult> {
    const client = await this.buildClient(msg.account);
    return signAndBroadcast(client, msg);
  }

  public async buildClient(
    account: Account
  ): Promise<signers.cosmos.CosmosClient> {
    const config = getConfig(fromBech32(account.address).prefix);
    const signer = await this.k()?.getOfflineSignerAuto(config.chainId);
    if (!signer) throw new Error(`No signer available for ${account.address}`);
    return buildClient(config, signers.cosmos.castSigner(signer));
  }

  public networks(): Network[] {
    return [
      GAIA,
      THOR,
    ];
  }
}

export const getGasPrice = (c: ChainInfo): signers.cosmos.GasPrice => ({
  denom: c.feeCurrencies[0].coinDenom,
  amount: Decimal.fromUserInput(
    c.feeCurrencies[0].gasPriceStep?.average.toString() || "0",
    18
  ),
});

export const getNetwork = (c: ChainInfo): Network => {
  switch (c.chainName) {
    case "Cosmos Hub":
      return GAIA;
    case "THORChain":
    case "THORChain Stagenet":
    case "THORChain Devnet":
      return THOR;
    default:
      throw new Error(`No Network for chain ${c.chainName}`);
  }
};

export const getConfigs = (): ChainInfo[] => {
  return config.main;
};

export const getConfig = (prefix: string): ChainInfo => {
  const c = getConfigs().find(
    (a) => a.bech32Config?.bech32PrefixAccAddr === prefix
  );
  if (!c) throw new Error(`Unrecognised Cosmos prefix ${prefix} `);
  return c;
};

export const buildClient = (
  config: ChainInfo,
  signer:
    | signers.cosmos.OfflineAminoSigner
    | signers.cosmos.OfflineDirectSigner,
  options?: signers.cosmos.CosmosClientOptions
): signers.cosmos.CosmosClient => {
  const client =
    clientCache.get(config.chainId) ||
    new signers.cosmos.HttpBatchClient(config.rpc);
  clientCache.set(config.chainId, client);
  const gasPrice = getGasPrice(config);

  return signers.cosmos.CosmosClient.createWithSigner(
    signers.cosmos.Comet38Client.create(client),
    signer,
    {
      gasPrice,
      aminoTypes: new signers.cosmos.AminoTypes({
        ...signers.cosmos.createDefaultAminoConverters(),
        ...signers.cosmos.createThorchainAminoConverters("thor"),
      }),
      ...options,
    }
  );
};

export const simulate = async (
  client: signers.cosmos.CosmosClient,
  msg: Msg
) => {
  const encoded = await msg.toCosmosTx();

  const simRaw = await client.simulate(
    msg.account.address,
    encoded.msgs,
    encoded.memo
  );
  const sim = Math.ceil(simRaw * 1.5);
  const fee = client.calculateFee(sim).amount[0];
  const feeAmount = BigInt(fee.amount);
  if (msg.account.network === THOR) {
    // Gas is only charged on thorchain if a signers.cosmos.MsgExecuteContract is in the tx
    const gasCost = encoded.msgs.find(
      (a) => a.typeUrl === signers.cosmos.MsgExecuteContract.typeUrl
    )
      ? feeAmount
      : 0n;

    // And all 0.02 RUNE fees still apply
    const feeCost =
      BigInt(
        encoded.msgs.filter((a) =>
          [
            signers.cosmos.MsgSend.typeUrl,
            signers.cosmos.MsgDeposit.typeUrl,
          ].includes(a.typeUrl)
        ).length
      ) * 2000000n;

    return {
      symbol: "RUNE",
      decimals: 8,
      amount: feeCost + gasCost,
      gas: BigInt(sim),
    };
  }

  return {
    // ATOM. All u prefixed and 6 decimals
    symbol: fee.denom.replace("u", "").toUpperCase(),
    decimals: 6,
    amount: feeAmount,
    gas: BigInt(sim),
  };
};

export const signAndBroadcast = async (
  client: signers.cosmos.CosmosClient,
  msg: Msg
): Promise<TxResult> => {
  const encoded = await msg.toCosmosTx();
  const res = await client.signAndBroadcast(
    msg.account.address,
    encoded.msgs,
    "auto",
    encoded.memo
  );
  signers.cosmos.assertIsDeliverTxSuccess(res);
  return {
    network: msg.account.network,
    address: msg.account.address,
    txHash: res.transactionHash,
    deposited: msg.toDeposit?.() || null,
  };
};
