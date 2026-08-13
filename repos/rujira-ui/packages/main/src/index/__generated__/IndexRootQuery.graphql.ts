/**
 * @generated SignedSource<<e37df9397307930fe8b6dca9faedc1de>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type IndexRootQuery$variables = Record<PropertyKey, never>;
export type IndexRootQuery$data = {
  readonly index: ReadonlyArray<{
    readonly id: string;
    readonly shareAsset: {
      readonly metadata: {
        readonly symbol: string;
      };
    };
  }>;
};
export type IndexRootQuery = {
  response: IndexRootQuery$data;
  variables: IndexRootQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "concreteType": "Metadata",
  "kind": "LinkedField",
  "name": "metadata",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "symbol",
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "IndexRootQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "IndexVault",
        "kind": "LinkedField",
        "name": "index",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Asset",
            "kind": "LinkedField",
            "name": "shareAsset",
            "plural": false,
            "selections": [
              (v1/*: any*/)
            ],
            "storageKey": null
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
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "IndexRootQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "IndexVault",
        "kind": "LinkedField",
        "name": "index",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Asset",
            "kind": "LinkedField",
            "name": "shareAsset",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v0/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "98894257cdbcb5d1e9c25ebe1f3ac9ec",
    "id": null,
    "metadata": {},
    "name": "IndexRootQuery",
    "operationKind": "query",
    "text": "query IndexRootQuery {\n  index {\n    id\n    shareAsset {\n      metadata {\n        symbol\n      }\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "6cfd2adbd4b3d0829a46dc56c75aaf9c";

export default node;
