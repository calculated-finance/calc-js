/**
 * @generated SignedSource<<0a7474c9b73b233b1b468a19c6c5e287>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type LeaderboardItemFragment$data = {
  readonly address: string;
  readonly badges: ReadonlyArray<string> | null | undefined;
  readonly points: bigint;
  readonly rank: number;
  readonly rankPrevious: number | null | undefined;
  readonly totalTx: number;
  readonly " $fragmentType": "LeaderboardItemFragment";
};
export type LeaderboardItemFragment$key = {
  readonly " $data"?: LeaderboardItemFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"LeaderboardItemFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "LeaderboardItemFragment",
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
  "type": "LeagueLeaderboardEntry",
  "abstractKey": null
};

(node as any).hash = "c36dc49a6b8524c2747a5cd68b5165c7";

export default node;
