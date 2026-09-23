/**
 * @generated SignedSource<<6ab2ab36c906831a3c81c28b212a47c0>>
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
export type RecurringSubmitFragment$data = {
  readonly address: string;
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
      readonly secured: {
        readonly asset: string;
        readonly chain: Chain;
        readonly metadata: {
          readonly decimals: number;
          readonly symbol: string;
        };
        readonly type: AssetType;
        readonly variants: {
          readonly native: {
            readonly denom: string;
          } | null | undefined;
        };
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
      readonly secured: {
        readonly asset: string;
        readonly chain: Chain;
        readonly metadata: {
          readonly decimals: number;
          readonly symbol: string;
        };
        readonly type: AssetType;
        readonly variants: {
          readonly native: {
            readonly denom: string;
          } | null | undefined;
        };
      } | null | undefined;
    };
  };
  readonly book: {
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
    readonly center: bigint | null | undefined;
  };
  readonly feeTaker: bigint;
  readonly tick: bigint;
  readonly " $fragmentType": "RecurringSubmitFragment";
};
export type RecurringSubmitFragment$key = {
  readonly " $data"?: RecurringSubmitFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"RecurringSubmitFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "asset",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "symbol",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "decimals",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v5 = {
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
},
v6 = [
  (v0/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "Metadata",
    "kind": "LinkedField",
    "name": "metadata",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "storageKey": null
  },
  (v3/*: any*/),
  (v4/*: any*/),
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
      (v5/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "Asset",
        "kind": "LinkedField",
        "name": "secured",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Metadata",
            "kind": "LinkedField",
            "name": "metadata",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v1/*: any*/)
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
              (v5/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
],
v7 = [
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
    "name": "price",
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
  "name": "RecurringSubmitFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "address",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "tick",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Asset",
      "kind": "LinkedField",
      "name": "assetBase",
      "plural": false,
      "selections": (v6/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Asset",
      "kind": "LinkedField",
      "name": "assetQuote",
      "plural": false,
      "selections": (v6/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "FinBook",
      "kind": "LinkedField",
      "name": "book",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "FinBookEntry",
          "kind": "LinkedField",
          "name": "bids",
          "plural": true,
          "selections": (v7/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "center",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "FinBookEntry",
          "kind": "LinkedField",
          "name": "asks",
          "plural": true,
          "selections": (v7/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "feeTaker",
      "storageKey": null
    }
  ],
  "type": "FinPair",
  "abstractKey": null
};
})();

(node as any).hash = "bf5bf4af34c0dc01e7520e7e9e0f00e7";

export default node;
