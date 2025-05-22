import crypto from "node:crypto";
import path from "node:path";

/**
 * Calculates SHA-1 hash of the `content`.
 * Returns a shorter version of hash (first 7 chars).
 * @param {string} content file content
 * @returns hash
 */
export function generateHash(content = "") {
  const sha1Hash = crypto.hash("sha1", content);
  return sha1Hash.substring(0, 7);
}

/**
 * Appends hashed value to a file's name.
 * @param {string} fullPath path to the file
 * @param {string} fileHash hashed value
 * @returns {string} file with hashed value in the name
 * @example
 * addHash("/scripts/lib/gib-events.js", "43f352b") -> "/scripts/lib/gib-events-43f352b.js"
 */
export function addHash(fullPath, fileHash) {
  const extension = path.extname(fullPath);
  const mainPart = fullPath.slice(0, fullPath.length - extension.length);

  return `${mainPart}-${fileHash}${extension}`;
}
