/**
 * @generated SignedSource<<d5f2a9d29a6b58c4eb6d216e6a719dea>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type BowPoolXykSummaryFragment$data = {
  readonly address: string;
  readonly quotes: {
    readonly pair: {
      readonly address: string;
      readonly assetBase: {
        readonly metadata: {
          readonly symbol: string;
        };
      };
      readonly assetQuote: {
        readonly metadata: {
          readonly symbol: string;
        };
      };
    };
  } | null | undefined;
  readonly " $fragmentType": "BowPoolXykSummaryFragment";
};
export type BowPoolXykSummaryFragment$key = {
  readonly " $data"?: BowPoolXykSummaryFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"BowPoolXykSummaryFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "address",
  "storageKey": null
},
v1 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Metadata",
    "kind": "LinkedField",
    "name": "metadata",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "symbol",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "BowPoolXykSummaryFragment",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "FinBook",
      "kind": "LinkedField",
      "name": "quotes",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "FinPair",
          "kind": "LinkedField",
          "name": "pair",
          "plural": false,
          "selections": [
            (v0/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "Asset",
              "kind": "LinkedField",
              "name": "assetBase",
              "plural": false,
              "selections": (v1/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "Asset",
              "kind": "LinkedField",
              "name": "assetQuote",
              "plural": false,
              "selections": (v1/*: any*/),
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "BowPoolXyk",
  "abstractKey": null
};
})();

(node as any).hash = "6b4cbbd93760357746abaa54c9dc6c47";

export default node;
