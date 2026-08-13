/**
 * @generated SignedSource<<b1a82dc1f8383c1a5a6d3aa4b0bb87b6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AprStatus = "AVAILABLE" | "NOT_APPLICABLE" | "SOON" | "%future added value";
export type StakeOverviewQuery$variables = {
  analyticsFrom: any;
  analyticsPeriod: number;
  analyticsTo: any;
};
export type StakeOverviewQuery$data = {
  readonly staking: {
    readonly pools: ReadonlyArray<{
      readonly analyticsBins: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly bin: any;
            readonly totalBalanceStaked: {
              readonly movingAvg: bigint;
              readonly value: bigint;
            };
            readonly totalRevenue: {
              readonly movingAvg: bigint;
              readonly value: bigint;
            };
          } | null | undefined;
        } | null | undefined> | null | undefined;
      } | null | undefined;
      readonly bondAsset: {
        readonly metadata: {
          readonly decimals: number;
          readonly symbol: string;
        };
        readonly price: {
          readonly current: bigint | null | undefined;
        } | null | undefined;
      };
      readonly id: string;
      readonly stakingStatus: {
        readonly accountBond: bigint;
        readonly liquidBondSize: bigint;
        readonly valueUsd: bigint;
      } | null | undefined;
      readonly stakingSummary: {
        readonly apr: {
          readonly status: AprStatus;
          readonly value: bigint | null | undefined;
        };
      };
    }>;
  };
};
export type StakeOverviewQuery = {
  response: StakeOverviewQuery$data;
  variables: StakeOverviewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "analyticsFrom"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "analyticsPeriod"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "analyticsTo"
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
  "concreteType": "Metadata",
  "kind": "LinkedField",
  "name": "metadata",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "symbol",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "decimals",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "current",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "accountBond",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "liquidBondSize",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "valueUsd",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "value",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "Apr",
  "kind": "LinkedField",
  "name": "apr",
  "plural": false,
  "selections": [
    (v9/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "status",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v11 = [
  (v9/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "movingAvg",
    "storageKey": null
  }
],
v12 = {
  "alias": null,
  "args": [
    {
      "kind": "Literal",
      "name": "first",
      "value": 7
    },
    {
      "kind": "Variable",
      "name": "from",
      "variableName": "analyticsFrom"
    },
    {
      "kind": "Variable",
      "name": "period",
      "variableName": "analyticsPeriod"
    },
    {
      "kind": "Literal",
      "name": "resolution",
      "value": "1D"
    },
    {
      "kind": "Variable",
      "name": "to",
      "variableName": "analyticsTo"
    }
  ],
  "concreteType": "AnalyticsStakingBinsConnection",
  "kind": "LinkedField",
  "name": "analyticsBins",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "AnalyticsStakingBinsEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "AnalyticsStakingBins",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "bin",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "Point",
              "kind": "LinkedField",
              "name": "totalRevenue",
              "plural": false,
              "selections": (v11/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "Point",
              "kind": "LinkedField",
              "name": "totalBalanceStaked",
              "plural": false,
              "selections": (v11/*: any*/),
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
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "StakeOverviewQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Staking",
        "kind": "LinkedField",
        "name": "staking",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "StakingPool",
            "kind": "LinkedField",
            "name": "pools",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "bondAsset",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Price",
                    "kind": "LinkedField",
                    "name": "price",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": "stakingStatus",
                "args": null,
                "concreteType": "StakingStatus",
                "kind": "LinkedField",
                "name": "status",
                "plural": false,
                "selections": [
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": "stakingSummary",
                "args": null,
                "concreteType": "StakingSummary",
                "kind": "LinkedField",
                "name": "summary",
                "plural": false,
                "selections": [
                  (v10/*: any*/)
                ],
                "storageKey": null
              },
              (v12/*: any*/)
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v2/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "StakeOverviewQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Staking",
        "kind": "LinkedField",
        "name": "staking",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "StakingPool",
            "kind": "LinkedField",
            "name": "pools",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "bondAsset",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Price",
                    "kind": "LinkedField",
                    "name": "price",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      (v3/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v3/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": "stakingStatus",
                "args": null,
                "concreteType": "StakingStatus",
                "kind": "LinkedField",
                "name": "status",
                "plural": false,
                "selections": [
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v3/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": "stakingSummary",
                "args": null,
                "concreteType": "StakingSummary",
                "kind": "LinkedField",
                "name": "summary",
                "plural": false,
                "selections": [
                  (v10/*: any*/),
                  (v3/*: any*/)
                ],
                "storageKey": null
              },
              (v12/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "f99a7ec4ea91cc8d004cf2f2068818b1",
    "id": null,
    "metadata": {},
    "name": "StakeOverviewQuery",
    "operationKind": "query",
    "text": "query StakeOverviewQuery(\n  $analyticsFrom: Timestamp!\n  $analyticsTo: Timestamp!\n  $analyticsPeriod: Int!\n) {\n  staking {\n    pools {\n      id\n      bondAsset {\n        metadata {\n          symbol\n          decimals\n        }\n        price {\n          current\n          id\n        }\n        id\n      }\n      stakingStatus: status {\n        accountBond\n        liquidBondSize\n        valueUsd\n        id\n      }\n      stakingSummary: summary {\n        apr {\n          value\n          status\n        }\n        id\n      }\n      analyticsBins(first: 7, from: $analyticsFrom, to: $analyticsTo, resolution: \"1D\", period: $analyticsPeriod) {\n        edges {\n          node {\n            bin\n            totalRevenue {\n              value\n              movingAvg\n            }\n            totalBalanceStaked {\n              value\n              movingAvg\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "565cf7942525b68557bbf47025c15599";

export default node;
