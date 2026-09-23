/**
 * @generated SignedSource<<53dbe65b2823caf53c9506c71c94c43c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type StakingPoolBalanceRewardsFragment$data = {
  readonly pendingRevenue: {
    readonly amount: bigint;
  };
  readonly pool: {
    readonly address: string;
    readonly revenueAsset: {
      readonly metadata: {
        readonly symbol: string;
      };
    };
  };
  readonly " $fragmentType": "StakingPoolBalanceRewardsFragment";
};
export type StakingPoolBalanceRewardsFragment$key = {
  readonly " $data"?: StakingPoolBalanceRewardsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"StakingPoolBalanceRewardsFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "StakingPoolBalanceRewardsFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "StakingPool",
      "kind": "LinkedField",
      "name": "pool",
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
          "concreteType": "Asset",
          "kind": "LinkedField",
          "name": "revenueAsset",
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
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Balance",
      "kind": "LinkedField",
      "name": "pendingRevenue",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "amount",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "StakingAccount",
  "abstractKey": null
};

(node as any).hash = "3a1d57faee1393502f845303d467d5c7";

export default node;
