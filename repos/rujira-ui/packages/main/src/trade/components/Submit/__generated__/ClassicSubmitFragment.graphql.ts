/**
 * @generated SignedSource<<9a3ecf53cdbb28e9ac7c2437d4d77a84>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ClassicSubmitFragment$data = {
  readonly address: string;
  readonly assetBase: {
    readonly metadata: {
      readonly symbol: string;
    };
  };
  readonly assetQuote: {
    readonly metadata: {
      readonly symbol: string;
    };
  };
  readonly book: {
    readonly asks: ReadonlyArray<{
      readonly price: bigint;
    }>;
    readonly bids: ReadonlyArray<{
      readonly price: bigint;
    }>;
    readonly center: bigint | null | undefined;
  };
  readonly feeMaker: bigint;
  readonly feeTaker: bigint;
  readonly oracleBase: {
    readonly id: string;
    readonly price: bigint;
  } | null | undefined;
  readonly oracleQuote: {
    readonly id: string;
    readonly price: bigint;
  } | null | undefined;
  readonly tick: bigint;
  readonly " $fragmentSpreads": FragmentRefs<"LimitSubmitFragment" | "MarketSubmitFragment" | "OracleSubmitFragment" | "RecurringSubmitFragment">;
  readonly " $fragmentType": "ClassicSubmitFragment";
};
export type ClassicSubmitFragment$key = {
  readonly " $data"?: ClassicSubmitFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ClassicSubmitFragment">;
};

const node: ReaderFragment = (function(){
var v0 = [
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
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "price",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "id",
    "storageKey": null
  },
  (v1/*: any*/)
],
v3 = [
  (v1/*: any*/)
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ClassicSubmitFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MarketSubmitFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "OracleSubmitFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "LimitSubmitFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "RecurringSubmitFragment"
    },
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
      "name": "tick",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Asset",
      "kind": "LinkedField",
      "name": "assetBase",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Asset",
      "kind": "LinkedField",
      "name": "assetQuote",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ThorchainOracle",
      "kind": "LinkedField",
      "name": "oracleBase",
      "plural": false,
      "selections": (v2/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ThorchainOracle",
      "kind": "LinkedField",
      "name": "oracleQuote",
      "plural": false,
      "selections": (v2/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "FinBook",
      "kind": "LinkedField",
      "name": "book",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "FinBookEntry",
          "kind": "LinkedField",
          "name": "bids",
          "plural": true,
          "selections": (v3/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "center",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "FinBookEntry",
          "kind": "LinkedField",
          "name": "asks",
          "plural": true,
          "selections": (v3/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "feeMaker",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "feeTaker",
      "storageKey": null
    }
  ],
  "type": "FinPair",
  "abstractKey": null
};
})();

(node as any).hash = "bb3e8a6d1ecaf2ec0d0641882f83b4ac";

export default node;
