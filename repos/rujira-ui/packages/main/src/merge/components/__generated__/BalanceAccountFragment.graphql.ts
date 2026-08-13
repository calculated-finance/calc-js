/**
 * @generated SignedSource<<7e30b019262651ea8c5c1de3dea4f007>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type BalanceAccountFragment$data = {
  readonly id: string;
  readonly pool: {
    readonly address: string;
    readonly mergeAsset: {
      readonly metadata: {
        readonly symbol: string;
      };
    };
    readonly status: {
      readonly shareValue: bigint;
      readonly shareValueChange: bigint;
    } | null | undefined;
  };
  readonly shares: bigint;
  readonly size: {
    readonly amount: bigint;
  };
  readonly " $fragmentType": "BalanceAccountFragment";
};
export type BalanceAccountFragment$key = {
  readonly " $data"?: BalanceAccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"BalanceAccountFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "BalanceAccountFragment",
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
      "concreteType": "MergePool",
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
          "name": "mergeAsset",
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
              "name": "shareValue",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "shareValueChange",
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
      "name": "shares",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Balance",
      "kind": "LinkedField",
      "name": "size",
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
  "type": "MergeAccount",
  "abstractKey": null
};

(node as any).hash = "e1449b51556b197fee0e34a1c8805b54";

export default node;
