import { fromBech32 } from "@cosmjs/encoding";
import { address } from "bitcoinjs-lib";
import { decodeBase58, ethers } from "ethers";
import { Asset } from "./asset";
// import { Address as TonAddress } from "ton";

export const AVAX: Network = "AVAX";
export const BASE: Network = "BASE";
export const BCH: Network = "BCH";
export const BSC: Network = "BSC";
export const BTC: Network = "BTC";
export const DOGE: Network = "DOGE";
export const ETH: Network = "ETH";
export const GAIA: Network = "GAIA";
export const KUJI: Network = "KUJI";
export const LTC: Network = "LTC";
export const NOBLE: Network = "NOBLE";
export const OSMO: Network = "OSMO";
export const SOL: Network = "SOL";
export const TERRA: Network = "TERRA";
export const TERRA2: Network = "TERRA2";
export const THOR: Network = "THOR";
export const TON: Network = "TON";
export const TRON: Network = "TRON";
export const XRP: Network = "XRP";

// Relay-compatible Network type
export type Network =
  | "AVAX"
  | "BASE"
  | "BCH"
  | "BSC"
  | "BTC"
  | "DOGE"
  | "ETH"
  | "GAIA"
  | "KUJI"
  | "LTC"
  | "NOBLE"
  | "OSMO"
  | "SOL"
  | "STEALTH"
  | "TERRA"
  | "TERRA2"
  | "THOR"
  | "TON"
  | "TRON"
  | "XRP"
  | "%future added value";

export const NETWORKS: Network[] = [
  AVAX,
  BASE,
  BCH,
  BSC,
  BTC,
  DOGE,
  ETH,
  GAIA,
  KUJI,
  LTC,
  NOBLE,
  OSMO,
  SOL,
  TERRA,
  TERRA2,
  THOR,
  TON,
  TRON,
  XRP,
];

export const gasToken = (n: Network): { symbol: string; decimals: number } => {
  switch (n) {
    case AVAX:
      return { symbol: "AVAX", decimals: 18 };
    case BASE:
      return { symbol: "ETH", decimals: 18 };
    case BTC:
      return { symbol: "BTC", decimals: 8 };
    case BCH:
      return { symbol: "BCH", decimals: 8 };
    case BSC:
      return { symbol: "BNB", decimals: 18 };
    case DOGE:
      return { symbol: "DOGE", decimals: 8 };
    case ETH:
      return { symbol: "ETH", decimals: 18 };
    case GAIA:
      return { symbol: "ATOM", decimals: 6 };
    case KUJI:
      return { symbol: "KUJI", decimals: 6 };
    case LTC:
      return { symbol: "LTC", decimals: 8 };
    case NOBLE:
      return { symbol: "USDC", decimals: 6 };
    case OSMO:
      return { symbol: "OSMO", decimals: 6 };
    case SOL:
      return { symbol: "SOL", decimals: 9 };
    case TON:
      return { symbol: "TON", decimals: 9 };
    case THOR:
      return { symbol: "RUNE", decimals: 8 };
    case TERRA:
      return { symbol: "LUNA", decimals: 6 };
    case TERRA2:
      return { symbol: "LUNA", decimals: 6 };
    case TRON:
      return { symbol: "TRX", decimals: 6 };
    case XRP:
      return { symbol: "XRP", decimals: 6 };
    case "STEALTH":
    case "%future added value":
      throw new Error(`Unknown network: ${n}`);
  }
};

export const networkExplorerLabel = (network: Network) => {
  switch (network) {
    case AVAX:
      return `Snowtrace`;
    case BASE:
      return `Basescan`;
    case BTC:
      return `Blockchain.com`;
    case BCH:
      return `Blockchair`;
    case BSC:
      return `BSCScan`;
    case DOGE:
      return `Dogechain.info`;
    case ETH:
      return `Etherscan`;
    case GAIA:
      return `Mintscan`;
    case KUJI:
      return `Chainsco.pe`;
    case LTC:
      return `Blockchair`;
    case NOBLE:
      return `Mintscan`;
    case OSMO:
      return `Mintscan`;
    case SOL:
      return `Solscan`;
    case TON:
      return `Tonscan`;
    case TRON:
      return "Tronscan";
    case THOR:
      return `THORChain.net`;
    case TERRA:
      return `Terra Finder`;
    case TERRA2:
      return `Mintscan`;
    case XRP:
      return `Xrpscan.com`;
    case "STEALTH":
    case "%future added value":
      throw new Error(`Unknown network: ${network}`);
  }
};

export const networkTxLink = ({
  network,
  txHash,
}: {
  network: Network;
  txHash: string;
}) => {
  switch (network) {
    case AVAX:
      return `https://snowtrace.io/tx/${txHash}`;
    case BASE:
      return `https://basescan.org/tx/${txHash}`;
    case BTC:
      return `https://www.blockchain.com/explorer/transactions/btc/${txHash}`;
    case BCH:
      return `https://blockchair.com/bitcoin-cash/transaction/${txHash}`;
    case BSC:
      return `https://bscscan.com/tx/${txHash}`;
    case DOGE:
      return `https://dogechain.info/tx/${txHash}`;
    case ETH:
      return `https://etherscan.io/tx/${txHash}`;
    case GAIA:
      return `https://www.mintscan.io/cosmos/tx/${txHash}`;
    case KUJI:
      return `https://chainsco.pe/kujira/tx/${txHash}`;
    case LTC:
      return `https://blockchair.com/litecoin/transaction/${txHash}`;
    case NOBLE:
      return `https://www.mintscan.io/noble/tx/${txHash}`;
    case OSMO:
      return `https://www.mintscan.io/osmosis/tx/${txHash}`;
    case SOL:
      return `https://solscan.io/tx/${txHash}`;
    case THOR:
      return `https://thorchain.net/tx/${txHash}`;
    case TERRA:
      return `https://finder.terra.money/classic/tx/${txHash}`;
    case TERRA2:
      return `https://www.mintscan.io/terra/tx/${txHash}`;
    case TON:
      return `https://tonscan.org/tx/${txHash}`;
    case TRON:
      return `https://tronscan.org/#/transaction/${txHash}`;
    case XRP:
      return `https://xrpscan.com/tx/${txHash}`;
    case "STEALTH":
    case "%future added value":
      throw new Error(`Unknown network: ${network}`);
  }
};

export const networkLabel = (n: Network | Asset): string => {
  if (typeof n !== "string") {
    return networkLabel(n.type === "SECURED" ? THOR : n.chain);
  }
  switch (n) {
    case AVAX:
      return "Avalanche C-Chain";
    case BASE:
      return "Base";
    case BTC:
      return "Bitcoin";
    case BCH:
      return "Bitcoin Cash";
    case BSC:
      return "BNB Chain";
    case DOGE:
      return "Dogecoin";
    case ETH:
      return "Ethereum";
    case GAIA:
      return "Cosmos Hub";
    case KUJI:
      return "Kujira";
    case LTC:
      return "Litecoin";
    case NOBLE:
      return "Noble";
    case OSMO:
      return "Osmosis";
    case SOL:
      return "Solana";
    case THOR:
      return "Rujira";
    case XRP:
      return "XRPL";
    case TERRA:
      return "Terra Classic";
    case TERRA2:
      return "Terra";
    case TRON:
      return "Tron";
    case TON:
      return "Ton";
    case "STEALTH":
    case "%future added value":
      throw new Error(`Unknown network: ${n}`);
  }
};

export const networkId = (n: Network): string => {
  switch (n) {
    case AVAX:
      return "0xa86a";
    case BASE:
      return "0x2105";
    case BSC:
      return "0x38";
    case ETH:
      return "0x1";
    case TRON:
      return "0x2B6653DC";
    default:
      throw new Error(`Non EVM chain ${n}`);
  }
};

export const networkConfirmationTime = (n: Network): number => {
  switch (n) {
    case AVAX:
      return 2 + networkConfirmationTime(THOR);
    case BASE:
      return 12 + networkConfirmationTime(THOR);
    case BTC:
      return 600 + networkConfirmationTime(THOR);
    case BCH:
      return 600 + networkConfirmationTime(THOR);
    case BSC:
      return 3 + networkConfirmationTime(THOR);
    case DOGE:
      return 60 + networkConfirmationTime(THOR);
    case ETH:
      return 12 + networkConfirmationTime(THOR);
    case GAIA:
      return 6 + networkConfirmationTime(THOR);
    case KUJI:
      return 6 + networkConfirmationTime(THOR);
    case LTC:
      return 150 + networkConfirmationTime(THOR);
    case NOBLE:
      return 6 + networkConfirmationTime(THOR);
    case OSMO:
      return 6 + networkConfirmationTime(THOR);
    case XRP:
      return 6 + networkConfirmationTime(THOR);
    case SOL:
      return 2 + networkConfirmationTime(THOR);
    case THOR:
      return 6;
    case TERRA:
      return 6 + networkConfirmationTime(THOR);
    case TERRA2:
      return 6 + networkConfirmationTime(THOR);
    case TRON:
      return 3 + networkConfirmationTime(THOR);
    case TON:
      return 6 + networkConfirmationTime(THOR);
    case "STEALTH":
    case "%future added value":
      throw new Error(`Unknown network: ${n}`);
  }
};

/*
Simple valiaton of address format for a given chain
*/
export const validateAddress = (n: Network, str: string): boolean => {
  try {
    switch (n) {
      case AVAX:
      case BASE:
      case BSC:
      case ETH:
        return ethers.isAddress(str);
      case BTC:
        return str.startsWith("bc") && address.fromBech32(str).prefix === "bc";
      case GAIA:
        return str.startsWith("cosmos") && fromBech32(str).prefix === "cosmos";
      case KUJI:
        return str.startsWith("kujira") && fromBech32(str).prefix === "kujira";
      case NOBLE:
        return str.startsWith("noble") && fromBech32(str).prefix === "noble";
      case OSMO:
        return str.startsWith("osmo") && fromBech32(str).prefix === "osmo";
      case THOR:
        return str.startsWith("thor") && fromBech32(str).prefix === "thor";
      case TERRA:
      case TERRA2:
        return str.startsWith("terra") && fromBech32(str).prefix === "terra";
      case BCH:
        return (
          (str.startsWith("bitcoincash") && !!decodeBase58(str)) ||
          str.startsWith("q") ||
          str.startsWith("p")
        );
      case DOGE:
        return (
          (str.startsWith("D") || str.startsWith("A")) && !!decodeBase58(str)
        );
      case LTC:
        return (
          (str.startsWith("ltc") && address.fromBech32(str).prefix === "ltc") ||
          ((str.startsWith("L") || str.startsWith("M")) && !!decodeBase58(str))
        );
      case TRON:
        return str.startsWith("T") && str.length === 34 && !!decodeBase58(str);
      case XRP:
        return str.startsWith("r") && !!decodeBase58(str);
      case TON:
        return str.startsWith("E") || str.startsWith("U");
      case SOL:
        return !!decodeBase58(str);
      case "STEALTH":
      case "%future added value":
        return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};
