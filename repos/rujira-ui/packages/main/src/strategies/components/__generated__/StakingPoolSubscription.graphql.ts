/**
 * @generated SignedSource<<b643dbb66f7aa1fa66260315923c1fbb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AprStatus = "AVAILABLE" | "NOT_APPLICABLE" | "SOON" | "%future added value";
export type StakingPoolSubscription$variables = {
  id: string;
};
export type StakingPoolSubscription$data = {
  readonly node: {
    readonly stakingSummary?: {
      readonly apr: {
        readonly status: AprStatus;
        readonly value: bigint | null | undefined;
      };
    };
    readonly status?: {
      readonly accountBond: bigint;
      readonly liquidBondSize: bigint;
      readonly valueUsd: bigint;
    } | null | undefined;
  } | null | undefined;
};
export type StakingPoolSubscription = {
  response: StakingPoolSubscription$data;
  variables: StakingPoolSubscription$variables;
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
  "name": "accountBond",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "liquidBondSize",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "valueUsd",
  "storageKey": null
},
v5 = {
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
v6 = {
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
    "name": "StakingPoolSubscription",
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
                "concreteType": "StakingStatus",
                "kind": "LinkedField",
                "name": "status",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": "stakingSummary",
                "args": null,
                "concreteType": "StakingSummary",
                "kind": "LinkedField",
                "name": "summary",
                "plural": false,
                "selections": [
                  (v5/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "StakingPool",
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
    "name": "StakingPoolSubscription",
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
                "concreteType": "StakingStatus",
                "kind": "LinkedField",
                "name": "status",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v6/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": "stakingSummary",
                "args": null,
                "concreteType": "StakingSummary",
                "kind": "LinkedField",
                "name": "summary",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
                  (v6/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "StakingPool",
            "abstractKey": null
          },
          (v6/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "b09bbc84fe550e77d18004e46ec8dd89",
    "id": null,
    "metadata": {},
    "name": "StakingPoolSubscription",
    "operationKind": "subscription",
    "text": "subscription StakingPoolSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on StakingPool {\n      status {\n        accountBond\n        liquidBondSize\n        valueUsd\n        id\n      }\n      stakingSummary: summary {\n        apr {\n          value\n          status\n        }\n        id\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "e687a404eef24869ddabf0244d3c7651";

export default node;
