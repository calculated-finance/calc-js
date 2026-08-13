/**
 * @generated SignedSource<<ae67afd5b41d60356d2a0764284c8a6a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PaymentConfigType = "PREPAID" | "WALLET" | "%future added value";
export type autoPaymentConfigQuery$variables = {
  id: string;
};
export type autoPaymentConfigQuery$data = {
  readonly node: {
    readonly auto?: {
      readonly paymentConfig: {
        readonly type: PaymentConfigType;
        readonly usdAllowance: bigint | null | undefined;
      } | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type autoPaymentConfigQuery = {
  response: autoPaymentConfigQuery$data;
  variables: autoPaymentConfigQuery$variables;
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
      "concreteType": "AutoAccount",
      "kind": "LinkedField",
      "name": "auto",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "AutoPaymentConfig",
          "kind": "LinkedField",
          "name": "paymentConfig",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "type",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "usdAllowance",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "autoPaymentConfigQuery",
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
    "type": "RootQueryType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "autoPaymentConfigQuery",
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
    "cacheID": "393ffc60278e093cffb30cc4572bd48a",
    "id": null,
    "metadata": {},
    "name": "autoPaymentConfigQuery",
    "operationKind": "query",
    "text": "query autoPaymentConfigQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on Account {\n      auto {\n        paymentConfig {\n          type\n          usdAllowance\n        }\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "2c21cdf36e7c7a644f92623c3af2ae4c";

export default node;
