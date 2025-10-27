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
  signers: SigningCosmWasmClient[];
  address: string;
  scheduler: string;
};

let initPromise: Promise<Resources> | null = null;

function init(): Promise<Resources> {
  if (initPromise) return initPromise;

  console.log("Initializing executor dependencies...");

  initPromise = (async () => {
    const chainId = process.env.CHAIN_ID!;
    const chain = CHAINS_BY_ID[chainId] as CosmosChain;
    const scheduler = chain.schedulerContract!;

    const secret = await secrets.send(
      new GetSecretValueCommand({ SecretId: process.env.SECRET_ARN! })
    );

    const { MNEMONIC } = JSON.parse(secret.SecretString!);

    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC, {
      prefix: chain.bech32AddressPrefix,
      hdPaths: [stringToPath(chain.hdPath)],
    });

    const signers = await Promise.all(
      chain.rpcUrls.map((rpcUrl) =>
        SigningCosmWasmClient.connectWithSigner(rpcUrl, wallet, {
          gasPrice: GasPrice.fromString(chain.defaultGasPrice),
        })
      )
    );

    const [{ address }] = await wallet.getAccounts();

    return { signers, address, scheduler };
  })();

  return initPromise;
}

const roundRobinSignTx = async (
  signers: SigningCosmWasmClient[],
  address: string,
  scheduler: string,
  triggers: string[]
) => {
  for (const signer of signers) {
    try {
      return await signer.execute(
        address,
        scheduler,
        {
          execute: triggers,
        },
        "auto"
      );
    } catch (error) {
      if (`${error}`.includes("account sequence mismatch")) {
        await new Promise((resolve) => setTimeout(resolve, 20_000));
      }

      console.error(`Signer failed to sign transaction: ${error}`);
    }
  }

  throw new Error("All signers failed to sign the transaction");
};

export const handler = async (event: {
  Records: Array<{ messageId: string; body: string }>;
}) => {
  const { signers, address, scheduler } = await init();

  const triggers = event.Records.map((r) => r.body);

  console.log("Processing triggers:", JSON.stringify(triggers, null, 2));

  const result = await roundRobinSignTx(signers, address, scheduler, triggers);

  for (const event of result.events) {
    console.log(JSON.stringify(event, null, 2));
  }

  return { batchItemFailures: [] };
};
