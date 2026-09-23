import { expect, test } from "vitest";
import { bigintToFixed } from "./bigint";

test("bigintToFixed works correctly", () => {
  expect(bigintToFixed(12345122334512345n)).toEqual("12345.122334512345");
  expect(bigintToFixed(1278200n)).toEqual("0.000001278200");
});
