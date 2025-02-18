import path from "node:path";
import fsPromises from "node:fs/promises";
import { minify } from "minify";
import minifyJs from "./minifyJs.js";
import scanDirectory from "./scanDirectory.js";
import appDir from "./appDir.js";

/**
 * @typedef Dirent
 * @type {import('node:fs').Dirent}
 */

/**
 * @typedef CopyOptions
 * @type {import('./runBuild.js').CopyOptions}
 */

/**
 * @typedef CopyResult
 * @type {import('./runBuild.js').CopyResult}
 */

/**
 * Removes `build` directory.
 * @returns {Promise<void>}
 */
export async function clearBuildDir() {
  const buildPath = path.join(appDir, "build");
  await fsPromises.rm(buildPath, { recursive: true, force: true });
}

/**
 * Creates an exact copy of all files from `static` inside `build/static` directory.
 * @returns {Promise<void>}
 */
export async function copyStaticFiles() {
  const staticPath = path.join(appDir, "static");
  const buildPath = path.join(appDir, "build/static");
  await fsPromises.cp(staticPath, buildPath, { recursive: true });
}

/**
 * Creates an exact copy of `favicon.ico` from `static` inside `build` directory.
 * @returns {Promise<void>}
 */
export async function copyFaviconIco() {
  try {
    const staticFaviconPath = path.join(appDir, "static", "favicon.ico");
    const buildFaviconPath = path.join(appDir, "build", "favicon.ico");
    await fsPromises.cp(staticFaviconPath, buildFaviconPath);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.warn("File /static/favicon.ico not found");
      return;
    }
    throw err;
  }
}

/**
 * Creates a transformed copy of all files from `src/styles` inside `build/styles` directory.
 * @param {CopyOptions} options configuration object
 * @returns {Promise<CopyResult>} stats on `[original, compressed]` file sizes
 */
export async function copyStyles({ skipMinification = false } = {}) {
  const stylesPath = path.join(appDir, "src/styles");
  const buildPath = path.join(appDir, "build/styles");

  const stylesContent = await scanDirectory(stylesPath, ".css");
  let originalSize = 0;
  let compressedSize = 0;

  for (const dirent of stylesContent) {
    const [copyFrom, copyTo] = generateCopyPath(dirent, stylesPath, buildPath);

    let textContent = await fsPromises.readFile(copyFrom, "utf-8");
    originalSize += textContent.length;

    if (!skipMinification) {
      textContent = await minify.css(textContent);
      compressedSize += textContent.length;
    }

    const destParentDir = copyTo.slice(0, dirent.name.length * -1);
    await fsPromises.mkdir(destParentDir, { recursive: true });
    await fsPromises.writeFile(copyTo, textContent, "utf-8");
  }

  return [originalSize, compressedSize];
}

/**
 * Creates a transformed copy of all files from `src/scripts` inside `build/scripts` directory.
 * @param {CopyOptions} options configuration object
 * @returns {Promise<CopyResult>} stats on `[original, compressed]` file sizes
 */
export async function copyScripts({ skipMinification = false } = {}) {
  const scriptsPath = path.join(appDir, "src/scripts");
  const buildPath = path.join(appDir, "build/scripts");

  const scriptsContent = await scanDirectory(scriptsPath, ".js");
  let originalSize = 0;
  let compressedSize = 0;

  for (const dirent of scriptsContent) {
    const [copyFrom, copyTo] = generateCopyPath(dirent, scriptsPath, buildPath);

    let textContent = await fsPromises.readFile(copyFrom, "utf-8");
    originalSize += textContent.length;

    if (!skipMinification) {
      textContent = minifyJs(textContent);
      compressedSize += textContent.length;
    }

    const destParentDir = copyTo.slice(0, dirent.name.length * -1);
    await fsPromises.mkdir(destParentDir, { recursive: true });
    await fsPromises.writeFile(copyTo, textContent, "utf-8");
  }

  return [originalSize, compressedSize];
}

/**
 * Generates absolute paths (`copyFrom` and `copyTo`)
 * from relative paths (`srcPath`, `destPath`)
 * for a given `dirent` (file).
 * @param {Dirent} dirent interface corresponding to coppied file
 * @param {string} srcPath relative path to copy from
 * @param {string} destPath relave path to copy to
 * @returns {[string, string]} absolute paths (`copyFrom` and `copyTo`)
 * @example
 * generateCopyPath(
 *   { parenthPath: '~/project/src/folders/inside', name: 'file.js' },
 *   '~/project/src',
 *   '~/project/build',
 * ) -> [
 *    '~/project/src/folders/inside/file.js',
 *    '~/project/build/folders/inside/file.js',
 * ]
 */
function generateCopyPath(dirent, srcPath, destPath) {
  const relativePath = dirent.parentPath.slice(srcPath.length);

  const copyFrom = path.join(dirent.parentPath, dirent.name);
  const copyTo = path.join(destPath, relativePath, dirent.name);

  return [copyFrom, copyTo];
}
