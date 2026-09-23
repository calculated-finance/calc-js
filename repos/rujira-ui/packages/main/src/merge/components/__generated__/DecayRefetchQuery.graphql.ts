/**
 * @generated SignedSource<<4f6a654b576ac7a6f6c522469c7341ec>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DecayRefetchQuery$variables = {
  id: string;
};
export type DecayRefetchQuery$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"DecayFragment">;
  } | null | undefined;
};
export type DecayRefetchQuery = {
  response: DecayRefetchQuery$data;
  variables: DecayRefetchQuery$variables;
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
    "name": "DecayRefetchQuery",
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
            "name": "DecayFragment"
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
    "name": "DecayRefetchQuery",
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
                "name": "startRate",
                "storageKey": null
              },
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
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "40bb53abeb1ed596116143974f8be560",
    "id": null,
    "metadata": {},
    "name": "DecayRefetchQuery",
    "operationKind": "query",
    "text": "query DecayRefetchQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ...DecayFragment\n    id\n  }\n}\n\nfragment DecayFragment on MergePool {\n  id\n  startRate\n  currentRate\n}\n"
  }
};
})();

(node as any).hash = "24fe1cad02c8277136b3d74b627cb00d";

export default node;
