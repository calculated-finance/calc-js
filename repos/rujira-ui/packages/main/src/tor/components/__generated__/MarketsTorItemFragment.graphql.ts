/**
 * @generated SignedSource<<5f1cc73481e5063ed1a94552888c8d31>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type AssetType = "LAYER_1" | "NATIVE" | "SECURED" | "SYNTH" | "%future added value";
export type Chain = "AVAX" | "BASE" | "BCH" | "BSC" | "BTC" | "DOGE" | "ETH" | "GAIA" | "KUJI" | "LTC" | "NOBLE" | "OSMO" | "SOL" | "TERRA" | "TERRA2" | "THOR" | "TON" | "TRON" | "TRON" | "XRP" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type MarketsTorItemFragment$data = {
  readonly asset: {
    readonly asset: string;
    readonly chain: Chain;
    readonly metadata: {
      readonly decimals: number;
      readonly symbol: string;
    };
    readonly type: AssetType;
  };
  readonly assetTorPrice: bigint;
  readonly id: string;
  readonly " $fragmentType": "MarketsTorItemFragment";
};
export type MarketsTorItemFragment$key = {
  readonly " $data"?: MarketsTorItemFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"MarketsTorItemFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MarketsTorItemFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Asset",
      "kind": "LinkedField",
      "name": "asset",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "asset",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "type",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "chain",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "Metadata",
          "kind": "LinkedField",
          "name": "metadata",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "symbol",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "decimals",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "assetTorPrice",
      "storageKey": null
    }
  ],
  "type": "ThorchainPool",
  "abstractKey": null
};

(node as any).hash = "3927c047a5d6e3fe33971a209274f25b";

export default node;
