/**
 * @generated SignedSource<<04b784ad4323038f8393c61ca39c0bb4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type GhostVaultBalanceWithdrawFragment$data = {
  readonly receiptShares: {
    readonly amount: bigint;
    readonly asset: {
      readonly " $fragmentSpreads": FragmentRefs<"msgAssetFragment">;
    };
  };
  readonly receiptValue: {
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
  readonly vault: {
    readonly address: string;
  };
  readonly " $fragmentType": "GhostVaultBalanceWithdrawFragment";
};
export type GhostVaultBalanceWithdrawFragment$key = {
  readonly " $data"?: GhostVaultBalanceWithdrawFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"GhostVaultBalanceWithdrawFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "amount",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "GhostVaultBalanceWithdrawFragment",
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
          "kind": "ScalarField",
          "name": "address",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": "receiptShares",
      "args": null,
      "concreteType": "Balance",
      "kind": "LinkedField",
      "name": "shares",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "Asset",
          "kind": "LinkedField",
          "name": "asset",
          "plural": false,
          "selections": [
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "msgAssetFragment"
            }
          ],
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
        (v0/*: any*/),
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
    }
  ],
  "type": "GhostVaultAccount",
  "abstractKey": null
};
})();

(node as any).hash = "4d1ff0ccdcbaa243543095ac4d22c488";

export default node;
