const datamoshedJpeg = new DatamoshedJpeg();
const animation = new Interval({ intervalMs: 90, initActive: true });

const docBody = document.querySelector("body");
const menuBar = document.querySelector("menu");
let isMenuBarHidden = false;
let controlsDisabled = true; // TODO: check if needed at all

const controls = {
  chunks: new NumericInputRange("from", "to", () => {
    datamoshedJpeg.setDatamoshRange(...controls.chunks.getRange());
    animation.runOnce();
  }),
  animated: new Checkbox("animated", (event) => {
    if (event.target.checked) {
      animation.run();
    } else {
      animation.stop();
    }
  }),
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
  animation.setOnIntervalFn(datamoshBackground);
};

window.onclick = (event) => {
  if (controlsDisabled || event.target !== docBody) {
    return;
  }

  animation.runOnce();
};

window.onkeydown = (event) => {
  if (event.ctrlKey || event.altKey) {
    return;
  }

  switch (event.code) {
    case "KeyH":
      toggleMenuBar();
      return;

    case "KeyF":
      filePicker.click();
      return;

    case "KeyA":
      controls.animated.toggle();
      return;
  }

  if (controlsDisabled) {
    return;
  }

  switch (event.code) {
    case "KeyG":
      animation.runOnce();
      return;

    case "Digit9":
      controls.chunks.decrementFrom();
      return;

    case "Digit0":
      controls.chunks.incrementFrom();
      return;

    case "Minus":
      controls.chunks.decrementTo();
      return;

    case "Equal":
      controls.chunks.incrementTo();
      return;

    // TODO: tile mode
  }
};

// TODO: think how to handle on touchscreens
function toggleMenuBar() {
  isMenuBarHidden = !isMenuBarHidden;

  if (isMenuBarHidden) {
    menuBar.classList.add("hidden");
  } else {
    menuBar.classList.remove("hidden");
  }
}

function enableAllControls() {
  controlsDisabled = false;

  for (const [key, elem] of Object.entries(controls)) {
    if (elem) {
      elem.enable();
    } else {
      console.error(`Missing "${key}" element`);
    }
  }
}
