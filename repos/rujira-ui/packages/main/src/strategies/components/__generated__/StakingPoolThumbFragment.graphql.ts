/**
 * @generated SignedSource<<57ab47cb84bbe8ed99f729595ab5cf71>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type StakingPoolThumbFragment$data = {
  readonly id: string;
  readonly pool: {
    readonly bondAsset: {
      readonly metadata: {
        readonly symbol: string;
      };
    };
  };
  readonly valueUsd: bigint;
  readonly " $fragmentType": "StakingPoolThumbFragment";
};
export type StakingPoolThumbFragment$key = {
  readonly " $data"?: StakingPoolThumbFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"StakingPoolThumbFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "StakingPoolThumbFragment",
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
      "concreteType": "StakingPool",
      "kind": "LinkedField",
      "name": "pool",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Asset",
          "kind": "LinkedField",
          "name": "bondAsset",
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
      "kind": "ScalarField",
      "name": "valueUsd",
      "storageKey": null
    }
  ],
  "type": "StakingAccount",
  "abstractKey": null
};

(node as any).hash = "589e685740a6ecba51223a619f5216d8";

export default node;
