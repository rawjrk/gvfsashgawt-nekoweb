const moshedImage = new DatamoshedImage();

const fromDisplay = document.getElementById("bytes-from-display");
const toDisplay = document.getElementById("bytes-to-display");

const controls = {
  bytes: new RangeSlider({
    fromElem: document.getElementById("bytes-from"),
    toElem: document.getElementById("bytes-to"),
    onChange: (_, [from, to]) => {
      fromDisplay.innerText = from;
      toDisplay.innerText = to;
      moshedImage.setDatamoshRange(from, to);
    },
  }),
};

const filePicker = document.getElementById("file-picker");
const canvas = document.getElementById("image-canvas");

filePicker.onchange = async (event) => {
  /** @type {File} */
  const file = event.target.files[0];
  if (!file) {
    console.warn("User canceled file upload");
    return;
  }

  await moshedImage.loadFromBlob(file);

  controls.bytes.setMax(file.size);

  const moshFrom = 100;
  const moshTo = 110;

  moshedImage.setDatamoshRange(moshFrom, moshTo);

  controls.bytes.setFrom(moshFrom);
  controls.bytes.setTo(moshTo);
  controls.bytes.enable();

  const mimeType = moshedImage.getMimeType();

  const datamoshCanvas = async () => {
    const content = moshedImage.generateMoshedBase64();
    await loadBase64ToCanvas(canvas, content, mimeType);
  };

  moshedImage.generateMoshedBase64();

  await datamoshCanvas();
  setInterval(datamoshCanvas, 90);
};
