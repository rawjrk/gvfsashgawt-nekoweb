import assert from "node:assert";
import { describe, it } from "node:test";
import minifyJs from "./minifyJs.js";

describe("minifyJs()", () => {
  it("should trim spaces at start, remove inline/multiline comments", () => {
    const sourceCode = `
      const uglifyMe = "yes!";
      
      /**
       * jsdocs are pain in the ass
       * but not as much as TypeScript 
       */
      function godLovesUgly() {
        const god = false;
        const love = true; // always have been
        return love;
      }
    `;

    const compressedCode = `const uglifyMe = "yes!";function godLovesUgly() {const god = false;const love = true; return love;}`;

    assert.strictEqual(minifyJs(sourceCode), compressedCode);
  });
});
