/**
 * @generated SignedSource<<81143bb95f934e9d5cb854bf314caa50>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TradeSubscriptionsRangeClosedSubscription$variables = {
  connection: string;
  owner: string;
};
export type TradeSubscriptionsRangeClosedSubscription$data = {
  readonly finRangeClosed: {
    readonly node: {
      readonly id?: string;
    } | null | undefined;
  } | null | undefined;
};
export type TradeSubscriptionsRangeClosedSubscription = {
  response: TradeSubscriptionsRangeClosedSubscription$data;
  variables: TradeSubscriptionsRangeClosedSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "connection"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "owner"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "owner",
    "variableName": "owner"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TradeSubscriptionsRangeClosedSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "NodeEdge",
        "kind": "LinkedField",
        "name": "finRangeClosed",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              {
                "kind": "InlineFragment",
                "selections": [
                  (v2/*: any*/)
                ],
                "type": "FinRange",
                "abstractKey": null
              }
            ],
            "storageKey": null
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
    "name": "TradeSubscriptionsRangeClosedSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "NodeEdge",
        "kind": "LinkedField",
        "name": "finRangeClosed",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
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
              (v2/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "ea8454c8b9faa5656fa103c89ea79c38",
    "id": null,
    "metadata": {},
    "name": "TradeSubscriptionsRangeClosedSubscription",
    "operationKind": "subscription",
    "text": "subscription TradeSubscriptionsRangeClosedSubscription(\n  $owner: Address!\n) {\n  finRangeClosed(owner: $owner) {\n    node {\n      __typename\n      ... on FinRange {\n        id\n      }\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "eae075947116a9c1ae8e70621a449d80";

export default node;
