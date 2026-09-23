/**
 * @generated SignedSource<<db6b5ea178507e8e39a82ab6726132ec>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type BowPoolXykBalanceWithdrawFragment$data = {
  readonly shares: {
    readonly amount: bigint;
    readonly asset: {
      readonly " $fragmentSpreads": FragmentRefs<"msgAssetFragment">;
    };
  };
  readonly value: ReadonlyArray<{
    readonly amount: bigint;
    readonly asset: {
      readonly metadata: {
        readonly symbol: string;
      };
    };
  }>;
  readonly " $fragmentType": "BowPoolXykBalanceWithdrawFragment";
};
export type BowPoolXykBalanceWithdrawFragment$key = {
  readonly " $data"?: BowPoolXykBalanceWithdrawFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"BowPoolXykBalanceWithdrawFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "amount",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "BowPoolXykBalanceWithdrawFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Balance",
      "kind": "LinkedField",
      "name": "shares",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "Asset",
          "kind": "LinkedField",
          "name": "asset",
          "plural": false,
          "selections": [
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "msgAssetFragment"
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
      "concreteType": "Balance",
      "kind": "LinkedField",
      "name": "value",
      "plural": true,
      "selections": [
        (v0/*: any*/),
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
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "BowAccount",
  "abstractKey": null
};
})();

(node as any).hash = "2ee340d72b3caef4e8254af7b8cceab3";

export default node;
