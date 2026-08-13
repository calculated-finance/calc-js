/**
 * @generated SignedSource<<6448b1f0594fa6e838bbce558f36ca51>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type LeagueLeaderboardSortBy = "POINTS" | "RANK" | "RANK_PREVIOUS" | "TOTAL_TX" | "%future added value";
export type SortDir = "ASC" | "DESC" | "%future added value";
export type LeaderboardLeaderboardQuery$variables = {
  search?: string | null | undefined;
  sortBy: LeagueLeaderboardSortBy;
  sortDir: SortDir;
};
export type LeaderboardLeaderboardQuery$data = {
  readonly league: ReadonlyArray<{
    readonly leaderboard: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly address: string;
          readonly " $fragmentSpreads": FragmentRefs<"LeaderboardItemFragment">;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
  }>;
};
export type LeaderboardLeaderboardQuery = {
  response: LeaderboardLeaderboardQuery$data;
  variables: LeaderboardLeaderboardQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "search"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "sortBy"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "sortDir"
  }
],
v1 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 50
  },
  {
    "kind": "Variable",
    "name": "search",
    "variableName": "search"
  },
  {
    "kind": "Variable",
    "name": "sortBy",
    "variableName": "sortBy"
  },
  {
    "kind": "Variable",
    "name": "sortDir",
    "variableName": "sortDir"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "address",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "LeaderboardLeaderboardQuery",
    "selections": [
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
            "args": (v1/*: any*/),
            "concreteType": "LeagueLeaderboardEntryConnection",
            "kind": "LinkedField",
            "name": "leaderboard",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "LeagueLeaderboardEntryEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "LeagueLeaderboardEntry",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      {
                        "args": null,
                        "kind": "FragmentSpread",
                        "name": "LeaderboardItemFragment"
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
    "name": "LeaderboardLeaderboardQuery",
    "selections": [
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
            "args": (v1/*: any*/),
            "concreteType": "LeagueLeaderboardEntryConnection",
            "kind": "LinkedField",
            "name": "leaderboard",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "LeagueLeaderboardEntryEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "LeagueLeaderboardEntry",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "points",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "rank",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "rankPrevious",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "totalTx",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "badges",
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
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "5490c2bf47efc92decece5d7fb93405a",
    "id": null,
    "metadata": {},
    "name": "LeaderboardLeaderboardQuery",
    "operationKind": "query",
    "text": "query LeaderboardLeaderboardQuery(\n  $search: String\n  $sortBy: LeagueLeaderboardSortBy!\n  $sortDir: SortDir!\n) {\n  league {\n    leaderboard(first: 50, search: $search, sortBy: $sortBy, sortDir: $sortDir) {\n      edges {\n        node {\n          address\n          ...LeaderboardItemFragment\n        }\n      }\n    }\n  }\n}\n\nfragment LeaderboardItemFragment on LeagueLeaderboardEntry {\n  address\n  points\n  rank\n  rankPrevious\n  totalTx\n  badges\n}\n"
  }
};
})();

(node as any).hash = "5077d0b377fc46a0f49f145b1abbd1ad";

export default node;
