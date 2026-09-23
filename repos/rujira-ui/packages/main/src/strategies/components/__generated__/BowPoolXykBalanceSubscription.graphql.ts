/**
 * @generated SignedSource<<457eff90c3172c814c6b2565090194f9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type BowPoolXykBalanceSubscription$variables = {
  id: string;
};
export type BowPoolXykBalanceSubscription$data = {
  readonly node: {
    readonly id?: string;
    readonly shares?: {
      readonly amount: bigint;
    };
    readonly value?: ReadonlyArray<{
      readonly amount: bigint;
    }>;
  } | null | undefined;
};
export type BowPoolXykBalanceSubscription = {
  response: BowPoolXykBalanceSubscription$data;
  variables: BowPoolXykBalanceSubscription$variables;
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
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "amount",
    "storageKey": null
  }
],
v4 = {
  "alias": null,
  "args": null,
  "concreteType": "Balance",
  "kind": "LinkedField",
  "name": "shares",
  "plural": false,
  "selections": (v3/*: any*/),
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "concreteType": "Balance",
  "kind": "LinkedField",
  "name": "value",
  "plural": true,
  "selections": (v3/*: any*/),
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "BowPoolXykBalanceSubscription",
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
              (v2/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/)
            ],
            "type": "BowAccount",
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
    "name": "BowPoolXykBalanceSubscription",
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
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/)
            ],
            "type": "BowAccount",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "ec1f347cfedd265af2cce871ad0c8a4b",
    "id": null,
    "metadata": {},
    "name": "BowPoolXykBalanceSubscription",
    "operationKind": "subscription",
    "text": "subscription BowPoolXykBalanceSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on BowAccount {\n      id\n      shares {\n        amount\n      }\n      value {\n        amount\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "2bf25556d30205fe178a48a6c3802a66";

export default node;
