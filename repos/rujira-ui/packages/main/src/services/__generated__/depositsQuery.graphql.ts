/**
 * @generated SignedSource<<ea7e3cf4fa5141e2519e091eab1934a6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type depositsQuery$variables = {
  ids: ReadonlyArray<string>;
};
export type depositsQuery$data = {
  readonly nodes: ReadonlyArray<{
    readonly finalizedEvents?: ReadonlyArray<{
      readonly attributes: ReadonlyArray<{
        readonly key: string;
        readonly value: string;
      }>;
      readonly type: string;
    }> | null | undefined;
    readonly finalizedHeight?: number | null | undefined;
    readonly id?: string;
  }>;
};
export type depositsQuery = {
  response: depositsQuery$data;
  variables: depositsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "ids"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "ids",
    "variableName": "ids"
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
    "name": "depositsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "nodes",
        "plural": true,
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
    "type": "RootQueryType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "depositsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "nodes",
        "plural": true,
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
    "cacheID": "8f5651dccb7c2fdd33adc119867e642c",
    "id": null,
    "metadata": {},
    "name": "depositsQuery",
    "operationKind": "query",
    "text": "query depositsQuery(\n  $ids: [ID!]!\n) {\n  nodes(ids: $ids) {\n    __typename\n    ... on ThorchainTxIn {\n      id\n      finalizedHeight\n      finalizedEvents {\n        type\n        attributes {\n          key\n          value\n        }\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "30d520360a0df2df1940eefb86bc9c0d";

export default node;
