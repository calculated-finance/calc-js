/**
 * @generated SignedSource<<f9fa6acba444d2ae7352e05660dd966f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type StakePoolBalanceTransferFragment$data = {
  readonly liquidShares: {
    readonly amount: bigint;
  };
  readonly liquidSize: {
    readonly amount: bigint;
  };
  readonly pool: {
    readonly bondAsset: {
      readonly metadata: {
        readonly symbol: string;
      };
      readonly price: {
        readonly current: bigint | null | undefined;
      } | null | undefined;
    };
    readonly receiptAsset: {
      readonly metadata: {
        readonly symbol: string;
      };
      readonly " $fragmentSpreads": FragmentRefs<"msgAssetFragment">;
    };
  };
  readonly " $fragmentType": "StakePoolBalanceTransferFragment";
};
export type StakePoolBalanceTransferFragment$key = {
  readonly " $data"?: StakePoolBalanceTransferFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"StakePoolBalanceTransferFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
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
v1 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "amount",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "StakePoolBalanceTransferFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "StakingPool",
      "kind": "LinkedField",
      "name": "pool",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Asset",
          "kind": "LinkedField",
          "name": "bondAsset",
          "plural": false,
          "selections": [
            (v0/*: any*/),
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
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "Asset",
          "kind": "LinkedField",
          "name": "receiptAsset",
          "plural": false,
          "selections": [
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "msgAssetFragment"
            },
            (v0/*: any*/)
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
      "name": "liquidSize",
      "plural": false,
      "selections": (v1/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Balance",
      "kind": "LinkedField",
      "name": "liquidShares",
      "plural": false,
      "selections": (v1/*: any*/),
      "storageKey": null
    }
  ],
  "type": "StakingAccount",
  "abstractKey": null
};
})();

(node as any).hash = "f70fb051908647c13bba3743aaf16c6b";

export default node;
