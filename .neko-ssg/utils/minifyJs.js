/**
 * Removes comments, indentation and line breaks from JS code.
 * @param {string} code source code
 * @returns {string} comressed code
 */
export default function minifyJs(code) {
  // TODO: add variables shortening

  let isInlineComment = false;
  let isMultilineComment = false;
  let isTabulation = true;

  let minifiedCode = "";

  for (let i = 0; i < code.length; i++) {
    const char = code[i];

    if (isMultilineComment && char === "*") {
      const nextChar = code[i + 1];

      if (nextChar === "/") {
        i++;
        isTabulation = false;
        isMultilineComment = false;
        continue;
      }
    }

    if (char === "/") {
      const nextChar = code[i + 1];

      if (nextChar === "/") {
        isTabulation = false;
        isInlineComment = true;
        i++;
        continue;
      }
      if (nextChar === "*") {
        isTabulation = false;
        isMultilineComment = true;
        i++;
        continue;
      }
    }

    if (char === " " && isTabulation) {
      continue;
    }

    if (char === "\n") {
      isTabulation = true;
      isInlineComment = false;
      continue;
    }

    if (isInlineComment || isMultilineComment) {
      continue;
    }

    isTabulation = false;
    minifiedCode += char;
  }

  return minifiedCode;
}
