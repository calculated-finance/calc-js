/**
 * @generated SignedSource<<4627b8c801e99b8447b74e12b4beb89b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ThorchainPoolDepositAccountFragment$data = {
  readonly pendingAsset: bigint;
  readonly pendingRune: bigint;
  readonly " $fragmentType": "ThorchainPoolDepositAccountFragment";
};
export type ThorchainPoolDepositAccountFragment$key = {
  readonly " $data"?: ThorchainPoolDepositAccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ThorchainPoolDepositAccountFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ThorchainPoolDepositAccountFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "pendingAsset",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "pendingRune",
      "storageKey": null
    }
  ],
  "type": "ThorchainLiquidityProvider",
  "abstractKey": null
};

(node as any).hash = "cd912560ee42c47fa1f85ef7c03d904d";

export default node;
