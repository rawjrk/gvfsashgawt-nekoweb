import buildPages from "./buildPages.js";
import {
  clearBuildDir,
  copyFaviconIco,
  copyScripts,
  copyStaticFiles,
  copyStyles,
} from "./fileTasks.js";
import { formatSize, roundNumber } from "./formatSize.js";

/**
 * @typedef {object} CopyOptions
 * @property {boolean} skipMinification specifies whether to skip minification step
 * while coppying file's content, defaults to `false`
 */

/**
 * @typedef {[number, number]} CopyResult
 */

/**
 * Runs build: compile EJS to HTML, copy JS/CSS and static files.
 * @param {object} options configuration object
 * @param {boolean} options.skipMinification specifies whether to skip minification step
 * @param {boolean} options.hideStats specifies whether to hide compression stats
 */
export default async function runBuild({ skipMinification = false, hideStats = false } = {}) {
  await clearBuildDir();

  const htmlStats = await buildPages({ skipMinification });
  const cssStats = await copyStyles({ skipMinification });
  const jsStats = await copyScripts({ skipMinification });

  await copyStaticFiles();
  await copyFaviconIco();

  if (!hideStats) {
    logStats({ htmlStats, cssStats, jsStats }, skipMinification);
  }

  console.log("Successfully completed fresh build");
}

/**
 * Logs statistics about code files compression.
 * @param {object} stats statistic object
 * @param {CopyResult} stats.htmlStats statistics on HTML files
 * @param {CopyResult} stats.cssStats statistics on CSS files
 * @param {CopyResult} stats.jsStats statistics on JS files
 * @param {boolean} skipMinification specifies whether to skip minification step
 * @returns {void}
 */
function logStats({ htmlStats, cssStats, jsStats }, skipMinification = false) {
  const [htmlOrig, htmlComp] = htmlStats;
  const [cssOrig, cssComp] = cssStats;
  const [jsOrig, jsComp] = jsStats;

  const originalSize = htmlOrig + cssOrig + jsOrig;
  const compressedSize = htmlComp + cssComp + jsComp;

  if (skipMinification) {
    console.log("Code size (uncompressed):", formatSize(originalSize));
    return;
  }

  console.log("Code size (before):", formatSize(originalSize));
  console.log("Code size (after):", formatSize(compressedSize));

  const formatRateDiff = (orig, comp) => {
    const rate = roundNumber(orig / comp, 2);
    const diff = formatSize(orig - comp);
    return `x${rate} (${diff})`;
  };

  console.log("Compression:", formatRateDiff(originalSize, compressedSize));

  console.log(" * HTML\t:", formatRateDiff(htmlOrig, htmlComp));
  console.log(" * CSS\t:", formatRateDiff(cssOrig, cssComp));
  console.log(" * JS\t:", formatRateDiff(jsOrig, jsComp));
}
