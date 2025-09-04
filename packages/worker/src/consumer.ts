import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { stringToPath } from "@cosmjs/crypto";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { GasPrice } from "@cosmjs/stargate";
import { CHAINS_BY_ID, CosmosChain } from "@template/domain/chains";

const secrets = new SecretsManagerClient({});

type Resources = {
  signer: SigningCosmWasmClient;
  address: string;
  scheduler: string;
};

let initPromise: Promise<Resources> | null = null;

function init(): Promise<Resources> {
  if (initPromise) return initPromise;

  console.log("Initializing consumer dependencies...");

  initPromise = (async () => {
    const chainId = process.env.CHAIN_ID!;
    const chain = CHAINS_BY_ID[chainId] as CosmosChain;
    const scheduler = chain.schedulerContract!;

    const secret = await secrets.send(
      new GetSecretValueCommand({ SecretId: process.env.SECRET_ARN! })
    );

    const { mnemonic } = JSON.parse(secret.SecretString!);

    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: chain.bech32AddressPrefix,
      hdPaths: [stringToPath(chain.hdPath)],
    });

    const signer = await SigningCosmWasmClient.connectWithSigner(
      chain.rpcUrls[0],
      wallet,
      { gasPrice: GasPrice.fromString(chain.defaultGasPrice) }
    );

    const [{ address }] = await wallet.getAccounts();

    return { signer, address, scheduler };
  })();

  return initPromise;
}

export const handler = async (event: {
  Records: Array<{ messageId: string; body: string }>;
}) => {
  const { signer, address, scheduler } = await init();

  await signer.execute(
    address,
    scheduler,
    {
      execute: event.Records.map((r) => r.body),
    },
    "auto"
  );
};
