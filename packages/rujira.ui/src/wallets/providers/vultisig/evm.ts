import { Chain, type VaultBase } from "@vultisig/sdk";
import {
  AbstractSigner,
  assertArgument,
  copyRequest,
  getAddress,
  hashMessage,
  JsonRpcApiProvider,
  Provider,
  resolveAddress,
  resolveProperties,
  Signer,
  Transaction,
  TransactionLike,
  TransactionRequest,
  TypedDataDomain,
  TypedDataField,
} from "ethers";
import { toEthersSignature } from "./signature";

export class Evm extends AbstractSigner<JsonRpcApiProvider> {
  private address: string;

  constructor(
    p: JsonRpcApiProvider,
    private vault: VaultBase,
    address: string,
    private chain: Chain
  ) {
    super(p);
    this.address = getAddress(address);
  }

  async getAddress(): Promise<string> {
    return this.address;
  }

  connect(provider: null | Provider): Signer {
    if (!(provider instanceof JsonRpcApiProvider)) {
      throw new Error("Vultisig EVM signer requires a JSON-RPC provider.");
    }
    return new Evm(provider, this.vault, this.address, this.chain);
  }

  async signTransaction(tx: TransactionRequest): Promise<string> {
    tx = copyRequest(tx);

    const { to, from } = await resolveProperties({
      to: tx.to ? resolveAddress(tx.to, this.provider) : undefined,
      from: tx.from ? resolveAddress(tx.from, this.provider) : undefined,
    });

    if (to != null) tx.to = to;
    if (from != null) {
      const fromAddress = getAddress(from);
      assertArgument(
        fromAddress === this.address,
        "transaction from address mismatch",
        "tx.from",
        fromAddress
      );
    }
    delete tx.from;

    const transaction = Transaction.from(tx as TransactionLike<string>);
    transaction.signature = await this.signDigest(transaction.unsignedHash);
    return transaction.serialized;
  }

  async signMessage(message: string | Uint8Array): Promise<string> {
    return (await this.signDigest(hashMessage(message))).serialized;
  }

  signTypedData(
    _domain: TypedDataDomain,
    _types: Record<string, Array<TypedDataField>>,
    _value: Record<string, any>
  ): Promise<string> {
    throw new Error("signTypedData not implemented.");
  }

  private async signDigest(digest: string) {
    const signature = await this.vault.signBytes({
      data: digest,
      chain: this.chain,
    });
    return toEthersSignature(signature);
  }
}
