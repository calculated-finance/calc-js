/**
 * @generated SignedSource<<6b09e11343b3d408cc22f0d8be637cce>>
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
export type IndexQuery$variables = {
  id: string;
};
export type IndexQuery$data = {
  readonly node: {
    readonly address?: string;
    readonly config?: {
      readonly quoteAsset: {
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
    };
    readonly entryAdapter?: string | null | undefined;
    readonly id?: string;
    readonly shareAsset?: {
      readonly asset: string;
      readonly metadata: {
        readonly decimals: number;
        readonly description: string | null | undefined;
        readonly display: string | null | undefined;
        readonly name: string | null | undefined;
        readonly symbol: string;
      };
      readonly variants: {
        readonly native: {
          readonly denom: string;
        } | null | undefined;
      };
    };
    readonly status?: {
      readonly nav: bigint;
      readonly navChange: bigint | null | undefined;
      readonly navPerShare: bigint;
      readonly navPerShareChange: bigint | null | undefined;
      readonly navQuote: bigint | null | undefined;
      readonly redemptionRate: bigint;
      readonly totalShares: bigint;
      readonly " $fragmentSpreads": FragmentRefs<"AllocationFragment" | "PartialWithdrawFragment">;
    };
    readonly type?: string;
    readonly " $fragmentSpreads": FragmentRefs<"FAQFragment">;
  } | null | undefined;
};
export type IndexQuery = {
  response: IndexQuery$data;
  variables: IndexQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
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
  "name": "totalShares",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "nav",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "navPerShare",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "redemptionRate",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "navQuote",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "navChange",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "navPerShareChange",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "asset",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "decimals",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "symbol",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "concreteType": "Metadata",
  "kind": "LinkedField",
  "name": "metadata",
  "plural": false,
  "selections": [
    (v14/*: any*/),
    (v15/*: any*/)
  ],
  "storageKey": null
},
v17 = {
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
v18 = {
  "alias": null,
  "args": null,
  "concreteType": "Metadata",
  "kind": "LinkedField",
  "name": "metadata",
  "plural": false,
  "selections": [
    (v14/*: any*/),
    (v15/*: any*/),
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
      "name": "display",
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
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entryAdapter",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "IndexQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "IndexStatus",
                "kind": "LinkedField",
                "name": "status",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "AllocationFragment"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "PartialWithdrawFragment"
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "IndexConfig",
                "kind": "LinkedField",
                "name": "config",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "quoteAsset",
                    "plural": false,
                    "selections": [
                      (v11/*: any*/),
                      (v12/*: any*/),
                      (v13/*: any*/),
                      (v16/*: any*/),
                      (v17/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "shareAsset",
                "plural": false,
                "selections": [
                  (v11/*: any*/),
                  (v18/*: any*/),
                  (v17/*: any*/)
                ],
                "storageKey": null
              },
              (v19/*: any*/),
              (v12/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "FAQFragment"
              }
            ],
            "type": "IndexVault",
            "abstractKey": null
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
    "name": "IndexQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "IndexStatus",
                "kind": "LinkedField",
                "name": "status",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "IndexAllocation",
                    "kind": "LinkedField",
                    "name": "allocations",
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
                          (v11/*: any*/),
                          (v16/*: any*/),
                          (v17/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Price",
                            "kind": "LinkedField",
                            "name": "price",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "changeDay",
                                "storageKey": null
                              },
                              (v2/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v2/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "value",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "price",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "targetWeight",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "currentWeight",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "balance",
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
                "concreteType": "IndexConfig",
                "kind": "LinkedField",
                "name": "config",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "quoteAsset",
                    "plural": false,
                    "selections": [
                      (v11/*: any*/),
                      (v12/*: any*/),
                      (v13/*: any*/),
                      (v16/*: any*/),
                      (v17/*: any*/),
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
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "shareAsset",
                "plural": false,
                "selections": [
                  (v11/*: any*/),
                  (v18/*: any*/),
                  (v17/*: any*/),
                  (v2/*: any*/)
                ],
                "storageKey": null
              },
              (v19/*: any*/),
              (v12/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "IndexFees",
                "kind": "LinkedField",
                "name": "fees",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "IndexFeesRates",
                    "kind": "LinkedField",
                    "name": "rates",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "management",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "transaction",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "IndexVault",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "5be5c02c81053b689c379e8ed0f3a526",
    "id": null,
    "metadata": {},
    "name": "IndexQuery",
    "operationKind": "query",
    "text": "query IndexQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on IndexVault {\n      id\n      address\n      status {\n        totalShares\n        nav\n        navPerShare\n        redemptionRate\n        navQuote\n        navChange\n        navPerShareChange\n        ...AllocationFragment\n        ...PartialWithdrawFragment\n      }\n      config {\n        quoteAsset {\n          asset\n          type\n          chain\n          metadata {\n            decimals\n            symbol\n          }\n          variants {\n            native {\n              denom\n            }\n          }\n          id\n        }\n      }\n      shareAsset {\n        asset\n        metadata {\n          decimals\n          symbol\n          description\n          display\n          name\n        }\n        variants {\n          native {\n            denom\n          }\n        }\n        id\n      }\n      entryAdapter\n      type\n      ...FAQFragment\n    }\n    id\n  }\n}\n\nfragment AllocationFragment on IndexStatus {\n  allocations {\n    asset {\n      asset\n      metadata {\n        decimals\n        symbol\n      }\n      variants {\n        native {\n          denom\n        }\n      }\n      price {\n        changeDay\n        id\n      }\n      id\n    }\n    value\n    price\n    targetWeight\n    currentWeight\n    balance\n  }\n}\n\nfragment FAQFragment on IndexVault {\n  address\n  fees {\n    rates {\n      management\n      transaction\n    }\n  }\n  shareAsset {\n    metadata {\n      symbol\n    }\n    id\n  }\n  type\n}\n\nfragment PartialWithdrawFragment on IndexStatus {\n  allocations {\n    asset {\n      metadata {\n        symbol\n        decimals\n      }\n      id\n    }\n    targetWeight\n  }\n}\n"
  }
};
})();

(node as any).hash = "4f142cf922792dd25d4c06409d6c27f7";

export default node;
