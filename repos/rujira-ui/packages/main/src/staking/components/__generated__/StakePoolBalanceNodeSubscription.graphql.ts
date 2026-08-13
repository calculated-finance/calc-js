/**
 * @generated SignedSource<<53c67c705c71bfacdb35f3a1ca707ba8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type StakePoolBalanceNodeSubscription$variables = {
  id: string;
};
export type StakePoolBalanceNodeSubscription$data = {
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
export type StakePoolBalanceNodeSubscription = {
  response: StakePoolBalanceNodeSubscription$data;
  variables: StakePoolBalanceNodeSubscription$variables;
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
    "name": "StakePoolBalanceNodeSubscription",
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
    "name": "StakePoolBalanceNodeSubscription",
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
    "cacheID": "a8a152074607fa36d3681e7cfed233f4",
    "id": null,
    "metadata": {},
    "name": "StakePoolBalanceNodeSubscription",
    "operationKind": "subscription",
    "text": "subscription StakePoolBalanceNodeSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on StakingAccount {\n      liquidSize {\n        amount\n      }\n      liquidShares {\n        amount\n      }\n      valueUsd\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "64b4bdf1012a3d81d1552fa50022873b";

export default node;
