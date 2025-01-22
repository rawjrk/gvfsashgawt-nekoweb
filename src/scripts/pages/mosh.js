// TODO: read query param `?url={imageUrl}` -> fetch image for datamosh if present

const imagePicker = document.getElementById("image-picker");

const datamoshedJpeg = new DatamoshedJpeg();

// TODO: hide <menu> by pressing "H" or "Esc"

// TODO: implement configuration via form inputs

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

  datamoshBackground();
  // document.body.onclick = datamoshBackground;
  setInterval(datamoshBackground, 90);
};
