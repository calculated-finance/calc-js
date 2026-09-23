/**
 * @generated SignedSource<<ba620b6cac823d9c6177f91475e449f0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type HistoryFragment$data = {
  readonly cursor: string | null | undefined;
  readonly node: {
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"HistoryItemFragment">;
  } | null | undefined;
  readonly " $fragmentType": "HistoryFragment";
};
export type HistoryFragment$key = {
  readonly " $data"?: HistoryFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"HistoryFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "HistoryFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "cursor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "FinTrade",
      "kind": "LinkedField",
      "name": "node",
      "plural": false,
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
          "name": "HistoryItemFragment"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "FinTradeEdge",
  "abstractKey": null
};

(node as any).hash = "a1d2a8a2c99cfad70a8595ba32589b7b";

export default node;
