/**
 * @generated SignedSource<<fe02cfaf753b06f610ca1040bf3499c7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type StakingPoolBalanceNodeSubscription$variables = {
  id: string;
};
export type StakingPoolBalanceNodeSubscription$data = {
  readonly node: {
    readonly liquidShares?: {
      readonly amount: bigint;
    };
    readonly liquidSize?: {
      readonly amount: bigint;
    };
    readonly valueUsd?: bigint;
  } | null | undefined;
};
export type StakingPoolBalanceNodeSubscription = {
  response: StakingPoolBalanceNodeSubscription$data;
  variables: StakingPoolBalanceNodeSubscription$variables;
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
v2 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "amount",
    "storageKey": null
  }
],
v3 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Balance",
      "kind": "LinkedField",
      "name": "liquidSize",
      "plural": false,
      "selections": (v2/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Balance",
      "kind": "LinkedField",
      "name": "liquidShares",
      "plural": false,
      "selections": (v2/*: any*/),
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
  "type": "StakingAccount",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "StakingPoolBalanceNodeSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
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
    "name": "StakingPoolBalanceNodeSubscription",
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
    "cacheID": "346763d3a00ce83b8b6e1bfc494dfbb7",
    "id": null,
    "metadata": {},
    "name": "StakingPoolBalanceNodeSubscription",
    "operationKind": "subscription",
    "text": "subscription StakingPoolBalanceNodeSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on StakingAccount {\n      liquidSize {\n        amount\n      }\n      liquidShares {\n        amount\n      }\n      valueUsd\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "524e4e0a67b4f1d412e862303b08c6e2";

export default node;
