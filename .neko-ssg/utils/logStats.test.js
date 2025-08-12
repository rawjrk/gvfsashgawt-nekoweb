import assert from "node:assert";
import { describe, it } from "node:test";

import logStats, { formatRateDiff } from "./logStats.js";

describe("formatRateDiff()", () => {
  it("should return formatted string", () => {
    assert.strictEqual(formatRateDiff(10240, 10240), "x1 (0 bytes)");
    assert.strictEqual(formatRateDiff(10240, 5120), "x2 (5 KB)");
    assert.strictEqual(formatRateDiff(10240, 3400), "x3.01 (6.68 KB)");
  });
});

describe("logStats()", () => {
  it("should log the corresponding messages (skipMinification: false)", () => {
    const stats = {
      html: [11905, 8998],
      css: [7937, 6209],
      js: [19687, 10576],
    };

    const messages = [
      `Code size (before): 38.6 KB`,
      `Code size (after): 25.18 KB`,
      `Compression: x1.53 (13.42 KB)`,
      ` * HTML\t: x1.32 (2.84 KB)`,
      ` * CSS\t: x1.28 (1.69 KB)`,
      ` * JS\t: x1.86 (8.9 KB)`,
    ];

    let index = 0;

    logStats(stats, false, (str) => {
      assert.strictEqual(str, messages[index]);
      index++;
    });

    assert.strictEqual(index, messages.length);
  });

  it("should log the corresponding messages (skipMinification: true)", () => {
    const stats = {
      html: [11905, 0],
      css: [7937, 0],
      js: [19687, 0],
    };

    const messages = [`Code size (uncompressed): 38.6 KB`];

    let index = 0;

    logStats(stats, true, (str) => {
      assert.strictEqual(str, messages[index]);
      index++;
    });

    assert.strictEqual(index, messages.length);
  });
});
