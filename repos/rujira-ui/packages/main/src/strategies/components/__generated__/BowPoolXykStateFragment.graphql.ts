/**
 * @generated SignedSource<<a856976eb2d10b45fbc5145a1ac415c2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type Chain = "AVAX" | "BASE" | "BCH" | "BSC" | "BTC" | "DOGE" | "ETH" | "GAIA" | "KUJI" | "LTC" | "NOBLE" | "OSMO" | "SOL" | "TERRA" | "TERRA2" | "THOR" | "TON" | "TRON" | "TRON" | "XRP" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type BowPoolXykStateFragment$data = {
  readonly config: {
    readonly x: {
      readonly chain: Chain;
      readonly metadata: {
        readonly symbol: string;
      };
    };
    readonly y: {
      readonly chain: Chain;
      readonly metadata: {
        readonly symbol: string;
      };
    };
  };
  readonly quotes: {
    readonly pair: {
      readonly bookV2: {
        readonly " $fragmentSpreads": FragmentRefs<"OrderBookFragment">;
      };
      readonly tick: bigint;
    };
  } | null | undefined;
  readonly summary: {
    readonly depthAsk: bigint;
    readonly depthBid: bigint;
    readonly spread: bigint;
    readonly utilization: bigint;
    readonly volume: bigint;
  } | null | undefined;
  readonly trades: {
    readonly edges: ReadonlyArray<{
      readonly " $fragmentSpreads": FragmentRefs<"HistoryFragment">;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "BowPoolXykStateFragment";
};
export type BowPoolXykStateFragment$key = {
  readonly " $data"?: BowPoolXykStateFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"BowPoolXykStateFragment">;
};

const node: ReaderFragment = (function(){
var v0 = [
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
  "name": "BowPoolXykStateFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "BowConfigXyk",
      "kind": "LinkedField",
      "name": "config",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Asset",
          "kind": "LinkedField",
          "name": "x",
          "plural": false,
          "selections": (v0/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "Asset",
          "kind": "LinkedField",
          "name": "y",
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
              "concreteType": "FinBookV2",
              "kind": "LinkedField",
              "name": "bookV2",
              "plural": false,
              "selections": [
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "OrderBookFragment"
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "BowSummary",
      "kind": "LinkedField",
      "name": "summary",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "spread",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "depthBid",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "depthAsk",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "volume",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "utilization",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 20
        }
      ],
      "concreteType": "FinTradeConnection",
      "kind": "LinkedField",
      "name": "trades",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "FinTradeEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "HistoryFragment"
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "trades(first:20)"
    }
  ],
  "type": "BowPoolXyk",
  "abstractKey": null
};
})();

(node as any).hash = "f2a9ca534b0e3c76cac21f80387eb60e";

export default node;
