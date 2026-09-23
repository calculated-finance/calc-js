/**
 * @generated SignedSource<<e6c3dbb8376106aeb0e1471fc90be2df>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type AssetType = "LAYER_1" | "NATIVE" | "SECURED" | "SYNTH" | "%future added value";
export type Chain = "AVAX" | "BASE" | "BCH" | "BSC" | "BTC" | "DOGE" | "ETH" | "GAIA" | "KUJI" | "LTC" | "NOBLE" | "OSMO" | "SOL" | "TERRA" | "TERRA2" | "THOR" | "TON" | "TRON" | "TRON" | "XRP" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type PositionPositionFragment$data = {
  readonly collateralLiquidationValueUsd: bigint;
  readonly collateralValueUsd: bigint;
  readonly collaterals: ReadonlyArray<{
    readonly collateral: {
      readonly __typename: "Balance";
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
  readonly " $fragmentType": "PositionPositionFragment";
};
export type PositionPositionFragment$key = {
  readonly " $data"?: PositionPositionFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"PositionPositionFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
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
      "name": "chain",
      "storageKey": null
    },
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
      "concreteType": "AssetVariants",
      "kind": "LinkedField",
      "name": "variants",
      "plural": false,
      "selections": [
        {
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
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PositionPositionFragment",
  "selections": [
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
                (v0/*: any*/),
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
                (v0/*: any*/)
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
    }
  ],
  "type": "GhostCreditAccount",
  "abstractKey": null
};
})();

(node as any).hash = "b020e81a3e92954397d652ef6c35c3cb";

export default node;
