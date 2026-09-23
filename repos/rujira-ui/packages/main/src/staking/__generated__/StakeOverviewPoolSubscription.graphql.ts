/**
 * @generated SignedSource<<822c860d89a271827fd61a4a644f5788>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AprStatus = "AVAILABLE" | "NOT_APPLICABLE" | "SOON" | "%future added value";
export type StakeOverviewPoolSubscription$variables = {
  id: string;
};
export type StakeOverviewPoolSubscription$data = {
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
export type StakeOverviewPoolSubscription = {
  response: StakeOverviewPoolSubscription$data;
  variables: StakeOverviewPoolSubscription$variables;
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
    "name": "StakeOverviewPoolSubscription",
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
    "name": "StakeOverviewPoolSubscription",
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
    "cacheID": "1fb9cb38aaa8042de45687ddf0ce101c",
    "id": null,
    "metadata": {},
    "name": "StakeOverviewPoolSubscription",
    "operationKind": "subscription",
    "text": "subscription StakeOverviewPoolSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on StakingPool {\n      status {\n        accountBond\n        liquidBondSize\n        valueUsd\n        id\n      }\n      stakingSummary: summary {\n        apr {\n          value\n          status\n        }\n        id\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "4105e627ed166def11633bf04e676d7a";

export default node;
