/**
 * @generated SignedSource<<46fb142f17377924d331c871a517af7c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AprStatus = "AVAILABLE" | "NOT_APPLICABLE" | "SOON" | "%future added value";
export type StakingPoolPortfolioRowSubscription$variables = {
  id: string;
};
export type StakingPoolPortfolioRowSubscription$data = {
  readonly node: {
    readonly pool?: {
      readonly summary: {
        readonly apr: {
          readonly status: AprStatus;
          readonly value: bigint | null | undefined;
        };
      };
    };
    readonly valueUsd?: bigint;
  } | null | undefined;
};
export type StakingPoolPortfolioRowSubscription = {
  response: StakingPoolPortfolioRowSubscription$data;
  variables: StakingPoolPortfolioRowSubscription$variables;
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
  "name": "valueUsd",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "concreteType": "Apr",
  "kind": "LinkedField",
  "name": "apr",
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
      "name": "status",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v4 = {
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
    "name": "StakingPoolPortfolioRowSubscription",
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
              {
                "alias": null,
                "args": null,
                "concreteType": "StakingPool",
                "kind": "LinkedField",
                "name": "pool",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "StakingSummary",
                    "kind": "LinkedField",
                    "name": "summary",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "StakingAccount",
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
    "name": "StakingPoolPortfolioRowSubscription",
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
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "StakingPool",
                "kind": "LinkedField",
                "name": "pool",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "StakingSummary",
                    "kind": "LinkedField",
                    "name": "summary",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v4/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "StakingAccount",
            "abstractKey": null
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "eb65890147a5a76c7cfbca94553634e2",
    "id": null,
    "metadata": {},
    "name": "StakingPoolPortfolioRowSubscription",
    "operationKind": "subscription",
    "text": "subscription StakingPoolPortfolioRowSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on StakingAccount {\n      valueUsd\n      pool {\n        summary {\n          apr {\n            value\n            status\n          }\n          id\n        }\n        id\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "2d962df4d6d7d2ed48e31d2f9d408a55";

export default node;
