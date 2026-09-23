/**
 * @generated SignedSource<<461b79c6502a4e48d1712933ff71764d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type GhostVaultSummaryFragment$data = {
  readonly address: string;
  readonly asset: {
    readonly metadata: {
      readonly symbol: string;
    };
  };
  readonly interest: {
    readonly baseRate: bigint;
    readonly step1: bigint;
    readonly step2: bigint;
    readonly targetUtilization: bigint;
  };
  readonly " $fragmentType": "GhostVaultSummaryFragment";
};
export type GhostVaultSummaryFragment$key = {
  readonly " $data"?: GhostVaultSummaryFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"GhostVaultSummaryFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "GhostVaultSummaryFragment",
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
      "concreteType": "Asset",
      "kind": "LinkedField",
      "name": "asset",
      "plural": false,
      "selections": [
        {
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
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "GhostVaultInterest",
      "kind": "LinkedField",
      "name": "interest",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "baseRate",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "step1",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "step2",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "targetUtilization",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "GhostVault",
  "abstractKey": null
};

(node as any).hash = "79760a9a4556e76f28ef120bfb971f8e";

export default node;
