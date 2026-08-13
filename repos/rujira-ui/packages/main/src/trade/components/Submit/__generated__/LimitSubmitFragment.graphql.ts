/**
 * @generated SignedSource<<7731797d28e65a15bc1e165e6a50c0d4>>
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
export type LimitSubmitFragment$data = {
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
  };
  readonly book: {
    readonly asks: ReadonlyArray<{
      readonly price: bigint;
    }>;
    readonly bids: ReadonlyArray<{
      readonly price: bigint;
    }>;
    readonly center: bigint | null | undefined;
  };
  readonly feeMaker: bigint;
  readonly feeTaker: bigint;
  readonly oracleBase: {
    readonly id: string;
    readonly price: bigint;
  } | null | undefined;
  readonly oracleQuote: {
    readonly id: string;
    readonly price: bigint;
  } | null | undefined;
  readonly tick: bigint;
  readonly " $fragmentType": "LimitSubmitFragment";
};
export type LimitSubmitFragment$key = {
  readonly " $data"?: LimitSubmitFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"LimitSubmitFragment">;
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
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "price",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "id",
    "storageKey": null
  },
  (v1/*: any*/)
],
v3 = [
  (v1/*: any*/)
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "LimitSubmitFragment",
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
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ThorchainOracle",
      "kind": "LinkedField",
      "name": "oracleBase",
      "plural": false,
      "selections": (v2/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ThorchainOracle",
      "kind": "LinkedField",
      "name": "oracleQuote",
      "plural": false,
      "selections": (v2/*: any*/),
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
          "selections": (v3/*: any*/),
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
          "selections": (v3/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "feeMaker",
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

(node as any).hash = "ca3bb51884f1df43765d0abbba074edb";

export default node;
