/**
 * Generates URLs from filenames.
 * @param {string[]} filenames with relative path, no extenstion
 * @returns {string[]} URLs with path starting from `/styles` and with `.css` extension
 */
export function cssHref(filenames) {
  return filenames.map((name) => `/styles/${name}.css`);
}

/**
 * Generates URLs from filenames.
 * @param {string[]} filenames with relative path, no extenstion
 * @returns {string[]} URLs with path starting from `/scripts` and with `.js` extension
 */
export function jsSrc(filenames) {
  return filenames.map((name) => `/scripts/${name}.js`);
}
