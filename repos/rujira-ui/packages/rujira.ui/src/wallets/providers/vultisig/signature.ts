import { Signature as VultisigSignature } from "@vultisig/sdk";
import { Signature as EthersSignature, hexlify } from "ethers";
import { signers } from "rujira.js";

export const stripHexPrefix = (value: string) =>
  value.startsWith("0x") || value.startsWith("0X") ? value.slice(2) : value;

export const secp256k1SignatureFromDer = (signature: string): Uint8Array =>
  signers.cosmos.crypto.Secp256k1Signature.fromDer(
    Buffer.from(stripHexPrefix(signature), "hex")
  ).toFixedLength();

const recoveryByte = (signature: VultisigSignature) => {
  if (signature.recovery === undefined) {
    throw new Error("Vultisig ECDSA signature missing recovery id.");
  }

  return signature.recovery < 27 ? signature.recovery + 27 : signature.recovery;
};

export const toEthersSignature = (
  signature: VultisigSignature
): EthersSignature => {
  const fixedLength = secp256k1SignatureFromDer(signature.signature);

  return EthersSignature.from({
    r: hexlify(fixedLength.slice(0, 32)),
    s: hexlify(fixedLength.slice(32)),
    v: recoveryByte(signature),
  });
};

export const toRawSignature = (signature: VultisigSignature): string => {
  const fixedLength = secp256k1SignatureFromDer(signature.signature);
  return `${Buffer.from(fixedLength).toString("hex")}${recoveryByte(signature)
    .toString(16)
    .padStart(2, "0")}`;
};
