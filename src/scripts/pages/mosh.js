// TODO: read query param `?url={imageUrl}` -> fetch image for datamosh if present

const imagePicker = document.getElementById("image-picker");
const pickerContainer = document.getElementById("picker-container");

const datamoshedJpeg = new DatamoshedJpeg();

// TODO: configuration
/**
 *
 * from/to: number inputs (+/-)
 *
 * chunks: range input [-----]
 *
 * change: file input <choose>
 *
 * tile mode: dropdown .control props:
 *   background-repeat (repeat/no-repeate)
 *   background-size (contain/cover/[n]%/[x]px [y]px)
 *
 * animated: checkbox [x]
 *
 * goto: navigation links
 *
 */
imagePicker.onchange = async (event) => {
  const file = event.target.files[0];
  await datamoshedJpeg.loadFromBlob(file);

  const numberOfChunks = file.size / 3;
  const moshFrom = 20 + Math.floor(numberOfChunks / 163);
  const moshTo = 20 + Math.floor(numberOfChunks / 150);
  datamoshedJpeg.setDatamoshRange(moshFrom, moshTo);

  const datamoshBackground = () => {
    const content = datamoshedJpeg.generateMoshedBase64();
    const imageData = `url("data:image/jpeg;base64,${content}")`;
    document.body.style.background = imageData;
  };

  pickerContainer.classList.add("hidden");
  datamoshBackground();
  // document.body.onclick = datamoshBackground;
  setInterval(datamoshBackground, 90);
};
