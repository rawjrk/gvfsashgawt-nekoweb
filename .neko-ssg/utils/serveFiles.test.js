import assert from "node:assert";
import { describe, it } from "node:test";
import { FILE_TYPE, getFileType, getMimeType } from "./serveFiles.js";

describe("FILE_TYPE", () => {
  it("should have correct props (INVALID = -1, BINARY = 0, TEXT = 1)", () => {
    assert.strictEqual(FILE_TYPE.INVALID, -1);
    assert.strictEqual(FILE_TYPE.BINARY, 0);
    assert.strictEqual(FILE_TYPE.TEXT, 1);
  });
});

describe("getFileType()", () => {
  it("should return BINARY (.jpeg/.png/.mp4)", () => {
    assert.strictEqual(getFileType(".jpeg"), FILE_TYPE.BINARY);
    assert.strictEqual(getFileType(".png"), FILE_TYPE.BINARY);
    assert.strictEqual(getFileType(".mp4"), FILE_TYPE.BINARY);
  });

  it("should return TEXT (.html/.css/.js)", () => {
    assert.strictEqual(getFileType(".html"), FILE_TYPE.TEXT);
    assert.strictEqual(getFileType(".css"), FILE_TYPE.TEXT);
    assert.strictEqual(getFileType(".js"), FILE_TYPE.TEXT);
  });

  it("should return INVALID (unsupported formats)", () => {
    assert.strictEqual(getFileType(".wrong"), FILE_TYPE.INVALID);
  });
});

describe("getMimeType()", () => {
  it("should return MIME type based on provided extension", () => {
    assert.strictEqual(getMimeType(".html"), "text/html");
    assert.strictEqual(getMimeType(".css"), "text/css");
    assert.strictEqual(getMimeType(".js"), "application/javascript");
    assert.strictEqual(getMimeType(".jpg"), "image/jpeg");
    assert.strictEqual(getMimeType(".jpeg"), "image/jpeg");
    assert.strictEqual(getMimeType(".png"), "image/png");
    assert.strictEqual(getMimeType(".gif"), "image/gif");
    assert.strictEqual(getMimeType(".ico"), "image/x-icon");
    assert.strictEqual(getMimeType(".mp4"), "video/mp4");
  });
});

// TODO: getFilePath(), checkNotFoundPageExists(), getNotFoundPageHtml()
