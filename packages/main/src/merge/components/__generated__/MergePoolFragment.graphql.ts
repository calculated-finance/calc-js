/**
 * @generated SignedSource<<09f8fd3972175a2e41358c1ecadf9924>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type AprStatus = "AVAILABLE" | "NOT_APPLICABLE" | "SOON" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type MergePoolFragment$data = {
  readonly address: string;
  readonly currentRate: bigint;
  readonly id: string;
  readonly mergeAsset: {
    readonly asset: string;
    readonly metadata: {
      readonly decimals: number;
      readonly symbol: string;
    };
  };
  readonly mergeSupply: bigint;
  readonly rujiAllocation: bigint;
  readonly startRate: bigint;
  readonly status: {
    readonly apr: {
      readonly status: AprStatus;
      readonly value: bigint | null | undefined;
    };
    readonly merged: bigint;
  } | null | undefined;
  readonly " $fragmentType": "MergePoolFragment";
};
export type MergePoolFragment$key = {
  readonly " $data"?: MergePoolFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"MergePoolFragment">;
};

import MergePoolRefetchQuery_graphql from './MergePoolRefetchQuery.graphql';

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "refetch": {
      "connection": null,
      "fragmentPathInResult": [
        "node"
      ],
      "operation": MergePoolRefetchQuery_graphql,
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "MergePoolFragment",
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
      "name": "address",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "currentRate",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Asset",
      "kind": "LinkedField",
      "name": "mergeAsset",
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
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "mergeSupply",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "rujiAllocation",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "startRate",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "MergeStatus",
      "kind": "LinkedField",
      "name": "status",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "merged",
          "storageKey": null
        },
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
  "type": "MergePool",
  "abstractKey": null
};

(node as any).hash = "6a6feca2dcfdfc820f1ec0f929731466";

export default node;
