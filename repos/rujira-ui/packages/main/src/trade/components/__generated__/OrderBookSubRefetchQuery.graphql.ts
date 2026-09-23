/**
 * @generated SignedSource<<bfc9a2252cd00e3970259aa2689f98fc>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OrderBookSubRefetchQuery$variables = {
  id: string;
  truncate?: number | null | undefined;
};
export type OrderBookSubRefetchQuery$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"OrderBookSubFragment">;
  } | null | undefined;
};
export type OrderBookSubRefetchQuery = {
  response: OrderBookSubRefetchQuery$data;
  variables: OrderBookSubRefetchQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "truncate"
},
v2 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v3 = {
  "kind": "Variable",
  "name": "truncate",
  "variableName": "truncate"
},
v4 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  },
  (v3/*: any*/)
],
v5 = [
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "OrderBookSubRefetchQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "args": [
              (v3/*: any*/)
            ],
            "kind": "FragmentSpread",
            "name": "OrderBookSubFragment"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "RootQueryType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "OrderBookSubRefetchQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
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
                "args": (v4/*: any*/),
                "concreteType": "FinBookEntryConnection",
                "kind": "LinkedField",
                "name": "bids",
                "plural": false,
                "selections": (v5/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v4/*: any*/),
                "concreteType": "FinBookEntryConnection",
                "kind": "LinkedField",
                "name": "asks",
                "plural": false,
                "selections": (v5/*: any*/),
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
    "cacheID": "ab681e35b7f1f110e65e8ae88d594863",
    "id": null,
    "metadata": {},
    "name": "OrderBookSubRefetchQuery",
    "operationKind": "query",
    "text": "query OrderBookSubRefetchQuery(\n  $truncate: Int\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ...OrderBookSubFragment_2ob4IK\n    id\n  }\n}\n\nfragment OrderBookEntryFragment on FinBookEntry {\n  price\n  side\n  total\n  value\n  virtualTotal\n  virtualValue\n}\n\nfragment OrderBookSubFragment_2ob4IK on FinBookV2 {\n  id\n  center\n  spread\n  bids(first: 100, truncate: $truncate) {\n    edges {\n      node {\n        value\n        price\n        total\n        virtualTotal\n        virtualValue\n        ...OrderBookEntryFragment\n      }\n    }\n  }\n  asks(first: 100, truncate: $truncate) {\n    edges {\n      node {\n        value\n        price\n        total\n        virtualTotal\n        virtualValue\n        ...OrderBookEntryFragment\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "ee3d5023fab4b044da64123fbb872f92";

export default node;
