/**
 * @generated SignedSource<<69da67a435fa75b1539593989df89c2b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DebtsAccountFragment$data = {
  readonly strategies: ReadonlyArray<{
    readonly id?: string;
    readonly receiptValue?: {
      readonly amount: bigint;
      readonly asset: {
        readonly metadata: {
          readonly decimals: number;
          readonly symbol: string;
        };
        readonly price: {
          readonly current: bigint | null | undefined;
        } | null | undefined;
      };
    };
    readonly valueUsd?: bigint;
    readonly vault?: {
      readonly address: string;
    };
    readonly " $fragmentSpreads": FragmentRefs<"GhostVaultBalanceWithdrawFragment">;
  }>;
  readonly " $fragmentType": "DebtsAccountFragment";
};
export type DebtsAccountFragment$key = {
  readonly " $data"?: DebtsAccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"DebtsAccountFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DebtsAccountFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "strategies",
      "plural": true,
      "selections": [
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
              "concreteType": "GhostVault",
              "kind": "LinkedField",
              "name": "vault",
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
              "alias": "receiptValue",
              "args": null,
              "concreteType": "Balance",
              "kind": "LinkedField",
              "name": "value",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "amount",
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
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "Metadata",
                      "kind": "LinkedField",
                      "name": "metadata",
                      "plural": false,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "symbol",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "decimals",
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    },
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
                          "name": "current",
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
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "valueUsd",
              "storageKey": null
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "GhostVaultBalanceWithdrawFragment"
            }
          ],
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

(node as any).hash = "1b8672ac6e343fac5eb46dd2e0ae635f";

export default node;
