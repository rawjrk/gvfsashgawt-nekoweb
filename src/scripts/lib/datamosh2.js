/** Class representing interface to load a file and generate its datamoshed version. */
class DatamoshedFile {
  /** @type {Uint8Array} */
  _bytes;
  /** @type {string} */
  _mimeType;
  /** @type {[number, number]} */
  _moshedRange = [0, 1];

  /** Creates an instance for a file datamosh. */
  constructor() {}

  /**
   * Fetches file content from `url`, and saves its content as Base64 string.
   * @param {string} url web location
   * @returns {Promise<void>}
   */
  async fetchFile(url) {
    const blob = await fetchBlob(url);
    await this.loadFromBlob(blob);
  }

  /**
   * Loads file content from `file`, and saves its content as Base64 string.
   * @param {Blob} file file interface
   * @returns {Promise<void>}
   */
  async loadFromBlob(file) {
    const buf = await file.arrayBuffer();
    this._bytes = new Uint8Array(buf);
    this._mimeType = getImageMimeType(file);
  }

  /**
   * Gives the current file's MIME-type.
   * @returns {string} a MIME-type
   */
  getMimeType() {
    return this._mimeType;
  }

  /**
   * Sets range of positions when file values are randomized.
   * @param {number} fromByte lower boundary (inclusive)
   * @param {number} toByte upper boundary (exclusive)
   */
  setDatamoshRange(fromByte, toByte) {
    if (isNaN(fromByte)) {
      throw TypeError('Value of "fromByte" should be numeric');
    }
    if (isNaN(toByte)) {
      throw TypeError('Value of "toByte" should be numeric');
    }
    this._moshedRange = [+fromByte, +toByte];
  }

  /**
   * Genarates a datamoshed version (i.e. with randomized bits) of the image.
   * @returns {string} Base64 string
   */
  generateMoshedBytes() {
    // TODO: get rid of unnecessary copies
    const moshedBytes = new Uint8Array(this._bytes);

    const [from, to] = this._moshedRange;

    for (let i = from; i <= to; i++) {
      const randValue = Math.floor(Math.random() * 256);
      moshedBytes[i] = randValue;
    }

    return moshedBytes;
  }
}

/**
 * Loads bytes as an image to a given `canvas` element.
 * @param {HTMLCanvasElement} canvas element
 * @param {Uint8Array} bytes raw bytes
 * @param {string} type MIME-type
 * @returns {Promise<void>}
 */
async function loadBytesToCanvas(canvas, bytes, type) {
  const blob = new Blob([bytes], { type });
  const bitmap = await createImageBitmap(blob);

  const ctx = canvas.getContext("2d");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  ctx.drawImage(bitmap, 0, 0);
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
