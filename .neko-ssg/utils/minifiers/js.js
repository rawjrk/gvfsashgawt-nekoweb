import { minify } from "terser";

/** @type {import('terser').MinifyOptions} */
const options = {};

/**
 * Minifies JS code.
 * @param {string} code
 * @returns {Promise<string>}
 */
export default async function minifyJs(code) {
  const { code: output } = await minify(code, options);
  return output;
}
