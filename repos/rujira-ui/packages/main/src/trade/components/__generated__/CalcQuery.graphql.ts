/**
 * @generated SignedSource<<d2bb309e1c7e0e1732e52bcbb44bc1fd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CalcQuery$variables = Record<PropertyKey, never>;
export type CalcQuery$data = {
  readonly calc: {
    readonly metadata: {
      readonly baseFeeBps: number;
      readonly manager: string;
      readonly scheduler: string;
    } | null | undefined;
  };
};
export type CalcQuery = {
  response: CalcQuery$data;
  variables: CalcQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Calc",
    "kind": "LinkedField",
    "name": "calc",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "CalcMetadata",
        "kind": "LinkedField",
        "name": "metadata",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "manager",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "scheduler",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "baseFeeBps",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "CalcQuery",
    "selections": (v0/*: any*/),
    "type": "RootQueryType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "CalcQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "94a6093e16a0207ec8792ead549dcc3c",
    "id": null,
    "metadata": {},
    "name": "CalcQuery",
    "operationKind": "query",
    "text": "query CalcQuery {\n  calc {\n    metadata {\n      manager\n      scheduler\n      baseFeeBps\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "ff0fa668f33724c5336d40de5355ec0a";

export default node;
