/**
 * @generated SignedSource<<f2aa48c224a3d7216b74b475c8ba69e5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MergePoolSubscription$variables = {
  id: string;
};
export type MergePoolSubscription$data = {
  readonly node: {
    readonly currentRate?: bigint;
    readonly status?: {
      readonly merged: bigint;
    } | null | undefined;
  } | null | undefined;
};
export type MergePoolSubscription = {
  response: MergePoolSubscription$data;
  variables: MergePoolSubscription$variables;
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
      "kind": "ScalarField",
      "name": "currentRate",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "MergeStatus",
      "kind": "LinkedField",
      "name": "status",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "merged",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "MergePool",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MergePoolSubscription",
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
    "name": "MergePoolSubscription",
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
    "cacheID": "ecef969a091d3b45e40985f600d1dba1",
    "id": null,
    "metadata": {},
    "name": "MergePoolSubscription",
    "operationKind": "subscription",
    "text": "subscription MergePoolSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on MergePool {\n      currentRate\n      status {\n        merged\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "58215bbded6ab39ff1e5de393a882544";

export default node;
