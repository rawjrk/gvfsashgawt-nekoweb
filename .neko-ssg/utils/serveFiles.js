import path from "node:path";
import appDir from "./appDir.js";

const SUPPORTED_BIN_FORMATS = [".jpg", ".jpeg", ".png", ".gif", ".ico", ".mp4"];
const SUPPORTED_TEXT_FORMATS = [".html", ".css", ".js"];

export const FILE_TYPE = {
  INVALID: -1,
  BIN: 0,
  TEXT: 1,
};

/**
 * Checks whether given `extname` corresponds to any of our formats.
 * @param {string} extname file extension
 * @returns {number} file type code
 * @example
 * getFileType('.png') -> 0 // e.i. binary
 * getFileType('.css') -> 1 // e.i. text
 * getFileType('.wrg') -> -1 // e.i. invalid
 */
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

/**
 * Gets MIME-type.
 * @param {string} extname file extension
 * @returns {string} MIME-type corresponding to file's format
 * @example
 * getMimeType('.html') -> 'text/html'
 * getMimeType('.jpeg') -> 'image/jpeg'
 */
export function getMimeType(extname) {
  switch (extname) {
    case ".js":
      return "application/javascript";

    case ".css":
      return "text/css";

    case ".html":
      return "text/html";

    case ".ico":
      return "image/x-icon";

    case ".jpg":
      return "image/jpeg";

    case ".jpeg":
    case ".png":
    case ".gif":
      return `image/${extname.slice(1)}`;

    case ".mp4":
      return `video/${extname.slice(1)}`;
  }
}

/**
 * Transforms web url to file path.
 * @param {string} url request URL (from the website)
 * @returns {string} file location (inside `build` directory)
 */
export function getFilePath(url) {
  const isExtensionSpecified = path.extname(url);
  const addExtension = isExtensionSpecified ? "" : ".html";

  const relativePath = url === "/" ? "index.html" : `${url}${addExtension}`;
  const absolutePath = path.join(appDir, "build", relativePath);

  return absolutePath;
}
