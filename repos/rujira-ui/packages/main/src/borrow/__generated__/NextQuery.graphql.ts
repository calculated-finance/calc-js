/**
 * @generated SignedSource<<ac69b011cf6a756e8615270d54b7b62e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type NextQuery$variables = {
  id: string;
};
export type NextQuery$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"BorrowNextFragment">;
  } | null | undefined;
};
export type NextQuery = {
  response: NextQuery$data;
  variables: NextQuery$variables;
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "NextQuery",
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
            "args": null,
            "kind": "FragmentSpread",
            "name": "BorrowNextFragment"
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
    "name": "NextQuery",
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
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "salt",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "account",
                "storageKey": null
              }
            ],
            "type": "GhostCreditAccountNext",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "9eeb233be3c9461b428de3486b73ac63",
    "id": null,
    "metadata": {},
    "name": "NextQuery",
    "operationKind": "query",
    "text": "query NextQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ...BorrowNextFragment\n    id\n  }\n}\n\nfragment BorrowNextFragment on GhostCreditAccountNext {\n  salt\n  account\n  id\n}\n"
  }
};
})();

(node as any).hash = "83605242194f268ef5671001865e171a";

export default node;
