/**
 * @generated SignedSource<<6389d69f0188b36adb6682b325787e47>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RecurringOrdersOrderUpdatedSubscription$variables = {
  id: string;
};
export type RecurringOrdersOrderUpdatedSubscription$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"RecurringOrdersFragment">;
  } | null | undefined;
};
export type RecurringOrdersOrderUpdatedSubscription = {
  response: RecurringOrdersOrderUpdatedSubscription$data;
  variables: RecurringOrdersOrderUpdatedSubscription$variables;
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
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
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
  "name": "label",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "symbol",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "decimals",
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
    (v8/*: any*/),
    (v9/*: any*/)
  ],
  "storageKey": null
},
v11 = {
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
v12 = {
  "alias": null,
  "args": null,
  "concreteType": "AssetVariants",
  "kind": "LinkedField",
  "name": "variants",
  "plural": false,
  "selections": [
    (v11/*: any*/)
  ],
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
v15 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Asset",
    "kind": "LinkedField",
    "name": "asset",
    "plural": false,
    "selections": [
      (v6/*: any*/),
      (v7/*: any*/),
      (v14/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "Metadata",
        "kind": "LinkedField",
        "name": "metadata",
        "plural": false,
        "selections": [
          (v9/*: any*/),
          (v8/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "AssetVariants",
        "kind": "LinkedField",
        "name": "variants",
        "plural": false,
        "selections": [
          (v11/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Asset",
            "kind": "LinkedField",
            "name": "secured",
            "plural": false,
            "selections": [
              (v14/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v10/*: any*/),
              (v12/*: any*/),
              (v3/*: any*/)
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
  (v13/*: any*/)
],
v16 = {
  "alias": null,
  "args": null,
  "concreteType": "Metadata",
  "kind": "LinkedField",
  "name": "metadata",
  "plural": false,
  "selections": [
    (v8/*: any*/)
  ],
  "storageKey": null
},
v17 = [
  (v16/*: any*/),
  (v7/*: any*/),
  (v6/*: any*/),
  (v3/*: any*/)
],
v18 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "price",
    "storageKey": null
  }
],
v19 = {
  "alias": "previousTime",
  "args": null,
  "kind": "ScalarField",
  "name": "previous",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RecurringOrdersOrderUpdatedSubscription",
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
            "args": null,
            "kind": "FragmentSpread",
            "name": "RecurringOrdersFragment"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "RootSubscriptionType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RecurringOrdersOrderUpdatedSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/),
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
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "updatedAt",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "owner",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Balance",
                "kind": "LinkedField",
                "name": "balances",
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
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v10/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AssetVariants",
                        "kind": "LinkedField",
                        "name": "variants",
                        "plural": false,
                        "selections": [
                          (v11/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Asset",
                            "kind": "LinkedField",
                            "name": "secured",
                            "plural": false,
                            "selections": [
                              (v6/*: any*/),
                              (v7/*: any*/),
                              (v10/*: any*/),
                              (v12/*: any*/),
                              (v3/*: any*/)
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
                  (v13/*: any*/)
                ],
                "storageKey": null
              },
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
                      (v2/*: any*/),
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
                              (v2/*: any*/),
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
                                      {
                                        "alias": null,
                                        "args": null,
                                        "kind": "ScalarField",
                                        "name": "shares",
                                        "storageKey": null
                                      },
                                      (v5/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": null,
                                        "kind": "LinkedField",
                                        "name": "recipient",
                                        "plural": false,
                                        "selections": [
                                          (v2/*: any*/),
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
                                    "selections": (v15/*: any*/),
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Balance",
                                    "kind": "LinkedField",
                                    "name": "minimumReceiveAmount",
                                    "plural": false,
                                    "selections": (v15/*: any*/),
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
                                      (v2/*: any*/),
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
                                                  (v12/*: any*/),
                                                  (v3/*: any*/)
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
                                      (v2/*: any*/),
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
                                                "selections": (v17/*: any*/),
                                                "storageKey": null
                                              },
                                              {
                                                "alias": null,
                                                "args": null,
                                                "concreteType": "Asset",
                                                "kind": "LinkedField",
                                                "name": "assetBase",
                                                "plural": false,
                                                "selections": (v17/*: any*/),
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
                                                  {
                                                    "alias": null,
                                                    "args": null,
                                                    "kind": "ScalarField",
                                                    "name": "center",
                                                    "storageKey": null
                                                  },
                                                  {
                                                    "alias": null,
                                                    "args": null,
                                                    "concreteType": "FinBookEntry",
                                                    "kind": "LinkedField",
                                                    "name": "bids",
                                                    "plural": true,
                                                    "selections": (v18/*: any*/),
                                                    "storageKey": null
                                                  },
                                                  {
                                                    "alias": null,
                                                    "args": null,
                                                    "concreteType": "FinBookEntry",
                                                    "kind": "LinkedField",
                                                    "name": "asks",
                                                    "plural": true,
                                                    "selections": (v18/*: any*/),
                                                    "storageKey": null
                                                  },
                                                  (v3/*: any*/)
                                                ],
                                                "storageKey": null
                                              },
                                              (v3/*: any*/)
                                            ],
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
                              (v2/*: any*/),
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
                                      (v2/*: any*/),
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
                                          (v19/*: any*/)
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
                                          (v19/*: any*/)
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
                                          (v16/*: any*/),
                                          (v3/*: any*/)
                                        ],
                                        "storageKey": null
                                      }
                                    ],
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
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "ab3f3fc35dd81f680e2b08fe6befc010",
    "id": null,
    "metadata": {},
    "name": "RecurringOrdersOrderUpdatedSubscription",
    "operationKind": "subscription",
    "text": "subscription RecurringOrdersOrderUpdatedSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ...RecurringOrdersFragment\n    id\n  }\n}\n\nfragment RecurringOrdersFragment on CalcOrder {\n  id\n  address\n  label\n  status\n  source\n  createdAt\n  updatedAt\n  owner\n  balances {\n    asset {\n      type\n      chain\n      metadata {\n        symbol\n        decimals\n      }\n      variants {\n        native {\n          denom\n        }\n        secured {\n          type\n          chain\n          metadata {\n            symbol\n            decimals\n          }\n          variants {\n            native {\n              denom\n            }\n          }\n          id\n        }\n      }\n      id\n    }\n    amount\n  }\n  config {\n    nodes {\n      __typename\n      ... on CalcAction {\n        next\n        action {\n          __typename\n          ... on CalcActionDistribute {\n            denoms\n            destinations {\n              shares\n              label\n              recipient {\n                __typename\n                ... on CalcRecipientBank {\n                  address\n                }\n                ... on CalcRecipientContract {\n                  address\n                  msg\n                }\n                ... on CalcRecipientDeposit {\n                  memo\n                }\n              }\n            }\n          }\n          ... on CalcActionSwap {\n            swapAmount {\n              asset {\n                type\n                chain\n                asset\n                metadata {\n                  decimals\n                  symbol\n                }\n                variants {\n                  native {\n                    denom\n                  }\n                  secured {\n                    asset\n                    type\n                    chain\n                    metadata {\n                      symbol\n                      decimals\n                    }\n                    variants {\n                      native {\n                        denom\n                      }\n                    }\n                    id\n                  }\n                }\n                id\n              }\n              amount\n            }\n            minimumReceiveAmount {\n              asset {\n                type\n                chain\n                asset\n                metadata {\n                  decimals\n                  symbol\n                }\n                variants {\n                  native {\n                    denom\n                  }\n                  secured {\n                    asset\n                    type\n                    chain\n                    metadata {\n                      symbol\n                      decimals\n                    }\n                    variants {\n                      native {\n                        denom\n                      }\n                    }\n                    id\n                  }\n                }\n                id\n              }\n              amount\n            }\n            adjustment {\n              __typename\n              ... on CalcSwapAmountAdjustmentFixed {\n                kind\n              }\n              ... on CalcSwapAmountAdjustmentLinearScalar {\n                baseReceiveAmount {\n                  amount\n                  asset {\n                    variants {\n                      native {\n                        denom\n                      }\n                    }\n                    id\n                  }\n                }\n                scalar\n              }\n            }\n            routes {\n              __typename\n              ... on CalcSwapRouteFin {\n                pair {\n                  ...RecurringOrdersPairFragment\n                  id\n                }\n              }\n              ... on CalcSwapRouteThorchain {\n                affiliateCode\n                affiliateBps\n              }\n            }\n            maximumSlippageBps\n          }\n        }\n      }\n      ... on CalcCondition {\n        condition {\n          __typename\n          ... on CalcConditionTimestampElapsed {\n            timestamp\n          }\n          ... on CalcConditionSchedule {\n            cadence {\n              __typename\n              ... on CalcCadenceCron {\n                expr\n                previousTime: previous\n              }\n              ... on CalcCadenceTime {\n                duration\n                previousTime: previous\n              }\n              ... on CalcCadenceBlocks {\n                interval\n                previousBlock: previous\n              }\n            }\n            executors\n            executions\n            jitter\n          }\n          ... on CalcConditionBalanceAvailable {\n            address\n            amount {\n              amount\n              asset {\n                metadata {\n                  symbol\n                }\n                id\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment RecurringOrdersPairFragment on FinPair {\n  address\n  assetQuote {\n    metadata {\n      symbol\n    }\n    chain\n    type\n    id\n  }\n  assetBase {\n    metadata {\n      symbol\n    }\n    chain\n    type\n    id\n  }\n  tick\n  book {\n    center\n    bids {\n      price\n    }\n    asks {\n      price\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "5584b145fb685f1df5791fde2c7f6595";

export default node;
