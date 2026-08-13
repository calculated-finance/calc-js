import { expect, test } from "vitest";
import { fiatize, toFiatAmount, toFiatDisplay } from "./fiat";

// $1.00 in 1e12 price scale; 1 unit in 8-decimal amount scale → fiat = $1.00
const PRICE_1 = 1_000_000_000_000n;
const AMOUNT_1 = 100_000_000n;

test("fiatize returns label when assets array is empty", () => {
  expect(fiatize("Buy", [])).toEqual("Buy");
});

test("fiatize returns label when all prices are null", () => {
  expect(fiatize("Buy", [{ price: null, amount: AMOUNT_1 }])).toEqual("Buy");
});

test("fiatize returns label when all prices are undefined", () => {
  expect(fiatize("Buy", [{ price: undefined, amount: AMOUNT_1 }])).toEqual(
    "Buy"
  );
});

test("fiatize returns label when amount is zero", () => {
  expect(fiatize("Buy", [{ price: PRICE_1, amount: 0n }])).toEqual("Buy");
});

test("fiatize returns label when price is zero", () => {
  expect(fiatize("Buy", [{ price: 0n, amount: AMOUNT_1 }])).toEqual("Buy");
});

test("fiatize appends formatted fiat for a single positive asset", () => {
  expect(fiatize("Buy", [{ price: PRICE_1, amount: AMOUNT_1 }])).toEqual(
    "Buy ($1.00)"
  );
});

test("fiatize sums multiple assets", () => {
  expect(
    fiatize("Buy", [
      { price: PRICE_1, amount: AMOUNT_1 },
      { price: PRICE_1, amount: AMOUNT_1 },
    ])
  ).toEqual("Buy ($2.00)");
});

test("fiatize returns label when 1 or more prices are unavailable - null price 1st", () => {
  expect(
    fiatize("Buy", [
      { price: null, amount: AMOUNT_1 },
      { price: PRICE_1, amount: AMOUNT_1 },
    ])
  ).toEqual("Buy");
});

test("fiatize returns label when 1 or more prices are unavailable - null price 2nd", () => {
  expect(
    fiatize("Buy", [
      { price: PRICE_1, amount: AMOUNT_1 },
      { price: null, amount: AMOUNT_1 },
    ])
  ).toEqual("Buy");
});

test("fiatize uses custom symbol", () => {
  expect(fiatize("Buy", [{ price: PRICE_1, amount: AMOUNT_1 }], "€")).toEqual(
    "Buy (€1.00)"
  );
});

test("fiatize uses default $ symbol when none provided", () => {
  expect(fiatize("Buy", [{ price: PRICE_1, amount: AMOUNT_1 }])).toContain("$");
});

// toFiatAmount
const TEST_PRICE = 75_248_900_000_000_000n; //$75,248.90 in 1e12

test("toFiatAmount returns undefined for undefined price", () => {
  expect(toFiatAmount(undefined, 100n)).toEqual(undefined);
});

test("toFiatAmount returns undefined for null price", () => {
  expect(toFiatAmount(null, 100n)).toEqual(undefined);
});

test("toFiatAmount returns 0n for 0n price and non-zero amount", () => {
  expect(toFiatAmount(0n, 100_000_000n)).toEqual(0n);
});

test("toFiatAmount returns 0n for non-zero price with 0n amount", () => {
  expect(toFiatAmount(TEST_PRICE, 0n)).toEqual(0n);
});

test("toFiatAmount returns correct amount when price and amount are supplied", () => {
  expect(toFiatAmount(TEST_PRICE, 100_000_000n)).toEqual(7_524_890_000_000n);
});

// toFiatDisplay
const TEST_FIAT_AMOUNT = 123_456_789n;

test("toFiatDisplay returns correctly when no options are supplied", () => {
  expect(toFiatDisplay(TEST_FIAT_AMOUNT)).toEqual("1.23");
});

test("toFiatDisplay returns correctly with empty options", () => {
  expect(toFiatDisplay(TEST_FIAT_AMOUNT, {})).toEqual("1.23");
});

test("toFiatDisplay returns correctly with rounding only option", () => {
  expect(toFiatDisplay(TEST_FIAT_AMOUNT, { rounding: 3 })).toEqual("1.234");
});

test("toFiatDisplay returns correctly with decimals only option", () => {
  expect(toFiatDisplay(TEST_FIAT_AMOUNT, { decimals: 7 })).toEqual("12.34");
});

test("toFiatDisplay returns correctly with decimals and rounding option", () => {
  expect(toFiatDisplay(TEST_FIAT_AMOUNT, { decimals: 7, rounding: 4 })).toEqual("12.3456");
});

test("toFiatDisplay returns correctly for zero amount", () => {
  expect(toFiatDisplay(0n)).toEqual("0.00");
});

test("toFiatDisplay clamps rounding to available decimal digits", () => {
  // rounding:10 exceeds decimals:8, substring returns all 8 available digits
  expect(toFiatDisplay(TEST_FIAT_AMOUNT, { rounding: 10 })).toEqual("1.23456789");
});

// integration
test("toFiatDisplay correctly formats the output of toFiatAmount", () => {
  // $1.00 price in 1e12 scale, 1 unit in 8 decimal scale → fiat = 100_000_000n → "$1.00"
  const fiat = toFiatAmount(1_000_000_000_000n, 100_000_000n);
  expect(toFiatDisplay(fiat!)).toEqual("1.00");
});
