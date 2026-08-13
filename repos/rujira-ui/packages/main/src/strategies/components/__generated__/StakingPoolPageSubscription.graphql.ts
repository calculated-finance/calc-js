/**
 * @generated SignedSource<<1ba60f94be0a1c6f72c7e7dcef433e25>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AprStatus = "AVAILABLE" | "NOT_APPLICABLE" | "SOON" | "%future added value";
export type StakingPoolPageSubscription$variables = {
  id: string;
};
export type StakingPoolPageSubscription$data = {
  readonly node: {
    readonly accountBond?: bigint;
    readonly accountRevenue?: bigint;
    readonly apr?: {
      readonly status: AprStatus;
      readonly value: bigint | null | undefined;
    };
    readonly liquidBondShares?: bigint;
    readonly liquidBondSize?: bigint;
    readonly pendingRevenue?: bigint;
    readonly valueUsd?: bigint;
  } | null | undefined;
};
export type StakingPoolPageSubscription = {
  response: StakingPoolPageSubscription$data;
  variables: StakingPoolPageSubscription$variables;
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
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "accountBond",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "accountRevenue",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "liquidBondShares",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "liquidBondSize",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "pendingRevenue",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "valueUsd",
      "storageKey": null
    }
  ],
  "type": "StakingStatus",
  "abstractKey": null
},
v3 = {
  "kind": "InlineFragment",
  "selections": [
    {
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
    }
  ],
  "type": "StakingSummary",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "StakingPoolPageSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/)
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
    "name": "StakingPoolPageSubscription",
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
          (v3/*: any*/),
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
    "cacheID": "3027f9441fd44c3822d7feb5d5ef144f",
    "id": null,
    "metadata": {},
    "name": "StakingPoolPageSubscription",
    "operationKind": "subscription",
    "text": "subscription StakingPoolPageSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on StakingStatus {\n      accountBond\n      accountRevenue\n      liquidBondShares\n      liquidBondSize\n      pendingRevenue\n      valueUsd\n    }\n    ... on StakingSummary {\n      apr {\n        value\n        status\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "c583b29e069b53bbf131da0411e56efa";

export default node;
