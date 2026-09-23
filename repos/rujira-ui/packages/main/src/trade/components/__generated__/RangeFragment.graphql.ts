/**
 * @generated SignedSource<<8e5edfe854763f368c9c793d28ab10f2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RangeFragment$data = {
  readonly bookV2: {
    readonly bestAsk: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly price: bigint;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
    readonly bestBid: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly price: bigint;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
    readonly center: bigint | null | undefined;
    readonly id: string;
  };
  readonly candles: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly close: bigint;
        readonly high: bigint;
        readonly low: bigint;
      } | null | undefined;
    } | null | undefined> | null | undefined;
  };
  readonly id: string;
  readonly tick: bigint;
  readonly " $fragmentType": "RangeFragment";
};
export type RangeFragment$key = {
  readonly " $data"?: RangeFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"RangeFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  }
],
v2 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "FinBookEntryEdge",
    "kind": "LinkedField",
    "name": "edges",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "FinBookEntry",
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "price",
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
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "rangeAfter"
    },
    {
      "kind": "RootArgument",
      "name": "rangeBefore"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "RangeFragment",
  "selections": [
    (v0/*: any*/),
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
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "center",
          "storageKey": null
        },
        {
          "alias": "bestAsk",
          "args": (v1/*: any*/),
          "concreteType": "FinBookEntryConnection",
          "kind": "LinkedField",
          "name": "asks",
          "plural": false,
          "selections": (v2/*: any*/),
          "storageKey": "asks(first:1)"
        },
        {
          "alias": "bestBid",
          "args": (v1/*: any*/),
          "concreteType": "FinBookEntryConnection",
          "kind": "LinkedField",
          "name": "bids",
          "plural": false,
          "selections": (v2/*: any*/),
          "storageKey": "bids(first:1)"
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "after",
          "variableName": "rangeAfter"
        },
        {
          "kind": "Variable",
          "name": "before",
          "variableName": "rangeBefore"
        },
        {
          "kind": "Literal",
          "name": "last",
          "value": 90
        },
        {
          "kind": "Literal",
          "name": "resolution",
          "value": "1D"
        }
      ],
      "concreteType": "FinCandleConnection",
      "kind": "LinkedField",
      "name": "candles",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "FinCandleEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "FinCandle",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "close",
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
                }
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
  "type": "FinPair",
  "abstractKey": null
};
})();

(node as any).hash = "1d163df9a1de1340938046cc58b8ac49";

export default node;
