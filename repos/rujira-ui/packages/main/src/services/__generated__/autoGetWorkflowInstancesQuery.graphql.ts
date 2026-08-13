/**
 * @generated SignedSource<<62158c4f4115dad902a326bbfb901e57>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ExecutionType = "ONESHOT" | "RECURRENT" | "SCHEDULED" | "%future added value";
export type InstanceState = "CANCELED" | "FINISHED" | "PAUSED" | "RUNNING" | "%future added value";
export type LastRunState = "CANCELED" | "COMPLETED" | "FAILED" | "RUNNING" | "TERMINATED" | "%future added value";
export type ScheduleStatus = "CANCELED" | "COMPLETED" | "PAUSED" | "RUNNING" | "%future added value";
export type autoGetWorkflowInstancesQuery$variables = {
  after?: string | null | undefined;
  before?: string | null | undefined;
  first?: number | null | undefined;
  id: string;
  last?: number | null | undefined;
  launcherId?: string | null | undefined;
  pageNumber?: number | null | undefined;
  states?: ReadonlyArray<string> | null | undefined;
  workflowId?: string | null | undefined;
};
export type autoGetWorkflowInstancesQuery$data = {
  readonly node: {
    readonly auto?: {
      readonly workflows: {
        readonly edges: ReadonlyArray<{
          readonly cursor: string | null | undefined;
          readonly node: {
            readonly cronExpression: string | null | undefined;
            readonly executionType: ExecutionType;
            readonly expirationDate: any | null | undefined;
            readonly instanceId: string;
            readonly lastRun: {
              readonly endTime: any;
              readonly startTime: any;
              readonly state: LastRunState;
            } | null | undefined;
            readonly launcherId: string | null | undefined;
            readonly offchainParameters: any;
            readonly onchainParameters: any;
            readonly requester: string;
            readonly schedule: {
              readonly nextExecutionTimes: ReadonlyArray<any> | null | undefined;
              readonly runningWorkflows: any | null | undefined;
              readonly status: ScheduleStatus;
            } | null | undefined;
            readonly state: InstanceState;
            readonly workflow: {
              readonly id: string;
              readonly name: string;
            };
            readonly workflowId: string;
          } | null | undefined;
        } | null | undefined> | null | undefined;
        readonly pageInfo: {
          readonly endCursor: string | null | undefined;
          readonly hasNextPage: boolean;
          readonly hasPreviousPage: boolean;
          readonly startCursor: string | null | undefined;
        };
      };
    } | null | undefined;
  } | null | undefined;
};
export type autoGetWorkflowInstancesQuery = {
  response: autoGetWorkflowInstancesQuery$data;
  variables: autoGetWorkflowInstancesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "after"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "before"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "first"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "last"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "launcherId"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "pageNumber"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "states"
},
v8 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "workflowId"
},
v9 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v10 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "after"
  },
  {
    "kind": "Variable",
    "name": "before",
    "variableName": "before"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "first"
  },
  {
    "kind": "Variable",
    "name": "last",
    "variableName": "last"
  },
  {
    "kind": "Variable",
    "name": "launcherId",
    "variableName": "launcherId"
  },
  {
    "kind": "Variable",
    "name": "pageNumber",
    "variableName": "pageNumber"
  },
  {
    "kind": "Variable",
    "name": "states",
    "variableName": "states"
  },
  {
    "kind": "Variable",
    "name": "workflowId",
    "variableName": "workflowId"
  }
],
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "instanceId",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "workflowId",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "requester",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "executionType",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cronExpression",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "onchainParameters",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "offchainParameters",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "expirationDate",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "launcherId",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "concreteType": "AutoWorkflow",
  "kind": "LinkedField",
  "name": "workflow",
  "plural": false,
  "selections": [
    (v20/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "concreteType": "AutoWorkflowSchedule",
  "kind": "LinkedField",
  "name": "schedule",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "status",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "nextExecutionTimes",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "runningWorkflows",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "concreteType": "AutoWorkflowRun",
  "kind": "LinkedField",
  "name": "lastRun",
  "plural": false,
  "selections": [
    (v23/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "startTime",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "endTime",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v26 = {
  "alias": null,
  "args": null,
  "concreteType": "PageInfo",
  "kind": "LinkedField",
  "name": "pageInfo",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasNextPage",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasPreviousPage",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "startCursor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "endCursor",
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v8/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "autoGetWorkflowInstancesQuery",
    "selections": [
      {
        "alias": null,
        "args": (v9/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
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
                    "args": (v10/*: any*/),
                    "concreteType": "AutoWorkflowInstanceConnection",
                    "kind": "LinkedField",
                    "name": "workflows",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AutoWorkflowInstanceEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "AutoWorkflowInstance",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v11/*: any*/),
                              (v12/*: any*/),
                              (v13/*: any*/),
                              (v14/*: any*/),
                              (v15/*: any*/),
                              (v16/*: any*/),
                              (v17/*: any*/),
                              (v18/*: any*/),
                              (v19/*: any*/),
                              (v21/*: any*/),
                              (v22/*: any*/),
                              (v24/*: any*/),
                              (v23/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v25/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v26/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "Account",
            "abstractKey": null
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
    "argumentDefinitions": [
      (v3/*: any*/),
      (v8/*: any*/),
      (v5/*: any*/),
      (v7/*: any*/),
      (v0/*: any*/),
      (v2/*: any*/),
      (v1/*: any*/),
      (v4/*: any*/),
      (v6/*: any*/)
    ],
    "kind": "Operation",
    "name": "autoGetWorkflowInstancesQuery",
    "selections": [
      {
        "alias": null,
        "args": (v9/*: any*/),
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
          {
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
                    "args": (v10/*: any*/),
                    "concreteType": "AutoWorkflowInstanceConnection",
                    "kind": "LinkedField",
                    "name": "workflows",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AutoWorkflowInstanceEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "AutoWorkflowInstance",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v11/*: any*/),
                              (v12/*: any*/),
                              (v13/*: any*/),
                              (v14/*: any*/),
                              (v15/*: any*/),
                              (v16/*: any*/),
                              (v17/*: any*/),
                              (v18/*: any*/),
                              (v19/*: any*/),
                              (v21/*: any*/),
                              (v22/*: any*/),
                              (v24/*: any*/),
                              (v23/*: any*/),
                              (v20/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v25/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v26/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "Account",
            "abstractKey": null
          },
          (v20/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "03b2ce91e019105098004c12aa042636",
    "id": null,
    "metadata": {},
    "name": "autoGetWorkflowInstancesQuery",
    "operationKind": "query",
    "text": "query autoGetWorkflowInstancesQuery(\n  $id: ID!\n  $workflowId: String\n  $launcherId: String\n  $states: [String!]\n  $after: String\n  $first: Int\n  $before: String\n  $last: Int\n  $pageNumber: Int\n) {\n  node(id: $id) {\n    __typename\n    ... on Account {\n      auto {\n        workflows(workflowId: $workflowId, launcherId: $launcherId, states: $states, after: $after, first: $first, before: $before, last: $last, pageNumber: $pageNumber) {\n          edges {\n            node {\n              instanceId\n              workflowId\n              requester\n              executionType\n              cronExpression\n              onchainParameters\n              offchainParameters\n              expirationDate\n              launcherId\n              workflow {\n                id\n                name\n              }\n              schedule {\n                status\n                nextExecutionTimes\n                runningWorkflows\n              }\n              lastRun {\n                state\n                startTime\n                endTime\n              }\n              state\n              id\n            }\n            cursor\n          }\n          pageInfo {\n            hasNextPage\n            hasPreviousPage\n            startCursor\n            endCursor\n          }\n        }\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "f971643288acbac73424c6dc6ee29462";

export default node;
