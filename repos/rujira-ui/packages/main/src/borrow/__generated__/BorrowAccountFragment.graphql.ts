/**
 * @generated SignedSource<<d5922c7e1b965b410012f7fc6e20237f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type BorrowAccountFragment$data = {
  readonly credit: {
    readonly accountsV2: {
      readonly __id: string;
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly account: {
            readonly address: string;
          };
          readonly ltv: bigint;
          readonly " $fragmentSpreads": FragmentRefs<"PositionBorrowRowFragment">;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    };
    readonly next: {
      readonly " $fragmentSpreads": FragmentRefs<"BorrowNextFragment">;
    } | null | undefined;
  };
  readonly " $fragmentType": "BorrowAccountFragment";
};
export type BorrowAccountFragment$key = {
  readonly " $data"?: BorrowAccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"BorrowAccountFragment">;
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
          "credit",
          "accountsV2"
        ]
      }
    ]
  },
  "name": "BorrowAccountFragment",
  "selections": [
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
              "args": null,
              "kind": "FragmentSpread",
              "name": "BorrowNextFragment"
            }
          ],
          "storageKey": null
        },
        {
          "alias": "accountsV2",
          "args": null,
          "concreteType": "GhostCreditAccountConnection",
          "kind": "LinkedField",
          "name": "__Borrow_accountsV2_connection",
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
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "RujiraAccount",
                      "kind": "LinkedField",
                      "name": "account",
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
                      "name": "ltv",
                      "storageKey": null
                    },
                    {
                      "args": null,
                      "kind": "FragmentSpread",
                      "name": "PositionBorrowRowFragment"
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
            },
            {
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

(node as any).hash = "79511ba8c1c1fc5a3fed46120c9ea0d4";

export default node;
