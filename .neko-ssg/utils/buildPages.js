/**
 * @typedef {import('node:fs').Dirent} Dirent
 * @typedef {import('ejs')} ejs
 * @typedef {import('./runBuild.js').CopyOptions} CopyOptions
 * @typedef {import('./runBuild.js').CopyResult} CopyResult
 */
import fsPromises from "node:fs/promises";
import path from "node:path";
import ejs from "ejs";
import { minify } from "minify";
import appDir from "./appDir.js";
import scanDirectory from "./scanDirectory.js";

const pagesPath = path.join(appDir, "src/pages");

/**
 * Builds HTML pages from EJS templates inside `src/pages` directory.
 * Compiled files are saved into `build` directory.
 * @param {CopyOptions} options configuration object
 * @returns {Promise<CopyResult>} stats on `[original, compressed]` file sizes
 */
export default async function buildPages({ skipMinification = false } = {}) {
  const pagesContent = await scanDirectory(pagesPath, ".ejs");

  let originalSize_bytes = 0;
  let compressedSize_bytes = 0;

  for (const dirent of pagesContent) {
    const { compiledHtml, writeTo, originalLength, compressedLength } = await generatePage(
      dirent,
      skipMinification,
    );

    originalSize_bytes += originalLength;
    compressedSize_bytes += compressedLength;

    await fsPromises.mkdir(path.dirname(writeTo), { recursive: true });
    await fsPromises.writeFile(writeTo, compiledHtml, "utf-8");
  }

  return [originalSize_bytes, compressedSize_bytes];
}

/**
 * @typedef GeneratePageObj
 * @type {object}
 * @property {string} compiledHtml page content
 * @property {string} writeTo build file directory
 * @property {number} originalLength size before compression
 * @property {number?} compressedLength size after compression
 */

/**
 * Generates `<page_name>.html` content from `<page_name>.ejs` template.
 * Uses `<page_name>.config.js` module exports for context
 * (e.i. to get exact values for vars inside templates).
 * @param {Dirent} dirent interface corresponding to source EJS template
 * @param {boolean} skipMinification specifies whether to skip minification step
 * @returns {Promise<GeneratePageObj>} page's content, absolute path, sizes (before/after compression)
 */
async function generatePage(dirent, skipMinification = false) {
  const renderFrom = path.join(dirent.parentPath, dirent.name);

  const configPath = replaceExtname(renderFrom, ".config.js");
  const { title, metadata, navigation } = await loadModule(configPath, "utf-8");

  const renderData = { title, metadata, navigation };
  let compiledHtml = await ejsRenderFile(renderFrom, renderData);

  let originalLength = compiledHtml.length;
  let compressedLength = null;

  if (!skipMinification) {
    compiledHtml = await minify.html(compiledHtml);
    compressedLength = compiledHtml.length;
  }

  const htmlFilename = replaceExtname(dirent.name, ".html");
  const writeTo = path.join(appDir, "build", htmlFilename);

  return { compiledHtml, writeTo, originalLength, compressedLength };
}

/**
 * Replaces file's extension from `nameOrPath` with `extname`. Leaves everything else in place.
 * @param {string} nameOrPath file name, or absolute/relative path with file name
 * @param {string} extname should start with a dot (e.g `.ejs`)
 * @returns {string} file name/path with replaced extension
 */
function replaceExtname(nameOrPath, extname) {
  const sliceBy = path.extname(nameOrPath).length * -1;
  return nameOrPath.slice(0, sliceBy) + extname;
}

/**
 * Loads JS module located at `absolutePath`.
 * If module doesn't exist, returns `{}`.
 * @param {string} absolutePath file location
 * @returns {Promise<*>} module namespace object
 */
async function loadModule(absolutePath) {
  try {
    const moduleNamespace = await import(`file://${absolutePath}`);
    return moduleNamespace;
  } catch (err) {
    if (err.code === "ERR_MODULE_NOT_FOUND") {
      console.error("Error on exporting config from", absolutePath);
      return {};
    }
    throw err;
  }
}

/**
 * Promisified version of `ejs.renderFile()` method.
 * Root directory for `<%- include('/path/to') is `src` directory.
 * @param {string} filename absolute path to EJS template
 * @param {ejs.Data} data compilation context
 * @param {ejs.Options} options configuration object as documented on [EJS page](https://ejs.co/#docs)
 * @returns {Promise<string>} compiled HTML
 */
async function ejsRenderFile(filename, data, options) {
  const customOptions = {
    root: path.join(appDir, "src"),
    ...options,
  };

  return new Promise((resolve, reject) => {
    ejs.renderFile(filename, data, customOptions, (err, str) => {
      if (err) {
        reject(err);
      }
      resolve(str);
    });
  });
}
