/**
 * @generated SignedSource<<391fe47b9d819542f2144ef18969bfee>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type StakePoolPageSwapTargetsQuery$variables = Record<PropertyKey, never>;
export type StakePoolPageSwapTargetsQuery$data = {
  readonly finV2: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly address: string;
        readonly assetBase: {
          readonly metadata: {
            readonly symbol: string;
          };
        };
        readonly assetQuote: {
          readonly metadata: {
            readonly symbol: string;
          };
        };
      } | null | undefined;
    } | null | undefined> | null | undefined;
  };
};
export type StakePoolPageSwapTargetsQuery = {
  response: StakePoolPageSwapTargetsQuery$data;
  variables: StakePoolPageSwapTargetsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 200
  },
  {
    "kind": "Literal",
    "name": "sortBy",
    "value": "NAME"
  },
  {
    "kind": "Literal",
    "name": "sortDir",
    "value": "ASC"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "address",
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
      "name": "symbol",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v3 = [
  (v2/*: any*/)
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = [
  (v2/*: any*/),
  (v4/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "StakePoolPageSwapTargetsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "FinPairConnection",
        "kind": "LinkedField",
        "name": "finV2",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "FinPairEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "FinPair",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "assetBase",
                    "plural": false,
                    "selections": (v3/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "assetQuote",
                    "plural": false,
                    "selections": (v3/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "finV2(first:200,sortBy:\"NAME\",sortDir:\"ASC\")"
      }
    ],
    "type": "RootQueryType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "StakePoolPageSwapTargetsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "FinPairConnection",
        "kind": "LinkedField",
        "name": "finV2",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "FinPairEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "FinPair",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "assetBase",
                    "plural": false,
                    "selections": (v5/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "assetQuote",
                    "plural": false,
                    "selections": (v5/*: any*/),
                    "storageKey": null
                  },
                  (v4/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "finV2(first:200,sortBy:\"NAME\",sortDir:\"ASC\")"
      }
    ]
  },
  "params": {
    "cacheID": "0c8e6e2252b3b65a2b6ba708b8ee75b5",
    "id": null,
    "metadata": {},
    "name": "StakePoolPageSwapTargetsQuery",
    "operationKind": "query",
    "text": "query StakePoolPageSwapTargetsQuery {\n  finV2(first: 200, sortBy: NAME, sortDir: ASC) {\n    edges {\n      node {\n        address\n        assetBase {\n          metadata {\n            symbol\n          }\n          id\n        }\n        assetQuote {\n          metadata {\n            symbol\n          }\n          id\n        }\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "e95c5618307bc3c61497ee96d67979c0";

export default node;
