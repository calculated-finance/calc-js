/**
 * @generated SignedSource<<5e014a8f8c53af8116c9a063ea158ac4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AnalyticsSampleQuery$variables = Record<PropertyKey, never>;
export type AnalyticsSampleQuery$data = {
  readonly users: {
    readonly topTradersByVolume: ReadonlyArray<{
      readonly amount: bigint;
      readonly percentage: bigint;
      readonly tier: string;
    }>;
  };
};
export type AnalyticsSampleQuery = {
  response: AnalyticsSampleQuery$data;
  variables: AnalyticsSampleQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Users",
    "kind": "LinkedField",
    "name": "users",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "UserTierAmount",
        "kind": "LinkedField",
        "name": "topTradersByVolume",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "tier",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "amount",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "percentage",
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AnalyticsSampleQuery",
    "selections": (v0/*: any*/),
    "type": "RootQueryType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AnalyticsSampleQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "a5d9fbda060339af20a3f0138336519f",
    "id": null,
    "metadata": {},
    "name": "AnalyticsSampleQuery",
    "operationKind": "query",
    "text": "query AnalyticsSampleQuery {\n  users {\n    topTradersByVolume {\n      tier\n      amount\n      percentage\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "26d6abe7d100352e085889035d11277c";

export default node;
