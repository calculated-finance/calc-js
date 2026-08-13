/**
 * @generated SignedSource<<12fbfd6919a3725aa7a21f5f9996f938>>
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
export type CreditAccountsRowFragment$data = {
  readonly collaterals: ReadonlyArray<{
    readonly collateral: {
      readonly __typename: "Balance";
      readonly amount: bigint;
      readonly asset: {
        readonly asset: string;
        readonly chain: Chain;
        readonly metadata: {
          readonly symbol: string;
        };
        readonly type: AssetType;
      };
    } | {
      // This will never be '%other', but we need some
      // value in case none of the concrete values match.
      readonly __typename: "%other";
    };
    readonly valueAdjusted: bigint;
    readonly valueFull: bigint;
  }>;
  readonly debts: ReadonlyArray<{
    readonly debt: {
      readonly borrower: {
        readonly asset: {
          readonly chain: Chain;
          readonly metadata: {
            readonly symbol: string;
          };
          readonly type: AssetType;
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
  readonly valueUsd: bigint;
  readonly " $fragmentType": "CreditAccountsRowFragment";
};
export type CreditAccountsRowFragment$key = {
  readonly " $data"?: CreditAccountsRowFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"CreditAccountsRowFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v2 = {
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
  "name": "CreditAccountsRowFragment",
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
                    (v0/*: any*/),
                    (v1/*: any*/),
                    (v2/*: any*/)
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
                    (v0/*: any*/),
                    (v1/*: any*/),
                    (v2/*: any*/)
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
      "name": "valueUsd",
      "storageKey": null
    }
  ],
  "type": "GhostCreditAccount",
  "abstractKey": null
};
})();

(node as any).hash = "20fe672b7bfc17fc5da93a3d80b98afd";

export default node;
