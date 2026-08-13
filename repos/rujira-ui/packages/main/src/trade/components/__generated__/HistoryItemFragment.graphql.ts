/**
 * @generated SignedSource<<2aa0c9540e3c0364d3c73254cfca537a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type HistoryItemFragment$data = {
  readonly baseAmount: bigint;
  readonly price: bigint;
  readonly protocol: string;
  readonly quoteAmount: bigint;
  readonly timestamp: any;
  readonly type: string;
  readonly " $fragmentType": "HistoryItemFragment";
};
export type HistoryItemFragment$key = {
  readonly " $data"?: HistoryItemFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"HistoryItemFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "HistoryItemFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "type",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "quoteAmount",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "baseAmount",
      "storageKey": null
    },
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
      "name": "protocol",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "timestamp",
      "storageKey": null
    }
  ],
  "type": "FinTrade",
  "abstractKey": null
};

(node as any).hash = "276fd8e82b8b758af106e923cd90e3f7";

export default node;
