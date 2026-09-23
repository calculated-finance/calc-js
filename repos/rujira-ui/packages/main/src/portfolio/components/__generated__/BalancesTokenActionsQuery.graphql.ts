/**
 * @generated SignedSource<<ec31609c3cfec2977886552b07a2ef39>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AssetType = "LAYER_1" | "NATIVE" | "SECURED" | "SYNTH" | "%future added value";
export type Chain = "AVAX" | "BASE" | "BCH" | "BSC" | "BTC" | "DOGE" | "ETH" | "GAIA" | "KUJI" | "LTC" | "NOBLE" | "OSMO" | "SOL" | "TERRA" | "TERRA2" | "THOR" | "TON" | "TRON" | "TRON" | "XRP" | "%future added value";
export type ThorchainPoolStatus = "AVAILABLE" | "STAGED" | "SUSPENDED" | "UNKNOWN" | "%future added value";
export type BalancesTokenActionsQuery$variables = Record<PropertyKey, never>;
export type BalancesTokenActionsQuery$data = {
  readonly finV2: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly assetBase: {
          readonly chain: Chain;
          readonly metadata: {
            readonly symbol: string;
          };
          readonly type: AssetType;
        };
        readonly assetQuote: {
          readonly chain: Chain;
          readonly metadata: {
            readonly symbol: string;
          };
          readonly type: AssetType;
        };
      } | null | undefined;
    } | null | undefined> | null | undefined;
  };
  readonly ghostCredit: {
    readonly collaterals: ReadonlyArray<{
      readonly asset: {
        readonly chain: Chain;
        readonly metadata: {
          readonly symbol: string;
        };
      };
    }>;
  } | null | undefined;
  readonly strategies: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly __typename: "GhostVault";
        readonly asset: {
          readonly asset: string;
          readonly chain: Chain;
          readonly metadata: {
            readonly symbol: string;
          };
          readonly type: AssetType;
        };
      } | {
        // This will never be '%other', but we need some
        // value in case none of the concrete values match.
        readonly __typename: "%other";
      } | null | undefined;
    } | null | undefined> | null | undefined;
  };
  readonly thorchainV2: {
    readonly pools: ReadonlyArray<{
      readonly asset: {
        readonly metadata: {
          readonly symbol: string;
        };
        readonly variants: {
          readonly secured: {
            readonly metadata: {
              readonly symbol: string;
            };
          } | null | undefined;
        };
      };
      readonly status: ThorchainPoolStatus;
    }>;
  } | null | undefined;
};
export type BalancesTokenActionsQuery = {
  response: BalancesTokenActionsQuery$data;
  variables: BalancesTokenActionsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
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
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v3 = {
  "kind": "Literal",
  "name": "first",
  "value": 100
},
v4 = [
  (v3/*: any*/),
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
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v6 = [
  (v0/*: any*/),
  (v5/*: any*/),
  (v1/*: any*/)
],
v7 = [
  (v3/*: any*/),
  {
    "kind": "Literal",
    "name": "typenames",
    "value": [
      "GhostVault"
    ]
  }
],
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "asset",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v11 = [
  (v0/*: any*/),
  (v5/*: any*/),
  (v1/*: any*/),
  (v10/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "BalancesTokenActionsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "GhostCredit",
        "kind": "LinkedField",
        "name": "ghostCredit",
        "plural": false,
        "selections": [
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
                  (v0/*: any*/),
                  (v1/*: any*/)
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
        "concreteType": "ThorchainV2",
        "kind": "LinkedField",
        "name": "thorchainV2",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ThorchainPool",
            "kind": "LinkedField",
            "name": "pools",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "asset",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  {
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
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "secured",
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
        "args": (v4/*: any*/),
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
        "storageKey": "finV2(first:100,sortBy:\"VOLUME_USD\",sortDir:\"DESC\")"
      },
      {
        "alias": null,
        "args": (v7/*: any*/),
        "concreteType": "StrategyConnection",
        "kind": "LinkedField",
        "name": "strategies",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "StrategyEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v8/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "asset",
                        "plural": false,
                        "selections": [
                          (v9/*: any*/),
                          (v0/*: any*/),
                          (v5/*: any*/),
                          (v1/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "type": "GhostVault",
                    "abstractKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "strategies(first:100,typenames:[\"GhostVault\"])"
      }
    ],
    "type": "RootQueryType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "BalancesTokenActionsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "GhostCredit",
        "kind": "LinkedField",
        "name": "ghostCredit",
        "plural": false,
        "selections": [
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
                  (v0/*: any*/),
                  (v1/*: any*/),
                  (v10/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v10/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "ThorchainV2",
        "kind": "LinkedField",
        "name": "thorchainV2",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ThorchainPool",
            "kind": "LinkedField",
            "name": "pools",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "asset",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  {
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
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "secured",
                        "plural": false,
                        "selections": [
                          (v1/*: any*/),
                          (v10/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v10/*: any*/)
                ],
                "storageKey": null
              },
              (v10/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v4/*: any*/),
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
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "assetBase",
                    "plural": false,
                    "selections": (v11/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "assetQuote",
                    "plural": false,
                    "selections": (v11/*: any*/),
                    "storageKey": null
                  },
                  (v10/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "finV2(first:100,sortBy:\"VOLUME_USD\",sortDir:\"DESC\")"
      },
      {
        "alias": null,
        "args": (v7/*: any*/),
        "concreteType": "StrategyConnection",
        "kind": "LinkedField",
        "name": "strategies",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "StrategyEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v8/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "asset",
                        "plural": false,
                        "selections": [
                          (v9/*: any*/),
                          (v0/*: any*/),
                          (v5/*: any*/),
                          (v1/*: any*/),
                          (v10/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "type": "GhostVault",
                    "abstractKey": null
                  },
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v10/*: any*/)
                    ],
                    "type": "Node",
                    "abstractKey": "__isNode"
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "strategies(first:100,typenames:[\"GhostVault\"])"
      }
    ]
  },
  "params": {
    "cacheID": "12c32622714060429ee3bf39e4008caa",
    "id": null,
    "metadata": {},
    "name": "BalancesTokenActionsQuery",
    "operationKind": "query",
    "text": "query BalancesTokenActionsQuery {\n  ghostCredit {\n    collaterals {\n      asset {\n        chain\n        metadata {\n          symbol\n        }\n        id\n      }\n    }\n    id\n  }\n  thorchainV2 {\n    pools {\n      status\n      asset {\n        metadata {\n          symbol\n        }\n        variants {\n          secured {\n            metadata {\n              symbol\n            }\n            id\n          }\n        }\n        id\n      }\n      id\n    }\n  }\n  finV2(first: 100, sortBy: VOLUME_USD, sortDir: DESC) {\n    edges {\n      node {\n        assetBase {\n          chain\n          type\n          metadata {\n            symbol\n          }\n          id\n        }\n        assetQuote {\n          chain\n          type\n          metadata {\n            symbol\n          }\n          id\n        }\n        id\n      }\n    }\n  }\n  strategies(first: 100, typenames: [\"GhostVault\"]) {\n    edges {\n      node {\n        __typename\n        ... on GhostVault {\n          asset {\n            asset\n            chain\n            type\n            metadata {\n              symbol\n            }\n            id\n          }\n        }\n        ... on Node {\n          __isNode: __typename\n          id\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "4c1f57f00e20a5b39b56b9b4a7f8c5f2";

export default node;
