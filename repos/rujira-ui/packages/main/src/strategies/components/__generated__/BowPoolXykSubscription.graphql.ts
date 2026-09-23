/**
 * @generated SignedSource<<8c3cdfe6a2bb56d889e05d75ba2611f6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type BowPoolXykSubscription$variables = {
  id: string;
};
export type BowPoolXykSubscription$data = {
  readonly node: {
    readonly state?: {
      readonly x: bigint;
      readonly y: bigint;
    };
  } | null | undefined;
};
export type BowPoolXykSubscription = {
  response: BowPoolXykSubscription$data;
  variables: BowPoolXykSubscription$variables;
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
      "concreteType": "BowStateXyk",
      "kind": "LinkedField",
      "name": "state",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "x",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "y",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "BowPoolXyk",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "BowPoolXykSubscription",
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
    "name": "BowPoolXykSubscription",
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
    "cacheID": "46cf02b5d643a536f113eec2a668ef23",
    "id": null,
    "metadata": {},
    "name": "BowPoolXykSubscription",
    "operationKind": "subscription",
    "text": "subscription BowPoolXykSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on BowPoolXyk {\n      state {\n        x\n        y\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "1fa420220dffaa8a376f0527608b60d1";

export default node;
