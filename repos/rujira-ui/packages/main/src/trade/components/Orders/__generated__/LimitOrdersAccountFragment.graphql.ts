/**
 * @generated SignedSource<<04aa9deaa8f9979ed5ca7112bce17dbd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type LimitOrdersAccountFragment$data = {
  readonly fin: {
    readonly ordersV2: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly __typename: "FinOrder";
          readonly filled: bigint;
          readonly pair: {
            readonly address: string;
          };
          readonly rate: bigint;
          readonly remaining: bigint;
          readonly side: string;
          readonly " $fragmentSpreads": FragmentRefs<"LimitOrdersFragment">;
        } | {
          // This will never be '%other', but we need some
          // value in case none of the concrete values match.
          readonly __typename: "%other";
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "LimitOrdersAccountFragment";
};
export type LimitOrdersAccountFragment$key = {
  readonly " $data"?: LimitOrdersAccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"LimitOrdersAccountFragment">;
};

const node: ReaderFragment = {
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
  "name": "LimitOrdersAccountFragment",
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
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "__typename",
                      "storageKey": null
                    },
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
                              "alias": null,
                              "args": null,
                              "kind": "ScalarField",
                              "name": "address",
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

(node as any).hash = "e85c06522edfcae4bab0c7a8d8f24402";

export default node;
