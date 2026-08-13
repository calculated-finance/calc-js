/**
 * @generated SignedSource<<72441cd648fb2e82faa3d2ad7870e16b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RangeOrdersAccountFragment$data = {
  readonly fin: {
    readonly ranges: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly base: bigint;
          readonly feesBase: bigint;
          readonly feesQuote: bigint;
          readonly id: string;
          readonly idx: bigint;
          readonly pair: {
            readonly address: string;
          };
          readonly quote: bigint;
          readonly " $fragmentSpreads": FragmentRefs<"RangeManageFragment" | "TradeSubscriptionsFinRangeFragment">;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "RangeOrdersAccountFragment";
};
export type RangeOrdersAccountFragment$key = {
  readonly " $data"?: RangeOrdersAccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"RangeOrdersAccountFragment">;
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
          "ranges"
        ]
      }
    ]
  },
  "name": "RangeOrdersAccountFragment",
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
                      "name": "idx",
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
                      "args": null,
                      "kind": "FragmentSpread",
                      "name": "RangeManageFragment"
                    },
                    {
                      "args": null,
                      "kind": "FragmentSpread",
                      "name": "TradeSubscriptionsFinRangeFragment"
                    },
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
                      "name": "__typename",
                      "storageKey": null
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

(node as any).hash = "c51f7e89d8fc46eee5207f1b3e064090";

export default node;
