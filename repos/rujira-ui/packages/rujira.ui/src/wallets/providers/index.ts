import { AccountProvider as BaseAccountProvider, Signer } from "rujira.js";
import { default as brave } from "./brave";
import { default as coinbase } from "./coinbase";
import { default as keplr } from "./keplr";
import { default as leap } from "./leap";
// import { default as ledger } from "./ledger";
import { default as daodao } from "./daodao";
import { default as metamask } from "./metamask";
import { default as okx } from "./okx";
import { default as rabby } from "./rabby";
import { default as station } from "./station";
import { default as ton } from "./ton";
import { default as tronlink } from "./tronlink";
import { default as trust } from "./trust";
import { default as vulticonnect } from "./vulticonnect";
import { default as vultisig } from "./vultisig";
import { default as xaman } from "./xaman";
export { vultisig };

export type AccountProvider = BaseAccountProvider<Provider.Key>;

export namespace Provider {
  export type Key =
    | "Brave"
    | "Coinbase"
    | "DaoDao"
    | "Keplr"
    | "Leap"
    | "Ledger"
    | "Metamask"
    | "Okx"
    | "Rabby"
    | "Station"
    | "Ton"
    | "Tronlink"
    | "Trust"
    | "Vulticonnect"
    | "Vultisig"
    | "Xaman";

  export const keys: Key[] = [
    "Brave",
    "Coinbase",
    "DaoDao",
    "Keplr",
    "Leap",
    "Ledger",
    "Metamask",
    "Okx",
    "Rabby",
    "Station",
    "Ton",
    "Tronlink",
    "Trust",
    "Vulticonnect",
    "Vultisig",
    "Xaman",
  ];

  export const signer = (p: Key): Signer => {
    switch (p) {
      case "Brave":
        return brave;
      case "Coinbase":
        return coinbase;
      case "DaoDao":
        return daodao;
      case "Keplr":
        return keplr;
      case "Leap":
        return leap;
      case "Ledger":
        throw new Error(`No signer for Ledger`);
      case "Metamask":
        return metamask;
      case "Okx":
        return okx;
      case "Rabby":
        return rabby;
      case "Station":
        return station;
      case "Ton":
        return ton;
      case "Tronlink":
        return tronlink;
      case "Trust":
        return trust;
      case "Vulticonnect":
        return vulticonnect;
      case "Vultisig":
        return vultisig;
      case "Xaman":
        return xaman;
    }
  };
}
