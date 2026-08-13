/**
 * @generated SignedSource<<80ece5fc087200f60299568d233ba285>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TorRelayChartDataProviderSubscription$variables = {
  prefix: string;
};
export type TorRelayChartDataProviderSubscription$data = {
  readonly edge: {
    readonly cursor: string | null | undefined;
    readonly node: {
      readonly bin?: any;
      readonly close?: bigint;
      readonly high?: bigint;
      readonly id?: string;
      readonly low?: bigint;
      readonly open?: bigint;
    } | null | undefined;
  } | null | undefined;
};
export type TorRelayChartDataProviderSubscription = {
  response: TorRelayChartDataProviderSubscription$data;
  variables: TorRelayChartDataProviderSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "prefix"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "prefix",
    "variableName": "prefix"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "open",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "close",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "high",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "low",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bin",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TorRelayChartDataProviderSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "NodeEdge",
        "kind": "LinkedField",
        "name": "edge",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/)
                ],
                "type": "ThorchainTorCandle",
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
    "name": "TorRelayChartDataProviderSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "NodeEdge",
        "kind": "LinkedField",
        "name": "edge",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
              (v3/*: any*/),
              {
                "kind": "InlineFragment",
                "selections": [
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/)
                ],
                "type": "ThorchainTorCandle",
                "abstractKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "e5ba47ae9b7a332b036188bf82be0e6c",
    "id": null,
    "metadata": {},
    "name": "TorRelayChartDataProviderSubscription",
    "operationKind": "subscription",
    "text": "subscription TorRelayChartDataProviderSubscription(\n  $prefix: String!\n) {\n  edge(prefix: $prefix) {\n    cursor\n    node {\n      __typename\n      ... on ThorchainTorCandle {\n        id\n        open\n        close\n        high\n        low\n        bin\n      }\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "3ff0ecf60f8fc0b56d2f786bbbc6cfea";

export default node;
