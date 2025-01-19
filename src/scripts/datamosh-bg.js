/**
 * TBD: planned for refactoring... use class ??
 * @param {string} imagePath URL of image to be fetched
 * @returns {Promise<Function>} `datamoshBackground` function
 */
async function createDatamoshBackgroundFn(imagePath) {
  const imageBlob = await fetchBlob(imagePath);
  const imageContent = await blobToBase64(imageBlob);

  const injectFrom = 460;
  const injectTo = 500;

  const injectWith_ascii = window.atob(imageContent.slice(injectFrom, injectTo));

  const getDataMoshedContent = () => {
    let randomized = "";

    for (let i = 0; i < injectWith_ascii.length; i++) {
      randomized += randomASCII();
    }

    const randomized_base64 = window.btoa(randomized);
    return injectString(imageContent, injectFrom, randomized_base64);
  };

  const datamoshBackground = () => {
    const content = getDataMoshedContent();
    const imageData = `url("data:image/jpeg;base64,${content}")`;
    document.body.style.background = imageData;
  };

  return datamoshBackground;
}

/**
 * Transforms blob interface into a string.
 * @param {Blob} blob image reference
 * @returns {Promise<string>} image encoded in base64
 */
async function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const contentWithDataPrefix = reader.result;
      const [, bareContent] = contentWithDataPrefix.split(",");
      resolve(bareContent);
    };
    reader.onerror = (error) => console.error(error);
    reader.readAsDataURL(blob);
  });
}

/**
 * Fetches image and returns it in a form of blob interface.
 * @param {string} path URL of image to be loaded
 * @returns {Promise<Blob>} blob interface
 */
async function fetchBlob(path) {
  const response = await fetch(`${window.location.origin}/${path}`);
  return response.blob();
}

/**
 * Places `injectedStr` inside `orinalStr` at a given `from` position.
 * String length is retained.
 * @param {string} originalStr initial value
 * @param {number} from position to start overriding
 * @param {string} injectedStr value to override with
 * @returns {string} modified string
 * @example
 * injectString('ABCDEFGH', 2, '__'); // 'AB__EFGH'
 * injectString('ABCDEFGH', 3, '__'); // 'ABC__FGH'
 */
function injectString(originalStr, from, injectedStr) {
  const to = from + injectedStr.length;

  const before = originalStr.slice(0, from);
  const after = originalStr.slice(to);

  return `${before}${injectedStr}${after}`;
}

/**
 * Generates value within ASCII (0 through 255 code) range.
 * @returns {string} random char
 */
function randomASCII() {
  const charCode = Math.floor(Math.random() * 256);
  return String.fromCharCode(charCode);
}
