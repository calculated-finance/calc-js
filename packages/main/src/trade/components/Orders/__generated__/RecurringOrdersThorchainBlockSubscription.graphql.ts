/**
 * @generated SignedSource<<b17ef0e6f4529e1693335e68ea9adb70>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type RecurringOrdersThorchainBlockSubscription$variables = {
  id: string;
};
export type RecurringOrdersThorchainBlockSubscription$data = {
  readonly node: {
    readonly header?: {
      readonly height: bigint;
      readonly time: any;
    };
  } | null | undefined;
};
export type RecurringOrdersThorchainBlockSubscription = {
  response: RecurringOrdersThorchainBlockSubscription$data;
  variables: RecurringOrdersThorchainBlockSubscription$variables;
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
      "concreteType": "ThorchainBlockHeader",
      "kind": "LinkedField",
      "name": "header",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "height",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "time",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "ThorchainBlock",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RecurringOrdersThorchainBlockSubscription",
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
    "name": "RecurringOrdersThorchainBlockSubscription",
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
    "cacheID": "9bc2327bf4a1d32412f13012543bf34c",
    "id": null,
    "metadata": {},
    "name": "RecurringOrdersThorchainBlockSubscription",
    "operationKind": "subscription",
    "text": "subscription RecurringOrdersThorchainBlockSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on ThorchainBlock {\n      header {\n        height\n        time\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "4ca84f92f1335577e62079846c5357f0";

export default node;
