/**
 * @generated SignedSource<<9b7564918570df757243eed23fe38e0f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type AprStatus = "AVAILABLE" | "NOT_APPLICABLE" | "SOON" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type IndexVaultRowFragment$data = {
  readonly id: string;
  readonly shareAsset: {
    readonly metadata: {
      readonly symbol: string;
    };
  };
  readonly status: {
    readonly allocations: ReadonlyArray<{
      readonly asset: {
        readonly metadata: {
          readonly symbol: string;
        };
      };
      readonly balance: bigint;
    }>;
    readonly apr: {
      readonly status: AprStatus;
      readonly value: bigint | null | undefined;
    };
    readonly nav: bigint;
  };
  readonly " $fragmentType": "IndexVaultRowFragment";
};
export type IndexVaultRowFragment$key = {
  readonly " $data"?: IndexVaultRowFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"IndexVaultRowFragment">;
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
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "IndexVaultRowFragment",
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
      "selections": (v0/*: any*/),
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
              "selections": (v0/*: any*/),
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
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "nav",
          "storageKey": null
        },
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
  "type": "IndexVault",
  "abstractKey": null
};
})();

(node as any).hash = "72c5da952bc2659b4543bbf08e571171";

export default node;
