/**
 * @generated SignedSource<<484a83226e398dbbac9a4fee4b6b54ab>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type GhostVaultAccountFragment$data = {
  readonly address: string;
  readonly strategies: ReadonlyArray<{
    readonly id?: string;
    readonly " $fragmentSpreads": FragmentRefs<"GhostVaultBalanceFragment">;
  }>;
  readonly " $fragmentType": "GhostVaultAccountFragment";
};
export type GhostVaultAccountFragment$key = {
  readonly " $data"?: GhostVaultAccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"GhostVaultAccountFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "GhostVaultAccountFragment",
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
      "concreteType": null,
      "kind": "LinkedField",
      "name": "strategies",
      "plural": true,
      "selections": [
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "id",
              "storageKey": null
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "GhostVaultBalanceFragment"
            }
          ],
          "type": "GhostVaultAccount",
          "abstractKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "a7f78221f1b24877c9f4ecd36ecfd482";

export default node;
