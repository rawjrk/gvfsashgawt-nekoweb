/**
 * @typedef {import('node:fs').Dirent} Dirent
 */
import path from "node:path";
import fsPromises from "node:fs/promises";

/**
 * Gets a recursive list of files inside `dirPath`.
 * Returns only files of a type specified in `allowedExtname`.
 * @param {string} dirPath absolute path to a directory
 * @param {string} allowedExtname should start with a dot `.jpeg`
 * @returns {Promise<Dirent[]>} list of files
 */
export default async function scanDirectory(dirPath, allowedExtname) {
  const dirContent = await fsPromises.readdir(dirPath, {
    recursive: true,
    withFileTypes: true,
  });

  return dirContent.filter(
    (dirent) => dirent.isFile() && path.extname(dirent.name) === allowedExtname,
  );
}
