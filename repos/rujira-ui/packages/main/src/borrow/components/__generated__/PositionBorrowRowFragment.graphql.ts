/**
 * @generated SignedSource<<4c468655b19a43da35db82837ec85de2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PositionBorrowRowFragment$data = {
  readonly account: {
    readonly address: string;
    readonly label: string;
  };
  readonly collateralLiquidationValueUsd: bigint;
  readonly collateralValueUsd: bigint;
  readonly collaterals: ReadonlyArray<{
    readonly collateral: {
      readonly __typename: "Balance";
      readonly amount: bigint;
      readonly asset: {
        readonly asset: string;
        readonly metadata: {
          readonly symbol: string;
        };
      };
    } | {
      // This will never be '%other', but we need some
      // value in case none of the concrete values match.
      readonly __typename: "%other";
    };
    readonly valueAdjusted: bigint;
    readonly valueFull: bigint;
  }>;
  readonly debtLiquidationValueUsd: bigint;
  readonly debtValueUsd: bigint;
  readonly debts: ReadonlyArray<{
    readonly debt: {
      readonly borrower: {
        readonly asset: {
          readonly metadata: {
            readonly symbol: string;
          };
        };
        readonly vault: {
          readonly status: {
            readonly debtRate: bigint;
          };
        };
      };
      readonly current: bigint;
    };
    readonly value: bigint;
  }>;
  readonly ltv: bigint;
  readonly " $fragmentSpreads": FragmentRefs<"PositionBorrowFragment">;
  readonly " $fragmentType": "PositionBorrowRowFragment";
};
export type PositionBorrowRowFragment$key = {
  readonly " $data"?: PositionBorrowRowFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"PositionBorrowRowFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
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
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PositionBorrowRowFragment",
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
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "label",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "GhostCreditCollateral",
      "kind": "LinkedField",
      "name": "collaterals",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": null,
          "kind": "LinkedField",
          "name": "collateral",
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
                  "concreteType": "Asset",
                  "kind": "LinkedField",
                  "name": "asset",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "asset",
                      "storageKey": null
                    },
                    (v0/*: any*/)
                  ],
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "amount",
                  "storageKey": null
                }
              ],
              "type": "Balance",
              "abstractKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "valueFull",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "valueAdjusted",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "GhostCreditDebt",
      "kind": "LinkedField",
      "name": "debts",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "value",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "GhostVaultDelegate",
          "kind": "LinkedField",
          "name": "debt",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "current",
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
                          "kind": "ScalarField",
                          "name": "debtRate",
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
                  "concreteType": "Asset",
                  "kind": "LinkedField",
                  "name": "asset",
                  "plural": false,
                  "selections": [
                    (v0/*: any*/)
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
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "ltv",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "collateralValueUsd",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "debtValueUsd",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "collateralLiquidationValueUsd",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "debtLiquidationValueUsd",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "PositionBorrowFragment"
    }
  ],
  "type": "GhostCreditAccount",
  "abstractKey": null
};
})();

(node as any).hash = "f39f64c6ec8953ee4b8b39a9cee155d9";

export default node;
