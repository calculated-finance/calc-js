/**
 * @generated SignedSource<<516abfdc7bbd861587b244ef637460ec>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type BalanceFragment$data = {
  readonly merge: {
    readonly accounts: ReadonlyArray<{
      readonly pool: {
        readonly address: string;
      };
      readonly " $fragmentSpreads": FragmentRefs<"BalanceAccountFragment">;
    }> | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "BalanceFragment";
};
export type BalanceFragment$key = {
  readonly " $data"?: BalanceFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"BalanceFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "BalanceFragment",
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
                }
              ],
              "storageKey": null
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "BalanceAccountFragment"
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

(node as any).hash = "56c6fe5faa8ec0b17a49487dd2840eef";

export default node;
