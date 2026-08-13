/**
 * @generated SignedSource<<ec0bdf072db6f8a6cf7c8bb870a2c87d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type CalcOrderStatus = "ACTIVE" | "PAUSED" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type TradeSubscriptionsFragment$data = {
  readonly address: string;
  readonly fin: {
    readonly ordersV2: {
      readonly __id: string;
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly __typename: "CalcOrder";
          readonly balances: ReadonlyArray<{
            readonly amount: bigint;
          }> | null | undefined;
          readonly config: {
            readonly nodes: ReadonlyArray<{
              readonly action?: {
                readonly routes?: ReadonlyArray<{
                  readonly pairAddress?: string;
                }>;
              };
            }> | null | undefined;
          };
          readonly id: string;
          readonly source: string | null | undefined;
          readonly status: CalcOrderStatus;
          readonly updatedAt: any;
          readonly valueUsd: bigint;
          readonly " $fragmentSpreads": FragmentRefs<"RecurringOrdersFragment">;
        } | {
          readonly __typename: "FinOrder";
          readonly deviation: bigint | null | undefined;
          readonly filled: bigint;
          readonly owner: string;
          readonly pair: {
            readonly address: string;
          };
          readonly rate: bigint;
          readonly remaining: bigint;
          readonly side: string;
          readonly type: string;
          readonly " $fragmentSpreads": FragmentRefs<"LimitOrdersFragment">;
        } | {
          // This will never be '%other', but we need some
          // value in case none of the concrete values match.
          readonly __typename: "%other";
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
    readonly ranges: {
      readonly __id: string;
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly id: string;
          readonly idx: bigint;
          readonly pair: {
            readonly address: string;
          };
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "TradeSubscriptionsFragment";
};
export type TradeSubscriptionsFragment$key = {
  readonly " $data"?: TradeSubscriptionsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"TradeSubscriptionsFragment">;
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
  "name": "__typename",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "concreteType": "FinPair",
  "kind": "LinkedField",
  "name": "pair",
  "plural": false,
  "selections": [
    (v0/*: any*/)
  ],
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
  "name": "cursor",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "concreteType": "PageInfo",
  "kind": "LinkedField",
  "name": "pageInfo",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "endCursor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasNextPage",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v6 = {
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
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": null,
        "cursor": null,
        "direction": "forward",
        "path": [
          "fin",
          "ordersV2"
        ]
      },
      {
        "count": null,
        "cursor": null,
        "direction": "forward",
        "path": [
          "fin",
          "ranges"
        ]
      }
    ]
  },
  "name": "TradeSubscriptionsFragment",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "FinAccount",
      "kind": "LinkedField",
      "name": "fin",
      "plural": false,
      "selections": [
        {
          "alias": "ordersV2",
          "args": null,
          "concreteType": "OrderConnection",
          "kind": "LinkedField",
          "name": "__TradeSubscriptionsFragment_ordersV2_connection",
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
                {
                  "alias": null,
                  "args": null,
                  "concreteType": null,
                  "kind": "LinkedField",
                  "name": "node",
                  "plural": false,
                  "selections": [
                    (v1/*: any*/),
                    {
                      "kind": "InlineFragment",
                      "selections": [
                        (v2/*: any*/),
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "side",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "rate",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "type",
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
                          "kind": "ScalarField",
                          "name": "deviation",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "remaining",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "filled",
                          "storageKey": null
                        },
                        {
                          "args": null,
                          "kind": "FragmentSpread",
                          "name": "LimitOrdersFragment"
                        }
                      ],
                      "type": "FinOrder",
                      "abstractKey": null
                    },
                    {
                      "kind": "InlineFragment",
                      "selections": [
                        (v3/*: any*/),
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
                          "name": "valueUsd",
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
                          "name": "status",
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
                              "kind": "ScalarField",
                              "name": "amount",
                              "storageKey": null
                            }
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
                                {
                                  "kind": "InlineFragment",
                                  "selections": [
                                    {
                                      "alias": null,
                                      "args": null,
                                      "concreteType": null,
                                      "kind": "LinkedField",
                                      "name": "action",
                                      "plural": false,
                                      "selections": [
                                        {
                                          "kind": "InlineFragment",
                                          "selections": [
                                            {
                                              "alias": null,
                                              "args": null,
                                              "concreteType": null,
                                              "kind": "LinkedField",
                                              "name": "routes",
                                              "plural": true,
                                              "selections": [
                                                {
                                                  "kind": "InlineFragment",
                                                  "selections": [
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
                                                }
                                              ],
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
                                }
                              ],
                              "storageKey": null
                            }
                          ],
                          "storageKey": null
                        },
                        {
                          "args": null,
                          "kind": "FragmentSpread",
                          "name": "RecurringOrdersFragment"
                        }
                      ],
                      "type": "CalcOrder",
                      "abstractKey": null
                    }
                  ],
                  "storageKey": null
                },
                (v4/*: any*/)
              ],
              "storageKey": null
            },
            (v5/*: any*/),
            (v6/*: any*/)
          ],
          "storageKey": null
        },
        {
          "alias": "ranges",
          "args": null,
          "concreteType": "FinRangeConnection",
          "kind": "LinkedField",
          "name": "__TradeSubscriptionsFragment_ranges_connection",
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
                    (v3/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "idx",
                      "storageKey": null
                    },
                    (v2/*: any*/),
                    (v1/*: any*/)
                  ],
                  "storageKey": null
                },
                (v4/*: any*/)
              ],
              "storageKey": null
            },
            (v5/*: any*/),
            (v6/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};
})();

(node as any).hash = "821659a2b5e2eb00bd68ab116f2fa87a";

export default node;
