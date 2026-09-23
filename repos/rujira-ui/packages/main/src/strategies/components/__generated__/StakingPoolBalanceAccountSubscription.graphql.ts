/**
 * @generated SignedSource<<d21eba71dd6b68063e4c244c7d608813>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type StakingPoolBalanceAccountSubscription$variables = {
  owner: string;
};
export type StakingPoolBalanceAccountSubscription$data = {
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
export type StakingPoolBalanceAccountSubscription = {
  response: StakingPoolBalanceAccountSubscription$data;
  variables: StakingPoolBalanceAccountSubscription$variables;
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
    "name": "StakingPoolBalanceAccountSubscription",
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
    "name": "StakingPoolBalanceAccountSubscription",
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
    "cacheID": "0fc30027633ca535ca58cd308e6dd72f",
    "id": null,
    "metadata": {},
    "name": "StakingPoolBalanceAccountSubscription",
    "operationKind": "subscription",
    "text": "subscription StakingPoolBalanceAccountSubscription(\n  $owner: Address!\n) {\n  stakingAccountUpdated(owner: $owner) {\n    bonded {\n      amount\n    }\n    pendingRevenue {\n      amount\n    }\n    liquidSize {\n      amount\n    }\n    valueUsd\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "4385467ce40fa46558f1cb3d77f90648";

export default node;
