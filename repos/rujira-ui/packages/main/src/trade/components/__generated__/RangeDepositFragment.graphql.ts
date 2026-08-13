/**
 * @generated SignedSource<<923248ebe44f5462e35145ee6ffdf18d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type AssetType = "LAYER_1" | "NATIVE" | "SECURED" | "SYNTH" | "%future added value";
export type Chain = "AVAX" | "BASE" | "BCH" | "BSC" | "BTC" | "DOGE" | "ETH" | "GAIA" | "KUJI" | "LTC" | "NOBLE" | "OSMO" | "SOL" | "TERRA" | "TERRA2" | "THOR" | "TON" | "TRON" | "TRON" | "XRP" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type RangeDepositFragment$data = {
  readonly assetBase: {
    readonly asset: string;
    readonly chain: Chain;
    readonly metadata: {
      readonly decimals: number;
      readonly symbol: string;
    };
    readonly price: {
      readonly current: bigint | null | undefined;
    } | null | undefined;
    readonly type: AssetType;
    readonly variants: {
      readonly native: {
        readonly denom: string;
      } | null | undefined;
    };
  };
  readonly assetQuote: {
    readonly asset: string;
    readonly chain: Chain;
    readonly metadata: {
      readonly decimals: number;
      readonly symbol: string;
    };
    readonly price: {
      readonly current: bigint | null | undefined;
    } | null | undefined;
    readonly type: AssetType;
    readonly variants: {
      readonly native: {
        readonly denom: string;
      } | null | undefined;
    };
  };
  readonly " $fragmentType": "RangeDepositFragment";
};
export type RangeDepositFragment$key = {
  readonly " $data"?: RangeDepositFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"RangeDepositFragment">;
};

const node: ReaderFragment = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "asset",
    "storageKey": null
  },
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
    "name": "chain",
    "storageKey": null
  },
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
        "name": "decimals",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "symbol",
        "storageKey": null
      }
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "Price",
    "kind": "LinkedField",
    "name": "price",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "current",
        "storageKey": null
      }
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "AssetVariants",
    "kind": "LinkedField",
    "name": "variants",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Denom",
        "kind": "LinkedField",
        "name": "native",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "denom",
            "storageKey": null
          }
        ],
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
  "name": "RangeDepositFragment",
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
  "type": "FinPair",
  "abstractKey": null
};
})();

(node as any).hash = "41c95d87251500cccfc9b2b914491bd8";

export default node;
