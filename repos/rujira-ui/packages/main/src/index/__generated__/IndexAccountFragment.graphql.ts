/**
 * @generated SignedSource<<d2e9449e5ac43b0bb733ad932efed1c7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type IndexAccountFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"ActionsAccountFragment" | "IndexBalancesFragment" | "ShareCardBadgeAccountFragment">;
  readonly " $fragmentType": "IndexAccountFragment";
};
export type IndexAccountFragment$key = {
  readonly " $data"?: IndexAccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"IndexAccountFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "IndexAccountFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ActionsAccountFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "IndexBalancesFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ShareCardBadgeAccountFragment"
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "f9749d569c98e1f62dafd18981ac4539";

export default node;
