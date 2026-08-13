/**
 * @generated SignedSource<<2dbded018d6cd5f2c0f0afe2337b8522>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type GhostVaultBalanceFragment$data = {
  readonly account: string;
  readonly id: string;
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
        readonly symbol: string;
      };
      readonly price: {
        readonly current: bigint | null | undefined;
      } | null | undefined;
    };
  };
  readonly valueUsd: bigint;
  readonly " $fragmentSpreads": FragmentRefs<"GhostVaultBalanceWithdrawFragment">;
  readonly " $fragmentType": "GhostVaultBalanceFragment";
};
export type GhostVaultBalanceFragment$key = {
  readonly " $data"?: GhostVaultBalanceFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"GhostVaultBalanceFragment">;
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
  "name": "GhostVaultBalanceFragment",
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
      "name": "account",
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
};
})();

(node as any).hash = "ff71b9e985de0df71d1898edfa980613";

export default node;
