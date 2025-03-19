import assert from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";
import path from "node:path";
import fs from "node:fs";
import { ejsRenderFile, generateBuildPath, loadModule } from "./buildPages.js";

describe("ejsRenderFile()", () => {
  const testDir = path.resolve("__ejsRenderFile__");

  const TEMPLATE_EJS = "template.ejs";
  const TEMPLATE_EJS_CONTENT = `<!DOCTYPE html><html lang="en"><head><title><%= title %></title></head><body><h1><%= message %></h1></body></html>`;
  const COMPILED_HTML_CONTENT = `<!DOCTYPE html><html lang="en"><head><title>World!</title></head><body><h1>Hello</h1></body></html>`;
  const DATA = { message: "Hello", title: "World!" };

  beforeEach(async () => {
    await fs.promises.mkdir(testDir, { recursive: true });
    await fs.promises.writeFile(path.join(testDir, TEMPLATE_EJS), TEMPLATE_EJS_CONTENT, "utf-8");
  });

  afterEach(async () => {
    await fs.promises.rm(testDir, { recursive: true });
  });

  it("should compile HTML code", async () => {
    const html = await ejsRenderFile(path.join(testDir, TEMPLATE_EJS), DATA);

    assert.strictEqual(html, COMPILED_HTML_CONTENT);
  });
});

describe("loadModule()", () => {
  const testDir = path.resolve("__loadModule__");
  const EXISTING_JS = "existing.js";

  beforeEach(async () => {
    const code = `export const foo = "bar";\n`;

    await fs.promises.mkdir(testDir, { recursive: true });
    await fs.promises.writeFile(path.join(testDir, EXISTING_JS), code, "utf-8");
  });

  afterEach(async () => {
    await fs.promises.rm(testDir, { recursive: true });
  });

  it("should return module import object (requested file exists)", async () => {
    const obj = await loadModule(path.join(testDir, EXISTING_JS));

    assert(obj);
    assert.strictEqual(obj.foo, "bar");
  });

  it("should return null (requested file doesn't exist)", async () => {
    const obj = await loadModule(path.join(testDir, "not-existing.js"));

    assert.strictEqual(obj, null);
  });
});

describe("generateBuildPath()", () => {
  it(`should replace dir "src" -> "build", retaining structure inside`, () => {
    const srcPath = "/home/user/project/src/nested/file.js";
    const srcDir = "/home/user/project/src";
    const buildDir = "/home/user/project/build";
    const buildPath = generateBuildPath({ srcPath, srcDir, buildDir });

    assert.deepStrictEqual(buildPath, "/home/user/project/build/nested/file.js");
  });
});
