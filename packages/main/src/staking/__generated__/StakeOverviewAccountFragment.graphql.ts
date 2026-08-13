/**
 * @generated SignedSource<<fe8246a18cb7fa1b216d9d2379009bd9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type StakeOverviewAccountFragment$data = {
  readonly stakingV2: ReadonlyArray<{
    readonly bonded: {
      readonly amount: bigint;
    };
    readonly id: string;
    readonly liquidSize: {
      readonly amount: bigint;
    };
    readonly pool: {
      readonly bondAsset: {
        readonly metadata: {
          readonly symbol: string;
        };
      };
      readonly id: string;
    };
    readonly valueUsd: bigint;
  }>;
  readonly " $fragmentType": "StakeOverviewAccountFragment";
};
export type StakeOverviewAccountFragment$key = {
  readonly " $data"?: StakeOverviewAccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"StakeOverviewAccountFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
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
  "name": "StakeOverviewAccountFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "StakingAccount",
      "kind": "LinkedField",
      "name": "stakingV2",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "StakingPool",
          "kind": "LinkedField",
          "name": "pool",
          "plural": false,
          "selections": [
            (v0/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "Asset",
              "kind": "LinkedField",
              "name": "bondAsset",
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
          "concreteType": "Balance",
          "kind": "LinkedField",
          "name": "bonded",
          "plural": false,
          "selections": (v1/*: any*/),
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
          "kind": "ScalarField",
          "name": "valueUsd",
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

(node as any).hash = "727c4ddf83b192ae842ee2fb4111156a";

export default node;
