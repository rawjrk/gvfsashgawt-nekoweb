import { formatSize, roundNumber } from "./formatSize.js";

/**
 * @typedef {Record<string, [number, number]>} Stats
 */

/**
 * Utility function.
 * @param {number} orig original file size.
 * @param {number} comp compressed file size.
 * @returns {string} formatted
 */
export function formatRateDiff(orig, comp) {
  const rate = roundNumber(orig / comp, 2);
  const diff = formatSize(orig - comp);
  return `x${rate} (${diff})`;
}

/**
 * Logs statistics about code files compression.
 * @param {Stats} stats statistic object
 * @param {boolean} skipMinification specifies whether to skip minification step
 * @param {(str: string) => void} logWith _used for test purposes_
 * @returns {void}
 */
export default function logStats(stats, skipMinification = false, logWith = console.log) {
  /** @type {string[]} */
  const logQueueStrings = [];

  let totalOrig = 0;
  let totalComp = 0;

  for (const key in stats) {
    const [orig, comp] = stats[key];

    totalOrig += orig;
    totalComp += comp;

    const title = key.toUpperCase();
    const rate = formatRateDiff(orig, comp);

    logQueueStrings.push(` * ${title}\t: ${rate}`);
  }

  if (skipMinification) {
    logWith(`Code size (uncompressed): ${formatSize(totalOrig)}`);
    return;
  }

  logWith(`Code size (before): ${formatSize(totalOrig)}`);
  logWith(`Code size (after): ${formatSize(totalComp)}`);

  logWith(`Compression: ${formatRateDiff(totalOrig, totalComp)}`);

  for (const str of logQueueStrings) {
    logWith(str);
  }
}
