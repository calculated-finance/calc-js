/**
 * @generated SignedSource<<622ebc50e2eceb6e72e505de1e0e4ed3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type RangePriceSubscription$variables = {
  id: string;
};
export type RangePriceSubscription$data = {
  readonly node: {
    readonly bestAsk?: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly price: bigint;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
    readonly bestBid?: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly price: bigint;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
    readonly center?: bigint | null | undefined;
  } | null | undefined;
};
export type RangePriceSubscription = {
  response: RangePriceSubscription$data;
  variables: RangePriceSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  }
],
v3 = [
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
],
v4 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "center",
      "storageKey": null
    },
    {
      "alias": "bestAsk",
      "args": (v2/*: any*/),
      "concreteType": "FinBookEntryConnection",
      "kind": "LinkedField",
      "name": "asks",
      "plural": false,
      "selections": (v3/*: any*/),
      "storageKey": "asks(first:1)"
    },
    {
      "alias": "bestBid",
      "args": (v2/*: any*/),
      "concreteType": "FinBookEntryConnection",
      "kind": "LinkedField",
      "name": "bids",
      "plural": false,
      "selections": (v3/*: any*/),
      "storageKey": "bids(first:1)"
    }
  ],
  "type": "FinBookV2",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RangePriceSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "RootSubscriptionType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RangePriceSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "7c4a4e91b966daeadeec5acb90748cb5",
    "id": null,
    "metadata": {},
    "name": "RangePriceSubscription",
    "operationKind": "subscription",
    "text": "subscription RangePriceSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on FinBookV2 {\n      center\n      bestAsk: asks(first: 1) {\n        edges {\n          node {\n            price\n          }\n        }\n      }\n      bestBid: bids(first: 1) {\n        edges {\n          node {\n            price\n          }\n        }\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "30d68c286f6f217df807ead63b699a93";

export default node;
