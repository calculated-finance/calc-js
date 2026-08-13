/**
 * @generated SignedSource<<8f6d71ec84a902d457fbaeca7051a114>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PositionSwapBookFragment$data = {
  readonly asks: ReadonlyArray<{
    readonly price: bigint;
    readonly total: bigint;
    readonly value: bigint;
  }>;
  readonly bids: ReadonlyArray<{
    readonly price: bigint;
    readonly total: bigint;
    readonly value: bigint;
  }>;
  readonly id: string;
  readonly pair: {
    readonly assetBase: {
      readonly asset: string;
    };
    readonly assetQuote: {
      readonly asset: string;
    };
  };
  readonly " $fragmentType": "PositionSwapBookFragment";
};
export type PositionSwapBookFragment$key = {
  readonly " $data"?: PositionSwapBookFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"PositionSwapBookFragment">;
};

const node: ReaderFragment = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "asset",
    "storageKey": null
  }
],
v1 = [
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
    "name": "total",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "value",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PositionSwapBookFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "FinPair",
      "kind": "LinkedField",
      "name": "pair",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Asset",
          "kind": "LinkedField",
          "name": "assetBase",
          "plural": false,
          "selections": (v0/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "Asset",
          "kind": "LinkedField",
          "name": "assetQuote",
          "plural": false,
          "selections": (v0/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "FinBookEntry",
      "kind": "LinkedField",
      "name": "bids",
      "plural": true,
      "selections": (v1/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "FinBookEntry",
      "kind": "LinkedField",
      "name": "asks",
      "plural": true,
      "selections": (v1/*: any*/),
      "storageKey": null
    }
  ],
  "type": "FinBook",
  "abstractKey": null
};
})();

(node as any).hash = "4dc32ad4856dcd5d5013225a7df91cc9";

export default node;
