/**
 * @generated SignedSource<<a771651ec68bac81faa1d06bde50d9ff>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type GhostVaultBalanceSubscription$variables = {
  id: string;
};
export type GhostVaultBalanceSubscription$data = {
  readonly node: {
    readonly id?: string;
    readonly receiptShares?: {
      readonly amount: bigint;
    };
    readonly receiptValue?: {
      readonly amount: bigint;
    };
    readonly valueUsd?: bigint;
  } | null | undefined;
};
export type GhostVaultBalanceSubscription = {
  response: GhostVaultBalanceSubscription$data;
  variables: GhostVaultBalanceSubscription$variables;
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
  "name": "id",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "amount",
    "storageKey": null
  }
],
v4 = {
  "alias": "receiptShares",
  "args": null,
  "concreteType": "Balance",
  "kind": "LinkedField",
  "name": "shares",
  "plural": false,
  "selections": (v3/*: any*/),
  "storageKey": null
},
v5 = {
  "alias": "receiptValue",
  "args": null,
  "concreteType": "Balance",
  "kind": "LinkedField",
  "name": "value",
  "plural": false,
  "selections": (v3/*: any*/),
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
    "name": "GhostVaultBalanceSubscription",
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
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/)
            ],
            "type": "GhostVaultAccount",
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
    "name": "GhostVaultBalanceSubscription",
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
          {
            "kind": "InlineFragment",
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/)
            ],
            "type": "GhostVaultAccount",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "0ab55f92f9a06257b20af75ca942bf07",
    "id": null,
    "metadata": {},
    "name": "GhostVaultBalanceSubscription",
    "operationKind": "subscription",
    "text": "subscription GhostVaultBalanceSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on GhostVaultAccount {\n      id\n      receiptShares: shares {\n        amount\n      }\n      receiptValue: value {\n        amount\n      }\n      valueUsd\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "af7cdb00e0ce77b3324e008fc831040c";

export default node;
