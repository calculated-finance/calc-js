import { Account } from "../accounts";
import { EncodeObject } from "../signers/cosmos/proto-signing";
import { GenericAuthorization } from "../signers/cosmos/types/cosmos/authz/v1beta1/authz";
import { MsgGrant as CosmosMsgGrant } from "../signers/cosmos/types/cosmos/authz/v1beta1/tx";
import { BaseMsg, Msg } from "./msg";

/**
 * MsgAuthzGrant creates an authz grant for GenericAuthorization
 * Allows the grantee to execute messages of the specified type on behalf of the granter
 */
export class MsgAuthzGrant extends BaseMsg implements Msg {
  constructor(
    public account: Account,
    private granter: string,
    private grantee: string,
    private msgTypeUrl: string,
    private expirationSeconds?: number
  ) {
    super();
  }

  async toCosmosTx(): Promise<{ msgs: EncodeObject[]; memo: string }> {
    // Encode the GenericAuthorization
    const authorizationValue = GenericAuthorization.encode({
      msg: this.msgTypeUrl,
    }).finish();

    // Create expiration if provided
    const expiration = this.expirationSeconds
      ? {
          seconds: BigInt(
            Math.floor(Date.now() / 1000) + this.expirationSeconds
          ),
          nanos: 0,
        }
      : undefined;

    return {
      msgs: [
        {
          typeUrl: CosmosMsgGrant.typeUrl,
          value: {
            granter: this.granter,
            grantee: this.grantee,
            grant: {
              authorization: {
                typeUrl: GenericAuthorization.typeUrl,
                value: authorizationValue,
              },
              expiration,
            },
          },
        },
      ],
      memo: "",
    };
  }
}
