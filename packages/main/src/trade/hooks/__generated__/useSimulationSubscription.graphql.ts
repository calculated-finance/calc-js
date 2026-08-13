/**
 * @generated SignedSource<<7d19a78d85448759f133c2b5c50f50b8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type useSimulationSubscription$variables = {
  address: string;
  amount: bigint;
  denom: string;
};
export type useSimulationSubscription$data = {
  readonly finSimulation: {
    readonly amount: bigint;
    readonly denom: string;
    readonly fee: bigint;
    readonly id: string;
    readonly returned: bigint;
  } | null | undefined;
};
export type useSimulationSubscription = {
  response: useSimulationSubscription$data;
  variables: useSimulationSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "address"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "amount"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "denom"
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "address",
        "variableName": "address"
      },
      {
        "kind": "Variable",
        "name": "amount",
        "variableName": "amount"
      },
      {
        "kind": "Variable",
        "name": "denom",
        "variableName": "denom"
      }
    ],
    "concreteType": "FinSimulation",
    "kind": "LinkedField",
    "name": "finSimulation",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "amount",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "denom",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "fee",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "returned",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "useSimulationSubscription",
    "selections": (v3/*: any*/),
    "type": "RootSubscriptionType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v2/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "useSimulationSubscription",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "2ab490313a13cd7dba5e14092dfd0188",
    "id": null,
    "metadata": {},
    "name": "useSimulationSubscription",
    "operationKind": "subscription",
    "text": "subscription useSimulationSubscription(\n  $address: Address!\n  $denom: String!\n  $amount: Bigint!\n) {\n  finSimulation(address: $address, denom: $denom, amount: $amount) {\n    id\n    amount\n    denom\n    fee\n    returned\n  }\n}\n"
  }
};
})();

(node as any).hash = "1cb97476a50b47be4de7814615923ffc";

export default node;
