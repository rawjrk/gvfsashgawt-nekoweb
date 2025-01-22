const datamoshedJpeg = new DatamoshedJpeg();
const imagePicker = document.getElementById("image-picker");
// TODO: implement configuration via form inputs
// TODO: read query param `?url={imageUrl}` -> fetch image for datamosh if present

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

const menuBar = document.querySelector("menu");
let isMenuBarHidden = false;

window.onkeydown = (event) => {
  if (event.ctrlKey || event.altKey) {
    return;
  }

  if (event.code === "KeyH" || event.code === "Escape") {
    toogleMenuBar();
  }
};

// TODO: think how to handle on touchscreens
function toogleMenuBar() {
  isMenuBarHidden = !isMenuBarHidden;

  if (isMenuBarHidden) {
    menuBar.classList.add("hidden");
  } else {
    menuBar.classList.remove("hidden");
  }
}
