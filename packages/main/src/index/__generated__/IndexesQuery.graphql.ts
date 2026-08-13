/**
 * @generated SignedSource<<1a8ada3bf29b2080cdbd4b1bf6f07b93>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type IndexesQuery$variables = Record<PropertyKey, never>;
export type IndexesQuery$data = {
  readonly index: ReadonlyArray<{
    readonly id: string;
    readonly shareAsset: {
      readonly metadata: {
        readonly decimals: number;
        readonly description: string | null | undefined;
        readonly name: string | null | undefined;
        readonly symbol: string;
      };
    };
    readonly status: {
      readonly nav: bigint;
      readonly navPerShareChange: bigint | null | undefined;
    };
  }>;
};
export type IndexesQuery = {
  response: IndexesQuery$data;
  variables: IndexesQuery$variables;
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
  "concreteType": "IndexStatus",
  "kind": "LinkedField",
  "name": "status",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "nav",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "navPerShareChange",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v2 = {
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
      "name": "decimals",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "symbol",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
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
    "name": "IndexesQuery",
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
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Asset",
            "kind": "LinkedField",
            "name": "shareAsset",
            "plural": false,
            "selections": [
              (v2/*: any*/)
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
    "name": "IndexesQuery",
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
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Asset",
            "kind": "LinkedField",
            "name": "shareAsset",
            "plural": false,
            "selections": [
              (v2/*: any*/),
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
    "cacheID": "658a5cb49194ae3384f2ed27b85d5567",
    "id": null,
    "metadata": {},
    "name": "IndexesQuery",
    "operationKind": "query",
    "text": "query IndexesQuery {\n  index {\n    id\n    status {\n      nav\n      navPerShareChange\n    }\n    shareAsset {\n      metadata {\n        decimals\n        symbol\n        description\n        name\n      }\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "697732a2707d138f263caf74db1beefd";

export default node;
