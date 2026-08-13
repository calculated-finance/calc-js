/**
 * @generated SignedSource<<dd3f998de257a053a0e8c9c7112e9276>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type StakePoolBalanceAccountSubscription$variables = {
  owner: string;
};
export type StakePoolBalanceAccountSubscription$data = {
  readonly stakingAccountUpdated: {
    readonly bonded: {
      readonly amount: bigint;
    };
    readonly liquidSize: {
      readonly amount: bigint;
    };
    readonly pendingRevenue: {
      readonly amount: bigint;
    };
    readonly valueUsd: bigint;
  } | null | undefined;
};
export type StakePoolBalanceAccountSubscription = {
  response: StakePoolBalanceAccountSubscription$data;
  variables: StakePoolBalanceAccountSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "owner"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "owner",
    "variableName": "owner"
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
  "alias": null,
  "args": null,
  "concreteType": "Balance",
  "kind": "LinkedField",
  "name": "bonded",
  "plural": false,
  "selections": (v2/*: any*/),
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "concreteType": "Balance",
  "kind": "LinkedField",
  "name": "pendingRevenue",
  "plural": false,
  "selections": (v2/*: any*/),
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "concreteType": "Balance",
  "kind": "LinkedField",
  "name": "liquidSize",
  "plural": false,
  "selections": (v2/*: any*/),
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "valueUsd",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "StakePoolBalanceAccountSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "StakingAccount",
        "kind": "LinkedField",
        "name": "stakingAccountUpdated",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/)
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
    "name": "StakePoolBalanceAccountSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "StakingAccount",
        "kind": "LinkedField",
        "name": "stakingAccountUpdated",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
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
    "cacheID": "68c64b51adccfb4752d2b9706c5e3896",
    "id": null,
    "metadata": {},
    "name": "StakePoolBalanceAccountSubscription",
    "operationKind": "subscription",
    "text": "subscription StakePoolBalanceAccountSubscription(\n  $owner: Address!\n) {\n  stakingAccountUpdated(owner: $owner) {\n    bonded {\n      amount\n    }\n    pendingRevenue {\n      amount\n    }\n    liquidSize {\n      amount\n    }\n    valueUsd\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "793a716e5092142195611b08af88eb8a";

export default node;
