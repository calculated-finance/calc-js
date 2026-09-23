/**
 * @generated SignedSource<<6307f0d56488c1b57c0fe9a4b3ab5724>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type Chain = "AVAX" | "BASE" | "BCH" | "BSC" | "BTC" | "DOGE" | "ETH" | "GAIA" | "KUJI" | "LTC" | "NOBLE" | "OSMO" | "SOL" | "TERRA" | "TERRA2" | "THOR" | "TON" | "TRON" | "TRON" | "XRP" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type ThorchainPoolBalanceWithDrawFragment$data = {
  readonly asset: {
    readonly chain: Chain;
    readonly metadata: {
      readonly symbol: string;
    };
    readonly " $fragmentSpreads": FragmentRefs<"msgAssetFragment">;
  };
  readonly assetAddress: string | null | undefined;
  readonly assetRedeemValue: bigint;
  readonly runeAddress: string | null | undefined;
  readonly runeRedeemValue: bigint;
  readonly units: bigint;
  readonly " $fragmentType": "ThorchainPoolBalanceWithDrawFragment";
};
export type ThorchainPoolBalanceWithDrawFragment$key = {
  readonly " $data"?: ThorchainPoolBalanceWithDrawFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ThorchainPoolBalanceWithDrawFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ThorchainPoolBalanceWithDrawFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "assetAddress",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "runeAddress",
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
            }
          ],
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "msgAssetFragment"
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "units",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "runeRedeemValue",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "assetRedeemValue",
      "storageKey": null
    }
  ],
  "type": "ThorchainLiquidityProvider",
  "abstractKey": null
};

(node as any).hash = "c11caeff0b3d39ab2dc71f2d1120f972";

export default node;
