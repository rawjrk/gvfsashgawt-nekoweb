/** Class representing interface to load an image and generate its datamoshed version. */
class DatamoshedImage {
  /** @type {string} */
  _imageBase64;
  /** @type {string} */
  _mimeType;
  /** @type {[number, number]} */
  _moshedBytes = [0, 1];

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
    this._mimeType = getImageMimeType(imageBlob);
  }

  /**
   * Gives the current file's MIME-type.
   * @returns {string} a MIME-type
   */
  getMimeType() {
    return this._mimeType;
  }

  /**
   * Sets range of positions when image values are randomized.
   * @param {number} fromByte starting position
   * @param {number} toByte ending position
   */
  setDatamoshRange(fromByte, toByte) {
    if (isNaN(fromByte) || isNaN(toByte)) {
      return;
    }
    this._moshedBytes = [fromByte, toByte];
  }

  /**
   * Genarates a datamoshed version (i.e. with randomized bits) of the image.
   * @returns {string} Base64 string
   */
  generateMoshedBase64() {
    const [fromByte, toByte] = this._moshedBytes;

    // 1 chunk = 4 chars (base64) = 3 chars (ascii)
    const injectBase64From = Math.floor(fromByte / 3) * 4;

    // first chunk BEFORE fromByte
    const startFrom = this._imageBase64.slice(fromByte - (fromByte % 3), fromByte);
    // last chunk AFTER toByte
    const endWith = this._imageBase64.slice(toByte, toByte - (toByte % 3) + 3);

    let randomizedAscii = startFrom;
    for (let i = 0; i < toByte - fromByte; i++) {
      randomizedAscii += randomASCII();
    }
    randomizedAscii += endWith;

    const randomizedBase64 = window.btoa(randomizedAscii);
    return injectString(this._imageBase64, injectBase64From, randomizedBase64);
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
 * Returns the given file's MIME-type.
 * Works either with instances of `File` or `Blob`.
 * @param {unknown} fileOrBlob file interface
 * @returns {string} a MIME-type
 */
function getImageMimeType(fileOrBlob) {
  if (fileOrBlob instanceof Blob) {
    const { type: mimeType } = fileOrBlob;

    const isImage = /^image\/jpeg$/.test(mimeType);
    if (isImage) {
      return mimeType;
    }

    throw Error(`Invalid MIME-type ${mimeType}`);
  }

  if (fileOrBlob instanceof File) {
    const ext = fileOrBlob.name.split(".").at(-1).toLowerCase();

    switch (ext) {
      case "jpeg":
        return `image/${ext}`;

      case "jpg":
        return "image/jpg";

      default:
        throw Error(`Unable to get MIME-type for extension ${ext}`);
    }
  }

  throw TypeError("Accepting only Blob or File interfaces");
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

/**
 * Loads base64 encoded image to a given `canvas` element.
 * @param {HTMLCanvasElement} canvas element
 * @param {string} content raw bytes
 * @param {string} mimeType MIME-type
 * @returns {Promise<void>}
 */
async function loadBase64ToCanvas(canvas, content, mimeType) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = `data:${mimeType};base64,${content}`;

    img.onload = () => {
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);
      resolve();
    };
  });
}
