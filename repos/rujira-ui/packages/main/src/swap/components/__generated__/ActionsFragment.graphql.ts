/**
 * @generated SignedSource<<c8061d767b1a9370077143c39e938f28>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ActionsFragment$data = {
  readonly fees: {
    readonly totalBps: number;
  };
  readonly inboundAddress: string;
  readonly memo: string;
  readonly streamingSwapBlocks: number;
  readonly streamingSwapSeconds: number;
  readonly totalSwapSeconds: number;
  readonly " $fragmentType": "ActionsFragment";
};
export type ActionsFragment$key = {
  readonly " $data"?: ActionsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ActionsFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ActionsFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "ThorchainQuoteFees",
      "kind": "LinkedField",
      "name": "fees",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "totalBps",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "streamingSwapBlocks",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "streamingSwapSeconds",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "totalSwapSeconds",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "inboundAddress",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "memo",
      "storageKey": null
    }
  ],
  "type": "ThorchainQuote",
  "abstractKey": null
};

(node as any).hash = "5da8039bfbcac10287b6586789f7454b";

export default node;
