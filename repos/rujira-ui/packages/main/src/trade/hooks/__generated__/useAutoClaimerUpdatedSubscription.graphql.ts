/**
 * @generated SignedSource<<bb67606e698c6e162a478d06fab62b97>>
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
export type useAutoClaimerUpdatedSubscription$variables = {
  id: string;
};
export type useAutoClaimerUpdatedSubscription$data = {
  readonly node: {
    readonly __typename: "AutoWorkflowInstance";
    readonly cronExpression: string | null | undefined;
    readonly executionType: ExecutionType;
    readonly expirationDate: any | null | undefined;
    readonly id: string;
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
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  } | null | undefined;
};
export type useAutoClaimerUpdatedSubscription = {
  response: useAutoClaimerUpdatedSubscription$data;
  variables: useAutoClaimerUpdatedSubscription$variables;
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "instanceId",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "workflowId",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "requester",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "executionType",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cronExpression",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "onchainParameters",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "offchainParameters",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "expirationDate",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "launcherId",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "concreteType": "AutoWorkflow",
  "kind": "LinkedField",
  "name": "workflow",
  "plural": false,
  "selections": [
    (v3/*: any*/),
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
v15 = {
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
v16 = {
  "alias": null,
  "args": null,
  "concreteType": "AutoWorkflowRun",
  "kind": "LinkedField",
  "name": "lastRun",
  "plural": false,
  "selections": [
    (v13/*: any*/),
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "useAutoClaimerUpdatedSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
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
              (v16/*: any*/)
            ],
            "type": "AutoWorkflowInstance",
            "abstractKey": null
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useAutoClaimerUpdatedSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
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
              (v16/*: any*/)
            ],
            "type": "AutoWorkflowInstance",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "10044334090f572ec7c660f451e999f5",
    "id": null,
    "metadata": {},
    "name": "useAutoClaimerUpdatedSubscription",
    "operationKind": "subscription",
    "text": "subscription useAutoClaimerUpdatedSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on AutoWorkflowInstance {\n      id\n      instanceId\n      workflowId\n      requester\n      executionType\n      cronExpression\n      onchainParameters\n      offchainParameters\n      expirationDate\n      launcherId\n      state\n      workflow {\n        id\n        name\n      }\n      schedule {\n        status\n        nextExecutionTimes\n        runningWorkflows\n      }\n      lastRun {\n        state\n        startTime\n        endTime\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "3b26142af30f972a1d930c3bf8b662f6";

export default node;
