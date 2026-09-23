import { describe, expect, it } from "vitest";
import { isUserRejection } from "../src/lib/wallet-errors";

describe("isUserRejection", () => {
  it("matches EIP-1193 code 4001", () => {
    expect(isUserRejection({ code: 4001, message: "MetaMask Tx Signature: User denied transaction signature." })).toBe(
      true,
    );
  });

  it("matches ethers ACTION_REJECTED", () => {
    expect(isUserRejection({ code: "ACTION_REJECTED", message: "user rejected transaction" })).toBe(true);
  });

  it("matches WalletConnect v2 codes", () => {
    expect(isUserRejection({ code: 5000, message: "" })).toBe(true);
    expect(isUserRejection({ code: 5002, message: "" })).toBe(true);
  });

  it("matches wallet decline messages", () => {
    for (const message of [
      "User rejected the request.",
      "Request rejected",
      "User cancelled the request",
      "User canceled the request",
      "Transaction was rejected by user",
      "User disapproved requested chains",
      "An error has occurred", // Keplr's decline, as observed
    ]) {
      expect(isUserRejection(new Error(message)), message).toBe(true);
    }
  });

  it("walks the cause chain of wrapped errors", () => {
    const inner = Object.assign(new Error("boom"), { code: 4001 });
    const wrapped = new Error("TransactionSubmissionFailed", { cause: new Error("failed", { cause: inner }) });
    expect(isUserRejection(wrapped)).toBe(true);
  });

  it("does not match genuine failures", () => {
    expect(isUserRejection(new Error("insufficient funds for fees"))).toBe(false);
    expect(isUserRejection({ code: -32603, message: "Internal JSON-RPC error." })).toBe(false);
    expect(isUserRejection(new Error("out of gas in location: wasm contract"))).toBe(false);
  });
});
