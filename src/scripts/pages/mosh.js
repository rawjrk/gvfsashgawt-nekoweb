/**
 * @typedef DatamoshedJpeg
 * @type {import ('../lib/datamosh-jpeg.js').DatamoshedJpeg}
 */

/**
 * @typedef Interval
 * @type {import ('../lib/interval.js').Interval}
 */

/**
 * @typedef NumericInputRange
 * @type {import ('../lib/controls.js').NumericInputRange}
 */

/**
 * @typedef Checkbox
 * @type {import ('../lib/controls.js').Checkbox}
 */

const datamoshedJpeg = new DatamoshedJpeg();
const animation = new Interval({ intervalMs: 90, initActive: true });

const docBody = document.querySelector("body");
const menuBar = document.querySelector("menu");
let isMenuBarHidden = false;
let controlsDisabled = true;

const controls = {
  chunks: new NumericInputRange("from", "to", (event) => {
    datamoshedJpeg.setDatamoshRange(...controls.chunks.getRange());
    animation.runOnce();
    event.target.blur();
  }),
  animated: new Checkbox("animated", (event) => {
    if (event.target.checked) {
      animation.run();
    } else {
      animation.stop();
    }
  }),
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

  if (event.code === "KeyG") {
    animation.runOnce();
    return;
  }

  if (controls.chunks.isFocused()) {
    return;
  }

  switch (event.code) {
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
  }
};

/**
 * Switches `<menu>` element visibility.
 * @returns {void}
 */
function toggleMenuBar() {
  // TODO: think how to handle on touchscreens

  isMenuBarHidden = !isMenuBarHidden;

  if (isMenuBarHidden) {
    menuBar.classList.add("hidden");
  } else {
    menuBar.classList.remove("hidden");
  }
}

/**
 * Marking controles prop disabled as false.
 * @returns {void}
 */
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
