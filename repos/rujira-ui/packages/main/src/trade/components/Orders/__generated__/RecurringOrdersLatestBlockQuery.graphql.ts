/**
 * @generated SignedSource<<b0573908ebb5e5cfad2f8d1fc4a675cf>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type RecurringOrdersLatestBlockQuery$variables = {
  id: string;
};
export type RecurringOrdersLatestBlockQuery$data = {
  readonly node: {
    readonly header?: {
      readonly height: bigint;
      readonly time: any;
    };
    readonly id?: string;
  } | null | undefined;
};
export type RecurringOrdersLatestBlockQuery = {
  response: RecurringOrdersLatestBlockQuery$data;
  variables: RecurringOrdersLatestBlockQuery$variables;
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
  "concreteType": "ThorchainBlockHeader",
  "kind": "LinkedField",
  "name": "header",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "height",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "time",
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
    "name": "RecurringOrdersLatestBlockQuery",
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
            "type": "ThorchainBlock",
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
    "name": "RecurringOrdersLatestBlockQuery",
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
            "type": "ThorchainBlock",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "ba0842bee67331adb3d341001fd40479",
    "id": null,
    "metadata": {},
    "name": "RecurringOrdersLatestBlockQuery",
    "operationKind": "query",
    "text": "query RecurringOrdersLatestBlockQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on ThorchainBlock {\n      id\n      header {\n        height\n        time\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "1430e66f582e657209e1b791330def20";

export default node;
