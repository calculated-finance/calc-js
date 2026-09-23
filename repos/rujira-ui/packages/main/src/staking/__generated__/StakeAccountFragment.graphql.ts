/**
 * @generated SignedSource<<d9115bd4814cf6bfa4bab46e0359eceb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type StakeAccountFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"StakePoolPageAccountFragment">;
  readonly " $fragmentType": "StakeAccountFragment";
};
export type StakeAccountFragment$key = {
  readonly " $data"?: StakeAccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"StakeAccountFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "StakeAccountFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "StakePoolPageAccountFragment"
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "952927d62c0788ba920d0b300973fb03";

export default node;
