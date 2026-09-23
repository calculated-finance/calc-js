/**
 * @generated SignedSource<<379996ecaac4990f42bbb7d76755a598>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OrderBookEntryFragment$data = {
  readonly price: bigint;
  readonly side: string;
  readonly total: bigint;
  readonly value: bigint;
  readonly virtualTotal: bigint;
  readonly virtualValue: bigint;
  readonly " $fragmentType": "OrderBookEntryFragment";
};
export type OrderBookEntryFragment$key = {
  readonly " $data"?: OrderBookEntryFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrderBookEntryFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrderBookEntryFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "price",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "side",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "total",
      "storageKey": null
    },
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
      "name": "virtualTotal",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "virtualValue",
      "storageKey": null
    }
  ],
  "type": "FinBookEntry",
  "abstractKey": null
};

(node as any).hash = "5766610c43ef8efad225d6eae1bedd2a";

export default node;
