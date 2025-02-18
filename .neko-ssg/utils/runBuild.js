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
 * @typedef CopyOptions
 * @type {object}
 * @property {boolean} skipMinification specifies whether to skip minification step
 * while coppying file's content, defaults to `false`
 */

/**
 * @typedef CopyResult
 * @type {[number, number]} original/compressed file sizes
 */

/**
 * Runs build: compile EJS to HTML, copy JS/CSS and static files.
 * @param {CopyOptions} options configuration object
 */
export default async function runBuild({ skipMinification = false } = {}) {
  await clearBuildDir();

  const [htmlOrig, htmlComp] = await buildPages({ skipMinification });
  const [cssOrig, cssComp] = await copyStyles({ skipMinification });
  const [jsOrig, jsComp] = await copyScripts({ skipMinification });

  await copyStaticFiles();
  await copyFaviconIco();

  const originalSize = htmlOrig + cssOrig + jsOrig;
  const compressedSize = htmlComp + cssComp + jsComp;

  if (!skipMinification) {
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
  } else {
    console.log("Code size (uncompressed):", formatSize(originalSize));
  }

  console.log("Successfully completed fresh build");
}
