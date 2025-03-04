export const LABELS = ["bytes", "KB", "MB", "GB", "TB", "PB"];

/**
 * Calculates closest allowed exponent
 * @param {number} num size in bytes
 * @returns {number} exponent
 */
export function calculateExponent(num) {
  if (!num) return 0;
  const log1024 = Math.floor(Math.log2(Math.abs(num)) / 10);
  return Math.min(log1024, LABELS.length);
}

/**
 * Rounds value `num` following specified `precision`
 * @param {number} num value to be rounded
 * @param {number} precision digits after point
 * @returns {number} rounded value
 */
export function roundNumber(num, precision = 0) {
  return Math.round(num * 10 ** precision) / 10 ** precision;
}

/**
 * Formats bytes size to a human-readable form (caps at gigabytes).
 * @param {number} bytes size of a file
 * @returns {string} formatted text
 * @example
 * formatSize(999) -> "999 bytes"
 * formatSize(2056) -> "2.01 KB"
 * formatSize(32465) -> "31.7 KB"
 * formatSize(155e4) -> "1.48 MB"
 * formatSize(118e8) -> "10.99 GB"
 */
export function formatSize(bytes) {
  const exponent = calculateExponent(bytes);

  const measure = LABELS[exponent];
  const size = roundNumber(bytes / 1024 ** exponent, 2);

  return `${size} ${measure}`;
}
