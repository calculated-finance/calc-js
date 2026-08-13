/**
 * @generated SignedSource<<0df9bc104c796dd4b6abb421c8d0c142>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type IndexSubscription$variables = {
  id: string;
};
export type IndexSubscription$data = {
  readonly node: {
    readonly status?: {
      readonly allocations: ReadonlyArray<{
        readonly balance: bigint;
        readonly currentWeight: bigint;
        readonly price: bigint;
        readonly value: bigint;
      }>;
      readonly nav: bigint;
      readonly navChange: bigint | null | undefined;
      readonly navPerShare: bigint;
      readonly navPerShareChange: bigint | null | undefined;
      readonly navQuote: bigint | null | undefined;
      readonly redemptionRate: bigint;
    };
  } | null | undefined;
};
export type IndexSubscription = {
  response: IndexSubscription$data;
  variables: IndexSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "kind": "InlineFragment",
  "selections": [
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
              "kind": "ScalarField",
              "name": "value",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "price",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "currentWeight",
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
          "kind": "ScalarField",
          "name": "navPerShare",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "navPerShareChange",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "redemptionRate",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "navQuote",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "navChange",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "IndexVault",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "IndexSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "RootSubscriptionType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "IndexSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "f2486f28b35c8abf1613ff52cd2824de",
    "id": null,
    "metadata": {},
    "name": "IndexSubscription",
    "operationKind": "subscription",
    "text": "subscription IndexSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on IndexVault {\n      status {\n        allocations {\n          value\n          price\n          currentWeight\n          balance\n        }\n        nav\n        navPerShare\n        navPerShareChange\n        redemptionRate\n        navQuote\n        navChange\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "d728c2f8ffaaf5e2f5651ab784990598";

export default node;
