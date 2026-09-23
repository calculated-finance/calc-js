/**
 * @generated SignedSource<<cd875b07402dd9c4c9f084cf6b6805f6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type BalanceMergeSubscription$variables = {
  id: string;
};
export type BalanceMergeSubscription$data = {
  readonly node: {
    readonly shares?: bigint;
    readonly size?: {
      readonly amount: bigint;
    };
  } | null | undefined;
};
export type BalanceMergeSubscription = {
  response: BalanceMergeSubscription$data;
  variables: BalanceMergeSubscription$variables;
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
      "name": "shares",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Balance",
      "kind": "LinkedField",
      "name": "size",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "amount",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "MergeAccount",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "BalanceMergeSubscription",
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
    "name": "BalanceMergeSubscription",
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
    "cacheID": "c7a24783bfb959abcfb2e43e128e8768",
    "id": null,
    "metadata": {},
    "name": "BalanceMergeSubscription",
    "operationKind": "subscription",
    "text": "subscription BalanceMergeSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on MergeAccount {\n      shares\n      size {\n        amount\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "5567851369b769ee26c0728853db27c5";

export default node;
