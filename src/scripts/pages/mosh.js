const datamoshedJpeg = new DatamoshedJpeg();

const menuBar = document.querySelector("menu");
let isMenuBarHidden = false;
let controlsDisabled = true;

const controls = {
  chunks: new NumericInputRange("from", "to", () => {
    datamoshedJpeg.setDatamoshRange(...controls.chunks.getRange());
  }),
  // TODO: animated
  // TODO: tileMode
};

const filePicker = document.getElementById("file-picker");
// TODO: read query param `?url={imageUrl}` -> fetch image for datamosh if present

filePicker.onchange = async (event) => {
  const file = event.target.files[0];
  await datamoshedJpeg.loadFromBlob(file);

  const numberOfChunks = Math.floor(file.size / 3);
  controls.chunks.setRangeMax(numberOfChunks);

  const moshFrom = 115; // TODO: calculate based on file's binary
  const moshTo = 120; // TODO: calculate based on file's binary

  controls.chunks.setTo(moshTo);
  controls.chunks.setFrom(moshFrom);
  enableAllControls();

  const datamoshBackground = () => {
    const content = datamoshedJpeg.generateMoshedBase64();
    const imageData = `url("data:image/jpeg;base64,${content}")`;
    document.body.style.background = imageData;
  };

  datamoshBackground();
  menuBar.classList.add("transparent");
  // document.body.onclick = datamoshBackground;
  setInterval(datamoshBackground, 90);
};

window.onkeydown = (event) => {
  if (event.ctrlKey || event.altKey) {
    return;
  }

  if (event.code === "KeyH" || event.code === "Escape") {
    toogleMenuBar();
  }

  // TODO: choose file

  if (controlsDisabled) {
    return;
  }

  // TODO: from/to
  // TODO: animated
  // TODO: tile mode
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

function enableAllControls() {
  controlsDisabled = false;

  for (const [name, elem] of Object.entries(controls)) {
    try {
      elem.disabled = false;
    } catch {
      console.error(`Element "${name}" not found`);
    }
  }
}
