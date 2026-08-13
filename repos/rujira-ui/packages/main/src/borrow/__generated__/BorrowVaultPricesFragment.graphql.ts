/**
 * @generated SignedSource<<5446ec3d4acc741a49eca74ac7968d83>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type BorrowVaultPricesFragment$data = {
  readonly vaults: ReadonlyArray<{
    readonly borrower: {
      readonly asset: {
        readonly metadata: {
          readonly symbol: string;
        };
      };
      readonly vault: {
        readonly status: {
          readonly debtPool: {
            readonly size: bigint;
          };
        };
      };
    };
    readonly price: {
      readonly current: bigint;
    } | null | undefined;
  }>;
  readonly " $fragmentType": "BorrowVaultPricesFragment";
};
export type BorrowVaultPricesFragment$key = {
  readonly " $data"?: BorrowVaultPricesFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"BorrowVaultPricesFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "BorrowVaultPricesFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "GhostCreditVault",
      "kind": "LinkedField",
      "name": "vaults",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "ThorchainOraclePrice",
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
        },
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
                      "concreteType": "GhostVaultPool",
                      "kind": "LinkedField",
                      "name": "debtPool",
                      "plural": false,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "size",
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
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "GhostCredit",
  "abstractKey": null
};

(node as any).hash = "792fd81bc6aa782f3db5815ce311b4df";

export default node;
