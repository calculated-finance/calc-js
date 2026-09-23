/**
 * @generated SignedSource<<5f265a1773918726eeec57902b820ab5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RangeInputsFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"RangeDepositFragment">;
  readonly " $fragmentType": "RangeInputsFragment";
};
export type RangeInputsFragment$key = {
  readonly " $data"?: RangeInputsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"RangeInputsFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "RangeInputsFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "RangeDepositFragment"
    }
  ],
  "type": "FinPair",
  "abstractKey": null
};

(node as any).hash = "e58fcab2b7803ce58416bb9edead1796";

export default node;
