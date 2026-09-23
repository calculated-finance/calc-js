/**
 * @generated SignedSource<<c121b53312d009d6a8d5a55afc71cf95>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AssetType = "LAYER_1" | "NATIVE" | "SECURED" | "SYNTH" | "%future added value";
export type Chain = "AVAX" | "BASE" | "BCH" | "BSC" | "BTC" | "DOGE" | "ETH" | "GAIA" | "KUJI" | "LTC" | "NOBLE" | "OSMO" | "SOL" | "TERRA" | "TERRA2" | "THOR" | "TON" | "TRON" | "TRON" | "XRP" | "%future added value";
export type PositionSwapConfigQuery$variables = {
  query: string;
};
export type PositionSwapConfigQuery$data = {
  readonly finV2: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly address: string;
        readonly assetBase: {
          readonly asset: string;
          readonly metadata: {
            readonly symbol: string;
          };
        };
        readonly assetQuote: {
          readonly asset: string;
          readonly metadata: {
            readonly symbol: string;
          };
        };
        readonly id: string;
      } | null | undefined;
    } | null | undefined> | null | undefined;
  };
  readonly ghostCredit: {
    readonly address: string;
    readonly collaterals: ReadonlyArray<{
      readonly asset: {
        readonly asset: string;
        readonly chain: Chain;
        readonly metadata: {
          readonly decimals: number;
          readonly symbol: string;
        };
        readonly type: AssetType;
        readonly variants: {
          readonly native: {
            readonly denom: string;
          } | null | undefined;
        };
      };
      readonly ratio: bigint;
    }>;
  } | null | undefined;
};
export type PositionSwapConfigQuery = {
  response: PositionSwapConfigQuery$data;
  variables: PositionSwapConfigQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "query"
  }
],
v1 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 20
  },
  {
    "kind": "Variable",
    "name": "query",
    "variableName": "query"
  },
  {
    "kind": "Literal",
    "name": "sortBy",
    "value": "VOLUME_USD"
  },
  {
    "kind": "Literal",
    "name": "sortDir",
    "value": "DESC"
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
  "name": "address",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "asset",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "symbol",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "concreteType": "Metadata",
  "kind": "LinkedField",
  "name": "metadata",
  "plural": false,
  "selections": [
    (v5/*: any*/)
  ],
  "storageKey": null
},
v7 = [
  (v4/*: any*/),
  (v6/*: any*/)
],
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v10 = {
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
    (v5/*: any*/)
  ],
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "concreteType": "AssetVariants",
  "kind": "LinkedField",
  "name": "variants",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Denom",
      "kind": "LinkedField",
      "name": "native",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "denom",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ratio",
  "storageKey": null
},
v13 = [
  (v4/*: any*/),
  (v6/*: any*/),
  (v2/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PositionSwapConfigQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
                  (v2/*: any*/),
                  (v3/*: any*/),
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
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "GhostCredit",
        "kind": "LinkedField",
        "name": "ghostCredit",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "GhostCreditCollateralConfig",
            "kind": "LinkedField",
            "name": "collaterals",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "asset",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v11/*: any*/)
                ],
                "storageKey": null
              },
              (v12/*: any*/)
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PositionSwapConfigQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
                  (v2/*: any*/),
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "assetBase",
                    "plural": false,
                    "selections": (v13/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "assetQuote",
                    "plural": false,
                    "selections": (v13/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "GhostCredit",
        "kind": "LinkedField",
        "name": "ghostCredit",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "GhostCreditCollateralConfig",
            "kind": "LinkedField",
            "name": "collaterals",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "asset",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v2/*: any*/)
                ],
                "storageKey": null
              },
              (v12/*: any*/)
            ],
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "c09b095d7ac5cdb22ef323bcec7d05f9",
    "id": null,
    "metadata": {},
    "name": "PositionSwapConfigQuery",
    "operationKind": "query",
    "text": "query PositionSwapConfigQuery(\n  $query: String!\n) {\n  finV2(first: 20, query: $query, sortBy: VOLUME_USD, sortDir: DESC) {\n    edges {\n      node {\n        id\n        address\n        assetBase {\n          asset\n          metadata {\n            symbol\n          }\n          id\n        }\n        assetQuote {\n          asset\n          metadata {\n            symbol\n          }\n          id\n        }\n      }\n    }\n  }\n  ghostCredit {\n    address\n    collaterals {\n      asset {\n        asset\n        type\n        chain\n        metadata {\n          decimals\n          symbol\n        }\n        variants {\n          native {\n            denom\n          }\n        }\n        id\n      }\n      ratio\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "9f38cc7b8c7291c96b582da766ca1542";

export default node;
