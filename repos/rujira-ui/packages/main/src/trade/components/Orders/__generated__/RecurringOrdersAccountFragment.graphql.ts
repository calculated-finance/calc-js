/**
 * @generated SignedSource<<0e87ecf61edaae64f946d588fbc0e54d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type CalcOrderStatus = "ACTIVE" | "PAUSED" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type RecurringOrdersAccountFragment$data = {
  readonly fin: {
    readonly ordersV2: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly __typename: "CalcOrder";
          readonly balances: ReadonlyArray<{
            readonly amount: bigint;
          }> | null | undefined;
          readonly config: {
            readonly nodes: ReadonlyArray<{
              readonly __typename: "CalcAction";
              readonly action: {
                readonly __typename: "CalcActionSwap";
                readonly routes: ReadonlyArray<{
                  readonly __typename: "CalcSwapRouteFin";
                  readonly pairAddress: string;
                } | {
                  // This will never be '%other', but we need some
                  // value in case none of the concrete values match.
                  readonly __typename: "%other";
                }>;
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
          readonly id: string;
          readonly source: string | null | undefined;
          readonly status: CalcOrderStatus;
          readonly " $fragmentSpreads": FragmentRefs<"RecurringOrdersFragment">;
        } | {
          // This will never be '%other', but we need some
          // value in case none of the concrete values match.
          readonly __typename: "%other";
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "RecurringOrdersAccountFragment";
};
export type RecurringOrdersAccountFragment$key = {
  readonly " $data"?: RecurringOrdersAccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"RecurringOrdersAccountFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
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
      }
    ]
  },
  "name": "RecurringOrdersAccountFragment",
  "selections": [
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
                    (v0/*: any*/),
                    {
                      "kind": "InlineFragment",
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "id",
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
                                (v0/*: any*/),
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
                                        (v0/*: any*/),
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
                                                (v0/*: any*/),
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
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "cursor",
                  "storageKey": null
                }
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
            }
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

(node as any).hash = "4ec82f8a5f78c983f039cb25c121ef1a";

export default node;
