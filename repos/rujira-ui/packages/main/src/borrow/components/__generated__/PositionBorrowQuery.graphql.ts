/**
 * @generated SignedSource<<6457e5b7e7a61ee4f0d277490400ed52>>
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
export type PositionBorrowQuery$variables = Record<PropertyKey, never>;
export type PositionBorrowQuery$data = {
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
  } | null | undefined;
};
export type PositionBorrowQuery = {
  response: PositionBorrowQuery$data;
  variables: PositionBorrowQuery$variables;
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
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "asset",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
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
v7 = {
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
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "Asset",
  "kind": "LinkedField",
  "name": "asset",
  "plural": false,
  "selections": [
    (v3/*: any*/),
    (v4/*: any*/),
    (v5/*: any*/),
    (v6/*: any*/),
    (v7/*: any*/)
  ],
  "storageKey": null
},
v9 = {
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
v10 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "size",
    "storageKey": null
  }
],
v11 = {
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
      "concreteType": "GhostVaultPool",
      "kind": "LinkedField",
      "name": "depositPool",
      "plural": false,
      "selections": (v10/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "GhostVaultPool",
      "kind": "LinkedField",
      "name": "debtPool",
      "plural": false,
      "selections": (v10/*: any*/),
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
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "concreteType": "ThorchainOraclePrice",
  "kind": "LinkedField",
  "name": "price",
  "plural": false,
  "selections": [
    (v13/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "current",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "concreteType": "Asset",
  "kind": "LinkedField",
  "name": "asset",
  "plural": false,
  "selections": [
    (v3/*: any*/),
    (v4/*: any*/),
    (v5/*: any*/),
    (v6/*: any*/),
    (v7/*: any*/),
    (v13/*: any*/)
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "PositionBorrowQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "GhostCredit",
        "kind": "LinkedField",
        "name": "ghostCredit",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "GhostCreditVault",
            "kind": "LinkedField",
            "name": "vaults",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "GhostVaultBorrower",
                "kind": "LinkedField",
                "name": "borrower",
                "plural": false,
                "selections": [
                  (v8/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "GhostVault",
                    "kind": "LinkedField",
                    "name": "vault",
                    "plural": false,
                    "selections": [
                      (v9/*: any*/),
                      (v11/*: any*/)
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
            "concreteType": "GhostCreditCollateralConfig",
            "kind": "LinkedField",
            "name": "collaterals",
            "plural": true,
            "selections": [
              (v8/*: any*/),
              (v2/*: any*/),
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
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "PositionBorrowQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "GhostCredit",
        "kind": "LinkedField",
        "name": "ghostCredit",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "GhostCreditVault",
            "kind": "LinkedField",
            "name": "vaults",
            "plural": true,
            "selections": [
              (v14/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "GhostVaultBorrower",
                "kind": "LinkedField",
                "name": "borrower",
                "plural": false,
                "selections": [
                  (v15/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "GhostVault",
                    "kind": "LinkedField",
                    "name": "vault",
                    "plural": false,
                    "selections": [
                      (v9/*: any*/),
                      (v11/*: any*/),
                      (v13/*: any*/)
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
            "concreteType": "GhostCreditCollateralConfig",
            "kind": "LinkedField",
            "name": "collaterals",
            "plural": true,
            "selections": [
              (v15/*: any*/),
              (v14/*: any*/),
              (v12/*: any*/)
            ],
            "storageKey": null
          },
          (v13/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "e68e7be10731d84fe0149e2c09ed422c",
    "id": null,
    "metadata": {},
    "name": "PositionBorrowQuery",
    "operationKind": "query",
    "text": "query PositionBorrowQuery {\n  ghostCredit {\n    address\n    adjustmentThreshold\n    vaults {\n      price {\n        ...OraclePriceFragment\n        id\n      }\n      borrower {\n        asset {\n          asset\n          type\n          chain\n          metadata {\n            symbol\n            decimals\n          }\n          variants {\n            native {\n              denom\n            }\n          }\n          id\n        }\n        vault {\n          interest {\n            baseRate\n            step1\n            step2\n            targetUtilization\n          }\n          status {\n            depositPool {\n              size\n            }\n            debtPool {\n              size\n            }\n          }\n          id\n        }\n      }\n    }\n    collaterals {\n      asset {\n        asset\n        type\n        chain\n        metadata {\n          symbol\n          decimals\n        }\n        variants {\n          native {\n            denom\n          }\n        }\n        id\n      }\n      price {\n        ...OraclePriceFragment\n        id\n      }\n      ratio\n    }\n    id\n  }\n}\n\nfragment OraclePriceFragment on ThorchainOraclePrice {\n  id\n  current\n}\n"
  }
};
})();

(node as any).hash = "b0539a71495a8337a2711042e4db2cdb";

export default node;
