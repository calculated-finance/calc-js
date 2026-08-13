/**
 * @generated SignedSource<<b3f133682d3c4da7bfb7833a0a304d9d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type IndexBalanceFragment$data = {
  readonly account: string;
  readonly index: {
    readonly id: string;
    readonly shareAsset: {
      readonly asset: string;
      readonly metadata: {
        readonly decimals: number;
        readonly symbol: string;
      };
      readonly " $fragmentSpreads": FragmentRefs<"msgAssetFragment">;
    };
  };
  readonly shares: bigint;
  readonly sharesValue: bigint;
  readonly " $fragmentType": "IndexBalanceFragment";
};
export type IndexBalanceFragment$key = {
  readonly " $data"?: IndexBalanceFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"IndexBalanceFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "IndexBalanceFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "sharesValue",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "shares",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "account",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "IndexVault",
      "kind": "LinkedField",
      "name": "index",
      "plural": false,
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
          "name": "shareAsset",
          "plural": false,
          "selections": [
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "msgAssetFragment"
            },
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
              "concreteType": "Metadata",
              "kind": "LinkedField",
              "name": "metadata",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "decimals",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "symbol",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "IndexAccount",
  "abstractKey": null
};

(node as any).hash = "b323055b008deb8260455f1616d53fc7";

export default node;
