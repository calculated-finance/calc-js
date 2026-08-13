/**
 * @generated SignedSource<<fccb07f5796f432553de370f78e48b1b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PartialWithdrawFragment$data = {
  readonly allocations: ReadonlyArray<{
    readonly asset: {
      readonly metadata: {
        readonly decimals: number;
        readonly symbol: string;
      };
    };
    readonly targetWeight: bigint;
  }>;
  readonly " $fragmentType": "PartialWithdrawFragment";
};
export type PartialWithdrawFragment$key = {
  readonly " $data"?: PartialWithdrawFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"PartialWithdrawFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PartialWithdrawFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "IndexAllocation",
      "kind": "LinkedField",
      "name": "allocations",
      "plural": true,
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
          "name": "targetWeight",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "IndexStatus",
  "abstractKey": null
};

(node as any).hash = "08d82d18c72838ab57826e601ea9cfb5";

export default node;
