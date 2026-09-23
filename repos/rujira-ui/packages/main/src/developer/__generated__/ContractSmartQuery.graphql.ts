/**
 * @generated SignedSource<<718ab4ed081f58678760e26f80d8c11a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { Result } from "relay-runtime";
export type ContractSmartQuery$variables = {
  id: string;
  query: string;
};
export type ContractSmartQuery$data = {
  readonly node: Result<{
    readonly querySmart?: string | null | undefined;
  } | null | undefined, unknown>;
};
export type ContractSmartQuery = {
  response: ContractSmartQuery$data;
  variables: ContractSmartQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "query"
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
      "args": [
        {
          "kind": "Variable",
          "name": "query",
          "variableName": "query"
        }
      ],
      "kind": "ScalarField",
      "name": "querySmart",
      "storageKey": null
    }
  ],
  "type": "Contract",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ContractSmartQuery",
    "selections": [
      {
        "kind": "CatchField",
        "field": {
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
        },
        "to": "RESULT"
      }
    ],
    "type": "RootQueryType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ContractSmartQuery",
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
    "cacheID": "484e2308d7f91de7a6f624033b15ad25",
    "id": null,
    "metadata": {},
    "name": "ContractSmartQuery",
    "operationKind": "query",
    "text": "query ContractSmartQuery(\n  $id: ID!\n  $query: String!\n) {\n  node(id: $id) {\n    __typename\n    ... on Contract {\n      querySmart(query: $query)\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "362770d79d377c9f35120c68c517fda3";

export default node;
