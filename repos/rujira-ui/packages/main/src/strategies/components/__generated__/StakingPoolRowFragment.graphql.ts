/**
 * @generated SignedSource<<f26636eb70c0f612a12ce8e2fe63d5dd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type AprStatus = "AVAILABLE" | "NOT_APPLICABLE" | "SOON" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type StakingPoolRowFragment$data = {
  readonly bondAsset: {
    readonly metadata: {
      readonly symbol: string;
    };
  };
  readonly id: string;
  readonly stakingStatus: {
    readonly accountBond: bigint;
    readonly liquidBondSize: bigint;
    readonly valueUsd: bigint;
  } | null | undefined;
  readonly stakingSummary: {
    readonly apr: {
      readonly status: AprStatus;
      readonly value: bigint | null | undefined;
    };
  };
  readonly " $fragmentType": "StakingPoolRowFragment";
};
export type StakingPoolRowFragment$key = {
  readonly " $data"?: StakingPoolRowFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"StakingPoolRowFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "StakingPoolRowFragment",
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
    },
    {
      "alias": "stakingStatus",
      "args": null,
      "concreteType": "StakingStatus",
      "kind": "LinkedField",
      "name": "status",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "accountBond",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "liquidBondSize",
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
      "storageKey": null
    },
    {
      "alias": "stakingSummary",
      "args": null,
      "concreteType": "StakingSummary",
      "kind": "LinkedField",
      "name": "summary",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Apr",
          "kind": "LinkedField",
          "name": "apr",
          "plural": false,
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
              "kind": "ScalarField",
              "name": "status",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "StakingPool",
  "abstractKey": null
};

(node as any).hash = "b9e3653a238285e239c25224fb20f09b";

export default node;
