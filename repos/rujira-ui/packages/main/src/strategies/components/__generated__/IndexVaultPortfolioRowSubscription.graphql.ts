/**
 * @generated SignedSource<<c001bce628e8bdc7e8d6b64044e41fa7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AprStatus = "AVAILABLE" | "NOT_APPLICABLE" | "SOON" | "%future added value";
export type IndexVaultPortfolioRowSubscription$variables = {
  id: string;
};
export type IndexVaultPortfolioRowSubscription$data = {
  readonly node: {
    readonly index?: {
      readonly status: {
        readonly allocations: ReadonlyArray<{
          readonly currentWeight: bigint;
        }>;
        readonly apr: {
          readonly status: AprStatus;
          readonly value: bigint | null | undefined;
        };
      };
    };
    readonly shares?: bigint;
    readonly sharesValue?: bigint;
  } | null | undefined;
};
export type IndexVaultPortfolioRowSubscription = {
  response: IndexVaultPortfolioRowSubscription$data;
  variables: IndexVaultPortfolioRowSubscription$variables;
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "sharesValue",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "shares",
  "storageKey": null
},
v4 = {
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
          "kind": "ScalarField",
          "name": "currentWeight",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "IndexVaultPortfolioRowSubscription",
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
            "kind": "InlineFragment",
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "IndexVault",
                "kind": "LinkedField",
                "name": "index",
                "plural": false,
                "selections": [
                  (v4/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "IndexAccount",
            "abstractKey": null
          }
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
    "name": "IndexVaultPortfolioRowSubscription",
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
          {
            "kind": "InlineFragment",
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "IndexVault",
                "kind": "LinkedField",
                "name": "index",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  (v5/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "IndexAccount",
            "abstractKey": null
          },
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "be1a7e309aba318516be589a5fa47d9c",
    "id": null,
    "metadata": {},
    "name": "IndexVaultPortfolioRowSubscription",
    "operationKind": "subscription",
    "text": "subscription IndexVaultPortfolioRowSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on IndexAccount {\n      sharesValue\n      shares\n      index {\n        status {\n          apr {\n            value\n            status\n          }\n          allocations {\n            currentWeight\n          }\n        }\n        id\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "1306f24f81697e58461ce14402f74c8e";

export default node;
