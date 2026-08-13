/**
 * @generated SignedSource<<1c2be2493e79be73879cce0e466ce111>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AllocationFragment$data = {
  readonly allocations: ReadonlyArray<{
    readonly asset: {
      readonly asset: string;
      readonly metadata: {
        readonly decimals: number;
        readonly symbol: string;
      };
      readonly price: {
        readonly changeDay: number | null | undefined;
      } | null | undefined;
      readonly variants: {
        readonly native: {
          readonly denom: string;
        } | null | undefined;
      };
    };
    readonly balance: bigint;
    readonly currentWeight: bigint;
    readonly price: bigint;
    readonly targetWeight: bigint;
    readonly value: bigint;
  }>;
  readonly " $fragmentType": "AllocationFragment";
};
export type AllocationFragment$key = {
  readonly " $data"?: AllocationFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"AllocationFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AllocationFragment",
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
                  "name": "decimals",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "symbol",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "AssetVariants",
              "kind": "LinkedField",
              "name": "variants",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Denom",
                  "kind": "LinkedField",
                  "name": "native",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "denom",
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
              "concreteType": "Price",
              "kind": "LinkedField",
              "name": "price",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "changeDay",
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
          "name": "value",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "price",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "targetWeight",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "currentWeight",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "balance",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "IndexStatus",
  "abstractKey": null
};

(node as any).hash = "1b1609f0c156971667959793757cbcb1";

export default node;
