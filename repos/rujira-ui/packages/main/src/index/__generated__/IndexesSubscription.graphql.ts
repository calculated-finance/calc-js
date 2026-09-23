/**
 * @generated SignedSource<<f5bbfa236b115345bc0def9abaa62925>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type IndexesSubscription$variables = {
  id: string;
};
export type IndexesSubscription$data = {
  readonly node: {
    readonly status?: {
      readonly nav: bigint;
      readonly navPerShareChange: bigint | null | undefined;
    };
  } | null | undefined;
};
export type IndexesSubscription = {
  response: IndexesSubscription$data;
  variables: IndexesSubscription$variables;
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
      "concreteType": "IndexStatus",
      "kind": "LinkedField",
      "name": "status",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "nav",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "navPerShareChange",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "IndexVault",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "IndexesSubscription",
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
    "name": "IndexesSubscription",
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
    "cacheID": "b138cd79e8d79449c39babbbce040cc2",
    "id": null,
    "metadata": {},
    "name": "IndexesSubscription",
    "operationKind": "subscription",
    "text": "subscription IndexesSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on IndexVault {\n      status {\n        nav\n        navPerShareChange\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "7d13b366f191f782f206fd87b4dea2a9";

export default node;
