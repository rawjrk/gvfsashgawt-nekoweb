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
 * Generates a string of random chars (gibberish word).
 * @param {number} len string length
 * @returns {string} gibberish word
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
 * Generates a sequence of gibberish words (random number: 3 to 9, random length: 5 to 9).
 * "Words" are separated by spaces, could be also separated by comma + splace (10% chance).
 * @returns {string} gibberish sentence
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
