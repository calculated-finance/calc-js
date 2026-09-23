/**
 * @generated SignedSource<<846b7fdfbe9757a765b5df16346baf5d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PositionSwapBookSubscription$variables = {
  id: string;
};
export type PositionSwapBookSubscription$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"PositionSwapBookFragment">;
  } | null | undefined;
};
export type PositionSwapBookSubscription = {
  response: PositionSwapBookSubscription$data;
  variables: PositionSwapBookSubscription$variables;
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
    "name": "asset",
    "storageKey": null
  },
  (v2/*: any*/)
],
v4 = [
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
    "name": "value",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PositionSwapBookSubscription",
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
                "args": null,
                "kind": "FragmentSpread",
                "name": "PositionSwapBookFragment"
              }
            ],
            "type": "FinBook",
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
    "name": "PositionSwapBookSubscription",
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
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "assetBase",
                    "plural": false,
                    "selections": (v3/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "assetQuote",
                    "plural": false,
                    "selections": (v3/*: any*/),
                    "storageKey": null
                  },
                  (v2/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "FinBookEntry",
                "kind": "LinkedField",
                "name": "bids",
                "plural": true,
                "selections": (v4/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "FinBookEntry",
                "kind": "LinkedField",
                "name": "asks",
                "plural": true,
                "selections": (v4/*: any*/),
                "storageKey": null
              }
            ],
            "type": "FinBook",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "ccf3841dd6743cfffb2792e43f2bb7e2",
    "id": null,
    "metadata": {},
    "name": "PositionSwapBookSubscription",
    "operationKind": "subscription",
    "text": "subscription PositionSwapBookSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on FinBook {\n      ...PositionSwapBookFragment\n    }\n    id\n  }\n}\n\nfragment PositionSwapBookFragment on FinBook {\n  id\n  pair {\n    assetBase {\n      asset\n      id\n    }\n    assetQuote {\n      asset\n      id\n    }\n    id\n  }\n  bids {\n    price\n    total\n    value\n  }\n  asks {\n    price\n    total\n    value\n  }\n}\n"
  }
};
})();

(node as any).hash = "7c323d4951e40ff95d4e93e36b2f09c8";

export default node;
