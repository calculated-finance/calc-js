/**
 * @generated SignedSource<<5aeede9d08b7599fd7fce2448f4b3a07>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AprStatus = "AVAILABLE" | "NOT_APPLICABLE" | "SOON" | "%future added value";
export type IndexVaultSubscription$variables = {
  id: string;
};
export type IndexVaultSubscription$data = {
  readonly node: {
    readonly status?: {
      readonly allocations: ReadonlyArray<{
        readonly balance: bigint;
      }>;
      readonly apr: {
        readonly status: AprStatus;
        readonly value: bigint | null | undefined;
      };
      readonly nav: bigint;
    };
  } | null | undefined;
};
export type IndexVaultSubscription = {
  response: IndexVaultSubscription$data;
  variables: IndexVaultSubscription$variables;
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
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "IndexVaultSubscription",
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
    "name": "IndexVaultSubscription",
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
    "cacheID": "fe422b025fa601eadecbcabec4708c0e",
    "id": null,
    "metadata": {},
    "name": "IndexVaultSubscription",
    "operationKind": "subscription",
    "text": "subscription IndexVaultSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on IndexVault {\n      status {\n        allocations {\n          balance\n        }\n        nav\n        apr {\n          value\n          status\n        }\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "5bbfa24ff2d39a741221684cd0bffad9";

export default node;
