/**
 * @generated SignedSource<<ee478eed9a0ed3628ac1671b80e26704>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TradeSubscriptionsBookSubscription$variables = {
  id: string;
  truncate?: number | null | undefined;
};
export type TradeSubscriptionsBookSubscription$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"OrderBookSubFragment">;
  } | null | undefined;
};
export type TradeSubscriptionsBookSubscription = {
  response: TradeSubscriptionsBookSubscription$data;
  variables: TradeSubscriptionsBookSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "truncate"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "kind": "Variable",
  "name": "truncate",
  "variableName": "truncate"
},
v3 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  },
  (v2/*: any*/)
],
v4 = [
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
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "side",
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
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TradeSubscriptionsBookSubscription",
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
            "kind": "InlineFragment",
            "selections": [
              {
                "args": [
                  (v2/*: any*/)
                ],
                "kind": "FragmentSpread",
                "name": "OrderBookSubFragment"
              }
            ],
            "type": "FinBookV2",
            "abstractKey": null
          }
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
    "name": "TradeSubscriptionsBookSubscription",
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
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
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
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "spread",
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v3/*: any*/),
                "concreteType": "FinBookEntryConnection",
                "kind": "LinkedField",
                "name": "bids",
                "plural": false,
                "selections": (v4/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v3/*: any*/),
                "concreteType": "FinBookEntryConnection",
                "kind": "LinkedField",
                "name": "asks",
                "plural": false,
                "selections": (v4/*: any*/),
                "storageKey": null
              }
            ],
            "type": "FinBookV2",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "d46bcc1c35eed0772ab8b51be0a09560",
    "id": null,
    "metadata": {},
    "name": "TradeSubscriptionsBookSubscription",
    "operationKind": "subscription",
    "text": "subscription TradeSubscriptionsBookSubscription(\n  $id: ID!\n  $truncate: Int\n) {\n  node(id: $id) {\n    __typename\n    ... on FinBookV2 {\n      ...OrderBookSubFragment_2ob4IK\n    }\n    id\n  }\n}\n\nfragment OrderBookEntryFragment on FinBookEntry {\n  price\n  side\n  total\n  value\n  virtualTotal\n  virtualValue\n}\n\nfragment OrderBookSubFragment_2ob4IK on FinBookV2 {\n  id\n  center\n  spread\n  bids(first: 100, truncate: $truncate) {\n    edges {\n      node {\n        value\n        price\n        total\n        virtualTotal\n        virtualValue\n        ...OrderBookEntryFragment\n      }\n    }\n  }\n  asks(first: 100, truncate: $truncate) {\n    edges {\n      node {\n        value\n        price\n        total\n        virtualTotal\n        virtualValue\n        ...OrderBookEntryFragment\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "8bde48e42120c830b2bab11c22f22b30";

export default node;
