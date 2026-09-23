/**
 * @generated SignedSource<<164d76acbd2d1d2a9fdaabec586c1c0e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PortfolioFragment$data = {
  readonly credit: {
    readonly accounts: ReadonlyArray<{
      readonly id: string;
      readonly valueUsd: bigint;
    }> | null | undefined;
  };
  readonly fin: {
    readonly ordersV2: {
      readonly edges: ReadonlyArray<{
        readonly cursor: string | null | undefined;
        readonly node: {
          readonly __typename: "CalcOrder";
          readonly balances: ReadonlyArray<{
            readonly amount: bigint;
          }> | null | undefined;
          readonly valueUsd: bigint;
          readonly " $fragmentSpreads": FragmentRefs<"RecurringOrdersFragment">;
        } | {
          readonly __typename: "FinOrder";
          readonly valueUsd: bigint;
        } | {
          // This will never be '%other', but we need some
          // value in case none of the concrete values match.
          readonly __typename: "%other";
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
    readonly ranges: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly valueUsd: bigint;
          readonly " $fragmentSpreads": FragmentRefs<"TradeSubscriptionsFinRangeFragment">;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
  } | null | undefined;
  readonly merge: {
    readonly accounts: ReadonlyArray<{
      readonly merged: {
        readonly amount: bigint;
      };
      readonly shares: bigint;
      readonly valueUsd: bigint;
    }> | null | undefined;
  } | null | undefined;
  readonly staking: {
    readonly single: {
      readonly bonded: {
        readonly amount: bigint;
      };
      readonly liquid: {
        readonly amount: bigint;
      };
    } | null | undefined;
  };
  readonly strategies: ReadonlyArray<{
    readonly __typename: "BowAccount";
    readonly id: string;
    readonly valueUsd: bigint;
  } | {
    readonly __typename: "GhostVaultAccount";
    readonly id: string;
    readonly valueUsd: bigint;
  } | {
    readonly __typename: "IndexAccount";
    readonly id: string;
    readonly sharesValue: bigint;
  } | {
    readonly __typename: "StakingAccount";
    readonly id: string;
    readonly valueUsd: bigint;
  } | {
    readonly __typename: "ThorchainLiquidityProvider";
    readonly id: string;
    readonly valueUsd: bigint;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  }>;
  readonly " $fragmentSpreads": FragmentRefs<"MergePortfolioAccountFragment">;
  readonly " $fragmentType": "PortfolioFragment";
};
export type PortfolioFragment$key = {
  readonly " $data"?: PortfolioFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"PortfolioFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
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
  "kind": "ScalarField",
  "name": "valueUsd",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "amount",
    "storageKey": null
  }
],
v4 = {
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
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v6 = [
  (v5/*: any*/),
  (v2/*: any*/)
];
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
  "name": "PortfolioFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MergePortfolioAccountFragment"
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
                (v0/*: any*/),
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
                        (v2/*: any*/)
                      ],
                      "type": "FinOrder",
                      "abstractKey": null
                    },
                    {
                      "kind": "InlineFragment",
                      "selections": [
                        (v2/*: any*/),
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "Balance",
                          "kind": "LinkedField",
                          "name": "balances",
                          "plural": true,
                          "selections": (v3/*: any*/),
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
                }
              ],
              "storageKey": null
            },
            (v4/*: any*/)
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
                    (v2/*: any*/),
                    {
                      "args": null,
                      "kind": "FragmentSpread",
                      "name": "TradeSubscriptionsFinRangeFragment"
                    },
                    (v1/*: any*/)
                  ],
                  "storageKey": null
                },
                (v0/*: any*/)
              ],
              "storageKey": null
            },
            (v4/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
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
              "concreteType": "Balance",
              "kind": "LinkedField",
              "name": "merged",
              "plural": false,
              "selections": (v3/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "shares",
              "storageKey": null
            },
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
            {
              "alias": null,
              "args": null,
              "concreteType": "Balance",
              "kind": "LinkedField",
              "name": "bonded",
              "plural": false,
              "selections": (v3/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "Balance",
              "kind": "LinkedField",
              "name": "liquid",
              "plural": false,
              "selections": (v3/*: any*/),
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
      "concreteType": "GhostCreditAccounts",
      "kind": "LinkedField",
      "name": "credit",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "GhostCreditAccount",
          "kind": "LinkedField",
          "name": "accounts",
          "plural": true,
          "selections": (v6/*: any*/),
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
        (v1/*: any*/),
        {
          "kind": "InlineFragment",
          "selections": (v6/*: any*/),
          "type": "ThorchainLiquidityProvider",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": (v6/*: any*/),
          "type": "BowAccount",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": (v6/*: any*/),
          "type": "StakingAccount",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v5/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "sharesValue",
              "storageKey": null
            }
          ],
          "type": "IndexAccount",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": (v6/*: any*/),
          "type": "GhostVaultAccount",
          "abstractKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};
})();

(node as any).hash = "149ef9d1f0912302ab3542d1a7d9d573";

export default node;
