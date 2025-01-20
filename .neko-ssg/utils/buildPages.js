import fsPromises from "node:fs/promises";
import path from "node:path";
import ejs from "ejs";
import { minify } from "minify";
import appDir from "./appDir.js";
import scanDirectory from "./scanDirectory.js";

/**
 * @typedef Dirent
 * @type {import('node:fs').Dirent}
 */

/**
 * @typedef CopyOptions
 * @type {import('./runBuild.js').CopyOptions}
 */

const pagesPath = path.join(appDir, "src/pages");

/**
 * Builds HTML pages from EJS templates inside `src/pages` directory.
 * Compiled files are saved into `build` directory.
 * @param {CopyOptions} options configuration object
 * @returns {Promise<void>}
 */
export default async function buildPages({ skipMinification = false } = {}) {
  const pagesContent = await scanDirectory(pagesPath, ".ejs");

  for (const dirent of pagesContent) {
    const { compiledHtml, writeTo } = await generatePage(dirent, skipMinification);

    await fsPromises.mkdir(path.dirname(writeTo), { recursive: true });
    await fsPromises.writeFile(writeTo, compiledHtml, "utf-8");
  }
}

/**
 * Generates `<page_name>.html` content from `<page_name>.ejs` template.
 * Uses `<page_name>.config.js` module exports for context
 * (e.i. to get exact values for vars inside templates).
 * @param {Dirent} dirent interface corresponding to source EJS template
 * @param {boolean} skipMinification specifies whether to skip minification step
 * @returns {Promise<{ compiledHtml: string, writeTo: string }>} page's content and absolute path
 */
async function generatePage(dirent, skipMinification = false) {
  const renderFrom = path.join(dirent.parentPath, dirent.name);

  const configPath = replaceExtname(renderFrom, ".config.js");
  const { title, metadata, navigation } = await loadModule(configPath, "utf-8");

  const renderData = { title, metadata, navigation };
  let compiledHtml = await ejsRenderFile(renderFrom, renderData);

  if (!skipMinification) {
    compiledHtml = await minify.html(compiledHtml);
  }

  const htmlFilename = replaceExtname(dirent.name, ".html");
  const writeTo = path.join(appDir, "build", htmlFilename);

  return { compiledHtml, writeTo };
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
 * @param {*} data compilation context
 * @param {*} options configuration object as documented on [EJS page](https://ejs.co/#docs)
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
