/**
 * @generated SignedSource<<6149859a640583136b147e6ad42dd7eb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AssetType = "LAYER_1" | "NATIVE" | "SECURED" | "SYNTH" | "%future added value";
export type Chain = "AVAX" | "BASE" | "BCH" | "BSC" | "BTC" | "DOGE" | "ETH" | "GAIA" | "KUJI" | "LTC" | "NOBLE" | "OSMO" | "SOL" | "TERRA" | "TERRA2" | "THOR" | "TON" | "TRON" | "TRON" | "XRP" | "%future added value";
export type AlgorithmicLeaderboardPairsQuery$variables = Record<PropertyKey, never>;
export type AlgorithmicLeaderboardPairsQuery$data = {
  readonly finV3: {
    readonly pairs: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly address: string;
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
export type AlgorithmicLeaderboardPairsQuery = {
  response: AlgorithmicLeaderboardPairsQuery$data;
  variables: AlgorithmicLeaderboardPairsQuery$variables;
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
  "kind": "ScalarField",
  "name": "asset",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v5 = {
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
v6 = [
  (v2/*: any*/),
  (v3/*: any*/),
  (v4/*: any*/),
  (v5/*: any*/)
],
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v8 = [
  (v2/*: any*/),
  (v3/*: any*/),
  (v4/*: any*/),
  (v5/*: any*/),
  (v7/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AlgorithmicLeaderboardPairsQuery",
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
                      (v1/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "assetBase",
                        "plural": false,
                        "selections": (v6/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "assetQuote",
                        "plural": false,
                        "selections": (v6/*: any*/),
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
    "name": "AlgorithmicLeaderboardPairsQuery",
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
                      (v1/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "assetBase",
                        "plural": false,
                        "selections": (v8/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "assetQuote",
                        "plural": false,
                        "selections": (v8/*: any*/),
                        "storageKey": null
                      },
                      (v7/*: any*/)
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
    "cacheID": "96f8046630f35288a6ad689228329dd5",
    "id": null,
    "metadata": {},
    "name": "AlgorithmicLeaderboardPairsQuery",
    "operationKind": "query",
    "text": "query AlgorithmicLeaderboardPairsQuery {\n  finV3 {\n    pairs(first: 200, sortBy: NAME, sortDir: ASC) {\n      edges {\n        node {\n          address\n          assetBase {\n            asset\n            type\n            chain\n            metadata {\n              symbol\n              decimals\n            }\n            id\n          }\n          assetQuote {\n            asset\n            type\n            chain\n            metadata {\n              symbol\n              decimals\n            }\n            id\n          }\n          id\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "e1397f436a02c00b0a3e11e3a09a5af0";

export default node;
