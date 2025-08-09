import { minify } from "terser";

/** @type {import('terser').MinifyOptions} */
const options = {};

/**
 * Minifies JS code.
 * @param {string} code source code
 * @returns {Promise<string>} compressed
 */
export async function minifyJs(code) {
  const { code: output } = await minify(code, options);
  return output;
}
