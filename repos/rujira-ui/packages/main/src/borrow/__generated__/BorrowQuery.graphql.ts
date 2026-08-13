/**
 * @generated SignedSource<<441e8bdf203a59bab8b33e9b64e5966e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AssetType = "LAYER_1" | "NATIVE" | "SECURED" | "SYNTH" | "%future added value";
export type Chain = "AVAX" | "BASE" | "BCH" | "BSC" | "BTC" | "DOGE" | "ETH" | "GAIA" | "KUJI" | "LTC" | "NOBLE" | "OSMO" | "SOL" | "TERRA" | "TERRA2" | "THOR" | "TON" | "TRON" | "TRON" | "XRP" | "%future added value";
export type ThorchainPoolStatus = "AVAILABLE" | "STAGED" | "SUSPENDED" | "UNKNOWN" | "%future added value";
export type BorrowQuery$variables = Record<PropertyKey, never>;
export type BorrowQuery$data = {
  readonly ghostCredit: {
    readonly address: string;
    readonly adjustmentThreshold: bigint;
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
      readonly price: {
        readonly " $fragmentSpreads": FragmentRefs<"OraclePriceFragment">;
      } | null | undefined;
      readonly ratio: bigint;
    }>;
    readonly vaults: ReadonlyArray<{
      readonly borrower: {
        readonly address: string;
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
            readonly secured: {
              readonly asset: string;
              readonly chain: Chain;
              readonly metadata: {
                readonly decimals: number;
                readonly symbol: string;
              };
              readonly type: AssetType;
            } | null | undefined;
          };
        };
        readonly available: bigint;
        readonly current: bigint;
        readonly limit: bigint;
        readonly shares: bigint;
        readonly vault: {
          readonly interest: {
            readonly baseRate: bigint;
            readonly step1: bigint;
            readonly step2: bigint;
            readonly targetUtilization: bigint;
          };
          readonly status: {
            readonly debtPool: {
              readonly size: bigint;
            };
            readonly debtRate: bigint;
            readonly depositPool: {
              readonly size: bigint;
            };
          };
        };
      };
      readonly price: {
        readonly " $fragmentSpreads": FragmentRefs<"OraclePriceFragment">;
      } | null | undefined;
    }>;
    readonly " $fragmentSpreads": FragmentRefs<"BorrowVaultPricesFragment">;
  } | null | undefined;
  readonly thorchainV2: {
    readonly pools: ReadonlyArray<{
      readonly asset: {
        readonly asset: string;
        readonly chain: Chain;
        readonly metadata: {
          readonly decimals: number;
          readonly symbol: string;
        };
        readonly type: AssetType;
        readonly variants: {
          readonly secured: {
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
          } | null | undefined;
        };
      };
      readonly status: ThorchainPoolStatus;
    }>;
    readonly rune: {
      readonly metadata: {
        readonly symbol: string;
      };
      readonly price: {
        readonly current: bigint | null | undefined;
      } | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type BorrowQuery = {
  response: BorrowQuery$data;
  variables: BorrowQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "address",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "adjustmentThreshold",
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
    (v5/*: any*/),
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
v7 = {
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
},
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "AssetVariants",
  "kind": "LinkedField",
  "name": "variants",
  "plural": false,
  "selections": [
    (v7/*: any*/)
  ],
  "storageKey": null
},
v9 = [
  (v2/*: any*/),
  (v3/*: any*/),
  (v4/*: any*/),
  (v6/*: any*/),
  (v8/*: any*/)
],
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "ThorchainOraclePrice",
  "kind": "LinkedField",
  "name": "price",
  "plural": false,
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "OraclePriceFragment"
    }
  ],
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ratio",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "available",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "current",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "limit",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "shares",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "concreteType": "GhostVaultInterest",
  "kind": "LinkedField",
  "name": "interest",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "baseRate",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "step1",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "step2",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "targetUtilization",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "debtRate",
  "storageKey": null
},
v18 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "size",
    "storageKey": null
  }
],
v19 = {
  "alias": null,
  "args": null,
  "concreteType": "GhostVaultPool",
  "kind": "LinkedField",
  "name": "depositPool",
  "plural": false,
  "selections": (v18/*: any*/),
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "concreteType": "GhostVaultPool",
  "kind": "LinkedField",
  "name": "debtPool",
  "plural": false,
  "selections": (v18/*: any*/),
  "storageKey": null
},
v21 = {
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
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v24 = [
  (v13/*: any*/),
  (v23/*: any*/)
],
v25 = [
  (v2/*: any*/),
  (v3/*: any*/),
  (v4/*: any*/),
  (v6/*: any*/),
  (v8/*: any*/),
  (v23/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "BorrowQuery",
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
            "args": null,
            "kind": "FragmentSpread",
            "name": "BorrowVaultPricesFragment"
          },
          (v0/*: any*/),
          (v1/*: any*/),
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
                "selections": (v9/*: any*/),
                "storageKey": null
              },
              (v10/*: any*/),
              (v11/*: any*/)
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
              (v10/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "GhostVaultBorrower",
                "kind": "LinkedField",
                "name": "borrower",
                "plural": false,
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
                      (v3/*: any*/),
                      (v4/*: any*/),
                      (v6/*: any*/),
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
                              (v2/*: any*/),
                              (v3/*: any*/),
                              (v4/*: any*/),
                              (v6/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v7/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v12/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v15/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "GhostVault",
                    "kind": "LinkedField",
                    "name": "vault",
                    "plural": false,
                    "selections": [
                      (v16/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "GhostVaultStatus",
                        "kind": "LinkedField",
                        "name": "status",
                        "plural": false,
                        "selections": [
                          (v17/*: any*/),
                          (v19/*: any*/),
                          (v20/*: any*/)
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
        "args": null,
        "concreteType": "ThorchainV2",
        "kind": "LinkedField",
        "name": "thorchainV2",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Asset",
            "kind": "LinkedField",
            "name": "rune",
            "plural": false,
            "selections": [
              (v21/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Price",
                "kind": "LinkedField",
                "name": "price",
                "plural": false,
                "selections": [
                  (v13/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ThorchainPool",
            "kind": "LinkedField",
            "name": "pools",
            "plural": true,
            "selections": [
              (v22/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "asset",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v6/*: any*/),
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
                        "selections": (v9/*: any*/),
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
      }
    ],
    "type": "RootQueryType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "BorrowQuery",
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
            "concreteType": "GhostCreditVault",
            "kind": "LinkedField",
            "name": "vaults",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ThorchainOraclePrice",
                "kind": "LinkedField",
                "name": "price",
                "plural": false,
                "selections": (v24/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "GhostVaultBorrower",
                "kind": "LinkedField",
                "name": "borrower",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "asset",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/),
                      (v23/*: any*/),
                      (v2/*: any*/),
                      (v3/*: any*/),
                      (v4/*: any*/),
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
                              (v2/*: any*/),
                              (v3/*: any*/),
                              (v4/*: any*/),
                              (v6/*: any*/),
                              (v23/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v7/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "GhostVault",
                    "kind": "LinkedField",
                    "name": "vault",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "GhostVaultStatus",
                        "kind": "LinkedField",
                        "name": "status",
                        "plural": false,
                        "selections": [
                          (v20/*: any*/),
                          (v17/*: any*/),
                          (v19/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v23/*: any*/),
                      (v16/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v0/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v15/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v0/*: any*/),
          (v1/*: any*/),
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
                "selections": (v25/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "ThorchainOraclePrice",
                "kind": "LinkedField",
                "name": "price",
                "plural": false,
                "selections": [
                  (v23/*: any*/),
                  (v13/*: any*/)
                ],
                "storageKey": null
              },
              (v11/*: any*/)
            ],
            "storageKey": null
          },
          (v23/*: any*/)
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
            "concreteType": "Asset",
            "kind": "LinkedField",
            "name": "rune",
            "plural": false,
            "selections": [
              (v21/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Price",
                "kind": "LinkedField",
                "name": "price",
                "plural": false,
                "selections": (v24/*: any*/),
                "storageKey": null
              },
              (v23/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ThorchainPool",
            "kind": "LinkedField",
            "name": "pools",
            "plural": true,
            "selections": [
              (v22/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "asset",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v6/*: any*/),
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
                        "selections": (v25/*: any*/),
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v23/*: any*/)
                ],
                "storageKey": null
              },
              (v23/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "412eb6fcff752cf20a800a5b5a74eb66",
    "id": null,
    "metadata": {},
    "name": "BorrowQuery",
    "operationKind": "query",
    "text": "query BorrowQuery {\n  ghostCredit {\n    ...BorrowVaultPricesFragment\n    address\n    adjustmentThreshold\n    collaterals {\n      asset {\n        asset\n        type\n        chain\n        metadata {\n          symbol\n          decimals\n        }\n        variants {\n          native {\n            denom\n          }\n        }\n        id\n      }\n      price {\n        ...OraclePriceFragment\n        id\n      }\n      ratio\n    }\n    vaults {\n      price {\n        ...OraclePriceFragment\n        id\n      }\n      borrower {\n        address\n        asset {\n          asset\n          type\n          chain\n          metadata {\n            symbol\n            decimals\n          }\n          variants {\n            secured {\n              asset\n              type\n              chain\n              metadata {\n                symbol\n                decimals\n              }\n              id\n            }\n            native {\n              denom\n            }\n          }\n          id\n        }\n        available\n        current\n        limit\n        shares\n        vault {\n          interest {\n            baseRate\n            step1\n            step2\n            targetUtilization\n          }\n          status {\n            debtRate\n            depositPool {\n              size\n            }\n            debtPool {\n              size\n            }\n          }\n          id\n        }\n      }\n    }\n    id\n  }\n  thorchainV2 {\n    rune {\n      metadata {\n        symbol\n      }\n      price {\n        current\n        id\n      }\n      id\n    }\n    pools {\n      status\n      asset {\n        asset\n        type\n        chain\n        metadata {\n          symbol\n          decimals\n        }\n        variants {\n          secured {\n            asset\n            type\n            chain\n            metadata {\n              symbol\n              decimals\n            }\n            variants {\n              native {\n                denom\n              }\n            }\n            id\n          }\n        }\n        id\n      }\n      id\n    }\n  }\n}\n\nfragment BorrowVaultPricesFragment on GhostCredit {\n  vaults {\n    price {\n      current\n      id\n    }\n    borrower {\n      asset {\n        metadata {\n          symbol\n        }\n        id\n      }\n      vault {\n        status {\n          debtPool {\n            size\n          }\n        }\n        id\n      }\n    }\n  }\n}\n\nfragment OraclePriceFragment on ThorchainOraclePrice {\n  id\n  current\n}\n"
  }
};
})();

(node as any).hash = "a8ba2349fdc74b54f6848562ed952dea";

export default node;
