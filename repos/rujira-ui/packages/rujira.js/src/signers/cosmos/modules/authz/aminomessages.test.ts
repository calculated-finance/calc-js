import { expect, test } from "vitest";
import { AminoTypes } from "../../amino";
import { GenericAuthorization } from "../../types/cosmos/authz/v1beta1/authz";
import { MsgGrant } from "../../types/cosmos/authz/v1beta1/tx";
import { createAuthzAminoConverters } from "./aminomessages";

test("amino MsgGrant converts GenericAuthorization to nested amino shape", () => {
  const authorization = {
    typeUrl: GenericAuthorization.typeUrl,
    value: GenericAuthorization.encode({
      msg: "/cosmwasm.wasm.v1.MsgExecuteContract",
    }).finish(),
  };

  const object = {
    typeUrl: MsgGrant.typeUrl,
    value: {
      granter: "thor1zcnkhl0md8j2k8jep6tg6m58kptjnf3qzw72f4",
      grantee: "thor15xwa4y4wucma9gmcakjjg7mw36skpuhenhwlh9nkjn8vjguz6xzs8nc8np",
      grant: {
        authorization,
      },
    },
  };

  const aminoTypes = new AminoTypes(createAuthzAminoConverters());
  const amino = aminoTypes.toAmino(object);

  expect(amino).toMatchObject({
    type: "cosmos-sdk/MsgGrant",
    value: {
      granter: object.value.granter,
      grantee: object.value.grantee,
      grant: {
        authorization: {
          type: "cosmos-sdk/GenericAuthorization",
          value: {
            msg: "/cosmwasm.wasm.v1.MsgExecuteContract",
          },
        },
      },
    },
  });
  expect(JSON.stringify(amino)).not.toContain('"0":');
});

test("amino MsgGrant converters roundtrip GenericAuthorization correctly", () => {
  const object = {
    typeUrl: MsgGrant.typeUrl,
    value: {
      granter: "thor1zcnkhl0md8j2k8jep6tg6m58kptjnf3qzw72f4",
      grantee: "thor15xwa4y4wucma9gmcakjjg7mw36skpuhenhwlh9nkjn8vjguz6xzs8nc8np",
      grant: {
        authorization: {
          typeUrl: GenericAuthorization.typeUrl,
          value: GenericAuthorization.encode({
            msg: "/cosmwasm.wasm.v1.MsgExecuteContract",
          }).finish(),
        },
        expiration: {
          seconds: 123n,
          nanos: 456,
        },
      },
    },
  };

  const aminoTypes = new AminoTypes(createAuthzAminoConverters());
  const fromAmino = aminoTypes.fromAmino(aminoTypes.toAmino(object));

  expect(fromAmino).toStrictEqual(object);
});
