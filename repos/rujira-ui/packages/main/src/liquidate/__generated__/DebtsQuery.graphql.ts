/**
 * @generated SignedSource<<312e0fa45a3106d68446e1ea22b09535>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AprStatus = "AVAILABLE" | "NOT_APPLICABLE" | "SOON" | "%future added value";
export type AssetType = "LAYER_1" | "NATIVE" | "SECURED" | "SYNTH" | "%future added value";
export type Chain = "AVAX" | "BASE" | "BCH" | "BSC" | "BTC" | "DOGE" | "ETH" | "GAIA" | "KUJI" | "LTC" | "NOBLE" | "OSMO" | "SOL" | "TERRA" | "TERRA2" | "THOR" | "TON" | "TRON" | "TRON" | "XRP" | "%future added value";
export type DebtsQuery$variables = Record<PropertyKey, never>;
export type DebtsQuery$data = {
  readonly ghostCredit: {
    readonly collaterals: ReadonlyArray<{
      readonly asset: {
        readonly metadata: {
          readonly symbol: string;
        };
      };
      readonly ratio: bigint;
    }>;
    readonly vaults: ReadonlyArray<{
      readonly borrower: {
        readonly current: bigint;
        readonly limit: bigint;
        readonly vault: {
          readonly address: string;
        };
      };
    }>;
  } | null | undefined;
  readonly strategies: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly __typename: "GhostVault";
        readonly address: string;
        readonly asset: {
          readonly asset: string;
          readonly chain: Chain;
          readonly metadata: {
            readonly decimals: number;
            readonly symbol: string;
          };
          readonly price: {
            readonly current: bigint | null | undefined;
          } | null | undefined;
          readonly type: AssetType;
          readonly variants: {
            readonly native: {
              readonly denom: string;
            } | null | undefined;
          };
        };
        readonly id: string;
        readonly status: {
          readonly apr: {
            readonly status: AprStatus;
            readonly value: bigint | null | undefined;
          };
          readonly debtPool: {
            readonly size: bigint;
          };
          readonly debtRate: bigint;
          readonly depositPool: {
            readonly size: bigint;
          };
          readonly lendRate: bigint;
          readonly utilizationRatio: bigint;
          readonly valueUsd: bigint;
        };
      } | {
        // This will never be '%other', but we need some
        // value in case none of the concrete values match.
        readonly __typename: "%other";
      } | null | undefined;
    } | null | undefined> | null | undefined;
  };
};
export type DebtsQuery = {
  response: DebtsQuery$data;
  variables: DebtsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ratio",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "symbol",
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
    (v1/*: any*/)
  ],
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "limit",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "current",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "address",
  "storageKey": null
},
v6 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  },
  {
    "kind": "Literal",
    "name": "typenames",
    "value": [
      "GhostVault"
    ]
  }
],
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
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
  "name": "type",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "concreteType": "Metadata",
  "kind": "LinkedField",
  "name": "metadata",
  "plural": false,
  "selections": [
    (v1/*: any*/),
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
v13 = {
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
v14 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "size",
    "storageKey": null
  }
],
v15 = {
  "alias": null,
  "args": null,
  "concreteType": "GhostVaultStatus",
  "kind": "LinkedField",
  "name": "status",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "utilizationRatio",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "GhostVaultPool",
      "kind": "LinkedField",
      "name": "debtPool",
      "plural": false,
      "selections": (v14/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "GhostVaultPool",
      "kind": "LinkedField",
      "name": "depositPool",
      "plural": false,
      "selections": (v14/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "valueUsd",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Apr",
      "kind": "LinkedField",
      "name": "apr",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "status",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "value",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "debtRate",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "lendRate",
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
    "name": "DebtsQuery",
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
              (v0/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "asset",
                "plural": false,
                "selections": [
                  (v2/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "GhostCreditVault",
            "kind": "LinkedField",
            "name": "vaults",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "GhostVaultBorrower",
                "kind": "LinkedField",
                "name": "borrower",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "GhostVault",
                    "kind": "LinkedField",
                    "name": "vault",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/)
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
        "args": (v6/*: any*/),
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
                  (v7/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v8/*: any*/),
                      (v5/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "asset",
                        "plural": false,
                        "selections": [
                          (v9/*: any*/),
                          (v10/*: any*/),
                          (v11/*: any*/),
                          (v12/*: any*/),
                          (v13/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Price",
                            "kind": "LinkedField",
                            "name": "price",
                            "plural": false,
                            "selections": [
                              (v4/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v15/*: any*/)
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
    "name": "DebtsQuery",
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
              (v0/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "asset",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v8/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "GhostCreditVault",
            "kind": "LinkedField",
            "name": "vaults",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "GhostVaultBorrower",
                "kind": "LinkedField",
                "name": "borrower",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "GhostVault",
                    "kind": "LinkedField",
                    "name": "vault",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      (v8/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v8/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v6/*: any*/),
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
                  (v7/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v8/*: any*/),
                      (v5/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "asset",
                        "plural": false,
                        "selections": [
                          (v9/*: any*/),
                          (v10/*: any*/),
                          (v11/*: any*/),
                          (v12/*: any*/),
                          (v13/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Price",
                            "kind": "LinkedField",
                            "name": "price",
                            "plural": false,
                            "selections": [
                              (v4/*: any*/),
                              (v8/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v8/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v15/*: any*/)
                    ],
                    "type": "GhostVault",
                    "abstractKey": null
                  },
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v8/*: any*/)
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
    "cacheID": "fa94d3b318a753a193ac3b2122d56d4e",
    "id": null,
    "metadata": {},
    "name": "DebtsQuery",
    "operationKind": "query",
    "text": "query DebtsQuery {\n  ghostCredit {\n    collaterals {\n      ratio\n      asset {\n        metadata {\n          symbol\n        }\n        id\n      }\n    }\n    vaults {\n      borrower {\n        limit\n        current\n        vault {\n          address\n          id\n        }\n      }\n    }\n    id\n  }\n  strategies(first: 100, typenames: [\"GhostVault\"]) {\n    edges {\n      node {\n        __typename\n        ... on GhostVault {\n          id\n          address\n          asset {\n            asset\n            type\n            chain\n            metadata {\n              symbol\n              decimals\n            }\n            variants {\n              native {\n                denom\n              }\n            }\n            price {\n              current\n              id\n            }\n            id\n          }\n          status {\n            utilizationRatio\n            debtPool {\n              size\n            }\n            depositPool {\n              size\n            }\n            valueUsd\n            apr {\n              status\n              value\n            }\n            debtRate\n            lendRate\n          }\n        }\n        ... on Node {\n          __isNode: __typename\n          id\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d2643984cbac09675b5043267fc8ecda";

export default node;
