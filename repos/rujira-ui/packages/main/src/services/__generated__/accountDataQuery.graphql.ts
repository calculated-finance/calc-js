/**
 * @generated SignedSource<<7c09b2b2edd6f661b5a89d0158dc1d45>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type accountDataQuery$variables = {
  addresses: ReadonlyArray<string>;
  id?: string | null | undefined;
};
export type accountDataQuery$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"BalanceContextFragment" | "BalanceFragment" | "BalancesPoolFragment" | "BorrowAccountFragment" | "DebtsAccountFragment" | "GhostVaultAccountFragment" | "IndexAccountFragment" | "IndexBalancesFragment" | "LimitOrdersAccountFragment" | "MergingFragment" | "OrderBookAccountFragment" | "PortfolioFragment" | "PositionsPortfolioFragment" | "RangeOrdersAccountFragment" | "RecurringOrdersAccountFragment" | "StakeAccountFragment" | "StakeOverviewAccountFragment" | "StrategyAccountFragment" | "ThorchainPoolAccountFragment" | "TradeSubscriptionsFragment" | "useAutoClaimerFragment">;
  } | null | undefined;
};
export type accountDataQuery = {
  response: accountDataQuery$data;
  variables: accountDataQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "addresses"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "address",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "symbol",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "concreteType": "Metadata",
  "kind": "LinkedField",
  "name": "metadata",
  "plural": false,
  "selections": [
    (v6/*: any*/)
  ],
  "storageKey": null
},
v8 = [
  (v7/*: any*/),
  (v5/*: any*/)
],
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "value",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "concreteType": "Apr",
  "kind": "LinkedField",
  "name": "apr",
  "plural": false,
  "selections": [
    (v9/*: any*/),
    (v10/*: any*/)
  ],
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "shares",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "amount",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "asset",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "decimals",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "current",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "concreteType": "Price",
  "kind": "LinkedField",
  "name": "price",
  "plural": false,
  "selections": [
    (v16/*: any*/),
    (v5/*: any*/)
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
    (v6/*: any*/),
    (v15/*: any*/)
  ],
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rate",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "valueUsd",
  "storageKey": null
},
v21 = {
  "kind": "Literal",
  "name": "first",
  "value": 100
},
v22 = [
  {
    "kind": "Variable",
    "name": "addresses",
    "variableName": "addresses"
  },
  (v21/*: any*/)
],
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "balance",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v26 = {
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
v27 = {
  "alias": null,
  "args": null,
  "concreteType": "AssetVariants",
  "kind": "LinkedField",
  "name": "variants",
  "plural": false,
  "selections": [
    (v26/*: any*/)
  ],
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endCursor",
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasNextPage",
  "storageKey": null
},
v31 = {
  "alias": null,
  "args": null,
  "concreteType": "PageInfo",
  "kind": "LinkedField",
  "name": "pageInfo",
  "plural": false,
  "selections": [
    (v29/*: any*/),
    (v30/*: any*/)
  ],
  "storageKey": null
},
v32 = {
  "kind": "ClientExtension",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "__id",
      "storageKey": null
    }
  ]
},
v33 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "account",
  "storageKey": null
},
v34 = {
  "alias": null,
  "args": null,
  "concreteType": "BowPool",
  "kind": "LinkedField",
  "name": "pool",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "config",
      "plural": false,
      "selections": [
        (v3/*: any*/),
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Asset",
              "kind": "LinkedField",
              "name": "x",
              "plural": false,
              "selections": (v8/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "Asset",
              "kind": "LinkedField",
              "name": "y",
              "plural": false,
              "selections": (v8/*: any*/),
              "storageKey": null
            }
          ],
          "type": "BowConfigXyk",
          "abstractKey": null
        }
      ],
      "storageKey": null
    },
    (v5/*: any*/)
  ],
  "storageKey": null
},
v35 = {
  "alias": null,
  "args": null,
  "concreteType": "Balance",
  "kind": "LinkedField",
  "name": "value",
  "plural": true,
  "selections": [
    (v13/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Asset",
      "kind": "LinkedField",
      "name": "asset",
      "plural": false,
      "selections": [
        (v17/*: any*/),
        (v7/*: any*/),
        (v5/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v36 = {
  "alias": null,
  "args": null,
  "concreteType": "Metadata",
  "kind": "LinkedField",
  "name": "metadata",
  "plural": false,
  "selections": [
    (v15/*: any*/),
    (v6/*: any*/)
  ],
  "storageKey": null
},
v37 = {
  "alias": null,
  "args": null,
  "concreteType": "AssetVariants",
  "kind": "LinkedField",
  "name": "variants",
  "plural": false,
  "selections": [
    (v26/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Asset",
      "kind": "LinkedField",
      "name": "secured",
      "plural": false,
      "selections": [
        (v24/*: any*/),
        (v25/*: any*/),
        (v14/*: any*/),
        (v36/*: any*/),
        (v27/*: any*/),
        (v5/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v38 = [
  (v24/*: any*/),
  (v25/*: any*/),
  (v14/*: any*/),
  (v36/*: any*/),
  (v37/*: any*/),
  (v5/*: any*/)
],
v39 = [
  (v13/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "Asset",
    "kind": "LinkedField",
    "name": "asset",
    "plural": false,
    "selections": (v38/*: any*/),
    "storageKey": null
  }
],
v40 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "assetRedeemValue",
  "storageKey": null
},
v41 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "runeRedeemValue",
  "storageKey": null
},
v42 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "sharesValue",
  "storageKey": null
},
v43 = {
  "alias": null,
  "args": null,
  "concreteType": "Asset",
  "kind": "LinkedField",
  "name": "asset",
  "plural": false,
  "selections": (v8/*: any*/),
  "storageKey": null
},
v44 = [
  (v13/*: any*/)
],
v45 = {
  "alias": null,
  "args": null,
  "concreteType": "Balance",
  "kind": "LinkedField",
  "name": "bonded",
  "plural": false,
  "selections": (v44/*: any*/),
  "storageKey": null
},
v46 = [
  (v13/*: any*/),
  (v43/*: any*/)
],
v47 = {
  "kind": "InlineFragment",
  "selections": [
    (v5/*: any*/)
  ],
  "type": "Node",
  "abstractKey": "__isNode"
},
v48 = [
  (v21/*: any*/)
],
v49 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "label",
  "storageKey": null
},
v50 = {
  "alias": null,
  "args": null,
  "concreteType": "RujiraAccount",
  "kind": "LinkedField",
  "name": "account",
  "plural": false,
  "selections": [
    (v4/*: any*/),
    (v49/*: any*/)
  ],
  "storageKey": null
},
v51 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ltv",
  "storageKey": null
},
v52 = {
  "alias": null,
  "args": null,
  "concreteType": "GhostCreditCollateral",
  "kind": "LinkedField",
  "name": "collaterals",
  "plural": true,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "collateral",
      "plural": false,
      "selections": [
        (v3/*: any*/),
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
                (v14/*: any*/),
                (v18/*: any*/),
                (v5/*: any*/),
                (v24/*: any*/),
                (v25/*: any*/),
                (v27/*: any*/)
              ],
              "storageKey": null
            },
            (v13/*: any*/)
          ],
          "type": "Balance",
          "abstractKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "valueFull",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "valueAdjusted",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v53 = {
  "alias": null,
  "args": null,
  "concreteType": "GhostCreditDebt",
  "kind": "LinkedField",
  "name": "debts",
  "plural": true,
  "selections": [
    (v9/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "GhostVaultDelegate",
      "kind": "LinkedField",
      "name": "debt",
      "plural": false,
      "selections": [
        (v16/*: any*/),
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
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "debtRate",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                },
                (v5/*: any*/)
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "Asset",
              "kind": "LinkedField",
              "name": "asset",
              "plural": false,
              "selections": [
                (v18/*: any*/),
                (v5/*: any*/),
                (v14/*: any*/),
                (v24/*: any*/),
                (v25/*: any*/),
                (v27/*: any*/)
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
v54 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "collateralValueUsd",
  "storageKey": null
},
v55 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "debtValueUsd",
  "storageKey": null
},
v56 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "collateralLiquidationValueUsd",
  "storageKey": null
},
v57 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "debtLiquidationValueUsd",
  "storageKey": null
},
v58 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "remaining",
  "storageKey": null
},
v59 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "center",
  "storageKey": null
},
v60 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "owner",
  "storageKey": null
},
v61 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "updatedAt",
  "storageKey": null
},
v62 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Asset",
    "kind": "LinkedField",
    "name": "asset",
    "plural": false,
    "selections": [
      (v24/*: any*/),
      (v25/*: any*/),
      (v14/*: any*/),
      (v36/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "AssetVariants",
        "kind": "LinkedField",
        "name": "variants",
        "plural": false,
        "selections": [
          (v26/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Asset",
            "kind": "LinkedField",
            "name": "secured",
            "plural": false,
            "selections": [
              (v14/*: any*/),
              (v24/*: any*/),
              (v25/*: any*/),
              (v18/*: any*/),
              (v27/*: any*/),
              (v5/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      (v5/*: any*/)
    ],
    "storageKey": null
  },
  (v13/*: any*/)
],
v63 = [
  (v7/*: any*/),
  (v25/*: any*/),
  (v24/*: any*/),
  (v5/*: any*/)
],
v64 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "price",
    "storageKey": null
  }
],
v65 = {
  "alias": "previousTime",
  "args": null,
  "kind": "ScalarField",
  "name": "previous",
  "storageKey": null
},
v66 = [
  (v24/*: any*/),
  (v25/*: any*/),
  (v14/*: any*/),
  (v18/*: any*/),
  (v27/*: any*/),
  (v17/*: any*/),
  (v5/*: any*/)
],
v67 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100000
  },
  {
    "kind": "Literal",
    "name": "states",
    "value": [
      "RUNNING"
    ]
  }
],
v68 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "accountDataQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "BalanceFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "BalanceContextFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "BalancesPoolFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "BorrowAccountFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "DebtsAccountFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "GhostVaultAccountFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "IndexAccountFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "IndexBalancesFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "MergingFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "OrderBookAccountFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "PortfolioFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "PositionsPortfolioFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "LimitOrdersAccountFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "RecurringOrdersAccountFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "RangeOrdersAccountFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "StakeAccountFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "StakeOverviewAccountFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "StrategyAccountFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "ThorchainPoolAccountFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "TradeSubscriptionsFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "useAutoClaimerFragment"
              }
            ],
            "type": "Account",
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
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "accountDataQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "MergeStats",
                "kind": "LinkedField",
                "name": "merge",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "MergeAccount",
                    "kind": "LinkedField",
                    "name": "accounts",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "MergePool",
                        "kind": "LinkedField",
                        "name": "pool",
                        "plural": false,
                        "selections": [
                          (v4/*: any*/),
                          (v5/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Asset",
                            "kind": "LinkedField",
                            "name": "mergeAsset",
                            "plural": false,
                            "selections": (v8/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "MergeStatus",
                            "kind": "LinkedField",
                            "name": "status",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "shareValue",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "shareValueChange",
                                "storageKey": null
                              },
                              (v11/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v5/*: any*/),
                      (v12/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Balance",
                        "kind": "LinkedField",
                        "name": "size",
                        "plural": false,
                        "selections": [
                          (v13/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Asset",
                            "kind": "LinkedField",
                            "name": "asset",
                            "plural": false,
                            "selections": [
                              (v14/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Metadata",
                                "kind": "LinkedField",
                                "name": "metadata",
                                "plural": false,
                                "selections": [
                                  (v15/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v17/*: any*/),
                              (v5/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Balance",
                        "kind": "LinkedField",
                        "name": "merged",
                        "plural": false,
                        "selections": [
                          (v13/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Asset",
                            "kind": "LinkedField",
                            "name": "asset",
                            "plural": false,
                            "selections": [
                              (v14/*: any*/),
                              (v18/*: any*/),
                              (v5/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v19/*: any*/),
                      (v20/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Balance",
                    "kind": "LinkedField",
                    "name": "totalSize",
                    "plural": false,
                    "selections": [
                      (v13/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "asset",
                        "plural": false,
                        "selections": [
                          (v7/*: any*/),
                          (v17/*: any*/),
                          (v5/*: any*/)
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
                "args": (v22/*: any*/),
                "concreteType": "BalanceV2Connection",
                "kind": "LinkedField",
                "name": "balancesV2",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "BalanceV2Edge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "BalanceV2",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v5/*: any*/),
                          (v23/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Asset",
                            "kind": "LinkedField",
                            "name": "asset",
                            "plural": false,
                            "selections": [
                              (v5/*: any*/),
                              (v14/*: any*/),
                              (v24/*: any*/),
                              (v25/*: any*/),
                              (v18/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Price",
                                "kind": "LinkedField",
                                "name": "price",
                                "plural": false,
                                "selections": [
                                  (v16/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "changeDay",
                                    "storageKey": null
                                  },
                                  (v5/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v27/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v20/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "BalanceV2Account",
                            "kind": "LinkedField",
                            "name": "accounts",
                            "plural": true,
                            "selections": [
                              (v4/*: any*/),
                              (v23/*: any*/),
                              (v20/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Asset",
                                "kind": "LinkedField",
                                "name": "asset",
                                "plural": false,
                                "selections": [
                                  (v14/*: any*/),
                                  (v24/*: any*/),
                                  (v25/*: any*/),
                                  (v17/*: any*/),
                                  (v18/*: any*/),
                                  (v27/*: any*/),
                                  (v5/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          (v3/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v28/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v31/*: any*/),
                  (v32/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v22/*: any*/),
                "filters": [
                  "addresses"
                ],
                "handle": "connection",
                "key": "BalanceContext_balancesV2",
                "kind": "LinkedHandle",
                "name": "balancesV2"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "BowAccount",
                "kind": "LinkedField",
                "name": "bow",
                "plural": true,
                "selections": [
                  (v5/*: any*/),
                  (v33/*: any*/),
                  (v34/*: any*/),
                  (v35/*: any*/),
                  (v20/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Balance",
                    "kind": "LinkedField",
                    "name": "shares",
                    "plural": false,
                    "selections": (v39/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "strategies",
                "plural": true,
                "selections": [
                  (v3/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v5/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "asset",
                        "plural": false,
                        "selections": [
                          (v14/*: any*/),
                          (v7/*: any*/),
                          (v17/*: any*/),
                          (v5/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v20/*: any*/),
                      (v40/*: any*/),
                      (v41/*: any*/)
                    ],
                    "type": "ThorchainLiquidityProvider",
                    "abstractKey": null
                  },
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v5/*: any*/),
                      (v33/*: any*/),
                      (v34/*: any*/),
                      (v20/*: any*/),
                      (v35/*: any*/)
                    ],
                    "type": "BowAccount",
                    "abstractKey": null
                  },
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v5/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "IndexVault",
                        "kind": "LinkedField",
                        "name": "index",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Asset",
                            "kind": "LinkedField",
                            "name": "shareAsset",
                            "plural": false,
                            "selections": (v8/*: any*/),
                            "storageKey": null
                          },
                          (v5/*: any*/),
                          (v24/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "IndexStatus",
                            "kind": "LinkedField",
                            "name": "status",
                            "plural": false,
                            "selections": [
                              (v11/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v42/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "IndexAllocation",
                        "kind": "LinkedField",
                        "name": "allocations",
                        "plural": true,
                        "selections": [
                          (v43/*: any*/),
                          (v23/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "type": "IndexAccount",
                    "abstractKey": null
                  },
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v5/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "StakingPool",
                        "kind": "LinkedField",
                        "name": "pool",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Asset",
                            "kind": "LinkedField",
                            "name": "bondAsset",
                            "plural": false,
                            "selections": (v8/*: any*/),
                            "storageKey": null
                          },
                          (v5/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "StakingSummary",
                            "kind": "LinkedField",
                            "name": "summary",
                            "plural": false,
                            "selections": [
                              (v11/*: any*/),
                              (v5/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v20/*: any*/),
                      (v45/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Balance",
                        "kind": "LinkedField",
                        "name": "liquidSize",
                        "plural": false,
                        "selections": (v44/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Balance",
                        "kind": "LinkedField",
                        "name": "pendingRevenue",
                        "plural": false,
                        "selections": (v46/*: any*/),
                        "storageKey": null
                      }
                    ],
                    "type": "StakingAccount",
                    "abstractKey": null
                  },
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v5/*: any*/),
                      (v33/*: any*/),
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
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Apr",
                                "kind": "LinkedField",
                                "name": "apr",
                                "plural": false,
                                "selections": [
                                  (v10/*: any*/),
                                  (v9/*: any*/)
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
                            "name": "asset",
                            "plural": false,
                            "selections": [
                              (v14/*: any*/),
                              (v25/*: any*/),
                              (v24/*: any*/),
                              (v7/*: any*/),
                              (v5/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v5/*: any*/),
                          (v4/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v20/*: any*/),
                      {
                        "alias": "receiptValue",
                        "args": null,
                        "concreteType": "Balance",
                        "kind": "LinkedField",
                        "name": "value",
                        "plural": false,
                        "selections": [
                          (v13/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Asset",
                            "kind": "LinkedField",
                            "name": "asset",
                            "plural": false,
                            "selections": [
                              (v17/*: any*/),
                              (v18/*: any*/),
                              (v5/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": "receiptShares",
                        "args": null,
                        "concreteType": "Balance",
                        "kind": "LinkedField",
                        "name": "shares",
                        "plural": false,
                        "selections": (v39/*: any*/),
                        "storageKey": null
                      }
                    ],
                    "type": "GhostVaultAccount",
                    "abstractKey": null
                  },
                  (v47/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "GhostCreditAccounts",
                "kind": "LinkedField",
                "name": "credit",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "GhostCreditAccountNext",
                    "kind": "LinkedField",
                    "name": "next",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "salt",
                        "storageKey": null
                      },
                      (v33/*: any*/),
                      (v5/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": (v48/*: any*/),
                    "concreteType": "GhostCreditAccountConnection",
                    "kind": "LinkedField",
                    "name": "accountsV2",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "GhostCreditAccountEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "GhostCreditAccount",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v50/*: any*/),
                              (v51/*: any*/),
                              (v52/*: any*/),
                              (v53/*: any*/),
                              (v54/*: any*/),
                              (v55/*: any*/),
                              (v56/*: any*/),
                              (v57/*: any*/),
                              (v5/*: any*/),
                              (v3/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v28/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v31/*: any*/),
                      (v32/*: any*/)
                    ],
                    "storageKey": "accountsV2(first:100)"
                  },
                  {
                    "alias": null,
                    "args": (v48/*: any*/),
                    "filters": null,
                    "handle": "connection",
                    "key": "Borrow_accountsV2",
                    "kind": "LinkedHandle",
                    "name": "accountsV2"
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "GhostCreditAccount",
                    "kind": "LinkedField",
                    "name": "accounts",
                    "plural": true,
                    "selections": [
                      (v5/*: any*/),
                      (v20/*: any*/),
                      (v50/*: any*/),
                      (v51/*: any*/),
                      (v52/*: any*/),
                      (v53/*: any*/),
                      (v54/*: any*/),
                      (v55/*: any*/),
                      (v56/*: any*/),
                      (v57/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "IndexAccount",
                "kind": "LinkedField",
                "name": "index",
                "plural": true,
                "selections": [
                  (v5/*: any*/),
                  (v12/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "IndexVault",
                    "kind": "LinkedField",
                    "name": "index",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      (v4/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "shareAsset",
                        "plural": false,
                        "selections": [
                          (v14/*: any*/),
                          (v5/*: any*/),
                          (v24/*: any*/),
                          (v25/*: any*/),
                          (v36/*: any*/),
                          (v37/*: any*/)
                        ],
                        "storageKey": null
                      },
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
                    "storageKey": null
                  },
                  (v42/*: any*/),
                  (v33/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "FinAccount",
                "kind": "LinkedField",
                "name": "fin",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": (v48/*: any*/),
                    "concreteType": "FinOrderConnection",
                    "kind": "LinkedField",
                    "name": "orders",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "FinOrderEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "FinOrder",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "FinPair",
                                "kind": "LinkedField",
                                "name": "pair",
                                "plural": false,
                                "selections": [
                                  (v4/*: any*/),
                                  (v5/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v19/*: any*/),
                              (v58/*: any*/),
                              (v5/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": "orders(first:100)"
                  },
                  {
                    "alias": null,
                    "args": (v48/*: any*/),
                    "concreteType": "OrderConnection",
                    "kind": "LinkedField",
                    "name": "ordersV2",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "OrderEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          (v28/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": null,
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v3/*: any*/),
                              {
                                "kind": "InlineFragment",
                                "selections": [
                                  (v20/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "FinPair",
                                    "kind": "LinkedField",
                                    "name": "pair",
                                    "plural": false,
                                    "selections": [
                                      (v4/*: any*/),
                                      (v5/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "Asset",
                                        "kind": "LinkedField",
                                        "name": "assetBase",
                                        "plural": false,
                                        "selections": [
                                          (v14/*: any*/),
                                          (v25/*: any*/),
                                          (v24/*: any*/),
                                          (v18/*: any*/),
                                          (v5/*: any*/)
                                        ],
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "Asset",
                                        "kind": "LinkedField",
                                        "name": "assetQuote",
                                        "plural": false,
                                        "selections": [
                                          (v14/*: any*/),
                                          (v25/*: any*/),
                                          (v24/*: any*/),
                                          (v18/*: any*/),
                                          (v17/*: any*/),
                                          (v5/*: any*/)
                                        ],
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "FinBook",
                                        "kind": "LinkedField",
                                        "name": "book",
                                        "plural": false,
                                        "selections": [
                                          (v5/*: any*/),
                                          (v59/*: any*/)
                                        ],
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "side",
                                    "storageKey": null
                                  },
                                  (v19/*: any*/),
                                  (v58/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "filled",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "deviation",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "filledValue",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "filledFee",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "offer",
                                    "storageKey": null
                                  },
                                  (v60/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "remainingValue",
                                    "storageKey": null
                                  },
                                  (v24/*: any*/),
                                  (v61/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "offerValue",
                                    "storageKey": null
                                  }
                                ],
                                "type": "FinOrder",
                                "abstractKey": null
                              },
                              {
                                "kind": "InlineFragment",
                                "selections": [
                                  (v20/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Balance",
                                    "kind": "LinkedField",
                                    "name": "balances",
                                    "plural": true,
                                    "selections": [
                                      (v13/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "Asset",
                                        "kind": "LinkedField",
                                        "name": "asset",
                                        "plural": false,
                                        "selections": [
                                          (v24/*: any*/),
                                          (v25/*: any*/),
                                          (v18/*: any*/),
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "AssetVariants",
                                            "kind": "LinkedField",
                                            "name": "variants",
                                            "plural": false,
                                            "selections": [
                                              (v26/*: any*/),
                                              {
                                                "alias": null,
                                                "args": null,
                                                "concreteType": "Asset",
                                                "kind": "LinkedField",
                                                "name": "secured",
                                                "plural": false,
                                                "selections": [
                                                  (v24/*: any*/),
                                                  (v25/*: any*/),
                                                  (v18/*: any*/),
                                                  (v27/*: any*/),
                                                  (v5/*: any*/)
                                                ],
                                                "storageKey": null
                                              }
                                            ],
                                            "storageKey": null
                                          },
                                          (v5/*: any*/)
                                        ],
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  },
                                  (v5/*: any*/),
                                  (v4/*: any*/),
                                  (v49/*: any*/),
                                  (v10/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "source",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "createdAt",
                                    "storageKey": null
                                  },
                                  (v61/*: any*/),
                                  (v60/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "CalcOrderConfig",
                                    "kind": "LinkedField",
                                    "name": "config",
                                    "plural": false,
                                    "selections": [
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": null,
                                        "kind": "LinkedField",
                                        "name": "nodes",
                                        "plural": true,
                                        "selections": [
                                          (v3/*: any*/),
                                          {
                                            "kind": "InlineFragment",
                                            "selections": [
                                              {
                                                "alias": null,
                                                "args": null,
                                                "kind": "ScalarField",
                                                "name": "next",
                                                "storageKey": null
                                              },
                                              {
                                                "alias": null,
                                                "args": null,
                                                "concreteType": null,
                                                "kind": "LinkedField",
                                                "name": "action",
                                                "plural": false,
                                                "selections": [
                                                  (v3/*: any*/),
                                                  {
                                                    "kind": "InlineFragment",
                                                    "selections": [
                                                      {
                                                        "alias": null,
                                                        "args": null,
                                                        "kind": "ScalarField",
                                                        "name": "denoms",
                                                        "storageKey": null
                                                      },
                                                      {
                                                        "alias": null,
                                                        "args": null,
                                                        "concreteType": "CalcDestination",
                                                        "kind": "LinkedField",
                                                        "name": "destinations",
                                                        "plural": true,
                                                        "selections": [
                                                          (v12/*: any*/),
                                                          (v49/*: any*/),
                                                          {
                                                            "alias": null,
                                                            "args": null,
                                                            "concreteType": null,
                                                            "kind": "LinkedField",
                                                            "name": "recipient",
                                                            "plural": false,
                                                            "selections": [
                                                              (v3/*: any*/),
                                                              {
                                                                "kind": "InlineFragment",
                                                                "selections": [
                                                                  (v4/*: any*/)
                                                                ],
                                                                "type": "CalcRecipientBank",
                                                                "abstractKey": null
                                                              },
                                                              {
                                                                "kind": "InlineFragment",
                                                                "selections": [
                                                                  (v4/*: any*/),
                                                                  {
                                                                    "alias": null,
                                                                    "args": null,
                                                                    "kind": "ScalarField",
                                                                    "name": "msg",
                                                                    "storageKey": null
                                                                  }
                                                                ],
                                                                "type": "CalcRecipientContract",
                                                                "abstractKey": null
                                                              },
                                                              {
                                                                "kind": "InlineFragment",
                                                                "selections": [
                                                                  {
                                                                    "alias": null,
                                                                    "args": null,
                                                                    "kind": "ScalarField",
                                                                    "name": "memo",
                                                                    "storageKey": null
                                                                  }
                                                                ],
                                                                "type": "CalcRecipientDeposit",
                                                                "abstractKey": null
                                                              }
                                                            ],
                                                            "storageKey": null
                                                          }
                                                        ],
                                                        "storageKey": null
                                                      }
                                                    ],
                                                    "type": "CalcActionDistribute",
                                                    "abstractKey": null
                                                  },
                                                  {
                                                    "kind": "InlineFragment",
                                                    "selections": [
                                                      {
                                                        "alias": null,
                                                        "args": null,
                                                        "concreteType": "Balance",
                                                        "kind": "LinkedField",
                                                        "name": "swapAmount",
                                                        "plural": false,
                                                        "selections": (v62/*: any*/),
                                                        "storageKey": null
                                                      },
                                                      {
                                                        "alias": null,
                                                        "args": null,
                                                        "concreteType": "Balance",
                                                        "kind": "LinkedField",
                                                        "name": "minimumReceiveAmount",
                                                        "plural": false,
                                                        "selections": (v62/*: any*/),
                                                        "storageKey": null
                                                      },
                                                      {
                                                        "alias": null,
                                                        "args": null,
                                                        "concreteType": null,
                                                        "kind": "LinkedField",
                                                        "name": "adjustment",
                                                        "plural": false,
                                                        "selections": [
                                                          (v3/*: any*/),
                                                          {
                                                            "kind": "InlineFragment",
                                                            "selections": [
                                                              {
                                                                "alias": null,
                                                                "args": null,
                                                                "kind": "ScalarField",
                                                                "name": "kind",
                                                                "storageKey": null
                                                              }
                                                            ],
                                                            "type": "CalcSwapAmountAdjustmentFixed",
                                                            "abstractKey": null
                                                          },
                                                          {
                                                            "kind": "InlineFragment",
                                                            "selections": [
                                                              {
                                                                "alias": null,
                                                                "args": null,
                                                                "concreteType": "Balance",
                                                                "kind": "LinkedField",
                                                                "name": "baseReceiveAmount",
                                                                "plural": false,
                                                                "selections": [
                                                                  (v13/*: any*/),
                                                                  {
                                                                    "alias": null,
                                                                    "args": null,
                                                                    "concreteType": "Asset",
                                                                    "kind": "LinkedField",
                                                                    "name": "asset",
                                                                    "plural": false,
                                                                    "selections": [
                                                                      (v27/*: any*/),
                                                                      (v5/*: any*/)
                                                                    ],
                                                                    "storageKey": null
                                                                  }
                                                                ],
                                                                "storageKey": null
                                                              },
                                                              {
                                                                "alias": null,
                                                                "args": null,
                                                                "kind": "ScalarField",
                                                                "name": "scalar",
                                                                "storageKey": null
                                                              }
                                                            ],
                                                            "type": "CalcSwapAmountAdjustmentLinearScalar",
                                                            "abstractKey": null
                                                          }
                                                        ],
                                                        "storageKey": null
                                                      },
                                                      {
                                                        "alias": null,
                                                        "args": null,
                                                        "concreteType": null,
                                                        "kind": "LinkedField",
                                                        "name": "routes",
                                                        "plural": true,
                                                        "selections": [
                                                          (v3/*: any*/),
                                                          {
                                                            "kind": "InlineFragment",
                                                            "selections": [
                                                              {
                                                                "alias": null,
                                                                "args": null,
                                                                "concreteType": "FinPair",
                                                                "kind": "LinkedField",
                                                                "name": "pair",
                                                                "plural": false,
                                                                "selections": [
                                                                  (v4/*: any*/),
                                                                  {
                                                                    "alias": null,
                                                                    "args": null,
                                                                    "concreteType": "Asset",
                                                                    "kind": "LinkedField",
                                                                    "name": "assetQuote",
                                                                    "plural": false,
                                                                    "selections": (v63/*: any*/),
                                                                    "storageKey": null
                                                                  },
                                                                  {
                                                                    "alias": null,
                                                                    "args": null,
                                                                    "concreteType": "Asset",
                                                                    "kind": "LinkedField",
                                                                    "name": "assetBase",
                                                                    "plural": false,
                                                                    "selections": (v63/*: any*/),
                                                                    "storageKey": null
                                                                  },
                                                                  {
                                                                    "alias": null,
                                                                    "args": null,
                                                                    "kind": "ScalarField",
                                                                    "name": "tick",
                                                                    "storageKey": null
                                                                  },
                                                                  {
                                                                    "alias": null,
                                                                    "args": null,
                                                                    "concreteType": "FinBook",
                                                                    "kind": "LinkedField",
                                                                    "name": "book",
                                                                    "plural": false,
                                                                    "selections": [
                                                                      (v59/*: any*/),
                                                                      {
                                                                        "alias": null,
                                                                        "args": null,
                                                                        "concreteType": "FinBookEntry",
                                                                        "kind": "LinkedField",
                                                                        "name": "bids",
                                                                        "plural": true,
                                                                        "selections": (v64/*: any*/),
                                                                        "storageKey": null
                                                                      },
                                                                      {
                                                                        "alias": null,
                                                                        "args": null,
                                                                        "concreteType": "FinBookEntry",
                                                                        "kind": "LinkedField",
                                                                        "name": "asks",
                                                                        "plural": true,
                                                                        "selections": (v64/*: any*/),
                                                                        "storageKey": null
                                                                      },
                                                                      (v5/*: any*/)
                                                                    ],
                                                                    "storageKey": null
                                                                  },
                                                                  (v5/*: any*/)
                                                                ],
                                                                "storageKey": null
                                                              },
                                                              {
                                                                "alias": null,
                                                                "args": null,
                                                                "kind": "ScalarField",
                                                                "name": "pairAddress",
                                                                "storageKey": null
                                                              }
                                                            ],
                                                            "type": "CalcSwapRouteFin",
                                                            "abstractKey": null
                                                          },
                                                          {
                                                            "kind": "InlineFragment",
                                                            "selections": [
                                                              {
                                                                "alias": null,
                                                                "args": null,
                                                                "kind": "ScalarField",
                                                                "name": "affiliateCode",
                                                                "storageKey": null
                                                              },
                                                              {
                                                                "alias": null,
                                                                "args": null,
                                                                "kind": "ScalarField",
                                                                "name": "affiliateBps",
                                                                "storageKey": null
                                                              }
                                                            ],
                                                            "type": "CalcSwapRouteThorchain",
                                                            "abstractKey": null
                                                          }
                                                        ],
                                                        "storageKey": null
                                                      },
                                                      {
                                                        "alias": null,
                                                        "args": null,
                                                        "kind": "ScalarField",
                                                        "name": "maximumSlippageBps",
                                                        "storageKey": null
                                                      }
                                                    ],
                                                    "type": "CalcActionSwap",
                                                    "abstractKey": null
                                                  }
                                                ],
                                                "storageKey": null
                                              }
                                            ],
                                            "type": "CalcAction",
                                            "abstractKey": null
                                          },
                                          {
                                            "kind": "InlineFragment",
                                            "selections": [
                                              {
                                                "alias": null,
                                                "args": null,
                                                "concreteType": null,
                                                "kind": "LinkedField",
                                                "name": "condition",
                                                "plural": false,
                                                "selections": [
                                                  (v3/*: any*/),
                                                  {
                                                    "kind": "InlineFragment",
                                                    "selections": [
                                                      {
                                                        "alias": null,
                                                        "args": null,
                                                        "kind": "ScalarField",
                                                        "name": "timestamp",
                                                        "storageKey": null
                                                      }
                                                    ],
                                                    "type": "CalcConditionTimestampElapsed",
                                                    "abstractKey": null
                                                  },
                                                  {
                                                    "kind": "InlineFragment",
                                                    "selections": [
                                                      {
                                                        "alias": null,
                                                        "args": null,
                                                        "concreteType": null,
                                                        "kind": "LinkedField",
                                                        "name": "cadence",
                                                        "plural": false,
                                                        "selections": [
                                                          (v3/*: any*/),
                                                          {
                                                            "kind": "InlineFragment",
                                                            "selections": [
                                                              {
                                                                "alias": null,
                                                                "args": null,
                                                                "kind": "ScalarField",
                                                                "name": "expr",
                                                                "storageKey": null
                                                              },
                                                              (v65/*: any*/)
                                                            ],
                                                            "type": "CalcCadenceCron",
                                                            "abstractKey": null
                                                          },
                                                          {
                                                            "kind": "InlineFragment",
                                                            "selections": [
                                                              {
                                                                "alias": null,
                                                                "args": null,
                                                                "kind": "ScalarField",
                                                                "name": "duration",
                                                                "storageKey": null
                                                              },
                                                              (v65/*: any*/)
                                                            ],
                                                            "type": "CalcCadenceTime",
                                                            "abstractKey": null
                                                          },
                                                          {
                                                            "kind": "InlineFragment",
                                                            "selections": [
                                                              {
                                                                "alias": null,
                                                                "args": null,
                                                                "kind": "ScalarField",
                                                                "name": "interval",
                                                                "storageKey": null
                                                              },
                                                              {
                                                                "alias": "previousBlock",
                                                                "args": null,
                                                                "kind": "ScalarField",
                                                                "name": "previous",
                                                                "storageKey": null
                                                              }
                                                            ],
                                                            "type": "CalcCadenceBlocks",
                                                            "abstractKey": null
                                                          }
                                                        ],
                                                        "storageKey": null
                                                      },
                                                      {
                                                        "alias": null,
                                                        "args": null,
                                                        "kind": "ScalarField",
                                                        "name": "executors",
                                                        "storageKey": null
                                                      },
                                                      {
                                                        "alias": null,
                                                        "args": null,
                                                        "kind": "ScalarField",
                                                        "name": "executions",
                                                        "storageKey": null
                                                      },
                                                      {
                                                        "alias": null,
                                                        "args": null,
                                                        "kind": "ScalarField",
                                                        "name": "jitter",
                                                        "storageKey": null
                                                      }
                                                    ],
                                                    "type": "CalcConditionSchedule",
                                                    "abstractKey": null
                                                  },
                                                  {
                                                    "kind": "InlineFragment",
                                                    "selections": [
                                                      (v4/*: any*/),
                                                      {
                                                        "alias": null,
                                                        "args": null,
                                                        "concreteType": "Balance",
                                                        "kind": "LinkedField",
                                                        "name": "amount",
                                                        "plural": false,
                                                        "selections": (v46/*: any*/),
                                                        "storageKey": null
                                                      }
                                                    ],
                                                    "type": "CalcConditionBalanceAvailable",
                                                    "abstractKey": null
                                                  }
                                                ],
                                                "storageKey": null
                                              }
                                            ],
                                            "type": "CalcCondition",
                                            "abstractKey": null
                                          }
                                        ],
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "type": "CalcOrder",
                                "abstractKey": null
                              },
                              (v47/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v31/*: any*/),
                      (v32/*: any*/)
                    ],
                    "storageKey": "ordersV2(first:100)"
                  },
                  {
                    "alias": null,
                    "args": (v48/*: any*/),
                    "filters": null,
                    "handle": "connection",
                    "key": "TradeSubscriptionsFragment_ordersV2",
                    "kind": "LinkedHandle",
                    "name": "ordersV2"
                  },
                  {
                    "alias": null,
                    "args": (v48/*: any*/),
                    "concreteType": "FinRangeConnection",
                    "kind": "LinkedField",
                    "name": "ranges",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "FinRangeEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "FinRange",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v20/*: any*/),
                              (v5/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "idx",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "low",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "high",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "skew",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "spread",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "fee",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "base",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "quote",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "feesBase",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "feesQuote",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "principalUsd",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "yieldUsd",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "FinPair",
                                "kind": "LinkedField",
                                "name": "pair",
                                "plural": false,
                                "selections": [
                                  (v4/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "FinBook",
                                    "kind": "LinkedField",
                                    "name": "book",
                                    "plural": false,
                                    "selections": [
                                      (v59/*: any*/),
                                      (v5/*: any*/)
                                    ],
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Asset",
                                    "kind": "LinkedField",
                                    "name": "assetBase",
                                    "plural": false,
                                    "selections": (v66/*: any*/),
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Asset",
                                    "kind": "LinkedField",
                                    "name": "assetQuote",
                                    "plural": false,
                                    "selections": (v66/*: any*/),
                                    "storageKey": null
                                  },
                                  (v5/*: any*/)
                                ],
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "inRange",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "FinRangePositionAnalytics",
                                "kind": "LinkedField",
                                "name": "analytics",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "firstDepositDate",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "weightedAverageInvestmentAgeDays",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "totalInvested",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "totalWithdrawn",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "realizedYield",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "unrealizedInvestment",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "unrealizedYield",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "moic",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "dpi",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "apr",
                                    "storageKey": null
                                  },
                                  (v5/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v3/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v28/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v31/*: any*/),
                      (v32/*: any*/)
                    ],
                    "storageKey": "ranges(first:100)"
                  },
                  {
                    "alias": null,
                    "args": (v48/*: any*/),
                    "filters": null,
                    "handle": "connection",
                    "key": "TradeSubscriptionsFragment_ranges",
                    "kind": "LinkedHandle",
                    "name": "ranges"
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "StakingAccounts",
                "kind": "LinkedField",
                "name": "staking",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "StakingAccount",
                    "kind": "LinkedField",
                    "name": "single",
                    "plural": false,
                    "selections": [
                      (v45/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Balance",
                        "kind": "LinkedField",
                        "name": "liquid",
                        "plural": false,
                        "selections": (v44/*: any*/),
                        "storageKey": null
                      },
                      (v5/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "StakingAccount",
                "kind": "LinkedField",
                "name": "stakingV2",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "StakingPool",
                    "kind": "LinkedField",
                    "name": "pool",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "bondAsset",
                        "plural": false,
                        "selections": [
                          (v7/*: any*/),
                          (v5/*: any*/),
                          (v17/*: any*/),
                          (v27/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v4/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "revenueAsset",
                        "plural": false,
                        "selections": (v8/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "receiptAsset",
                        "plural": false,
                        "selections": (v38/*: any*/),
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v5/*: any*/),
                  (v33/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Balance",
                    "kind": "LinkedField",
                    "name": "liquidSize",
                    "plural": false,
                    "selections": (v39/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Balance",
                    "kind": "LinkedField",
                    "name": "bonded",
                    "plural": false,
                    "selections": (v46/*: any*/),
                    "storageKey": null
                  },
                  (v20/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Balance",
                    "kind": "LinkedField",
                    "name": "liquidShares",
                    "plural": false,
                    "selections": (v44/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Balance",
                    "kind": "LinkedField",
                    "name": "pendingRevenue",
                    "plural": false,
                    "selections": (v44/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "ThorchainLiquidityProvider",
                "kind": "LinkedField",
                "name": "liquidityAccounts",
                "plural": true,
                "selections": [
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "asset",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      (v17/*: any*/),
                      (v18/*: any*/),
                      (v25/*: any*/),
                      (v24/*: any*/),
                      (v14/*: any*/),
                      (v37/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v40/*: any*/),
                  (v41/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "units",
                    "storageKey": null
                  },
                  (v20/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "assetAddress",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "runeAddress",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "pendingAsset",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "pendingRune",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "AutoAccount",
                "kind": "LinkedField",
                "name": "auto",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": (v67/*: any*/),
                    "concreteType": "AutoWorkflowInstanceConnection",
                    "kind": "LinkedField",
                    "name": "workflows",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AutoWorkflowInstanceEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "AutoWorkflowInstance",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v5/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "instanceId",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "workflowId",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "requester",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "executionType",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "cronExpression",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "onchainParameters",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "offchainParameters",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "expirationDate",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "launcherId",
                                "storageKey": null
                              },
                              (v68/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "AutoWorkflow",
                                "kind": "LinkedField",
                                "name": "workflow",
                                "plural": false,
                                "selections": [
                                  (v5/*: any*/),
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
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "AutoWorkflowSchedule",
                                "kind": "LinkedField",
                                "name": "schedule",
                                "plural": false,
                                "selections": [
                                  (v10/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "nextExecutionTimes",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "runningWorkflows",
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "AutoWorkflowRun",
                                "kind": "LinkedField",
                                "name": "lastRun",
                                "plural": false,
                                "selections": [
                                  (v68/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "startTime",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "endTime",
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              },
                              (v3/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v28/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "PageInfo",
                        "kind": "LinkedField",
                        "name": "pageInfo",
                        "plural": false,
                        "selections": [
                          (v30/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "hasPreviousPage",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "startCursor",
                            "storageKey": null
                          },
                          (v29/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v32/*: any*/)
                    ],
                    "storageKey": "workflows(first:100000,states:[\"RUNNING\"])"
                  },
                  {
                    "alias": null,
                    "args": (v67/*: any*/),
                    "filters": [
                      "states"
                    ],
                    "handle": "connection",
                    "key": "useAutoClaimerFragment_workflows",
                    "kind": "LinkedHandle",
                    "name": "workflows"
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "Account",
            "abstractKey": null
          },
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "63abdad924e092aff3dbcb8ff44f13cf",
    "id": null,
    "metadata": {},
    "name": "accountDataQuery",
    "operationKind": "query",
    "text": "query accountDataQuery(\n  $id: ID\n  $addresses: [Address!]!\n) {\n  node(id: $id) {\n    __typename\n    ... on Account {\n      ...BalanceFragment\n      ...BalanceContextFragment\n      ...BalancesPoolFragment\n      ...BorrowAccountFragment\n      ...DebtsAccountFragment\n      ...GhostVaultAccountFragment\n      ...IndexAccountFragment\n      ...IndexBalancesFragment\n      ...MergingFragment\n      ...OrderBookAccountFragment\n      ...PortfolioFragment\n      ...PositionsPortfolioFragment\n      ...LimitOrdersAccountFragment\n      ...RecurringOrdersAccountFragment\n      ...RangeOrdersAccountFragment\n      ...StakeAccountFragment\n      ...StakeOverviewAccountFragment\n      ...StrategyAccountFragment\n      ...ThorchainPoolAccountFragment\n      ...TradeSubscriptionsFragment\n      ...useAutoClaimerFragment\n    }\n    id\n  }\n}\n\nfragment ActionsAccountFragment on Account {\n  index {\n    id\n    shares\n    index {\n      id\n      address\n      shareAsset {\n        asset\n        id\n      }\n      fees {\n        rates {\n          transaction\n        }\n      }\n    }\n  }\n}\n\nfragment BalanceAccountFragment on MergeAccount {\n  id\n  pool {\n    address\n    mergeAsset {\n      metadata {\n        symbol\n      }\n      id\n    }\n    status {\n      shareValue\n      shareValueChange\n    }\n    id\n  }\n  shares\n  size {\n    amount\n  }\n}\n\nfragment BalanceContextFragment on Account {\n  balancesV2(first: 100, addresses: $addresses) {\n    edges {\n      node {\n        id\n        balance\n        asset {\n          id\n          asset\n          type\n          chain\n          metadata {\n            symbol\n            decimals\n          }\n          price {\n            current\n            changeDay\n            id\n          }\n          variants {\n            native {\n              denom\n            }\n          }\n        }\n        valueUsd\n        accounts {\n          ...BalanceV2AccountFragment\n        }\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment BalanceFragment on Account {\n  merge {\n    accounts {\n      pool {\n        address\n        id\n      }\n      ...BalanceAccountFragment\n      id\n    }\n  }\n}\n\nfragment BalanceThumbDualFragment on BowAccount {\n  id\n  account\n  pool {\n    config {\n      __typename\n      ... on BowConfigXyk {\n        x {\n          metadata {\n            symbol\n          }\n          id\n        }\n        y {\n          metadata {\n            symbol\n          }\n          id\n        }\n      }\n    }\n    id\n  }\n  value {\n    amount\n    asset {\n      price {\n        current\n        id\n      }\n      metadata {\n        symbol\n      }\n      id\n    }\n  }\n  valueUsd\n  ...BowPoolXykBalanceWithdrawFragment\n}\n\nfragment BalanceV2AccountFragment on BalanceV2Account {\n  address\n  balance\n  valueUsd\n  asset {\n    asset\n    type\n    chain\n    price {\n      current\n      id\n    }\n    metadata {\n      symbol\n      decimals\n    }\n    variants {\n      native {\n        denom\n      }\n    }\n    id\n  }\n}\n\nfragment BalancesPoolFragment on Account {\n  bow {\n    id\n    ...BalanceThumbDualFragment\n  }\n  strategies {\n    __typename\n    ... on ThorchainLiquidityProvider {\n      id\n      ...ThorchainPoolThumbFragment\n    }\n    ... on BowAccount {\n      id\n      ...BowPoolXykThumbFragment\n    }\n    ... on IndexAccount {\n      id\n      ...IndexVaultThumbFragment\n      ...IndexVaultPortfolioRowFragment\n    }\n    ... on StakingAccount {\n      id\n      ...StakingPoolThumbFragment\n      ...StakingPoolPortfolioRowFragment\n    }\n    ... on GhostVaultAccount {\n      id\n      ...GhostVaultThumbFragment\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment BorrowAccountFragment on Account {\n  credit {\n    next {\n      ...BorrowNextFragment\n      id\n    }\n    accountsV2(first: 100) {\n      edges {\n        node {\n          account {\n            address\n          }\n          ltv\n          ...PositionBorrowRowFragment\n          id\n          __typename\n        }\n        cursor\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n}\n\nfragment BorrowNextFragment on GhostCreditAccountNext {\n  salt\n  account\n  id\n}\n\nfragment BowPoolXykAccountFragment on Account {\n  address\n  bow {\n    id\n    ...BowPoolXykBalanceFragment\n  }\n}\n\nfragment BowPoolXykBalanceFragment on BowAccount {\n  id\n  account\n  shares {\n    amount\n    asset {\n      ...msgAssetFragment\n      id\n    }\n  }\n  value {\n    amount\n    asset {\n      price {\n        current\n        id\n      }\n      metadata {\n        symbol\n      }\n      id\n    }\n  }\n  valueUsd\n  ...BowPoolXykBalanceWithdrawFragment\n}\n\nfragment BowPoolXykBalanceWithdrawFragment on BowAccount {\n  shares {\n    amount\n    asset {\n      ...msgAssetFragment\n      id\n    }\n  }\n  value {\n    amount\n    asset {\n      metadata {\n        symbol\n      }\n      id\n    }\n  }\n}\n\nfragment BowPoolXykThumbFragment on BowAccount {\n  id\n  account\n  pool {\n    config {\n      __typename\n      ... on BowConfigXyk {\n        x {\n          metadata {\n            symbol\n          }\n          id\n        }\n        y {\n          metadata {\n            symbol\n          }\n          id\n        }\n      }\n    }\n    id\n  }\n  valueUsd\n  value {\n    amount\n    asset {\n      price {\n        current\n        id\n      }\n      metadata {\n        symbol\n      }\n      id\n    }\n  }\n}\n\nfragment DebtsAccountFragment on Account {\n  strategies {\n    __typename\n    ... on GhostVaultAccount {\n      id\n      vault {\n        address\n        id\n      }\n      receiptValue: value {\n        amount\n        asset {\n          metadata {\n            symbol\n            decimals\n          }\n          price {\n            current\n            id\n          }\n          id\n        }\n      }\n      valueUsd\n      ...GhostVaultBalanceWithdrawFragment\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment GhostVaultAccountFragment on Account {\n  address\n  strategies {\n    __typename\n    ... on GhostVaultAccount {\n      id\n      ...GhostVaultBalanceFragment\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment GhostVaultBalanceFragment on GhostVaultAccount {\n  id\n  account\n  receiptShares: shares {\n    amount\n    asset {\n      ...msgAssetFragment\n      id\n    }\n  }\n  receiptValue: value {\n    amount\n    asset {\n      price {\n        current\n        id\n      }\n      metadata {\n        symbol\n      }\n      id\n    }\n  }\n  valueUsd\n  ...GhostVaultBalanceWithdrawFragment\n}\n\nfragment GhostVaultBalanceWithdrawFragment on GhostVaultAccount {\n  vault {\n    address\n    id\n  }\n  receiptShares: shares {\n    amount\n    asset {\n      ...msgAssetFragment\n      id\n    }\n  }\n  receiptValue: value {\n    amount\n    asset {\n      metadata {\n        symbol\n        decimals\n      }\n      price {\n        current\n        id\n      }\n      id\n    }\n  }\n}\n\nfragment GhostVaultThumbFragment on GhostVaultAccount {\n  id\n  account\n  vault {\n    status {\n      apr {\n        status\n        value\n      }\n    }\n    asset {\n      asset\n      chain\n      type\n      metadata {\n        symbol\n      }\n      id\n    }\n    id\n  }\n  valueUsd\n  receiptValue: value {\n    amount\n    asset {\n      price {\n        current\n        id\n      }\n      metadata {\n        symbol\n      }\n      id\n    }\n  }\n}\n\nfragment IndexAccountFragment on Account {\n  ...ActionsAccountFragment\n  ...IndexBalancesFragment\n  ...ShareCardBadgeAccountFragment\n}\n\nfragment IndexBalanceFragment on IndexAccount {\n  sharesValue\n  shares\n  account\n  index {\n    id\n    shareAsset {\n      ...msgAssetFragment\n      asset\n      metadata {\n        decimals\n        symbol\n      }\n      id\n    }\n  }\n}\n\nfragment IndexBalancesFragment on Account {\n  index {\n    id\n    ...IndexBalanceFragment\n  }\n}\n\nfragment IndexVaultPortfolioRowFragment on IndexAccount {\n  id\n  index {\n    id\n    type\n    shareAsset {\n      metadata {\n        symbol\n      }\n      id\n    }\n    status {\n      apr {\n        value\n        status\n      }\n    }\n  }\n  sharesValue\n  allocations {\n    asset {\n      metadata {\n        symbol\n      }\n      id\n    }\n    balance\n  }\n}\n\nfragment IndexVaultThumbFragment on IndexAccount {\n  id\n  index {\n    shareAsset {\n      metadata {\n        symbol\n      }\n      id\n    }\n    id\n  }\n  sharesValue\n}\n\nfragment LimitOrdersAccountFragment on Account {\n  fin {\n    ordersV2(first: 100) {\n      edges {\n        node {\n          __typename\n          ... on FinOrder {\n            pair {\n              address\n              id\n            }\n            side\n            rate\n            remaining\n            filled\n            ...LimitOrdersFragment\n          }\n          ... on Node {\n            __isNode: __typename\n            id\n          }\n        }\n        cursor\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n}\n\nfragment LimitOrdersFragment on FinOrder {\n  deviation\n  filled\n  filledValue\n  filledFee\n  offer\n  owner\n  pair {\n    address\n    assetBase {\n      asset\n      chain\n      type\n      metadata {\n        symbol\n        decimals\n      }\n      id\n    }\n    assetQuote {\n      asset\n      chain\n      type\n      metadata {\n        symbol\n        decimals\n      }\n      price {\n        current\n        id\n      }\n      id\n    }\n    book {\n      id\n      center\n    }\n    id\n  }\n  remaining\n  remainingValue\n  rate\n  side\n  type\n  updatedAt\n  offerValue\n}\n\nfragment MergePortfolioAccountFragment on Account {\n  merge {\n    totalSize {\n      amount\n      asset {\n        metadata {\n          symbol\n        }\n        price {\n          current\n          id\n        }\n        id\n      }\n    }\n  }\n}\n\nfragment MergingFragment on Account {\n  merge {\n    accounts {\n      merged {\n        amount\n        asset {\n          asset\n          metadata {\n            symbol\n            decimals\n          }\n          id\n        }\n      }\n      rate\n      shares\n      size {\n        amount\n        asset {\n          asset\n          metadata {\n            decimals\n          }\n          price {\n            current\n            id\n          }\n          id\n        }\n      }\n      valueUsd\n      pool {\n        status {\n          apr {\n            value\n            status\n          }\n        }\n        id\n      }\n      id\n    }\n  }\n}\n\nfragment OrderBookAccountFragment on Account {\n  fin {\n    orders(first: 100) {\n      edges {\n        node {\n          pair {\n            address\n            id\n          }\n          rate\n          remaining\n          id\n        }\n      }\n    }\n  }\n}\n\nfragment PortfolioFragment on Account {\n  ...MergePortfolioAccountFragment\n  fin {\n    ordersV2(first: 100) {\n      edges {\n        cursor\n        node {\n          __typename\n          ... on FinOrder {\n            valueUsd\n          }\n          ... on CalcOrder {\n            valueUsd\n            balances {\n              amount\n            }\n            ...RecurringOrdersFragment\n          }\n          ... on Node {\n            __isNode: __typename\n            id\n          }\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n    ranges(first: 100) {\n      edges {\n        node {\n          valueUsd\n          ...TradeSubscriptionsFinRangeFragment\n          id\n          __typename\n        }\n        cursor\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n  merge {\n    accounts {\n      merged {\n        amount\n      }\n      shares\n      valueUsd\n      id\n    }\n  }\n  staking {\n    single {\n      bonded {\n        amount\n      }\n      liquid {\n        amount\n      }\n      id\n    }\n  }\n  credit {\n    accounts {\n      id\n      valueUsd\n    }\n  }\n  strategies {\n    __typename\n    ... on ThorchainLiquidityProvider {\n      id\n      valueUsd\n    }\n    ... on BowAccount {\n      id\n      valueUsd\n    }\n    ... on StakingAccount {\n      id\n      valueUsd\n    }\n    ... on IndexAccount {\n      id\n      sharesValue\n    }\n    ... on GhostVaultAccount {\n      id\n      valueUsd\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment PositionBorrowFragment on GhostCreditAccount {\n  id\n  account {\n    address\n    label\n  }\n  ...PositionPositionFragment\n}\n\nfragment PositionBorrowRowFragment on GhostCreditAccount {\n  account {\n    address\n    label\n  }\n  collaterals {\n    collateral {\n      __typename\n      ... on Balance {\n        asset {\n          asset\n          metadata {\n            symbol\n          }\n          id\n        }\n        amount\n      }\n    }\n    valueFull\n    valueAdjusted\n  }\n  debts {\n    value\n    debt {\n      current\n      borrower {\n        vault {\n          status {\n            debtRate\n          }\n          id\n        }\n        asset {\n          metadata {\n            symbol\n          }\n          id\n        }\n      }\n    }\n  }\n  ltv\n  collateralValueUsd\n  debtValueUsd\n  collateralLiquidationValueUsd\n  debtLiquidationValueUsd\n  ...PositionBorrowFragment\n}\n\nfragment PositionPositionFragment on GhostCreditAccount {\n  collaterals {\n    collateral {\n      __typename\n      ... on Balance {\n        asset {\n          asset\n          type\n          chain\n          metadata {\n            symbol\n            decimals\n          }\n          variants {\n            native {\n              denom\n            }\n          }\n          id\n        }\n        amount\n      }\n    }\n    valueFull\n    valueAdjusted\n  }\n  debts {\n    value\n    debt {\n      current\n      borrower {\n        vault {\n          status {\n            debtRate\n          }\n          id\n        }\n        asset {\n          asset\n          type\n          chain\n          metadata {\n            symbol\n            decimals\n          }\n          variants {\n            native {\n              denom\n            }\n          }\n          id\n        }\n      }\n    }\n  }\n  ltv\n  collateralValueUsd\n  debtValueUsd\n  collateralLiquidationValueUsd\n  debtLiquidationValueUsd\n}\n\nfragment PositionsPortfolioFragment on Account {\n  credit {\n    accounts {\n      account {\n        address\n      }\n      ltv\n      ...PositionBorrowRowFragment\n      id\n    }\n  }\n}\n\nfragment RangeManageFragment on FinRange {\n  id\n  ...TradeSubscriptionsFinRangeFragment\n}\n\nfragment RangeOrdersAccountFragment on Account {\n  fin {\n    ranges(first: 100) {\n      edges {\n        node {\n          id\n          idx\n          base\n          quote\n          feesBase\n          feesQuote\n          ...RangeManageFragment\n          ...TradeSubscriptionsFinRangeFragment\n          pair {\n            address\n            id\n          }\n          __typename\n        }\n        cursor\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n}\n\nfragment RecurringOrdersAccountFragment on Account {\n  fin {\n    ordersV2(first: 100) {\n      edges {\n        node {\n          __typename\n          ... on CalcOrder {\n            id\n            source\n            status\n            balances {\n              amount\n            }\n            config {\n              nodes {\n                __typename\n                ... on CalcAction {\n                  action {\n                    __typename\n                    ... on CalcActionSwap {\n                      routes {\n                        __typename\n                        ... on CalcSwapRouteFin {\n                          pairAddress\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n            ...RecurringOrdersFragment\n          }\n          ... on Node {\n            __isNode: __typename\n            id\n          }\n        }\n        cursor\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n}\n\nfragment RecurringOrdersFragment on CalcOrder {\n  id\n  address\n  label\n  status\n  source\n  createdAt\n  updatedAt\n  owner\n  balances {\n    asset {\n      type\n      chain\n      metadata {\n        symbol\n        decimals\n      }\n      variants {\n        native {\n          denom\n        }\n        secured {\n          type\n          chain\n          metadata {\n            symbol\n            decimals\n          }\n          variants {\n            native {\n              denom\n            }\n          }\n          id\n        }\n      }\n      id\n    }\n    amount\n  }\n  config {\n    nodes {\n      __typename\n      ... on CalcAction {\n        next\n        action {\n          __typename\n          ... on CalcActionDistribute {\n            denoms\n            destinations {\n              shares\n              label\n              recipient {\n                __typename\n                ... on CalcRecipientBank {\n                  address\n                }\n                ... on CalcRecipientContract {\n                  address\n                  msg\n                }\n                ... on CalcRecipientDeposit {\n                  memo\n                }\n              }\n            }\n          }\n          ... on CalcActionSwap {\n            swapAmount {\n              asset {\n                type\n                chain\n                asset\n                metadata {\n                  decimals\n                  symbol\n                }\n                variants {\n                  native {\n                    denom\n                  }\n                  secured {\n                    asset\n                    type\n                    chain\n                    metadata {\n                      symbol\n                      decimals\n                    }\n                    variants {\n                      native {\n                        denom\n                      }\n                    }\n                    id\n                  }\n                }\n                id\n              }\n              amount\n            }\n            minimumReceiveAmount {\n              asset {\n                type\n                chain\n                asset\n                metadata {\n                  decimals\n                  symbol\n                }\n                variants {\n                  native {\n                    denom\n                  }\n                  secured {\n                    asset\n                    type\n                    chain\n                    metadata {\n                      symbol\n                      decimals\n                    }\n                    variants {\n                      native {\n                        denom\n                      }\n                    }\n                    id\n                  }\n                }\n                id\n              }\n              amount\n            }\n            adjustment {\n              __typename\n              ... on CalcSwapAmountAdjustmentFixed {\n                kind\n              }\n              ... on CalcSwapAmountAdjustmentLinearScalar {\n                baseReceiveAmount {\n                  amount\n                  asset {\n                    variants {\n                      native {\n                        denom\n                      }\n                    }\n                    id\n                  }\n                }\n                scalar\n              }\n            }\n            routes {\n              __typename\n              ... on CalcSwapRouteFin {\n                pair {\n                  ...RecurringOrdersPairFragment\n                  id\n                }\n              }\n              ... on CalcSwapRouteThorchain {\n                affiliateCode\n                affiliateBps\n              }\n            }\n            maximumSlippageBps\n          }\n        }\n      }\n      ... on CalcCondition {\n        condition {\n          __typename\n          ... on CalcConditionTimestampElapsed {\n            timestamp\n          }\n          ... on CalcConditionSchedule {\n            cadence {\n              __typename\n              ... on CalcCadenceCron {\n                expr\n                previousTime: previous\n              }\n              ... on CalcCadenceTime {\n                duration\n                previousTime: previous\n              }\n              ... on CalcCadenceBlocks {\n                interval\n                previousBlock: previous\n              }\n            }\n            executors\n            executions\n            jitter\n          }\n          ... on CalcConditionBalanceAvailable {\n            address\n            amount {\n              amount\n              asset {\n                metadata {\n                  symbol\n                }\n                id\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment RecurringOrdersPairFragment on FinPair {\n  address\n  assetQuote {\n    metadata {\n      symbol\n    }\n    chain\n    type\n    id\n  }\n  assetBase {\n    metadata {\n      symbol\n    }\n    chain\n    type\n    id\n  }\n  tick\n  book {\n    center\n    bids {\n      price\n    }\n    asks {\n      price\n    }\n    id\n  }\n}\n\nfragment ShareCardBadgeAccountFragment on Account {\n  index {\n    sharesValue\n    index {\n      id\n    }\n    id\n  }\n}\n\nfragment StakeAccountFragment on Account {\n  ...StakePoolPageAccountFragment\n}\n\nfragment StakeOverviewAccountFragment on Account {\n  stakingV2 {\n    id\n    pool {\n      id\n      bondAsset {\n        metadata {\n          symbol\n        }\n        id\n      }\n    }\n    bonded {\n      amount\n    }\n    liquidSize {\n      amount\n    }\n    valueUsd\n  }\n}\n\nfragment StakePoolBalanceFragment on StakingAccount {\n  id\n  account\n  liquidSize {\n    amount\n    asset {\n      ...msgAssetFragment\n      id\n    }\n  }\n  bonded {\n    amount\n  }\n  valueUsd\n  pool {\n    bondAsset {\n      metadata {\n        symbol\n      }\n      id\n    }\n    id\n  }\n  ...StakePoolBalanceWithdrawFragment\n  ...StakePoolBalanceRewardsFragment\n  ...StakePoolBalanceTransferFragment\n}\n\nfragment StakePoolBalanceRewardsFragment on StakingAccount {\n  pool {\n    address\n    revenueAsset {\n      metadata {\n        symbol\n      }\n      id\n    }\n    id\n  }\n  pendingRevenue {\n    amount\n  }\n}\n\nfragment StakePoolBalanceTransferFragment on StakingAccount {\n  pool {\n    bondAsset {\n      metadata {\n        symbol\n      }\n      price {\n        current\n        id\n      }\n      id\n    }\n    receiptAsset {\n      ...msgAssetFragment\n      metadata {\n        symbol\n      }\n      id\n    }\n    id\n  }\n  liquidSize {\n    amount\n  }\n  liquidShares {\n    amount\n  }\n}\n\nfragment StakePoolBalanceWithdrawFragment on StakingAccount {\n  pool {\n    address\n    bondAsset {\n      price {\n        current\n        id\n      }\n      variants {\n        native {\n          denom\n        }\n      }\n      id\n    }\n    id\n  }\n  bonded {\n    amount\n    asset {\n      metadata {\n        symbol\n      }\n      id\n    }\n  }\n  liquidSize {\n    amount\n  }\n  liquidShares {\n    amount\n  }\n}\n\nfragment StakePoolPageAccountFragment on Account {\n  stakingV2 {\n    pool {\n      id\n    }\n    ...StakePoolBalanceFragment\n    id\n  }\n}\n\nfragment StakingPoolPortfolioRowFragment on StakingAccount {\n  id\n  pool {\n    bondAsset {\n      metadata {\n        symbol\n      }\n      id\n    }\n    summary {\n      apr {\n        value\n        status\n      }\n      id\n    }\n    id\n  }\n  bonded {\n    amount\n  }\n  liquidSize {\n    amount\n  }\n  pendingRevenue {\n    amount\n    asset {\n      metadata {\n        symbol\n      }\n      id\n    }\n  }\n  valueUsd\n}\n\nfragment StakingPoolThumbFragment on StakingAccount {\n  id\n  pool {\n    bondAsset {\n      metadata {\n        symbol\n      }\n      id\n    }\n    id\n  }\n  valueUsd\n}\n\nfragment StrategyAccountFragment on Account {\n  ...BowPoolXykAccountFragment\n  ...ThorchainPoolAccountFragment\n}\n\nfragment ThorchainPoolAccountFragment on Account {\n  liquidityAccounts {\n    id\n    asset {\n      id\n    }\n    ...ThorchainPoolBalanceFragment\n    ...ThorchainPoolDepositAccountFragment\n  }\n}\n\nfragment ThorchainPoolBalanceFragment on ThorchainLiquidityProvider {\n  id\n  asset {\n    price {\n      current\n      id\n    }\n    metadata {\n      symbol\n    }\n    id\n  }\n  assetRedeemValue\n  runeRedeemValue\n  units\n  valueUsd\n  ...ThorchainPoolBalanceWithDrawFragment\n}\n\nfragment ThorchainPoolBalanceWithDrawFragment on ThorchainLiquidityProvider {\n  assetAddress\n  runeAddress\n  asset {\n    chain\n    metadata {\n      symbol\n    }\n    ...msgAssetFragment\n    id\n  }\n  units\n  runeRedeemValue\n  assetRedeemValue\n}\n\nfragment ThorchainPoolDepositAccountFragment on ThorchainLiquidityProvider {\n  pendingAsset\n  pendingRune\n}\n\nfragment ThorchainPoolThumbFragment on ThorchainLiquidityProvider {\n  asset {\n    asset\n    metadata {\n      symbol\n    }\n    price {\n      current\n      id\n    }\n    id\n  }\n  valueUsd\n  assetRedeemValue\n  runeRedeemValue\n}\n\nfragment TradeSubscriptionsFinRangeFragment on FinRange {\n  id\n  idx\n  low\n  high\n  skew\n  spread\n  fee\n  base\n  quote\n  feesBase\n  feesQuote\n  principalUsd\n  yieldUsd\n  pair {\n    address\n    book {\n      center\n      id\n    }\n    assetBase {\n      type\n      chain\n      asset\n      metadata {\n        symbol\n        decimals\n      }\n      variants {\n        native {\n          denom\n        }\n      }\n      price {\n        current\n        id\n      }\n      id\n    }\n    assetQuote {\n      type\n      chain\n      asset\n      metadata {\n        symbol\n        decimals\n      }\n      variants {\n        native {\n          denom\n        }\n      }\n      price {\n        current\n        id\n      }\n      id\n    }\n    id\n  }\n  inRange\n  analytics {\n    firstDepositDate\n    weightedAverageInvestmentAgeDays\n    totalInvested\n    totalWithdrawn\n    realizedYield\n    unrealizedInvestment\n    unrealizedYield\n    moic\n    dpi\n    apr\n    id\n  }\n}\n\nfragment TradeSubscriptionsFragment on Account {\n  address\n  fin {\n    ordersV2(first: 100) {\n      edges {\n        node {\n          __typename\n          ... on FinOrder {\n            pair {\n              address\n              id\n            }\n            side\n            rate\n            type\n            owner\n            deviation\n            remaining\n            filled\n            ...LimitOrdersFragment\n          }\n          ... on CalcOrder {\n            id\n            updatedAt\n            valueUsd\n            source\n            status\n            balances {\n              amount\n            }\n            config {\n              nodes {\n                __typename\n                ... on CalcAction {\n                  action {\n                    __typename\n                    ... on CalcActionSwap {\n                      routes {\n                        __typename\n                        ... on CalcSwapRouteFin {\n                          pairAddress\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n            ...RecurringOrdersFragment\n          }\n          ... on Node {\n            __isNode: __typename\n            id\n          }\n        }\n        cursor\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n    ranges(first: 100) {\n      edges {\n        node {\n          id\n          idx\n          pair {\n            address\n            id\n          }\n          __typename\n        }\n        cursor\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n}\n\nfragment msgAssetFragment on Asset {\n  type\n  chain\n  asset\n  metadata {\n    decimals\n    symbol\n  }\n  variants {\n    native {\n      denom\n    }\n    secured {\n      type\n      chain\n      asset\n      metadata {\n        decimals\n        symbol\n      }\n      variants {\n        native {\n          denom\n        }\n      }\n      id\n    }\n  }\n}\n\nfragment useAutoClaimerFragment on Account {\n  address\n  auto {\n    workflows(states: [\"RUNNING\"], first: 100000) {\n      edges {\n        node {\n          id\n          instanceId\n          workflowId\n          requester\n          executionType\n          cronExpression\n          onchainParameters\n          offchainParameters\n          expirationDate\n          launcherId\n          state\n          workflow {\n            id\n            name\n          }\n          schedule {\n            status\n            nextExecutionTimes\n            runningWorkflows\n          }\n          lastRun {\n            state\n            startTime\n            endTime\n          }\n          __typename\n        }\n        cursor\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "4c2ba2d688cbd55bfb85a4088ca11a56";

export default node;
