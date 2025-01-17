import path from "node:path";
import appDir from "./appDir.js";

const SUPPORTED_BIN_FORMATS = [".jpg", ".jpeg", ".png", ".gif"];
const SUPPORTED_TEXT_FORMATS = [".html", ".css", ".js"];

export const FILE_TYPE = {
  INVALID: -1,
  BIN: 0,
  TEXT: 1,
};

export function getFileType(extname) {
  const isTextFile = SUPPORTED_TEXT_FORMATS.includes(extname);
  if (isTextFile) {
    return FILE_TYPE.TEXT;
  }

  const isBinFile = SUPPORTED_BIN_FORMATS.includes(extname);
  if (isBinFile) {
    return FILE_TYPE.BIN;
  }

  return FILE_TYPE.INVALID;
}

export function getMimeType(extname) {
  switch (extname) {
    case ".js":
      return "application/javascript";
    case ".css":
      return "text/css";
    case ".html":
      return "text/html";

    case ".jpg":
      return "image/jpeg";

    case ".jpeg":
    case ".png":
    case ".gif":
      return `image/${extname.slice(1)}`;
  }
}

export function getFilePath(url) {
  const isExtensionSpecified = path.extname(url);
  const addExtension = isExtensionSpecified ? "" : ".html";

  const relativePath = url === "/" ? "index.html" : `${url}${addExtension}`;
  const absolutePath = path.join(appDir, "build", relativePath);

  return absolutePath;
}
