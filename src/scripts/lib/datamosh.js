/** Class representing interface to load an image and generate its datamoshed version. */
class DatamoshedImage {
  _imageBase64;
  _datamoshChunks; // 1 chunk = 4 chars (base64) = 3 raw bytes

  /** Creates an instance for an image datamosh. */
  constructor() {}

  /**
   * Fetches file content from `imageUrl`, and saves its content as Base64 string.
   * @param {string} imageUrl web location
   * @returns {Promise<void>}
   */
  async fetchImage(imageUrl) {
    const imageBlob = await fetchBlob(imageUrl);
    await this.loadFromBlob(imageBlob);
  }

  /**
   * Loads file content from `imageBlob`, and saves its content as Base64 string.
   * @param {Blob} imageBlob file interface
   * @returns {Promise<void>}
   */
  async loadFromBlob(imageBlob) {
    this._imageBase64 = await blobToBase64(imageBlob);
  }

  /**
   * Sets range of positions when image values are randomized.
   * Each chunk represents 3 bytes (chars) when decoded.
   * Which corresponds to 4 chars sequence after encoded in base64.
   * @param {number} fromChunk starting position
   * @param {number} toChunk ending position
   */
  setDatamoshRange(fromChunk, toChunk) {
    if (!fromChunk || !toChunk) {
      return;
    }
    this._datamoshChunks = [fromChunk, toChunk];
  }

  /**
   * Genarates a datamoshed version (i.e. with randomized bits) of the image.
   * @returns {string} Base64 string
   */
  generateMoshedBase64() {
    const [fromChunk, toChunk] = this._datamoshChunks;

    const injectedAsciiLength = (toChunk - fromChunk) * 3;
    let randomizedAscii = "";

    for (let i = 0; i < injectedAsciiLength; i++) {
      randomizedAscii += randomASCII();
    }

    const randomizedBase64 = window.btoa(randomizedAscii);
    return injectString(this._imageBase64, fromChunk * 4, randomizedBase64);
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
    reader.onerror = (error) => reject(error);
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
