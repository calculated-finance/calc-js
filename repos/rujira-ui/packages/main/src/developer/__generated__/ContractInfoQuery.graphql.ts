/**
 * @generated SignedSource<<ba417146fb1736dfccab098888c36e9a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ContractInfoQuery$variables = {
  id: string;
};
export type ContractInfoQuery$data = {
  readonly node: {
    readonly config?: string | null | undefined;
    readonly info?: {
      readonly admin: string | null | undefined;
      readonly code: {
        readonly checksum: string;
      };
      readonly codeId: number;
      readonly creator: string;
      readonly label: string;
    } | null | undefined;
  } | null | undefined;
};
export type ContractInfoQuery = {
  response: ContractInfoQuery$data;
  variables: ContractInfoQuery$variables;
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
      "concreteType": "ContractInfo",
      "kind": "LinkedField",
      "name": "info",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "admin",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "codeId",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "Code",
          "kind": "LinkedField",
          "name": "code",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "checksum",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "creator",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "label",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "config",
      "storageKey": null
    }
  ],
  "type": "Contract",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ContractInfoQuery",
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
    "name": "ContractInfoQuery",
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
    "cacheID": "da393bf47f522426f5417278a3f86604",
    "id": null,
    "metadata": {},
    "name": "ContractInfoQuery",
    "operationKind": "query",
    "text": "query ContractInfoQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on Contract {\n      info {\n        admin\n        codeId\n        code {\n          checksum\n        }\n        creator\n        label\n      }\n      config\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "be1c3ee3af51243ffb32f1d9760ee0ff";

export default node;
