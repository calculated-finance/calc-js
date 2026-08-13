/**
 * @generated SignedSource<<b29d63a20549334e9bbc4aa223330139>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AprStatus = "AVAILABLE" | "NOT_APPLICABLE" | "SOON" | "%future added value";
export type GhostVaultSubscription$variables = {
  id: string;
};
export type GhostVaultSubscription$data = {
  readonly node: {
    readonly id?: string;
    readonly vaultStatus?: {
      readonly apr: {
        readonly status: AprStatus;
        readonly value: bigint | null | undefined;
      };
      readonly depositPool: {
        readonly size: bigint;
      };
      readonly valueUsd: bigint;
    };
  } | null | undefined;
};
export type GhostVaultSubscription = {
  response: GhostVaultSubscription$data;
  variables: GhostVaultSubscription$variables;
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
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": "vaultStatus",
  "args": null,
  "concreteType": "GhostVaultStatus",
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
          "name": "status",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "value",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "GhostVaultPool",
      "kind": "LinkedField",
      "name": "depositPool",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "size",
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
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "GhostVaultSubscription",
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
              (v3/*: any*/)
            ],
            "type": "GhostVault",
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
    "name": "GhostVaultSubscription",
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
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/)
            ],
            "type": "GhostVault",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "4c130d98a62aab6d78810d289bd62ab6",
    "id": null,
    "metadata": {},
    "name": "GhostVaultSubscription",
    "operationKind": "subscription",
    "text": "subscription GhostVaultSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on GhostVault {\n      id\n      vaultStatus: status {\n        apr {\n          status\n          value\n        }\n        depositPool {\n          size\n        }\n        valueUsd\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "bff578c0f03dcd9800836004b042194b";

export default node;
