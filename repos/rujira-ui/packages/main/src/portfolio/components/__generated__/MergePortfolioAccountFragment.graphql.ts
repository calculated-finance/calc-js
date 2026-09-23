/**
 * @generated SignedSource<<8e3a4e83c1d5bcaa3e939add5ad9a8ca>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MergePortfolioAccountFragment$data = {
  readonly merge: {
    readonly totalSize: {
      readonly amount: bigint;
      readonly asset: {
        readonly metadata: {
          readonly symbol: string;
        };
        readonly price: {
          readonly current: bigint | null | undefined;
        } | null | undefined;
      };
    };
  } | null | undefined;
  readonly " $fragmentType": "MergePortfolioAccountFragment";
};
export type MergePortfolioAccountFragment$key = {
  readonly " $data"?: MergePortfolioAccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"MergePortfolioAccountFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MergePortfolioAccountFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "MergeStats",
      "kind": "LinkedField",
      "name": "merge",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Balance",
          "kind": "LinkedField",
          "name": "totalSize",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "amount",
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
                  "alias": null,
                  "args": null,
                  "concreteType": "Price",
                  "kind": "LinkedField",
                  "name": "price",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "current",
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
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "4a800c7568081ec08fecb817e45ae632";

export default node;
