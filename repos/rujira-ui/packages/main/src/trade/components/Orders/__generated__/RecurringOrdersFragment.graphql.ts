/**
 * @generated SignedSource<<a2f8562a3c2d47c63e6c94b0e7d96854>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type AssetType = "LAYER_1" | "NATIVE" | "SECURED" | "SYNTH" | "%future added value";
export type CalcOrderStatus = "ACTIVE" | "PAUSED" | "%future added value";
export type CalcSwapAmountAdjustmentKind = "FIXED" | "LINEAR_SCALAR" | "%future added value";
export type Chain = "AVAX" | "BASE" | "BCH" | "BSC" | "BTC" | "DOGE" | "ETH" | "GAIA" | "KUJI" | "LTC" | "NOBLE" | "OSMO" | "SOL" | "TERRA" | "TERRA2" | "THOR" | "TON" | "TRON" | "TRON" | "XRP" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type RecurringOrdersFragment$data = {
  readonly address: string;
  readonly balances: ReadonlyArray<{
    readonly amount: bigint;
    readonly asset: {
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
  }> | null | undefined;
  readonly config: {
    readonly nodes: ReadonlyArray<{
      readonly __typename: "CalcAction";
      readonly action: {
        readonly __typename: "CalcActionDistribute";
        readonly denoms: ReadonlyArray<string>;
        readonly destinations: ReadonlyArray<{
          readonly label: string | null | undefined;
          readonly recipient: {
            readonly __typename: "CalcRecipientBank";
            readonly address: string;
          } | {
            readonly __typename: "CalcRecipientContract";
            readonly address: string;
            readonly msg: string;
          } | {
            readonly __typename: "CalcRecipientDeposit";
            readonly memo: string;
          } | {
            // This will never be '%other', but we need some
            // value in case none of the concrete values match.
            readonly __typename: "%other";
          };
          readonly shares: number;
        }>;
      } | {
        readonly __typename: "CalcActionSwap";
        readonly adjustment: {
          readonly __typename: "CalcSwapAmountAdjustmentFixed";
          readonly kind: CalcSwapAmountAdjustmentKind;
        } | {
          readonly __typename: "CalcSwapAmountAdjustmentLinearScalar";
          readonly baseReceiveAmount: {
            readonly amount: bigint;
            readonly asset: {
              readonly variants: {
                readonly native: {
                  readonly denom: string;
                } | null | undefined;
              };
            };
          };
          readonly scalar: bigint;
        } | {
          // This will never be '%other', but we need some
          // value in case none of the concrete values match.
          readonly __typename: "%other";
        };
        readonly maximumSlippageBps: number;
        readonly minimumReceiveAmount: {
          readonly amount: bigint;
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
                readonly variants: {
                  readonly native: {
                    readonly denom: string;
                  } | null | undefined;
                };
              } | null | undefined;
            };
          };
        };
        readonly routes: ReadonlyArray<{
          readonly __typename: "CalcSwapRouteFin";
          readonly pair: {
            readonly " $fragmentSpreads": FragmentRefs<"RecurringOrdersPairFragment">;
          };
        } | {
          readonly __typename: "CalcSwapRouteThorchain";
          readonly affiliateBps: number | null | undefined;
          readonly affiliateCode: string | null | undefined;
        } | {
          // This will never be '%other', but we need some
          // value in case none of the concrete values match.
          readonly __typename: "%other";
        }>;
        readonly swapAmount: {
          readonly amount: bigint;
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
                readonly variants: {
                  readonly native: {
                    readonly denom: string;
                  } | null | undefined;
                };
              } | null | undefined;
            };
          };
        };
      } | {
        // This will never be '%other', but we need some
        // value in case none of the concrete values match.
        readonly __typename: "%other";
      };
      readonly next: number | null | undefined;
    } | {
      readonly __typename: "CalcCondition";
      readonly condition: {
        readonly __typename: "CalcConditionBalanceAvailable";
        readonly address: string | null | undefined;
        readonly amount: {
          readonly amount: bigint;
          readonly asset: {
            readonly metadata: {
              readonly symbol: string;
            };
          };
        };
      } | {
        readonly __typename: "CalcConditionSchedule";
        readonly cadence: {
          readonly __typename: "CalcCadenceBlocks";
          readonly interval: number;
          readonly previousBlock: number | null | undefined;
        } | {
          readonly __typename: "CalcCadenceCron";
          readonly expr: string;
          readonly previousTime: any | null | undefined;
        } | {
          readonly __typename: "CalcCadenceTime";
          readonly duration: number;
          readonly previousTime: any | null | undefined;
        } | {
          // This will never be '%other', but we need some
          // value in case none of the concrete values match.
          readonly __typename: "%other";
        };
        readonly executions: number | null | undefined;
        readonly executors: ReadonlyArray<string> | null | undefined;
        readonly jitter: number | null | undefined;
      } | {
        readonly __typename: "CalcConditionTimestampElapsed";
        readonly timestamp: any;
      } | {
        // This will never be '%other', but we need some
        // value in case none of the concrete values match.
        readonly __typename: "%other";
      };
    } | {
      // This will never be '%other', but we need some
      // value in case none of the concrete values match.
      readonly __typename: "%other";
    }> | null | undefined;
  };
  readonly createdAt: any;
  readonly id: string;
  readonly label: string;
  readonly owner: string;
  readonly source: string | null | undefined;
  readonly status: CalcOrderStatus;
  readonly updatedAt: any;
  readonly " $fragmentType": "RecurringOrdersFragment";
};
export type RecurringOrdersFragment$key = {
  readonly " $data"?: RecurringOrdersFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"RecurringOrdersFragment">;
};

const node: ReaderFragment = (function(){
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
  "name": "label",
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
  "kind": "ScalarField",
  "name": "symbol",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "decimals",
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
    (v4/*: any*/),
    (v5/*: any*/)
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
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "amount",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "asset",
  "storageKey": null
},
v12 = [
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
      (v11/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "Metadata",
        "kind": "LinkedField",
        "name": "metadata",
        "plural": false,
        "selections": [
          (v5/*: any*/),
          (v4/*: any*/)
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
          (v7/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Asset",
            "kind": "LinkedField",
            "name": "secured",
            "plural": false,
            "selections": [
              (v11/*: any*/),
              (v2/*: any*/),
              (v3/*: any*/),
              (v6/*: any*/),
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
  (v9/*: any*/)
],
v13 = {
  "alias": "previousTime",
  "args": null,
  "kind": "ScalarField",
  "name": "previous",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "RecurringOrdersFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    (v0/*: any*/),
    (v1/*: any*/),
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
            (v2/*: any*/),
            (v3/*: any*/),
            (v6/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "AssetVariants",
              "kind": "LinkedField",
              "name": "variants",
              "plural": false,
              "selections": [
                (v7/*: any*/),
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
                    (v6/*: any*/),
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
        (v9/*: any*/)
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
            (v10/*: any*/),
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
                    (v10/*: any*/),
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
                            (v1/*: any*/),
                            {
                              "alias": null,
                              "args": null,
                              "concreteType": null,
                              "kind": "LinkedField",
                              "name": "recipient",
                              "plural": false,
                              "selections": [
                                (v10/*: any*/),
                                {
                                  "kind": "InlineFragment",
                                  "selections": [
                                    (v0/*: any*/)
                                  ],
                                  "type": "CalcRecipientBank",
                                  "abstractKey": null
                                },
                                {
                                  "kind": "InlineFragment",
                                  "selections": [
                                    (v0/*: any*/),
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
                          "selections": (v12/*: any*/),
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "Balance",
                          "kind": "LinkedField",
                          "name": "minimumReceiveAmount",
                          "plural": false,
                          "selections": (v12/*: any*/),
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
                            (v10/*: any*/),
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
                                    (v9/*: any*/),
                                    {
                                      "alias": null,
                                      "args": null,
                                      "concreteType": "Asset",
                                      "kind": "LinkedField",
                                      "name": "asset",
                                      "plural": false,
                                      "selections": [
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
                            (v10/*: any*/),
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
                                    {
                                      "args": null,
                                      "kind": "FragmentSpread",
                                      "name": "RecurringOrdersPairFragment"
                                    }
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
                    (v10/*: any*/),
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
                            (v10/*: any*/),
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
                                (v13/*: any*/)
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
                                (v13/*: any*/)
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
                        (v0/*: any*/),
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "Balance",
                          "kind": "LinkedField",
                          "name": "amount",
                          "plural": false,
                          "selections": [
                            (v9/*: any*/),
                            {
                              "alias": null,
                              "args": null,
                              "concreteType": "Asset",
                              "kind": "LinkedField",
                              "name": "asset",
                              "plural": false,
                              "selections": [
                                {
                                  "alias": null,
                                  "args": null,
                                  "concreteType": "Metadata",
                                  "kind": "LinkedField",
                                  "name": "metadata",
                                  "plural": false,
                                  "selections": [
                                    (v4/*: any*/)
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
};
})();

(node as any).hash = "edae975a9141d883e2b878563d83fd8b";

export default node;
