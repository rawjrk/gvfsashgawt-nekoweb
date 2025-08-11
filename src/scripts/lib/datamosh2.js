class DatamoshedFile {
  /** @type {Uint8Array} */
  _bytes;
  /** @type {string} */
  _mimeType;
  /** @type {[number, number]} */
  _moshedRange = [0, 1];

  constructor() {}

  async loadFromBlob(file) {
    const buf = await file.arrayBuffer();
    this._bytes = new Uint8Array(buf);
    this._mimeType = getImageMimeType(file);
  }

  getMimeType() {
    return this._mimeType;
  }

  setDatamoshRange(fromByte, toByte) {
    if (isNaN(fromByte)) {
      throw TypeError('Value of "fromByte" should be numeric');
    }
    if (isNaN(toByte)) {
      throw TypeError('Value of "toByte" should be numeric');
    }
    this._moshedRange = [+fromByte, +toByte];
  }

  generateMoshedBytes() {
    const moshedBytes = new Uint8Array(this._bytes);

    const [from, to] = this._moshedRange;

    for (let i = from; i <= to; i++) {
      const randValue = Math.floor(Math.random() * 256);
      moshedBytes[i] = randValue;
    }

    return moshedBytes;
  }
}

async function loadBytesToCanvas(canvas, bytes, type) {
  return new Promise((resolve) => {
    const blob = new Blob([bytes], { type });
    const url = URL.createObjectURL(blob);

    const img = new Image();

    img.onload = () => {
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);
      resolve();
    };

    img.src = url;
  });
}

function getImageMimeType(file) {
  const ext = file.name.split(".").at(-1).toLowerCase();

  switch (ext) {
    case "jpeg":
      return `image/${ext}`;

    case "jpg":
      return "image/jpg";

    default:
      throw Error(`Unable to get MIME-type for extension ${ext}`);
  }
}
