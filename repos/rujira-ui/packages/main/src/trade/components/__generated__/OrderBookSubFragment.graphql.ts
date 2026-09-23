/**
 * @generated SignedSource<<6408dd7855fe91625ba4182623b1b5c8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OrderBookSubFragment$data = {
  readonly asks: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly price: bigint;
        readonly total: bigint;
        readonly value: bigint;
        readonly virtualTotal: bigint;
        readonly virtualValue: bigint;
        readonly " $fragmentSpreads": FragmentRefs<"OrderBookEntryFragment">;
      } | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly bids: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly price: bigint;
        readonly total: bigint;
        readonly value: bigint;
        readonly virtualTotal: bigint;
        readonly virtualValue: bigint;
        readonly " $fragmentSpreads": FragmentRefs<"OrderBookEntryFragment">;
      } | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly center: bigint | null | undefined;
  readonly id: string;
  readonly spread: bigint | null | undefined;
  readonly " $fragmentType": "OrderBookSubFragment";
};
export type OrderBookSubFragment$key = {
  readonly " $data"?: OrderBookSubFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrderBookSubFragment">;
};

import OrderBookSubRefetchQuery_graphql from './OrderBookSubRefetchQuery.graphql';

const node: ReaderFragment = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  },
  {
    "kind": "Variable",
    "name": "truncate",
    "variableName": "truncate"
  }
],
v1 = [
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
            "name": "value",
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
            "name": "total",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "virtualTotal",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "virtualValue",
            "storageKey": null
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "OrderBookEntryFragment"
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
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "truncate"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "refetch": {
      "connection": null,
      "fragmentPathInResult": [
        "node"
      ],
      "operation": OrderBookSubRefetchQuery_graphql,
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "OrderBookSubFragment",
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
      "kind": "ScalarField",
      "name": "center",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "spread",
      "storageKey": null
    },
    {
      "alias": null,
      "args": (v0/*: any*/),
      "concreteType": "FinBookEntryConnection",
      "kind": "LinkedField",
      "name": "bids",
      "plural": false,
      "selections": (v1/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": (v0/*: any*/),
      "concreteType": "FinBookEntryConnection",
      "kind": "LinkedField",
      "name": "asks",
      "plural": false,
      "selections": (v1/*: any*/),
      "storageKey": null
    }
  ],
  "type": "FinBookV2",
  "abstractKey": null
};
})();

(node as any).hash = "ee3d5023fab4b044da64123fbb872f92";

export default node;
