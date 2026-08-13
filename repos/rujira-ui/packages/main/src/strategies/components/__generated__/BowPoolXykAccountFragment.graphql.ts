/**
 * @generated SignedSource<<95fb98d42335c570e58180173a945d4f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type BowPoolXykAccountFragment$data = {
  readonly address: string;
  readonly bow: ReadonlyArray<{
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"BowPoolXykBalanceFragment">;
  }>;
  readonly " $fragmentType": "BowPoolXykAccountFragment";
};
export type BowPoolXykAccountFragment$key = {
  readonly " $data"?: BowPoolXykAccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"BowPoolXykAccountFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "BowPoolXykAccountFragment",
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
      "concreteType": "BowAccount",
      "kind": "LinkedField",
      "name": "bow",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "id",
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "BowPoolXykBalanceFragment"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "7c8dbb826229f6e74ca1b5a35080ad5d";

export default node;
