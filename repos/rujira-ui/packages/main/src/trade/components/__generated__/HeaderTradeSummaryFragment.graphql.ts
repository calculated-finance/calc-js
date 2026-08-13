/**
 * @generated SignedSource<<a8fc7ba9c34ec860c62cfa7b6354a009>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type HeaderTradeSummaryFragment$data = {
  readonly change: bigint;
  readonly high: bigint;
  readonly last: bigint;
  readonly lastUsd: bigint;
  readonly low: bigint;
  readonly volumeUsd: bigint;
  readonly " $fragmentType": "HeaderTradeSummaryFragment";
};
export type HeaderTradeSummaryFragment$key = {
  readonly " $data"?: HeaderTradeSummaryFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"HeaderTradeSummaryFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "HeaderTradeSummaryFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "last",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "lastUsd",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "high",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "low",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "change",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "volumeUsd",
      "storageKey": null
    }
  ],
  "type": "FinSummary",
  "abstractKey": null
};

(node as any).hash = "fa0dd27c9a828f5013c370db620db3e4";

export default node;
