/**
 * @generated SignedSource<<f8c13c8517abbb39ae30c7f0fbae7fd2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type HeaderTradeSubscription$variables = {
  id: string;
};
export type HeaderTradeSubscription$data = {
  readonly node: {
    readonly summary?: {
      readonly " $fragmentSpreads": FragmentRefs<"HeaderTradeSummaryFragment">;
    } | null | undefined;
  } | null | undefined;
};
export type HeaderTradeSubscription = {
  response: HeaderTradeSubscription$data;
  variables: HeaderTradeSubscription$variables;
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "HeaderTradeSubscription",
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
                "alias": null,
                "args": null,
                "concreteType": "FinSummary",
                "kind": "LinkedField",
                "name": "summary",
                "plural": false,
                "selections": [
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "HeaderTradeSummaryFragment"
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "FinPair",
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
    "name": "HeaderTradeSubscription",
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
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "FinSummary",
                "kind": "LinkedField",
                "name": "summary",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "last",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "lastUsd",
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
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "change",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "volumeUsd",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "FinPair",
            "abstractKey": null
          },
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
    "cacheID": "67ac52c2649e00ddf48dad5bdd3b0215",
    "id": null,
    "metadata": {},
    "name": "HeaderTradeSubscription",
    "operationKind": "subscription",
    "text": "subscription HeaderTradeSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on FinPair {\n      summary {\n        ...HeaderTradeSummaryFragment\n      }\n    }\n    id\n  }\n}\n\nfragment HeaderTradeSummaryFragment on FinSummary {\n  last\n  lastUsd\n  high\n  low\n  change\n  volumeUsd\n}\n"
  }
};
})();

(node as any).hash = "2f48f0674cf85dde796ae4ecbaeb46b3";

export default node;
