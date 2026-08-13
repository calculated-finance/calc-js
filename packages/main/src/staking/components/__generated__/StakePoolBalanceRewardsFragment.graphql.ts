/**
 * @generated SignedSource<<a45f46e267da2c5d20b41f2b2df3d58d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type StakePoolBalanceRewardsFragment$data = {
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
  readonly " $fragmentType": "StakePoolBalanceRewardsFragment";
};
export type StakePoolBalanceRewardsFragment$key = {
  readonly " $data"?: StakePoolBalanceRewardsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"StakePoolBalanceRewardsFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "StakePoolBalanceRewardsFragment",
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

(node as any).hash = "4f1583deead9524a293d8741d193a6c7";

export default node;
