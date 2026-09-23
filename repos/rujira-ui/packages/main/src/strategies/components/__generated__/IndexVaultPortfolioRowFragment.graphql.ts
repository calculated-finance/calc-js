/**
 * @generated SignedSource<<02b8a00822faf2cf174066d6808338fd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type AprStatus = "AVAILABLE" | "NOT_APPLICABLE" | "SOON" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type IndexVaultPortfolioRowFragment$data = {
  readonly allocations: ReadonlyArray<{
    readonly asset: {
      readonly metadata: {
        readonly symbol: string;
      };
    };
    readonly balance: bigint;
  }>;
  readonly id: string;
  readonly index: {
    readonly id: string;
    readonly shareAsset: {
      readonly metadata: {
        readonly symbol: string;
      };
    };
    readonly status: {
      readonly apr: {
        readonly status: AprStatus;
        readonly value: bigint | null | undefined;
      };
    };
    readonly type: string;
  };
  readonly sharesValue: bigint;
  readonly " $fragmentType": "IndexVaultPortfolioRowFragment";
};
export type IndexVaultPortfolioRowFragment$key = {
  readonly " $data"?: IndexVaultPortfolioRowFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"IndexVaultPortfolioRowFragment">;
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
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "IndexVaultPortfolioRowFragment",
  "selections": [
    (v0/*: any*/),
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
          "name": "type",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "Asset",
          "kind": "LinkedField",
          "name": "shareAsset",
          "plural": false,
          "selections": (v1/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "IndexStatus",
          "kind": "LinkedField",
          "name": "status",
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
      "kind": "ScalarField",
      "name": "sharesValue",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "IndexAllocation",
      "kind": "LinkedField",
      "name": "allocations",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Asset",
          "kind": "LinkedField",
          "name": "asset",
          "plural": false,
          "selections": (v1/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "balance",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "IndexAccount",
  "abstractKey": null
};
})();

(node as any).hash = "e73cd5fa98dbd9726ebd85cab4d674ed";

export default node;
