/**
 * @generated SignedSource<<13a529ec39f7a54e0837dee6dda4d405>>
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
export type useAutoClaimerCreatedSubscription$variables = {
  connection: string;
  owner: string;
};
export type useAutoClaimerCreatedSubscription$data = {
  readonly autoInstanceCreated: {
    readonly cursor: string | null | undefined;
    readonly node: {
      readonly cronExpression?: string | null | undefined;
      readonly executionType?: ExecutionType;
      readonly expirationDate?: any | null | undefined;
      readonly id?: string;
      readonly instanceId?: string;
      readonly lastRun?: {
        readonly endTime: any;
        readonly startTime: any;
        readonly state: LastRunState;
      } | null | undefined;
      readonly launcherId?: string | null | undefined;
      readonly offchainParameters?: any;
      readonly onchainParameters?: any;
      readonly requester?: string;
      readonly schedule?: {
        readonly nextExecutionTimes: ReadonlyArray<any> | null | undefined;
        readonly runningWorkflows: any | null | undefined;
        readonly status: ScheduleStatus;
      } | null | undefined;
      readonly state?: InstanceState;
      readonly workflow?: {
        readonly id: string;
        readonly name: string;
      };
      readonly workflowId?: string;
    } | null | undefined;
  } | null | undefined;
};
export type useAutoClaimerCreatedSubscription = {
  response: useAutoClaimerCreatedSubscription$data;
  variables: useAutoClaimerCreatedSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connection"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "owner"
},
v2 = [
  {
    "kind": "Variable",
    "name": "owner",
    "variableName": "owner"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "instanceId",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "workflowId",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "requester",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "executionType",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cronExpression",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "onchainParameters",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "offchainParameters",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "expirationDate",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "launcherId",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "concreteType": "AutoWorkflow",
  "kind": "LinkedField",
  "name": "workflow",
  "plural": false,
  "selections": [
    (v4/*: any*/),
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
v16 = {
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
v17 = {
  "alias": null,
  "args": null,
  "concreteType": "AutoWorkflowRun",
  "kind": "LinkedField",
  "name": "lastRun",
  "plural": false,
  "selections": [
    (v14/*: any*/),
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
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "useAutoClaimerCreatedSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "NodeEdge",
        "kind": "LinkedField",
        "name": "autoInstanceCreated",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              {
                "kind": "InlineFragment",
                "selections": [
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v15/*: any*/),
                  (v16/*: any*/),
                  (v17/*: any*/)
                ],
                "type": "AutoWorkflowInstance",
                "abstractKey": null
              }
            ],
            "storageKey": null
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
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "useAutoClaimerCreatedSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "NodeEdge",
        "kind": "LinkedField",
        "name": "autoInstanceCreated",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
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
              (v4/*: any*/),
              {
                "kind": "InlineFragment",
                "selections": [
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v15/*: any*/),
                  (v16/*: any*/),
                  (v17/*: any*/)
                ],
                "type": "AutoWorkflowInstance",
                "abstractKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v2/*: any*/),
        "filters": null,
        "handle": "appendEdge",
        "key": "",
        "kind": "LinkedHandle",
        "name": "autoInstanceCreated",
        "handleArgs": [
          {
            "items": [
              {
                "kind": "Variable",
                "name": "connections.0",
                "variableName": "connection"
              }
            ],
            "kind": "ListValue",
            "name": "connections"
          }
        ]
      }
    ]
  },
  "params": {
    "cacheID": "ddebe5367b024b4b7a7041d3c1f54453",
    "id": null,
    "metadata": {},
    "name": "useAutoClaimerCreatedSubscription",
    "operationKind": "subscription",
    "text": "subscription useAutoClaimerCreatedSubscription(\n  $owner: Address!\n) {\n  autoInstanceCreated(owner: $owner) {\n    cursor\n    node {\n      __typename\n      ... on AutoWorkflowInstance {\n        id\n        instanceId\n        workflowId\n        requester\n        executionType\n        cronExpression\n        onchainParameters\n        offchainParameters\n        expirationDate\n        launcherId\n        state\n        workflow {\n          id\n          name\n        }\n        schedule {\n          status\n          nextExecutionTimes\n          runningWorkflows\n        }\n        lastRun {\n          state\n          startTime\n          endTime\n        }\n      }\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "9a752cd031d151d2b5e670fbcd366047";

export default node;
