/**
 * @generated SignedSource<<7bb95a168fa6c1a6525e115c29ab0674>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type AprStatus = "AVAILABLE" | "NOT_APPLICABLE" | "SOON" | "%future added value";
export type AssetType = "LAYER_1" | "NATIVE" | "SECURED" | "SYNTH" | "%future added value";
export type Chain = "AVAX" | "BASE" | "BCH" | "BSC" | "BTC" | "DOGE" | "ETH" | "GAIA" | "KUJI" | "LTC" | "NOBLE" | "OSMO" | "SOL" | "TERRA" | "TERRA2" | "THOR" | "TON" | "TRON" | "TRON" | "XRP" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type GhostVaultFragment$data = {
  readonly address: string;
  readonly asset: {
    readonly asset: string;
    readonly chain: Chain;
    readonly metadata: {
      readonly decimals: number;
      readonly symbol: string;
    };
    readonly price: {
      readonly current: bigint | null | undefined;
    } | null | undefined;
    readonly type: AssetType;
    readonly variants: {
      readonly native: {
        readonly denom: string;
      } | null | undefined;
    };
    readonly " $fragmentSpreads": FragmentRefs<"msgAssetFragment">;
  };
  readonly id: string;
  readonly vaultStatus: {
    readonly apr: {
      readonly status: AprStatus;
      readonly value: bigint | null | undefined;
    };
    readonly depositPool: {
      readonly size: bigint;
    };
    readonly valueUsd: bigint;
  };
  readonly " $fragmentSpreads": FragmentRefs<"GhostVaultSummaryFragment">;
  readonly " $fragmentType": "GhostVaultFragment";
};
export type GhostVaultFragment$key = {
  readonly " $data"?: GhostVaultFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"GhostVaultFragment">;
};

import GhostVaultQuery_graphql from './GhostVaultQuery.graphql';

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "refetch": {
      "connection": null,
      "fragmentPathInResult": [
        "node"
      ],
      "operation": GhostVaultQuery_graphql,
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "GhostVaultFragment",
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
      "name": "address",
      "storageKey": null
    },
    {
      "alias": "vaultStatus",
      "args": null,
      "concreteType": "GhostVaultStatus",
      "kind": "LinkedField",
      "name": "status",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Apr",
          "kind": "LinkedField",
          "name": "apr",
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
              "name": "value",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "GhostVaultPool",
          "kind": "LinkedField",
          "name": "depositPool",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "size",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "valueUsd",
          "storageKey": null
        }
      ],
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
          "kind": "ScalarField",
          "name": "asset",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "chain",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "type",
          "storageKey": null
        },
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
        {
          "alias": null,
          "args": null,
          "concreteType": "Price",
          "kind": "LinkedField",
          "name": "price",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "current",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "AssetVariants",
          "kind": "LinkedField",
          "name": "variants",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Denom",
              "kind": "LinkedField",
              "name": "native",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "denom",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "msgAssetFragment"
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "GhostVaultSummaryFragment"
    }
  ],
  "type": "GhostVault",
  "abstractKey": null
};

(node as any).hash = "16dbc043c1dfc5eb8941c45625fe0cbb";

export default node;
