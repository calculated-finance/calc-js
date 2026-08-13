/**
 * @generated SignedSource<<27e6830c00b54c5a066b838e5dcdc38e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ActionsAccountFragment$data = {
  readonly index: ReadonlyArray<{
    readonly id: string;
    readonly index: {
      readonly address: string;
      readonly fees: {
        readonly rates: {
          readonly transaction: bigint;
        };
      };
      readonly id: string;
      readonly shareAsset: {
        readonly asset: string;
      };
    };
    readonly shares: bigint;
  }>;
  readonly " $fragmentType": "ActionsAccountFragment";
};
export type ActionsAccountFragment$key = {
  readonly " $data"?: ActionsAccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ActionsAccountFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ActionsAccountFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "IndexAccount",
      "kind": "LinkedField",
      "name": "index",
      "plural": true,
      "selections": [
        (v0/*: any*/),
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
          "concreteType": "IndexVault",
          "kind": "LinkedField",
          "name": "index",
          "plural": false,
          "selections": [
            (v0/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "address",
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
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "asset",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "IndexFees",
              "kind": "LinkedField",
              "name": "fees",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "IndexFeesRates",
                  "kind": "LinkedField",
                  "name": "rates",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "transaction",
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
})();

(node as any).hash = "7f082274e1eaee79cd06c1a25578bd34";

export default node;
