import { describe, expect, it } from "vitest";
import { fieldErrors } from "../src/lib/validation";

describe("fieldErrors", () => {
  it("keys messages by dot-joined path", () => {
    const errors = fieldErrors([{ message: "too big", path: ["swap", "adjustment", "scalar"] }]);
    expect(errors).toEqual({ "swap.adjustment.scalar": "too big" });
  });

  it("unwraps object path segments", () => {
    const errors = fieldErrors([{ message: "bad", path: [{ key: "swap" }, { key: "routes" }, 0] }]);
    expect(errors).toEqual({ "swap.routes.0": "bad" });
  });

  it("skips issues without a path", () => {
    expect(fieldErrors([{ message: "root-level" }])).toEqual({});
    expect(fieldErrors([{ message: "empty", path: [] }])).toEqual({});
  });

  it("keeps the first message per field when duplicated", () => {
    const errors = fieldErrors([
      { message: "first", path: ["label"] },
      { message: "second", path: ["label"] },
    ]);
    expect(errors).toEqual({ label: "first" });
  });

  it("returns an empty map for undefined issues", () => {
    expect(fieldErrors(undefined)).toEqual({});
  });
});
