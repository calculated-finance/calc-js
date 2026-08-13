/**
 * @generated SignedSource<<c28950400de8be08ed56470f615ffc9f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type AprStatus = "AVAILABLE" | "NOT_APPLICABLE" | "SOON" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type StakingPoolPortfolioRowFragment$data = {
  readonly bonded: {
    readonly amount: bigint;
  };
  readonly id: string;
  readonly liquidSize: {
    readonly amount: bigint;
  };
  readonly pendingRevenue: {
    readonly amount: bigint;
    readonly asset: {
      readonly metadata: {
        readonly symbol: string;
      };
    };
  };
  readonly pool: {
    readonly bondAsset: {
      readonly metadata: {
        readonly symbol: string;
      };
    };
    readonly summary: {
      readonly apr: {
        readonly status: AprStatus;
        readonly value: bigint | null | undefined;
      };
    };
  };
  readonly valueUsd: bigint;
  readonly " $fragmentType": "StakingPoolPortfolioRowFragment";
};
export type StakingPoolPortfolioRowFragment$key = {
  readonly " $data"?: StakingPoolPortfolioRowFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"StakingPoolPortfolioRowFragment">;
};

const node: ReaderFragment = (function(){
var v0 = [
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
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "amount",
  "storageKey": null
},
v2 = [
  (v1/*: any*/)
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "StakingPoolPortfolioRowFragment",
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
          "selections": (v0/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "StakingSummary",
          "kind": "LinkedField",
          "name": "summary",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Apr",
              "kind": "LinkedField",
              "name": "apr",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "value",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "status",
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
      "selections": (v2/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Balance",
      "kind": "LinkedField",
      "name": "liquidSize",
      "plural": false,
      "selections": (v2/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Balance",
      "kind": "LinkedField",
      "name": "pendingRevenue",
      "plural": false,
      "selections": [
        (v1/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "Asset",
          "kind": "LinkedField",
          "name": "asset",
          "plural": false,
          "selections": (v0/*: any*/),
          "storageKey": null
        }
      ],
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
  "type": "StakingAccount",
  "abstractKey": null
};
})();

(node as any).hash = "cef861db8f4aa9b1bf265d5082976b0b";

export default node;
