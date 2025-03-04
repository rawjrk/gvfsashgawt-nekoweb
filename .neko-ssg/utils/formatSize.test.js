import assert from "node:assert";
import { describe, it } from "node:test";
import { calculateExponent, formatSize, LABELS, roundNumber } from "./formatSize.js";

describe("calculateExponent()", () => {
  it("should exponent of 1024 (num > 0)", () => {
    assert.strictEqual(calculateExponent(1), 0);
    assert.strictEqual(calculateExponent(1023), 0);
    assert.strictEqual(calculateExponent(1024), 1);
    assert.strictEqual(calculateExponent(1024 ** 2), 2);
    assert.strictEqual(calculateExponent(1024 ** 3), 3);
  });

  it("should return 0 (num = 0)", () => {
    assert.strictEqual(calculateExponent(0), 0);
  });

  it("should return exponent (num < 0)", () => {
    assert.strictEqual(calculateExponent(-1), 0);
    assert.strictEqual(calculateExponent(-1023), 0);
    assert.strictEqual(calculateExponent(-1024), 1);
    assert.strictEqual(calculateExponent(-(1024 ** 2)), 2);
    assert.strictEqual(calculateExponent(-(1024 ** 3)), 3);
  });

  it("should return exponent that doesn't exceed max allowed", () => {
    const exceedingValue = 12;
    const maxAllowed = LABELS.length;
    assert(exceedingValue > maxAllowed);
    assert.strictEqual(calculateExponent(1024 ** exceedingValue), maxAllowed);
  });
});

describe("roundNumber()", () => {
  it("should round to smaller for .0 through .4", () => {
    assert.strictEqual(roundNumber(1.0, 0), 1);
    assert.strictEqual(roundNumber(1.1, 0), 1);
    assert.strictEqual(roundNumber(1.2, 0), 1);
    assert.strictEqual(roundNumber(1.3, 0), 1);
    assert.strictEqual(roundNumber(1.4, 0), 1);
  });

  it("should round to bigger for .5 through .9", () => {
    assert.strictEqual(roundNumber(1.5, 0), 2);
    assert.strictEqual(roundNumber(1.6, 0), 2);
    assert.strictEqual(roundNumber(1.7, 0), 2);
    assert.strictEqual(roundNumber(1.8, 0), 2);
    assert.strictEqual(roundNumber(1.9, 0), 2);
  });

  it("should return whole number (precision = 0)", () => {
    assert.strictEqual(roundNumber(1645.3527, 0), 1645);
  });

  it("should apply 0 precision (precision = undefined)", () => {
    assert.strictEqual(roundNumber(1645.3527, undefined), 1645);
  });

  it("should return float with N numbers after dot (precision = N)", () => {
    assert.strictEqual(roundNumber(1645.3527, 1), 1645.4);
    assert.strictEqual(roundNumber(1645.3527, 2), 1645.35);
    assert.strictEqual(roundNumber(1645.3527, 3), 1645.353);
    assert.strictEqual(roundNumber(1645.3527, 4), 1645.3527);
    assert.strictEqual(roundNumber(1645.3527, 5), 1645.3527);
  });

  it("should round with N zeros before dot (precision: -N)", () => {
    assert.strictEqual(roundNumber(1645.3527, -1), 1650);
    assert.strictEqual(roundNumber(1645.3527, -2), 1600);
    assert.strictEqual(roundNumber(1645.3527, -3), 2000);
    assert.strictEqual(roundNumber(1645.3527, -4), 0);
  });
});

describe("formatSize()", () => {
  it("should return formatted string", () => {
    assert.strictEqual(formatSize(999), "999 bytes");
    assert.strictEqual(formatSize(2056), "2.01 KB");
    assert.strictEqual(formatSize(32465), "31.7 KB");
    assert.strictEqual(formatSize(155e4), "1.48 MB");
    assert.strictEqual(formatSize(118e8), "10.99 GB");

    assert.strictEqual(formatSize(-999), "-999 bytes");
    assert.strictEqual(formatSize(-2056), "-2.01 KB");
  });
});
