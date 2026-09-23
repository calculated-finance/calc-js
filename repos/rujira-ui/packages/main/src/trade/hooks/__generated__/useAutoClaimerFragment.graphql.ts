/**
 * @generated SignedSource<<bb742d84f3e392610434f673e6b27b99>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type ExecutionType = "ONESHOT" | "RECURRENT" | "SCHEDULED" | "%future added value";
export type InstanceState = "CANCELED" | "FINISHED" | "PAUSED" | "RUNNING" | "%future added value";
export type LastRunState = "CANCELED" | "COMPLETED" | "FAILED" | "RUNNING" | "TERMINATED" | "%future added value";
export type ScheduleStatus = "CANCELED" | "COMPLETED" | "PAUSED" | "RUNNING" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type useAutoClaimerFragment$data = {
  readonly address: string;
  readonly auto: {
    readonly workflows: {
      readonly __id: string;
      readonly edges: ReadonlyArray<{
        readonly cursor: string | null | undefined;
        readonly node: {
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
  readonly " $fragmentType": "useAutoClaimerFragment";
};
export type useAutoClaimerFragment$key = {
  readonly " $data"?: useAutoClaimerFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"useAutoClaimerFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": null,
        "cursor": null,
        "direction": "forward",
        "path": [
          "auto",
          "workflows"
        ]
      }
    ]
  },
  "name": "useAutoClaimerFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "address",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "AutoAccount",
      "kind": "LinkedField",
      "name": "auto",
      "plural": false,
      "selections": [
        {
          "alias": "workflows",
          "args": [
            {
              "kind": "Literal",
              "name": "states",
              "value": [
                "RUNNING"
              ]
            }
          ],
          "concreteType": "AutoWorkflowInstanceConnection",
          "kind": "LinkedField",
          "name": "__useAutoClaimerFragment_workflows_connection",
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
                    (v0/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "instanceId",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "workflowId",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "requester",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "executionType",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "cronExpression",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "onchainParameters",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "offchainParameters",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "expirationDate",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "launcherId",
                      "storageKey": null
                    },
                    (v1/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "AutoWorkflow",
                      "kind": "LinkedField",
                      "name": "workflow",
                      "plural": false,
                      "selections": [
                        (v0/*: any*/),
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
                    {
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
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "AutoWorkflowRun",
                      "kind": "LinkedField",
                      "name": "lastRun",
                      "plural": false,
                      "selections": [
                        (v1/*: any*/),
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
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "__typename",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "cursor",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
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
            },
            {
              "kind": "ClientExtension",
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "__id",
                  "storageKey": null
                }
              ]
            }
          ],
          "storageKey": "__useAutoClaimerFragment_workflows_connection(states:[\"RUNNING\"])"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};
})();

(node as any).hash = "61d33506d0bbb34aa5d79bd8383eeaae";

export default node;
