/**
 * @typedef {import('node:fs').Dirent} Dirent
 */
import fsPromises from "node:fs/promises";

/**
 * Gets a recursive list of files inside `dirPath`.
 * Returns only files of a type specified in `allowedExtname`.
 * @param {string} dirPath absolute path to a directory
 * @param {string | RegExp =} pattern should start with a dot `.jpeg`
 * @returns {Promise<Dirent[]>} list of files
 */
export default async function scanDirectory(dirPath, pattern) {
  const dirContent = await fsPromises.readdir(dirPath, {
    recursive: true,
    withFileTypes: true,
  });

  if (!pattern) {
    return dirContent.filter((dirent) => dirent.isFile());
  }

  return dirContent.filter((dirent) => dirent.isFile() && dirent.name.match(pattern));
}
