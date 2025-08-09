import CleanCSS from "clean-css";

/** @type {import ('clean-css').OptionsPromise} */
const options = {
  level: 2,
};

/**
 * Minifies CSS code.
 * @param {string} code source code
 * @returns {Promise<string>} compressed
 */
export async function minifyCss(code) {
  const { styles, errors } = await new CleanCSS(options).minify(code);
  const [error] = errors;

  if (error) {
    throw error;
  }

  return styles;
}
