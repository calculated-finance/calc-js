/**
 * @generated SignedSource<<05689bcb4312beba1d447515243543e4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type depositsSubscription$variables = {
  id: string;
};
export type depositsSubscription$data = {
  readonly node: {
    readonly finalizedEvents?: ReadonlyArray<{
      readonly attributes: ReadonlyArray<{
        readonly key: string;
        readonly value: string;
      }>;
      readonly type: string;
    }> | null | undefined;
    readonly finalizedHeight?: number | null | undefined;
    readonly id?: string;
  } | null | undefined;
};
export type depositsSubscription = {
  response: depositsSubscription$data;
  variables: depositsSubscription$variables;
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "finalizedHeight",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "concreteType": "ThorchainBlockEvent",
  "kind": "LinkedField",
  "name": "finalizedEvents",
  "plural": true,
  "selections": [
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
      "concreteType": "ThorchainBlockEventAttribute",
      "kind": "LinkedField",
      "name": "attributes",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "key",
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
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "depositsSubscription",
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
              (v4/*: any*/)
            ],
            "type": "ThorchainTxIn",
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
    "name": "depositsSubscription",
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
              (v3/*: any*/),
              (v4/*: any*/)
            ],
            "type": "ThorchainTxIn",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "9d394d708f18a5ff5666bf46a61a84cf",
    "id": null,
    "metadata": {},
    "name": "depositsSubscription",
    "operationKind": "subscription",
    "text": "subscription depositsSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on ThorchainTxIn {\n      id\n      finalizedHeight\n      finalizedEvents {\n        type\n        attributes {\n          key\n          value\n        }\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "075cff48495eed9a6d7616448f537405";

export default node;
