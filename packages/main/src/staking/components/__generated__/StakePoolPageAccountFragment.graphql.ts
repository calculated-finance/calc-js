/**
 * @generated SignedSource<<f0ea49e3d2024ec4130b3f0fc51f3e1f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type StakePoolPageAccountFragment$data = {
  readonly stakingV2: ReadonlyArray<{
    readonly pool: {
      readonly id: string;
    };
    readonly " $fragmentSpreads": FragmentRefs<"StakePoolBalanceFragment">;
  }>;
  readonly " $fragmentType": "StakePoolPageAccountFragment";
};
export type StakePoolPageAccountFragment$key = {
  readonly " $data"?: StakePoolPageAccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"StakePoolPageAccountFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "StakePoolPageAccountFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "StakingAccount",
      "kind": "LinkedField",
      "name": "stakingV2",
      "plural": true,
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
              "name": "id",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "StakePoolBalanceFragment"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "eb4a8e57dc84486043f64fb672a82ffe";

export default node;
