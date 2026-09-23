import { Msg } from "./msgs";

export class InsufficientAllowanceError extends Error {
  constructor(
    public spender: string,
    public current: bigint,
    public required: bigint,
    public asset: { contract: string; decimals: number; symbol: string }
  ) {
    super();
  }
}

export class TxError extends Error {
  constructor(
    public msg: Msg,
    public error: string | Error,
    public type: "simulation" | "signAndBroadcast"
  ) {
    super();
  }
}

export const translateError = (message: string): string => {
  if (
    message.includes("failed to simulate swap") &&
    message.includes("fail to add outbound tx") &&
    message.includes("not enough asset to pay for fees")
  ) {
    return "Insufficient asset returned to pay for outbound fee";
  }

  if (
    message.includes("prepare outbound tx not successful") &&
    message.includes("not enough asset to pay for fees")
  )
    return "Insufficient withdrawal to pay for outbound fee";

  if (
    message.includes("failed to simulate swap: failed to simulate handler") &&
    message.includes("insufficient funds")
  )
    return "Invalid swap";

  if (
    message.includes("spendable balance") &&
    message.includes("is smaller than") &&
    message.includes("insufficient funds")
  ) {
    return "Insufficient funds. Do you have enough RUNE for gas?";
  }

  if (message.includes("swap Source and Target cannot be the same"))
    return "Source and Target cannot be the same";

  if (message.includes("user rejected action")) return "Transaction Cancelled";

  if (message.includes("insufficient funds")) return "Insufficient Funds";

  if (message.includes(`Invalid \\\"to\\\" address.`))
    return `Invalid \"to\" address`;

  if (message.includes("account sequence mismatch"))
    return "Pending Transaction. Try again shortly";

  if (message.includes("outbound amount does not meet requirements")) {
    return "Insufficient return amount";
  }

  if (message.includes("failed to simulate swap: emit asset")) {
    return "Slippage tolerance exceeded";
  }
  if (message.includes("amount cannot be zero")) return "Amount cannot be zero";
  if (message.includes("Invalid Tick Size")) return "Invalid Price";

  // RUJI INDEX
  if (message.includes("Swap contract not found"))
    return "Missing Configuration in Entry Adapter";
  if (/Insufficient ?Return expected/.test(message)) {
    return "Insufficient on-chain liquidity for one of the underlying assets. Try increasing the slippage tolerance.";
  }

  if (message.includes("Account Unsafe")) {
    return `Unsafe LTV: ${message.match(/ltv\s([0-9\.]+)/)?.at(1)}`;
  }

  const evmErr = message.match(/execution reverted: "([^"]+)"/);
  if (evmErr) return evmErr[0];

  const minAmountInErr = message.match(/recommended_min_amount_in: ([0-9]+)/);
  if (minAmountInErr)
    return `Amount less than min swap amount. Minimum ${(Number(minAmountInErr[1] || 0) / 1e8).toLocaleString()}`;

  return message;
};
