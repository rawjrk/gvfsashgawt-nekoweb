import assert from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";
import path from "node:path";
import fsPromises from "node:fs/promises";
import scanDirectory from "./scanDirectory.js";

describe("scanDirectory()", () => {
  const testDir = path.resolve("__scanDirectory__");

  const ABC_TXT = "abc.txt";
  const GHI_TEXT = "ghi.text";
  const UNKNOWN_DAT = "unknown.dat";
  const DEF_TXT = "def.txt";

  beforeEach(async () => {
    const buff = Buffer.from("whatever");

    await fsPromises.mkdir(testDir);
    await fsPromises.writeFile(path.join(testDir, ABC_TXT), buff);
    await fsPromises.writeFile(path.join(testDir, GHI_TEXT), buff);
    await fsPromises.writeFile(path.join(testDir, UNKNOWN_DAT), buff);

    await fsPromises.mkdir(path.join(testDir, "nested"));
    await fsPromises.writeFile(path.join(testDir, "nested", DEF_TXT), buff);
  });

  afterEach(async () => {
    await fsPromises.rm(testDir, { recursive: true, force: true });
  });

  it("should find all files (no pattern)", async () => {
    const arr = await scanDirectory(testDir);
    assert.strictEqual(arr.length, 4);

    assert(arr.find((dirent) => dirent.name === ABC_TXT));
    assert(arr.find((dirent) => dirent.name === GHI_TEXT));
    assert(arr.find((dirent) => dirent.name === UNKNOWN_DAT));
    assert(arr.find((dirent) => dirent.name === DEF_TXT));
  });

  it("should find matching files (pattern: string)", async () => {
    const arr = await scanDirectory(testDir, ".txt");
    assert.strictEqual(arr.length, 2);

    assert(arr.find((dirent) => dirent.name === ABC_TXT));
    assert(arr.find((dirent) => dirent.name === DEF_TXT));
  });

  it("should find matching files (pattern: regexp)", async () => {
    const arr = await scanDirectory(testDir, /.txt|.text$/);
    assert.strictEqual(arr.length, 3);

    assert(arr.find((dirent) => dirent.name === ABC_TXT));
    assert(arr.find((dirent) => dirent.name === GHI_TEXT));
    assert(arr.find((dirent) => dirent.name === DEF_TXT));
  });
});
