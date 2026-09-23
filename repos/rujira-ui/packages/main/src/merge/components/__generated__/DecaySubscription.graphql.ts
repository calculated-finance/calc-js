/**
 * @generated SignedSource<<783d68ec3900df06bcf017157ea3d76c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DecaySubscription$variables = {
  id: string;
};
export type DecaySubscription$data = {
  readonly node: {
    readonly currentRate?: bigint;
  } | null | undefined;
};
export type DecaySubscription = {
  response: DecaySubscription$data;
  variables: DecaySubscription$variables;
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
    "name": "DecaySubscription",
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
    "name": "DecaySubscription",
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
    "cacheID": "1412b808ff0a8cb2f2340793f0461266",
    "id": null,
    "metadata": {},
    "name": "DecaySubscription",
    "operationKind": "subscription",
    "text": "subscription DecaySubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on MergePool {\n      currentRate\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "ec5e9f0b93315f61203d43f4480336e6";

export default node;
