/**
 * @generated SignedSource<<db625a265491c7d46c1348d1cbc5acca>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type WorkflowStatus = "APPROVED" | "PENDING" | "REJECTED" | "%future added value";
export type autoGetWorkflowQuery$variables = {
  id?: string | null | undefined;
  name?: string | null | undefined;
};
export type autoGetWorkflowQuery$data = {
  readonly rujira: {
    readonly auto: {
      readonly workflow: {
        readonly creationTimestamp: any | null | undefined;
        readonly description: string | null | undefined;
        readonly id: string;
        readonly name: string;
        readonly publisher: string | null | undefined;
        readonly status: WorkflowStatus;
      } | null | undefined;
    };
  } | null | undefined;
};
export type autoGetWorkflowQuery = {
  response: autoGetWorkflowQuery$data;
  variables: autoGetWorkflowQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "name"
  }
],
v1 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Rujira",
    "kind": "LinkedField",
    "name": "rujira",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Auto",
        "kind": "LinkedField",
        "name": "auto",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": [
              {
                "kind": "Variable",
                "name": "id",
                "variableName": "id"
              },
              {
                "kind": "Variable",
                "name": "name",
                "variableName": "name"
              }
            ],
            "concreteType": "AutoWorkflow",
            "kind": "LinkedField",
            "name": "workflow",
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
                "name": "name",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "description",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "creationTimestamp",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "publisher",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "status",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "autoGetWorkflowQuery",
    "selections": (v1/*: any*/),
    "type": "RootQueryType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "autoGetWorkflowQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "eca3e5187bcf27a4b6d1b7d31fb15c79",
    "id": null,
    "metadata": {},
    "name": "autoGetWorkflowQuery",
    "operationKind": "query",
    "text": "query autoGetWorkflowQuery(\n  $id: String\n  $name: String\n) {\n  rujira {\n    auto {\n      workflow(id: $id, name: $name) {\n        id\n        name\n        description\n        creationTimestamp\n        publisher\n        status\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "ac104ed8c4fe9e3c866ae2a62b37c349";

export default node;
