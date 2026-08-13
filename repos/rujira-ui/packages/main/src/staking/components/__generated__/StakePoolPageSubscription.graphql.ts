/**
 * @generated SignedSource<<a1f1420629865a0b51c21b216cf4adb0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AprStatus = "AVAILABLE" | "NOT_APPLICABLE" | "SOON" | "%future added value";
export type StakePoolPageSubscription$variables = {
  id: string;
};
export type StakePoolPageSubscription$data = {
  readonly node: {
    readonly accountBond?: bigint;
    readonly apr?: {
      readonly status: AprStatus;
      readonly value: bigint | null | undefined;
    };
    readonly liquidBondSize?: bigint;
    readonly valueUsd?: bigint;
  } | null | undefined;
};
export type StakePoolPageSubscription = {
  response: StakePoolPageSubscription$data;
  variables: StakePoolPageSubscription$variables;
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
      "name": "liquidBondSize",
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
    "name": "StakePoolPageSubscription",
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
    "name": "StakePoolPageSubscription",
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
    "cacheID": "ec86f112885ac299630a54e7a71ab02f",
    "id": null,
    "metadata": {},
    "name": "StakePoolPageSubscription",
    "operationKind": "subscription",
    "text": "subscription StakePoolPageSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on StakingStatus {\n      accountBond\n      liquidBondSize\n      valueUsd\n    }\n    ... on StakingSummary {\n      apr {\n        value\n        status\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "61bf26ec9de3a77de447cc20d9fcbdce";

export default node;
