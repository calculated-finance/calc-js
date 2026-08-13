import { AminoMsg } from "../../amino";
import { AminoConverters } from "../../amino/types";
import { GenericAuthorization } from "../../types/cosmos/authz/v1beta1/authz";
import { MsgGrant, MsgRevoke } from "../../types/cosmos/authz/v1beta1/tx";

export interface AminoGenericAuthorization {
  readonly type: "cosmos-sdk/GenericAuthorization";
  readonly value: {
    readonly msg: string;
  };
}

type AminoAuthorization = AminoGenericAuthorization;

export interface AminoMsgGrant extends AminoMsg {
  readonly type: "cosmos-sdk/MsgGrant";
  readonly value: {
    readonly granter: string;
    readonly grantee: string;
    readonly grant: {
      readonly authorization: AminoAuthorization;
      readonly expiration?: {
        readonly seconds: string;
        readonly nanos: number;
      };
    };
  };
}

export function isAminoMsgGrant(msg: AminoMsg): msg is AminoMsgGrant {
  return msg.type === "cosmos-sdk/MsgGrant";
}

export interface AminoMsgRevoke extends AminoMsg {
  readonly type: "cosmos-sdk/MsgRevoke";
  readonly value: {
    readonly granter: string;
    readonly grantee: string;
    readonly msg_type_url: string;
  };
}

export function isAminoMsgRevoke(msg: AminoMsg): msg is AminoMsgRevoke {
  return msg.type === "cosmos-sdk/MsgRevoke";
}

function toAminoAuthorization(
  authorization: MsgGrant["grant"]["authorization"] | undefined
): AminoAuthorization {
  if (!authorization) {
    throw new Error("Missing authz authorization for MsgGrant Amino conversion");
  }

  switch (authorization.typeUrl) {
    case GenericAuthorization.typeUrl: {
      const decoded = GenericAuthorization.decode(authorization.value);
      return {
        type: "cosmos-sdk/GenericAuthorization",
        value: {
          msg: decoded.msg,
        },
      };
    }
    default:
      throw new Error(
        `Unsupported authz authorization type for Amino conversion: ${authorization.typeUrl}`
      );
  }
}

function fromAminoAuthorization(
  authorization: AminoAuthorization
): NonNullable<MsgGrant["grant"]>["authorization"] {
  switch (authorization.type) {
    case "cosmos-sdk/GenericAuthorization":
      return {
        typeUrl: GenericAuthorization.typeUrl,
        value: GenericAuthorization.encode({
          msg: authorization.value.msg,
        }).finish(),
      };
    default:
      throw new Error(
        `Unsupported authz Amino authorization type: ${(authorization as { type: string }).type}`
      );
  }
}

export function createAuthzAminoConverters(): AminoConverters {
  return {
    "/cosmos.authz.v1beta1.MsgGrant": {
      aminoType: "cosmos-sdk/MsgGrant",
      toAmino: ({
        granter,
        grantee,
        grant,
      }: MsgGrant): AminoMsgGrant["value"] => ({
        granter,
        grantee,
        grant: {
          authorization: toAminoAuthorization(grant?.authorization),
          expiration: grant?.expiration
            ? {
                seconds: grant.expiration.seconds.toString(),
                nanos: grant.expiration.nanos,
              }
            : undefined,
        },
      }),
      fromAmino: ({
        granter,
        grantee,
        grant,
      }: AminoMsgGrant["value"]): MsgGrant => ({
        granter,
        grantee,
        grant: {
          authorization: fromAminoAuthorization(grant.authorization),
          expiration: grant.expiration
            ? {
                seconds: BigInt(grant.expiration.seconds),
                nanos: grant.expiration.nanos,
              }
            : undefined,
        },
      }),
    },
    "/cosmos.authz.v1beta1.MsgRevoke": {
      aminoType: "cosmos-sdk/MsgRevoke",
      toAmino: ({
        granter,
        grantee,
        msgTypeUrl,
      }: MsgRevoke): AminoMsgRevoke["value"] => ({
        granter,
        grantee,
        msg_type_url: msgTypeUrl,
      }),
      fromAmino: ({
        granter,
        grantee,
        msg_type_url,
      }: AminoMsgRevoke["value"]): MsgRevoke => ({
        granter,
        grantee,
        msgTypeUrl: msg_type_url,
      }),
    },
  };
}

