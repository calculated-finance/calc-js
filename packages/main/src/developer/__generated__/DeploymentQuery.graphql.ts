/**
 * @generated SignedSource<<a80be5b619013aa0a4a777465792537f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeploymentQuery$variables = Record<PropertyKey, never>;
export type DeploymentQuery$data = {
  readonly deployment: {
    readonly targets: ReadonlyArray<{
      readonly address: string;
      readonly contract: {
        readonly admin: string | null | undefined;
        readonly code: {
          readonly checksum: string;
        };
        readonly codeId: number;
        readonly label: string;
      } | null | undefined;
      readonly module: string;
      readonly name: string;
      readonly version: string | null | undefined;
    }>;
  } | null | undefined;
};
export type DeploymentQuery = {
  response: DeploymentQuery$data;
  variables: DeploymentQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "address",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "module",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "concreteType": "ContractInfo",
  "kind": "LinkedField",
  "name": "contract",
  "plural": false,
  "selections": [
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
      "name": "admin",
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
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "version",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "DeploymentQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Deployment",
        "kind": "LinkedField",
        "name": "deployment",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "DeploymentTarget",
            "kind": "LinkedField",
            "name": "targets",
            "plural": true,
            "selections": [
              (v0/*: any*/),
              (v1/*: any*/),
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "RootQueryType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "DeploymentQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Deployment",
        "kind": "LinkedField",
        "name": "deployment",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "DeploymentTarget",
            "kind": "LinkedField",
            "name": "targets",
            "plural": true,
            "selections": [
              (v0/*: any*/),
              (v1/*: any*/),
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
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
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "a8b8b8261c4d2ae8764191f163548a17",
    "id": null,
    "metadata": {},
    "name": "DeploymentQuery",
    "operationKind": "query",
    "text": "query DeploymentQuery {\n  deployment {\n    targets {\n      address\n      module\n      name\n      contract {\n        codeId\n        code {\n          checksum\n        }\n        admin\n        label\n      }\n      version\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "03af17d82a8e866e20c1f90143a6c265";

export default node;
