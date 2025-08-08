import * as os from "node:os";

const isWindows = os.platform() === "win32";

/**
 * Prevents URLs from being broken on Windows.
 * @param {string} uri URL generated with `node:path` module
 * @returns {string} URL with replaced backslashes
 */
export function platformSafeUrl(uri) {
  if (!isWindows) {
    return uri;
  }

  return uri.replaceAll("\\", "/");
}
