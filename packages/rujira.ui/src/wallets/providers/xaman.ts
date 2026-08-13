import {
  Address,
  Msg,
  Network,
  Signer,
  Simulation,
  TxResult,
  XRP,
} from "rujira.js";
import { Xumm } from "xumm";
import type { ResolvedFlow } from "xumm-oauth2-pkce";

export type XamanContext = ResolvedFlow;
type XrpPayment = Awaited<ReturnType<Msg["toXrpPayment"]>>;

export interface XrpContext {
  submit(payment: XrpPayment): Promise<string>;
}

export class XamanAdapter implements Signer {
  private xumm?: Xumm;
  private pendingCallbacks: Array<() => void> = [];
  constructor(private apiKey: string) {}

  private getXumm(): Xumm {
    if (!this.xumm) {
      this.xumm = new Xumm(this.apiKey);
      for (const cb of this.pendingCallbacks) {
        this.xumm.on("success", cb);
      }
      this.pendingCallbacks = [];
    }
    return this.xumm;
  }

  async connect(): Promise<Address[]> {
    const x = await this.getXumm().authorize();
    if (x instanceof Error) throw x;
    if (!x) throw new Error(`No account returned`);
    return [{ address: x.me.account, networks: [XRP] }];
  }
  async simulate(msg: Msg): Promise<Simulation> {
    return simulate(msg);
  }
  async signAndBroadcast(_simulation: Simulation, msg: Msg): Promise<TxResult> {
    return signAndBroadcast(this, msg);
  }
  async submit(payment: XrpPayment): Promise<string> {
    const xumm = this.getXumm();
    if (!xumm.payload) throw new Error(`No xumm payload`);
    const { resolved, payload } = await xumm.payload.createAndSubscribe(
      payment,
      (x) => {
        if ("signed" in x.data) return x;
      }
    );

    await resolved;

    if (!payload.meta.signed) throw new Error("User Rejected Transaction");

    switch (payload.response.dispatched_result?.slice(0, 3)) {
      // Success
      case "tes":
        if (!payload.response.txid) throw new Error("No txid returned");
        return payload.response.txid;
      default:
        throw new Error(payload.response.dispatched_result || "Unknown Error");
    }
  }
  isAvailable() {
    return true;
  }
  disconnect() {
    this.xumm?.logout();
  }
  onChange(cb: () => void) {
    if (this.xumm) {
      this.xumm.on("success", cb);
    } else {
      this.pendingCallbacks.push(cb);
    }
  }
  public networks(): Network[] {
    return [XRP];
  }
}

export const simulate = async (msg: Msg): Promise<Simulation> => {
  const inboundAddress = await msg.inboundAddress?.(msg.account.network);
  return {
    symbol: "XRP",
    decimals: 6,
    amount: inboundAddress?.gasRate || 0n,
    gas: inboundAddress?.gasRate || 0n,
  };
};

export const signAndBroadcast = async (
  context: XrpContext,
  msg: Msg
): Promise<TxResult> => {
  const payment = await msg.toXrpPayment();
  return {
    network: XRP,
    address: msg.account.address,
    txHash: await context.submit(payment),
    deposited: msg.toDeposit?.() || null,
  };
};

// Construction wires the SDK to `window.*` so it must be gated for SSR.
const provider: XamanAdapter =
  typeof window === "undefined"
    ? (null as unknown as XamanAdapter)
    : new XamanAdapter(
        // Rujira public API key
        "9ce0c336-4724-47e6-8f35-21ce088226bf"
      );
export default provider;
