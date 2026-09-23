/**
 * @generated SignedSource<<fd8ea606116d04d8e54c213d6f4a9374>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OraclePriceFragment$data = {
  readonly current: bigint;
  readonly id: string;
  readonly " $fragmentType": "OraclePriceFragment";
};
export type OraclePriceFragment$key = {
  readonly " $data"?: OraclePriceFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OraclePriceFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OraclePriceFragment",
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
      "name": "current",
      "storageKey": null
    }
  ],
  "type": "ThorchainOraclePrice",
  "abstractKey": null
};

(node as any).hash = "fe8e6da6661598fb53d5bd2f588c563e";

export default node;
