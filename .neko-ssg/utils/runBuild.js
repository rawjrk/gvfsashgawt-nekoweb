import buildPages from "./buildPages.js";
import {
  clearBuildDir,
  copyFaviconIco,
  copyScripts,
  copyStaticFiles,
  copyStyles,
} from "./fileTasks.js";

/**
 * @typedef CopyOptions
 * @type {object}
 * @property {boolean} skipMinification specifies whether to skip minification step
 * while coppying file's content, defaults to `false`
 */

/**
 * Runs build: compile EJS to HTML, copy JS/CSS and static files.
 * @param {CopyOptions} options configuration object
 */
export default async function runBuild({ skipMinification = false } = {}) {
  console.log("Skipping minification:", skipMinification);

  await clearBuildDir();
  await buildPages({ skipMinification });
  await copyScripts({ skipMinification });
  await copyStyles({ skipMinification });

  await copyStaticFiles();
  await copyFaviconIco();

  console.log("Successfully completed fresh build");
}
