import crypto from "node:crypto";
import path from "node:path";

/**
 * Calculates SHA-1 hash of the `content`.
 * Returns a shorter version of hash (first 7 chars).
 * @param {string} content file content
 * @returns {string} file hash
 */
export function generateHash(content = "") {
  const sha1Hash = crypto.hash("sha1", content);
  return sha1Hash.substring(0, 7);
}

/**
 * Appends URL with version query.
 * @param {string} fileURL path to the file
 * @param {string} fileHash hashed value
 * @returns {string} file with hashed value in the name
 */
export function addHash(fileURL, fileHash) {
  return `${fileURL}?v=${fileHash}`;
}
