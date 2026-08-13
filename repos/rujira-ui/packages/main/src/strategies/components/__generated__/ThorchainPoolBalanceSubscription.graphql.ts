/**
 * @generated SignedSource<<79bcc29a3413a6f4ab5be34bb3d14217>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ThorchainPoolBalanceSubscription$variables = {
  id: string;
};
export type ThorchainPoolBalanceSubscription$data = {
  readonly node: {
    readonly assetRedeemValue?: bigint;
    readonly runeRedeemValue?: bigint;
    readonly units?: bigint;
  } | null | undefined;
};
export type ThorchainPoolBalanceSubscription = {
  response: ThorchainPoolBalanceSubscription$data;
  variables: ThorchainPoolBalanceSubscription$variables;
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
      "name": "assetRedeemValue",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "runeRedeemValue",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "units",
      "storageKey": null
    }
  ],
  "type": "ThorchainLiquidityProvider",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ThorchainPoolBalanceSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/)
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
    "name": "ThorchainPoolBalanceSubscription",
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
    "cacheID": "2862b274c7e29cfc783ead8742c319fe",
    "id": null,
    "metadata": {},
    "name": "ThorchainPoolBalanceSubscription",
    "operationKind": "subscription",
    "text": "subscription ThorchainPoolBalanceSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on ThorchainLiquidityProvider {\n      assetRedeemValue\n      runeRedeemValue\n      units\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "cc5c45424d4110b39360a7ee4a573e5f";

export default node;
