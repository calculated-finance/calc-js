/**
 * @generated SignedSource<<93a7b748e7195ceda51cf117a44c4f47>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type LeaderboardQuery$variables = Record<PropertyKey, never>;
export type LeaderboardQuery$data = {
  readonly league: ReadonlyArray<{
    readonly league: string;
    readonly season: number;
    readonly stats: {
      readonly participants: number;
      readonly totalPoints: bigint;
    };
  }>;
};
export type LeaderboardQuery = {
  response: LeaderboardQuery$data;
  variables: LeaderboardQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "League",
    "kind": "LinkedField",
    "name": "league",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "league",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "season",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "LeagueStats",
        "kind": "LinkedField",
        "name": "stats",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "totalPoints",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "participants",
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "LeaderboardQuery",
    "selections": (v0/*: any*/),
    "type": "RootQueryType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "LeaderboardQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "0fc44533c6c345a59848d56fa8deef61",
    "id": null,
    "metadata": {},
    "name": "LeaderboardQuery",
    "operationKind": "query",
    "text": "query LeaderboardQuery {\n  league {\n    league\n    season\n    stats {\n      totalPoints\n      participants\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "82eaaf9784afd6f295ecc39742e9b415";

export default node;
