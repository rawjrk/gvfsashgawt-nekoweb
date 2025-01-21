/** Class representing interface to load an image and generate its datamoshed version. */
class DatamoshedJpeg {
  _imageUrl;
  _imageData_base64;
  _datamoshRange; // TODO: very unclear and crypting, need to specify range based on bits position

  /**
   * Creates
   * @param {string} imageUrl fetch location
   * @param {[number, number]} datamoshRange position [from, to] at which values are randomized
   */
  constructor(imageUrl, datamoshRange = [0, 0]) {
    this._imageUrl = imageUrl;
    this._datamoshRange = datamoshRange;
  }

  /**
   * Fetches image from specified URL, and saves its content as Base64 string.
   * @returns {Promise<void>}
   */
  async fetchImage() {
    const imageBlob = await fetchBlob(this._imageUrl);
    this._imageData_base64 = await blobToBase64(imageBlob);
  }

  /**
   * Genarates a datamoshed version (i.e. with randomized bits) of the image.
   * @returns {string} Base64 string
   */
  generateMoshedBase64() {
    const [injectFrom, injectTo] = this._datamoshRange;

    // TODO: get rid of unnecessary coersions between ASCII and Base64 encodings.
    const injectWith_ascii = window.atob(this._imageData_base64.slice(injectFrom, injectTo));

    let randomized_ascii = "";

    for (let i = 0; i < injectWith_ascii.length; i++) {
      randomized_ascii += randomASCII();
    }

    const randomized_base64 = window.btoa(randomized_ascii);
    return injectString(this._imageData_base64, injectFrom, randomized_base64);
  }
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
