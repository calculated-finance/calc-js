import { FC } from "react";
import {
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
  Network,
  OSMO,
  SOL,
  THOR,
  TON,
  TRON,
  XRP,
} from "rujira.js";
import { NetworkIcons } from "../..";

export const NetworkIcon: FC<{
  network: Network;
  className?: string;
  selected?: boolean;
}> = ({ network, className, selected = true }) => {
  switch (network) {
    case AVAX:
      return selected ? (
        <NetworkIcons.Avalanche className={className} />
      ) : (
        <NetworkIcons.AvalancheSimple className={className} />
      );
    case BASE:
      return selected ? (
        <NetworkIcons.Base className={className} />
      ) : (
        <NetworkIcons.BaseSimple className={className} />
      );
    case BTC:
      return selected ? (
        <NetworkIcons.Bitcoin className={className} />
      ) : (
        <NetworkIcons.BitcoinSimple className={className} />
      );
    case BCH:
      return selected ? (
        <NetworkIcons.BitcoinCash className={className} />
      ) : (
        <NetworkIcons.BitcoinCashSimple className={className} />
      );
    case BSC:
      return selected ? (
        <NetworkIcons.BinanceSmartChain className={className} />
      ) : (
        <NetworkIcons.BinanceSmartChainSimple className={className} />
      );
    case DOGE:
      return selected ? (
        <NetworkIcons.Doge className={className} />
      ) : (
        <NetworkIcons.DogeSimple className={className} />
      );
    case ETH:
      return selected ? (
        <NetworkIcons.Ethereum className={className} />
      ) : (
        <NetworkIcons.EthereumSimple className={className} />
      );
    case GAIA:
      return selected ? (
        <NetworkIcons.Cosmos className={className} />
      ) : (
        <NetworkIcons.CosmosSimple className={className} />
      );
    case KUJI:
      return selected ? (
        <NetworkIcons.Kujira className={className} />
      ) : (
        <NetworkIcons.KujiraSimple className={className} />
      );
    case LTC:
      return selected ? (
        <NetworkIcons.Litecoin className={className} />
      ) : (
        <NetworkIcons.LitecoinSimple className={className} />
      );
    case NOBLE:
      return selected ? (
        <NetworkIcons.Noble className={className} />
      ) : (
        <NetworkIcons.NobleSimple className={className} />
      );
    case OSMO:
      return selected ? (
        <NetworkIcons.Osmosis className={className} />
      ) : (
        <NetworkIcons.OsmosisSimple className={className} />
      );
    case THOR:
      return selected ? (
        <NetworkIcons.Thorchain className={className} />
      ) : (
        <NetworkIcons.ThorchainSimple className={className} />
      );
    case TON:
      return selected ? (
        <NetworkIcons.Ton className={className} />
      ) : (
        <NetworkIcons.TonSimple className={className} />
      );
    case TRON:
      return selected ? (
        <NetworkIcons.Tron className={className} />
      ) : (
        <NetworkIcons.TronSimple className={className} />
      );
    case SOL:
      return selected ? (
        <NetworkIcons.Solana className={className} />
      ) : (
        <NetworkIcons.SolanaSimple className={className} />
      );
    case XRP:
      return selected ? (
        <NetworkIcons.XRP className={className} />
      ) : (
        <NetworkIcons.XRPSimple className={className} />
      );
  }
};
