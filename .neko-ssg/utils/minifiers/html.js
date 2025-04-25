import { minify } from "html-minifier-terser";

/** @type {import ('html-minifier-terser').Options} */
const options = {
  removeComments: true,
  removeCommentsFromCDATA: true,
  removeCDATASectionsFromCDATA: true,
  collapseWhitespace: true,
  collapseBooleanAttributes: true,
  removeAttributeQuotes: true,
  removeRedundantAttributes: true,
  useShortDoctype: true,
  removeEmptyAttributes: true,
  removeEmptyElements: false,
  removeOptionalTags: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
};

/**
 * Minifies HTML code.
 * @param {string} code input
 * @returns {Promise<string>} output
 */
export default function minifyHtml(code) {
  return minify(code, options);
}
