/**
 * @generated SignedSource<<0602b56926e168a1b3961971c7862968>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type AprStatus = "AVAILABLE" | "NOT_APPLICABLE" | "SOON" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type MergingFragment$data = {
  readonly merge: {
    readonly accounts: ReadonlyArray<{
      readonly merged: {
        readonly amount: bigint;
        readonly asset: {
          readonly asset: string;
          readonly metadata: {
            readonly decimals: number;
            readonly symbol: string;
          };
        };
      };
      readonly pool: {
        readonly status: {
          readonly apr: {
            readonly status: AprStatus;
            readonly value: bigint | null | undefined;
          };
        } | null | undefined;
      };
      readonly rate: bigint;
      readonly shares: bigint;
      readonly size: {
        readonly amount: bigint;
        readonly asset: {
          readonly asset: string;
          readonly metadata: {
            readonly decimals: number;
          };
          readonly price: {
            readonly current: bigint | null | undefined;
          } | null | undefined;
        };
      };
      readonly valueUsd: bigint;
    }> | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "MergingFragment";
};
export type MergingFragment$key = {
  readonly " $data"?: MergingFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"MergingFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "amount",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "asset",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "decimals",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MergingFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "MergeStats",
      "kind": "LinkedField",
      "name": "merge",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "MergeAccount",
          "kind": "LinkedField",
          "name": "accounts",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Balance",
              "kind": "LinkedField",
              "name": "merged",
              "plural": false,
              "selections": [
                (v0/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Asset",
                  "kind": "LinkedField",
                  "name": "asset",
                  "plural": false,
                  "selections": [
                    (v1/*: any*/),
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
                        (v2/*: any*/)
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
              "name": "rate",
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
                (v0/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Asset",
                  "kind": "LinkedField",
                  "name": "asset",
                  "plural": false,
                  "selections": [
                    (v1/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "Metadata",
                      "kind": "LinkedField",
                      "name": "metadata",
                      "plural": false,
                      "selections": [
                        (v2/*: any*/)
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
                          "name": "current",
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
                  "concreteType": "MergeStatus",
                  "kind": "LinkedField",
                  "name": "status",
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
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};
})();

(node as any).hash = "999227dc3fb5f8bb3e2a1b0984732bcd";

export default node;
