/**
 * @generated SignedSource<<87014c0da1561083905a35c807deb1e6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RangeManageFragment$data = {
  readonly id: string;
  readonly " $fragmentSpreads": FragmentRefs<"TradeSubscriptionsFinRangeFragment">;
  readonly " $fragmentType": "RangeManageFragment";
};
export type RangeManageFragment$key = {
  readonly " $data"?: RangeManageFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"RangeManageFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "RangeManageFragment",
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
      "name": "TradeSubscriptionsFinRangeFragment"
    }
  ],
  "type": "FinRange",
  "abstractKey": null
};

(node as any).hash = "68fce3d76b2324ee1b7f14308f34ecea";

export default node;
