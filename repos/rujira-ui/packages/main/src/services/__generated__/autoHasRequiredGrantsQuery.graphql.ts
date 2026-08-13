/**
 * @generated SignedSource<<dcd1cb6704dfe8c95b89a48949e3e42e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type autoHasRequiredGrantsQuery$variables = {
  id: string;
};
export type autoHasRequiredGrantsQuery$data = {
  readonly node: {
    readonly auto?: {
      readonly hasRequiredGrants: boolean;
    } | null | undefined;
  } | null | undefined;
};
export type autoHasRequiredGrantsQuery = {
  response: autoHasRequiredGrantsQuery$data;
  variables: autoHasRequiredGrantsQuery$variables;
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
          "kind": "ScalarField",
          "name": "hasRequiredGrants",
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
    "name": "autoHasRequiredGrantsQuery",
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
    "name": "autoHasRequiredGrantsQuery",
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
    "cacheID": "aab5b0e92299a7faa40cf665bc5089b7",
    "id": null,
    "metadata": {},
    "name": "autoHasRequiredGrantsQuery",
    "operationKind": "query",
    "text": "query autoHasRequiredGrantsQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on Account {\n      auto {\n        hasRequiredGrants\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "a27b88db8580ef0e30aac2042c80eeeb";

export default node;
