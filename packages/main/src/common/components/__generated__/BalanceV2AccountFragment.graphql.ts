/**
 * @generated SignedSource<<c9ec0d57e4e925b9985ef1ad06c73bb1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from 'relay-runtime';
export type AssetType = "LAYER_1" | "NATIVE" | "SECURED" | "SYNTH" | "%future added value";
export type Chain = "AVAX" | "BASE" | "BCH" | "BSC" | "BTC" | "DOGE" | "ETH" | "GAIA" | "KUJI" | "LTC" | "NOBLE" | "OSMO" | "SOL" | "TERRA" | "TERRA2" | "THOR" | "TON" | "TRON" | "TRON" | "XRP" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type BalanceV2AccountFragment$data = {
  readonly address: string;
  readonly asset: {
    readonly asset: string;
    readonly chain: Chain;
    readonly metadata: {
      readonly decimals: number;
      readonly symbol: string;
    };
    readonly price: {
      readonly current: bigint | null | undefined;
    } | null | undefined;
    readonly type: AssetType;
    readonly variants: {
      readonly native: {
        readonly denom: string;
      } | null | undefined;
    };
  };
  readonly balance: bigint;
  readonly valueUsd: bigint;
  readonly " $fragmentType": "BalanceV2AccountFragment";
};
export type BalanceV2AccountFragment$key = {
  readonly " $data"?: BalanceV2AccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"BalanceV2AccountFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "BalanceV2AccountFragment"
};

(node as any).hash = "a292432e083d63e76866731ff18e7f2a";

export default node;
