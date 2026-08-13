/**
 * @generated SignedSource<<36198bb44417154d174dfe21eece01cc>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type IndexVaultThumbFragment$data = {
  readonly id: string;
  readonly index: {
    readonly shareAsset: {
      readonly metadata: {
        readonly symbol: string;
      };
    };
  };
  readonly sharesValue: bigint;
  readonly " $fragmentType": "IndexVaultThumbFragment";
};
export type IndexVaultThumbFragment$key = {
  readonly " $data"?: IndexVaultThumbFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"IndexVaultThumbFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "IndexVaultThumbFragment",
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
      "concreteType": "IndexVault",
      "kind": "LinkedField",
      "name": "index",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Asset",
          "kind": "LinkedField",
          "name": "shareAsset",
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
      "name": "sharesValue",
      "storageKey": null
    }
  ],
  "type": "IndexAccount",
  "abstractKey": null
};

(node as any).hash = "68458b853024045c228288d6b90935d9";

export default node;
