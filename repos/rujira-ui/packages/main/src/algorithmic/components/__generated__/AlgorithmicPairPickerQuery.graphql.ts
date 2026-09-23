/**
 * @generated SignedSource<<6e503af1568c5d85935e5ac0e4585a20>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AssetType = "LAYER_1" | "NATIVE" | "SECURED" | "SYNTH" | "%future added value";
export type Chain = "AVAX" | "BASE" | "BCH" | "BSC" | "BTC" | "DOGE" | "ETH" | "GAIA" | "KUJI" | "LTC" | "NOBLE" | "OSMO" | "SOL" | "TERRA" | "TERRA2" | "THOR" | "TON" | "TRON" | "TRON" | "XRP" | "%future added value";
export type AlgorithmicPairPickerQuery$variables = Record<PropertyKey, never>;
export type AlgorithmicPairPickerQuery$data = {
  readonly finV3: {
    readonly pairs: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly assetBase: {
            readonly asset: string;
            readonly chain: Chain;
            readonly metadata: {
              readonly decimals: number;
              readonly symbol: string;
            };
            readonly type: AssetType;
          };
          readonly assetQuote: {
            readonly asset: string;
            readonly chain: Chain;
            readonly metadata: {
              readonly decimals: number;
              readonly symbol: string;
            };
            readonly type: AssetType;
          };
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
  };
};
export type AlgorithmicPairPickerQuery = {
  response: AlgorithmicPairPickerQuery$data;
  variables: AlgorithmicPairPickerQuery$variables;
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
  "name": "asset",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v4 = {
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
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "decimals",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v5 = [
  (v1/*: any*/),
  (v2/*: any*/),
  (v3/*: any*/),
  (v4/*: any*/)
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = [
  (v1/*: any*/),
  (v2/*: any*/),
  (v3/*: any*/),
  (v4/*: any*/),
  (v6/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AlgorithmicPairPickerQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "FinV3",
        "kind": "LinkedField",
        "name": "finV3",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v0/*: any*/),
            "concreteType": "FinPairConnection",
            "kind": "LinkedField",
            "name": "pairs",
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
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "pairs(first:200,sortBy:\"NAME\",sortDir:\"ASC\")"
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
    "name": "AlgorithmicPairPickerQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "FinV3",
        "kind": "LinkedField",
        "name": "finV3",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v0/*: any*/),
            "concreteType": "FinPairConnection",
            "kind": "LinkedField",
            "name": "pairs",
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
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "assetBase",
                        "plural": false,
                        "selections": (v7/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "assetQuote",
                        "plural": false,
                        "selections": (v7/*: any*/),
                        "storageKey": null
                      },
                      (v6/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "pairs(first:200,sortBy:\"NAME\",sortDir:\"ASC\")"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "38da6aeef6c3152a4344eee2c778a12b",
    "id": null,
    "metadata": {},
    "name": "AlgorithmicPairPickerQuery",
    "operationKind": "query",
    "text": "query AlgorithmicPairPickerQuery {\n  finV3 {\n    pairs(first: 200, sortBy: NAME, sortDir: ASC) {\n      edges {\n        node {\n          assetBase {\n            asset\n            type\n            chain\n            metadata {\n              symbol\n              decimals\n            }\n            id\n          }\n          assetQuote {\n            asset\n            type\n            chain\n            metadata {\n              symbol\n              decimals\n            }\n            id\n          }\n          id\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "acf33cee1513d2942caa68dcace4bbb0";

export default node;
