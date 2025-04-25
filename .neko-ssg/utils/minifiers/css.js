import CleanCSS from "clean-css";

/** @type {import ('clean-css').OptionsPromise} */
const options = {
  level: 2,
};

/**
 * Minifies CSS code.
 * @param {string} code input
 * @returns {Promise<string>} ouput
 */
export default async function minifyCss(code) {
  const { styles, errors } = await new CleanCSS(options).minify(code);
  const [error] = errors;

  if (error) {
    throw error;
  }

  return styles;
}
