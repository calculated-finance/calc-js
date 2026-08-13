/**
 * @generated SignedSource<<586a1ffff4874818a0fd85e3abd2c4a1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OrderBookAccountFragment$data = {
  readonly fin: {
    readonly orders: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly pair: {
            readonly address: string;
          };
          readonly rate: bigint;
          readonly remaining: bigint;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "OrderBookAccountFragment";
};
export type OrderBookAccountFragment$key = {
  readonly " $data"?: OrderBookAccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrderBookAccountFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrderBookAccountFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "FinAccount",
      "kind": "LinkedField",
      "name": "fin",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": [
            {
              "kind": "Literal",
              "name": "first",
              "value": 100
            }
          ],
          "concreteType": "FinOrderConnection",
          "kind": "LinkedField",
          "name": "orders",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "FinOrderEdge",
              "kind": "LinkedField",
              "name": "edges",
              "plural": true,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "FinOrder",
                  "kind": "LinkedField",
                  "name": "node",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "FinPair",
                      "kind": "LinkedField",
                      "name": "pair",
                      "plural": false,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "address",
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
                      "name": "remaining",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": "orders(first:100)"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "18b91f315924dd21796e6ed3518c11e8";

export default node;
