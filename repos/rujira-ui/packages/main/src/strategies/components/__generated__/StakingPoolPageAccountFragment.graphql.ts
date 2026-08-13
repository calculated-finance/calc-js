/**
 * @generated SignedSource<<d077b681cfd5b61983a3e12687d2a46f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type StakingPoolPageAccountFragment$data = {
  readonly strategies: ReadonlyArray<{
    readonly pool?: {
      readonly id: string;
    };
    readonly " $fragmentSpreads": FragmentRefs<"StakingPoolBalanceFragment">;
  }>;
  readonly " $fragmentType": "StakingPoolPageAccountFragment";
};
export type StakingPoolPageAccountFragment$key = {
  readonly " $data"?: StakingPoolPageAccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"StakingPoolPageAccountFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "StakingPoolPageAccountFragment",
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
              "name": "StakingPoolBalanceFragment"
            }
          ],
          "type": "StakingAccount",
          "abstractKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "65b48d6ca2f8e494da0d3d411ede6868";

export default node;
