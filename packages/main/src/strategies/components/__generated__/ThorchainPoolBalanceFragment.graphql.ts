/**
 * @generated SignedSource<<8cef78ca40f067a84719fafcfc4c1111>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ThorchainPoolBalanceFragment$data = {
  readonly asset: {
    readonly metadata: {
      readonly symbol: string;
    };
    readonly price: {
      readonly current: bigint | null | undefined;
    } | null | undefined;
  };
  readonly assetRedeemValue: bigint;
  readonly id: string;
  readonly runeRedeemValue: bigint;
  readonly units: bigint;
  readonly valueUsd: bigint;
  readonly " $fragmentSpreads": FragmentRefs<"ThorchainPoolBalanceWithDrawFragment">;
  readonly " $fragmentType": "ThorchainPoolBalanceFragment";
};
export type ThorchainPoolBalanceFragment$key = {
  readonly " $data"?: ThorchainPoolBalanceFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ThorchainPoolBalanceFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ThorchainPoolBalanceFragment",
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
      "concreteType": "Asset",
      "kind": "LinkedField",
      "name": "asset",
      "plural": false,
      "selections": [
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
      "kind": "ScalarField",
      "name": "assetRedeemValue",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "runeRedeemValue",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "units",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "valueUsd",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ThorchainPoolBalanceWithDrawFragment"
    }
  ],
  "type": "ThorchainLiquidityProvider",
  "abstractKey": null
};

(node as any).hash = "1717334cf29ccc8c8e03d8b093a90731";

export default node;
