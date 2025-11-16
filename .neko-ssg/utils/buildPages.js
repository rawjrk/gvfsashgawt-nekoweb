/**
 * @typedef {import('ejs')} ejs
 */
import path from "node:path";

import ejs from "ejs";

import appDir from "./appDir.js";

/**
 * Loads JS module located at `absolutePath`.
 * If module doesn't exist, returns `null`.
 * @param {string} absolutePath file location
 * @returns {Promise<*>} module namespace object
 */
export async function loadModule(absolutePath) {
  try {
    const moduleNamespace = await import(`file://${absolutePath}`);
    return moduleNamespace;
  } catch (err) {
    if (err.code === "ERR_MODULE_NOT_FOUND") {
      console.error("Error on exporting config from", absolutePath); // TODO: move outside
      return null;
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
export async function ejsRenderFile(filename, data, options) {
  const customOptions = {
    root: path.join(appDir, "src/legacy"),
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

/**
 * Generates absolute path for build file (retains structure inside `srcDir` to `buildDir`).
 * @param {object} options props object
 * @param {string} options.srcPath source file (absolute path)
 * @param {string} options.srcDir source folder (absolute path)
 * @param {string} options.buildDir build folder (absolute path)
 * @returns {string} build file (absolute path)
 */
export function generateBuildPath({ srcPath, srcDir, buildDir }) {
  const relativePath = srcPath.slice(srcDir.length); // <-- path inside `/src` to retain
  return path.join(buildDir, relativePath);
}
