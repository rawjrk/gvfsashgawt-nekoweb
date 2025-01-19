/**
 * Generates number within specified range.
 * @param {number} min lower boundary (inclusive)
 * @param {number} max upper boundary (inclusive)
 * @returns {number} random integer
 */
function randomRange(min, max) {
  const range = max + 1 - min;
  return Math.floor(Math.random() * range) + min;
}

/**
 * Returns string of randomly generated chars.
 * @param {number} len string length
 * @returns {string}
 */
function gibberishWord(len) {
  let gib = "";

  for (let i = 0; i < len; i++) {
    const charCode = randomRange(97, 122); // 'a' to 'z'
    const letter = String.fromCharCode(charCode);
    gib += letter;
  }

  return gib;
}

/**
 * Returns string filled with sequence of gibberish words.
 * @returns {string}
 */
function gibberishSentence() {
  const numberOfWords = randomRange(3, 9);
  let sentence = "";

  for (let i = 0; i < numberOfWords; i++) {
    const wordLength = randomRange(5, 12);
    sentence += gibberishWord(wordLength);

    const isLastWord = i === numberOfWords - 1;

    if (!isLastWord) {
      const addComma = randomRange(0, 9) === 6;
      sentence += addComma ? ", " : " ";
    }
  }

  return sentence;
}
