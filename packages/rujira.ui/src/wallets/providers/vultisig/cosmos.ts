import { Chain, getPublicKey, VaultBase } from "@vultisig/sdk";
import { sha256 } from "ethers";
import { signers } from "rujira.js";
import { WalletCore } from "./common";

export class Cosmos implements signers.cosmos.OfflineDirectSigner {
  constructor(
    private vault: VaultBase,
    private walletCore: WalletCore
  ) {}
  async getAccounts(): Promise<readonly signers.cosmos.AccountData[]> {
    return this.vault.addresses().then((addrs) =>
      [Chain.THORChain].reduce(
        (a: signers.cosmos.AccountData[], chain) => {
          const address = addrs[chain];
          return address ? [this.accountData(chain, address), ...a] : a;
        },
        []
      )
    );
  }

  accountData(chain: Chain, address: string): signers.cosmos.AccountData {
    return {
      address,
      algo: "secp256k1",
      pubkey: getPublicKey({
        chain,
        walletCore: this.walletCore,
        hexChainCode: this.vault.hexChainCode,
        publicKeys: this.vault.publicKeys,
      }).data(),
    };
  }

  async signDirect(
    _signerAddress: string,
    signDoc: signers.cosmos.SignDoc
  ): Promise<signers.cosmos.DirectSignResponse> {
    const data = sha256(signers.cosmos.SignDoc.encode(signDoc).finish());

    const chain = {
      "thorchain-1": Chain.THORChain,
    }[signDoc.chainId];
    if (!chain) throw new Error(`No SDK chain for ${signDoc.chainId}`);
    const signature = await this.vault.signBytes({ data, chain });
    return {
      signed: signDoc,
      signature: signers.cosmos.encodeSecp256k1Signature(
        getPublicKey({
          chain,
          walletCore: this.walletCore,
          hexChainCode: this.vault.hexChainCode,
          publicKeys: this.vault.publicKeys,
        }).data(),
        signers.cosmos.crypto.Secp256k1Signature.fromDer(
          Buffer.from(signature.signature, "hex")
        ).toFixedLength()
      ),
    };
  }
}
