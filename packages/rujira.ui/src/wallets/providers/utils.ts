import { Account, Network } from "rujira.js";

export const walletType = (
  account: Account
): "evm" | "cosmos" | "ton" | "xrp" | "tron" | "sol" | ["utxo", Network] => {
  switch (account.network) {
    case "AVAX":
    case "BASE":
    case "BSC":
    case "ETH":
      return "evm";
    case "GAIA":
    case "THOR":
      return "cosmos";
    case "SOL":
      return "sol";
    case "TON":
      return "ton";
    case "TRON":
      return "tron";
    case "XRP":
      return "xrp";
    case "%future added value":
      throw new Error(`Unknown`);
    default:
      return ["utxo", account.network];
  }
};
