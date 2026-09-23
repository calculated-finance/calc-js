/**
 * @generated SignedSource<<7bb5915f368f39faf7bd12b31d68f47a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type AssetType = "LAYER_1" | "NATIVE" | "SECURED" | "SYNTH" | "%future added value";
export type Chain = "AVAX" | "BASE" | "BCH" | "BSC" | "BTC" | "DOGE" | "ETH" | "GAIA" | "KUJI" | "LTC" | "NOBLE" | "OSMO" | "SOL" | "TERRA" | "TERRA2" | "THOR" | "TON" | "TRON" | "TRON" | "XRP" | "%future added value";
export type ThorchainPoolStatus = "AVAILABLE" | "STAGED" | "SUSPENDED" | "UNKNOWN" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type InputDestinationFragment$data = {
  readonly pools: ReadonlyArray<{
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
        readonly secured: {
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
        } | null | undefined;
      };
    };
    readonly assetTorPrice: bigint;
    readonly status: ThorchainPoolStatus;
  }>;
  readonly rune: {
    readonly metadata: {
      readonly decimals: number;
    };
    readonly price: {
      readonly current: bigint | null | undefined;
    } | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "InputDestinationFragment";
};
export type InputDestinationFragment$key = {
  readonly " $data"?: InputDestinationFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"InputDestinationFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
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
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "decimals",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "asset",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v5 = {
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
    (v1/*: any*/)
  ],
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "InputDestinationFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Asset",
      "kind": "LinkedField",
      "name": "rune",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "Metadata",
          "kind": "LinkedField",
          "name": "metadata",
          "plural": false,
          "selections": [
            (v1/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ThorchainPool",
      "kind": "LinkedField",
      "name": "pools",
      "plural": true,
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
          "concreteType": "Asset",
          "kind": "LinkedField",
          "name": "asset",
          "plural": false,
          "selections": [
            (v2/*: any*/),
            (v3/*: any*/),
            (v4/*: any*/),
            (v0/*: any*/),
            (v5/*: any*/),
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
                  "concreteType": "Asset",
                  "kind": "LinkedField",
                  "name": "secured",
                  "plural": false,
                  "selections": [
                    (v4/*: any*/),
                    (v3/*: any*/),
                    (v2/*: any*/),
                    (v5/*: any*/),
                    (v0/*: any*/)
                  ],
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
          "name": "assetTorPrice",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "ThorchainV2",
  "abstractKey": null
};
})();

(node as any).hash = "1126ae85026cdf66b3b07d166281e29e";

export default node;
