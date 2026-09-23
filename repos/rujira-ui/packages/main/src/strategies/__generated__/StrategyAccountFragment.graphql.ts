/**
 * @generated SignedSource<<e87b940d81432c0dca8e66d7f6d5e949>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type StrategyAccountFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"BowPoolXykAccountFragment" | "ThorchainPoolAccountFragment">;
  readonly " $fragmentType": "StrategyAccountFragment";
};
export type StrategyAccountFragment$key = {
  readonly " $data"?: StrategyAccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"StrategyAccountFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "StrategyAccountFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "BowPoolXykAccountFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ThorchainPoolAccountFragment"
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "6cc581b2b72cc04a70a248262dad48b7";

export default node;
